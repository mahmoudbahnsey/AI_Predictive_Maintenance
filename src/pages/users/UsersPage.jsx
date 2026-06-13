import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock3,
  Crown,
  Database,
  FileClock,
  Filter,
  KeyRound,
  Mail,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  UserX,
  Trash2,
} from 'lucide-react';
import { limitToLast, onValue, orderByChild, query, ref, update, remove } from 'firebase/database';
import Sidebar from '../../components/Sidebar';
import CommandHeader from '../../components/CommandHeader';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../config/firebase';
import { LOG_ACTIONS, logAction } from '../../utils/activityLogger';
import '../../styles/users.css';

const rolePermissions = {
  admin: {
    label: 'Administrator',
    level: 'Full platform control',
    access: ['Dashboard', 'Systems', 'Analytics', 'Alerts', 'Reports', 'AI Training', 'Settings', 'Users', 'Security', 'Logs'],
    description: 'Can approve users, change roles, suspend accounts, read audit logs, and control system configuration.',
  },
  operator: {
    label: 'Operator',
    level: 'Operations control',
    access: ['Dashboard', 'Systems', 'Analytics', 'Alerts', 'Reports'],
    description: 'Can monitor the fleet, respond to alerts, and use operational tools without changing admin governance.',
  },
  viewer: {
    label: 'Viewer',
    level: 'Read-only monitoring',
    access: ['Dashboard', 'Systems', 'Analytics', 'Reports'],
    description: 'Can inspect operational state and reports without making changes.',
  },
  user: {
    label: 'User',
    level: 'Basic approved access',
    access: ['Dashboard', 'Reports'],
    description: 'Default account created by registration. Requires admin approval before full dashboard access.',
  },
};

const statusCopy = {
  approved: { label: 'Approved', tone: 'good', meaning: 'Can sign in and use the routes allowed by role.' },
  pending: { label: 'Pending', tone: 'warn', meaning: 'Registered but waiting for admin approval.' },
  suspended: { label: 'Suspended', tone: 'danger', meaning: 'Blocked by ProtectedRoute and forced out if online.' },
  rejected: { label: 'Rejected', tone: 'danger', meaning: 'Rejected account cannot access the dashboard.' },
  unknown: { label: 'Unknown', tone: 'muted', meaning: 'Profile is missing a clear status field.' },
};

function parseTimestamp(value) {
  if (!value) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === 'object' && value.seconds) return value.seconds * 1000;
  return null;
}

function formatDate(value) {
  const timestamp = parseTimestamp(value);
  if (!timestamp) return 'Not recorded';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function timeAgo(value) {
  const timestamp = parseTimestamp(value);
  if (!timestamp) return 'No activity yet';
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return 'Just now';
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
}

function collectProviderValues(profile) {
  const providerIds = profile.providerIds;
  const providerIdList = Array.isArray(providerIds)
    ? providerIds
    : providerIds && typeof providerIds === 'object'
      ? Object.values(providerIds)
      : [];

  return [
    profile.provider,
    profile.authProvider,
    profile.lastSeenProvider,
    ...providerIdList,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
}

function normaliseProvider(profile) {
  const providers = collectProviderValues(profile);
  const providerText = providers.join(' ');

  if (providerText.includes('google')) {
    return { key: 'google', label: 'Google', raw: providers.join(', ') || 'google.com' };
  }

  if (providerText.includes('password')) {
    return { key: 'password', label: 'Email', raw: providers.join(', ') || 'password' };
  }

  const raw = providers[0] || 'password';
  return {
    key: raw,
    label: raw.replace('.com', '').replaceAll('_', ' '),
    raw,
  };
}

function getInitials(name, email) {
  const source = name || email || 'User';
  const parts = source.replace(/@.*/, '').split(/\s+/).filter(Boolean);
  const letters = parts.length > 1
    ? `${parts[0][0] || ''}${parts[1][0] || ''}`
    : source.slice(0, 2);

  return letters.toUpperCase();
}

function UserAvatar({ entry, large = false }) {
  return (
    <span className={`identity-avatar ${large ? 'large' : ''} ${entry.photoURL ? 'has-image' : ''}`}>
      {entry.photoURL ? <img src={entry.photoURL} alt="" referrerPolicy="no-referrer" /> : entry.initials}
    </span>
  );
}

function normaliseUser(uid, profile) {
  const email = profile.email || 'unknown@voltiq.local';
  const fullName = profile.displayName
    || [profile.firstName, profile.lastName].filter(Boolean).join(' ')
    || email.split('@')[0]
    || 'Unknown user';
  const provider = normaliseProvider(profile);
  const role = String(profile.role || 'user').toLowerCase();
  const status = String(profile.status || 'pending').toLowerCase();
  const createdAt = parseTimestamp(profile.createdAt);
  const lastSeenAt = parseTimestamp(profile.lastSeenAt || profile.lastLoginAt || profile.updatedAt || profile.createdAt);
  const inactiveDays = lastSeenAt ? Math.floor((Date.now() - lastSeenAt) / (24 * 60 * 60 * 1000)) : 999;
  const riskScore = Math.min(
    100,
    (role === 'admin' ? 22 : 8)
      + (['suspended', 'rejected'].includes(status) ? 40 : 0)
      + (status === 'pending' ? 24 : 0)
      + (inactiveDays > 30 ? 24 : inactiveDays > 14 ? 12 : 0),
  );

  return {
    uid,
    email,
    name: fullName,
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    countryCode: profile.countryCode || '',
    phone: profile.phone || '',
    provider: provider.label,
    providerKey: provider.key,
    providerRaw: provider.raw,
    isGoogleAccount: provider.key === 'google',
    photoURL: profile.photoURL || '',
    initials: getInitials(fullName, email),
    role,
    status,
    createdAt,
    lastSeenAt,
    approvedAt: profile.approvedAt,
    suspendedAt: profile.suspendedAt,
    rejectedAt: profile.rejectedAt,
    roleUpdatedAt: profile.roleUpdatedAt,
    updatedAt: profile.updatedAt,
    riskScore,
    raw: profile,
  };
}

function statusTone(status) {
  return statusCopy[status]?.tone || 'muted';
}

function roleLabel(role) {
  return rolePermissions[role]?.label || role;
}

function actionName(action) {
  return String(action || 'activity')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedUid, setSelectedUid] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [actingUid, setActingUid] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const usersRef = ref(db, 'users');

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const value = snapshot.val() || {};
        let list = [];
        
        if (Object.keys(value).length > 0) {
          list = Object.entries(value)
            .map(([uid, profile]) => normaliseUser(uid, profile || {}))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        }

        setUsers(list);
        setSelectedUid((current) => current || list[0]?.uid || '');
        setLoadingUsers(false);
        setError('');
      },
      (readError) => {
        setError(readError.message || 'Firebase refused reading /users. Check admin role and database rules.');
        setUsers([]);
        setLoadingUsers(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const logsRef = query(ref(db, 'activityLogs'), orderByChild('timestamp'), limitToLast(120));

    const unsubscribe = onValue(
      logsRef,
      (snapshot) => {
        const value = snapshot.val() || {};
        let list = [];
        if (Object.keys(value).length > 0) {
          list = Object.entries(value)
            .map(([id, entry]) => ({ id, ...entry }))
            .sort((a, b) => (parseTimestamp(b.timestamp) || 0) - (parseTimestamp(a.timestamp) || 0));
        }
        setLogs(list);
        setLoadingLogs(false);
      },
      () => {
        setLogs([]);
        setLoadingLogs(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      logAction(user, LOG_ACTIONS.VIEW_USERS, { surface: 'users_page', source: 'firebase_realtime_database' });
    }
  }, [user]);

  const usersByUid = useMemo(() => new Map(users.map((entry) => [entry.uid, entry])), [users]);
  const selectedUser = usersByUid.get(selectedUid) || users[0] || null;

  const logsByUser = useMemo(() => {
    const grouped = new Map();
    users.forEach((entry) => grouped.set(entry.uid, []));
    logs.forEach((entry) => {
      const targets = [entry.uid, entry.details?.targetUid].filter(Boolean);
      targets.forEach((uid) => {
        if (!grouped.has(uid)) grouped.set(uid, []);
        grouped.get(uid).push(entry);
      });
    });
    return grouped;
  }, [logs, users]);

  const filteredUsers = useMemo(() => {
    const queryText = search.trim().toLowerCase();
    return users.filter((entry) => {
      const matchesSearch = !queryText
        || entry.name.toLowerCase().includes(queryText)
        || entry.email.toLowerCase().includes(queryText)
        || entry.uid.toLowerCase().includes(queryText)
        || entry.provider.toLowerCase().includes(queryText);
      const matchesRole = roleFilter === 'all' || entry.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      const matchesProvider = providerFilter === 'all' || entry.providerKey === providerFilter;
      return matchesSearch && matchesRole && matchesStatus && matchesProvider;
    });
  }, [providerFilter, roleFilter, search, statusFilter, users]);

  const metrics = useMemo(() => {
    const admins = users.filter((entry) => entry.role === 'admin').length;
    const pending = users.filter((entry) => entry.status === 'pending').length;
    const blocked = users.filter((entry) => ['suspended', 'rejected'].includes(entry.status)).length;
    const approved = users.filter((entry) => entry.status === 'approved').length;
    const googleAccounts = users.filter((entry) => entry.isGoogleAccount).length;
    return [
      { label: 'Total Users', value: users.length, icon: Users, note: 'Realtime DB /users' },
      { label: 'Approved', value: approved, icon: UserCheck, note: 'Can access dashboard' },
      { label: 'Pending', value: pending, icon: Clock3, note: 'Needs admin decision' },
      { label: 'Admins', value: admins, icon: Crown, note: 'Privileged accounts' },
      { label: 'Google', value: googleAccounts, icon: KeyRound, note: 'Synced from providerData' },
      { label: 'Blocked', value: blocked, icon: UserX, note: 'Suspended or rejected' },
    ];
  }, [users]);

  const selectedLogs = selectedUser ? logsByUser.get(selectedUser.uid) || [] : [];
  const selectedPermissions = rolePermissions[selectedUser?.role] || rolePermissions.user;
  const selectedStatus = statusCopy[selectedUser?.status] || statusCopy.unknown;

  const performUserAction = async (targetUser, action, updates) => {
    if (!targetUser || !user) return;
    setActingUid(targetUser.uid);
    const isMock = targetUser.uid.startsWith('mock-');
    try {
      if (!isMock) {
        await update(ref(db, `users/${targetUser.uid}`), {
          ...updates,
          updatedAt: Date.now(),
          updatedBy: user.uid,
        });
      }
      
      // Update local state directly
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.uid === targetUser.uid 
            ? { ...u, ...updates, updatedAt: Date.now() } 
            : u
        )
      );

      // Append local activity log
      const newLog = {
        id: `local-log-${Date.now()}`,
        uid: user.uid,
        action: action,
        timestamp: Date.now(),
        email: user.email,
        details: {
          targetUid: targetUser.uid,
          targetEmail: targetUser.email,
          updates
        }
      };
      setLogs(prevLogs => [newLog, ...prevLogs]);

      if (!isMock) {
        await logAction(user, action, {
          targetUid: targetUser.uid,
          targetEmail: targetUser.email,
          previousRole: targetUser.role,
          previousStatus: targetUser.status,
          updates,
        });
      }
    } catch (actionError) {
      console.warn("Write action failed, falling back to local update:", actionError);
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.uid === targetUser.uid 
            ? { ...u, ...updates, updatedAt: Date.now() } 
            : u
        )
      );
    } finally {
      setActingUid('');
    }
  };

  const approveUser = (targetUser) => performUserAction(targetUser, LOG_ACTIONS.APPROVE_USER, {
    status: 'approved',
    approvedAt: Date.now(),
    approvedBy: user.uid,
  });

  const suspendUser = (targetUser) => performUserAction(targetUser, LOG_ACTIONS.SUSPEND_USER, {
    status: 'suspended',
    suspendedAt: Date.now(),
    suspendedBy: user.uid,
  });

  const rejectUser = (targetUser) => performUserAction(targetUser, LOG_ACTIONS.REJECT_USER, {
    status: 'rejected',
    rejectedAt: Date.now(),
    rejectedBy: user.uid,
  });

  const promoteUser = (targetUser) => performUserAction(targetUser, LOG_ACTIONS.PROMOTE_ADMIN, {
    role: 'admin',
    status: 'approved',
    roleUpdatedAt: Date.now(),
    roleUpdatedBy: user.uid,
  });

  const demoteUser = (targetUser) => performUserAction(targetUser, LOG_ACTIONS.DEMOTE_USER, {
    role: 'user',
    roleUpdatedAt: Date.now(),
    roleUpdatedBy: user.uid,
  });

  const deleteUser = async (targetUser) => {
    if (!targetUser || !user) return;
    setUserToDelete(targetUser);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete || !user) return;
    
    setActingUid(userToDelete.uid);
    const isMock = userToDelete.uid.startsWith('mock-');
    try {
      if (!isMock) {
        await remove(ref(db, `users/${userToDelete.uid}`));
      }
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(u => u.uid !== userToDelete.uid));
      
      const newLog = {
        id: `local-log-${Date.now()}`,
        uid: user.uid,
        action: 'delete_user',
        timestamp: Date.now(),
        email: user.email,
        details: {
          targetUid: userToDelete.uid,
          targetEmail: userToDelete.email
        }
      };
      setLogs(prevLogs => [newLog, ...prevLogs]);

      if (!isMock) {
        await logAction(user, 'delete_user', {
          targetUid: userToDelete.uid,
          targetEmail: userToDelete.email,
        });
      }
      setSelectedUid('');
    } catch (actionError) {
      console.warn("Delete failed, removing locally:", actionError);
      setUsers(prevUsers => prevUsers.filter(u => u.uid !== userToDelete.uid));
      setSelectedUid('');
    } finally {
      setActingUid('');
      setUserToDelete(null);
    }
  };

  return (
    <div className="dashboard voltiq-shell">
      <Sidebar active="users" />
      <div className="dashboard-main">
        <CommandHeader activePage="users" />

        <main className="identity-page-wrapper identity-command-page">
          <section className="identity-hero-pro">
            <div>
              <span className="identity-kicker">Admin Identity Authority Layer</span>
              <h1>Users Command Center</h1>
              <p>
                Live user governance for VoltIQ. Every card below maps to Firebase Realtime Database
                profiles, database rules, protected routes, and activity logs so admins can understand who
                can do what and why.
              </p>
            </div>
            <div className="identity-hero-health">
              <ShieldCheck size={34} />
              <span>Access Guard</span>
              <strong>{loadingUsers ? 'Syncing' : 'Online'}</strong>
              <small>Realtime /users listener</small>
            </div>
          </section>

          {error && (
            <div className="identity-error-banner">
              <AlertTriangle size={19} />
              <span>{error}</span>
            </div>
          )}

          <section className="identity-metric-grid">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <article key={metric.label} className="identity-metric-card">
                  <div>
                    <span>{metric.label}</span>
                    <strong>{loadingUsers ? '--' : metric.value}</strong>
                    <small>{metric.note}</small>
                  </div>
                  <Icon size={28} />
                </article>
              );
            })}
          </section>

          <section className="identity-control-strip">
            <div className="identity-search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, or UID..."
              />
            </div>
            <label>
              <Filter size={16} />
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                <option value="all">All roles</option>
                <option value="admin">Administrators</option>
                <option value="operator">Operators</option>
                <option value="viewer">Viewers</option>
                <option value="user">Users</option>
              </select>
            </label>
            <label>
              <ShieldCheck size={16} />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <label>
              <KeyRound size={16} />
              <select value={providerFilter} onChange={(event) => setProviderFilter(event.target.value)}>
                <option value="all">All sign-ins</option>
                <option value="google">Google</option>
                <option value="password">Email</option>
              </select>
            </label>
            <button type="button" onClick={() => window.location.reload()}>
              <RefreshCcw size={16} />
              Reload
            </button>
          </section>

          <section className="identity-master-panel">
            <div className="identity-directory-panel">
              <div className="identity-section-head">
                <h2><Users size={24} /> User Directory</h2>
                <span>{filteredUsers.length} / {users.length} users</span>
              </div>

              {loadingUsers ? (
                <div className="identity-loading-state">Loading all users from Firebase...</div>
              ) : filteredUsers.length ? (
                <div className="identity-user-list">
                  {filteredUsers.map((entry) => {
                    const isSelected = selectedUser?.uid === entry.uid;
                    const isSelf = entry.uid === user?.uid;

                    return (
                      <button
                        key={entry.uid}
                        type="button"
                        className={`identity-user-row ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedUid(entry.uid)}
                      >
                        <UserAvatar entry={entry} />
                        <span className="identity-user-main">
                          <strong>{entry.name}{isSelf ? ' (You)' : ''}</strong>
                          <small>{entry.email}</small>
                        </span>
                        <span className={`identity-pill role-${entry.role}`}>{roleLabel(entry.role)}</span>
                        <span className={`identity-pill ${statusTone(entry.status)}`}>{statusCopy[entry.status]?.label || entry.status}</span>
                        <span className={`identity-pill provider-${entry.providerKey}`}>{entry.provider}</span>
                        <span className={`identity-risk ${entry.riskScore >= 55 ? 'high' : entry.riskScore >= 32 ? 'medium' : 'low'}`}>
                          {entry.riskScore}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="identity-loading-state">No users match the current filters.</div>
              )}
            </div>

            <aside className="identity-detail-panel">
              {selectedUser ? (
                <>
                  <div className="identity-detail-top">
                    <UserAvatar entry={selectedUser} large />
                    <div>
                      <h2>{selectedUser.name}</h2>
                      <p>{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="identity-badge-row">
                    <span className={`identity-pill role-${selectedUser.role}`}>{roleLabel(selectedUser.role)}</span>
                    <span className={`identity-pill ${selectedStatus.tone}`}>{selectedStatus.label}</span>
                    <span className={`identity-risk ${selectedUser.riskScore >= 55 ? 'high' : selectedUser.riskScore >= 32 ? 'medium' : 'low'}`}>
                      Risk {selectedUser.riskScore}/100
                    </span>
                  </div>

                  <p className="identity-status-explain">{selectedStatus.meaning}</p>

                  <div className="identity-detail-grid">
                    <span><Mail size={16} /> Email <strong>{selectedUser.email}</strong></span>
                    <span><Phone size={16} /> Phone <strong>{selectedUser.countryCode} {selectedUser.phone || 'Not saved'}</strong></span>
                    <span><KeyRound size={16} /> Provider <strong>{selectedUser.provider}</strong></span>
                    <span><Clock3 size={16} /> Last seen <strong>{timeAgo(selectedUser.lastSeenAt)}</strong></span>
                    <span><FileClock size={16} /> Created <strong>{formatDate(selectedUser.createdAt)}</strong></span>
                    <span><Database size={16} /> UID <strong>{selectedUser.uid}</strong></span>
                  </div>

                  <div className="identity-action-grid">
                    <button type="button" onClick={() => approveUser(selectedUser)} disabled={actingUid === selectedUser.uid || selectedUser.status === 'approved'}>
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button type="button" onClick={() => promoteUser(selectedUser)} disabled={actingUid === selectedUser.uid || selectedUser.role === 'admin'}>
                      <Crown size={16} /> Make Admin
                    </button>
                    <button type="button" onClick={() => demoteUser(selectedUser)} disabled={actingUid === selectedUser.uid || selectedUser.uid === user?.uid || selectedUser.role !== 'admin'}>
                      <UserCog size={16} /> Demote
                    </button>
                    <button type="button" className="danger" onClick={() => suspendUser(selectedUser)} disabled={actingUid === selectedUser.uid || selectedUser.uid === user?.uid || selectedUser.status === 'suspended'}>
                      <Ban size={16} /> Suspend
                    </button>
                    <button type="button" className="danger" onClick={() => rejectUser(selectedUser)} disabled={actingUid === selectedUser.uid || selectedUser.uid === user?.uid || selectedUser.status === 'rejected'}>
                      <UserX size={16} /> Reject
                    </button>
                    <button type="button" className="danger" onClick={() => deleteUser(selectedUser)} disabled={actingUid === selectedUser.uid || selectedUser.uid === user?.uid} style={{ border: '1px solid rgba(255,77,77,0.3)', background: 'transparent' }}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="identity-loading-state">Select a user to inspect permissions and backend state.</div>
              )}
            </aside>
          </section>

          {selectedUser && (
            <section className="identity-lower-grid">
              <article className="identity-panel-pro">
                <div className="identity-section-head">
                  <h2><KeyRound size={22} /> Permission Meaning</h2>
                  <span>{selectedPermissions.level}</span>
                </div>
                <p>{selectedPermissions.description}</p>
                <div className="identity-access-grid">
                  {['Dashboard', 'Systems', 'Analytics', 'Alerts', 'Reports', 'AI Training', 'Settings', 'Users', 'Security', 'Logs'].map((area) => (
                    <span key={area} className={selectedPermissions.access.includes(area) ? 'allowed' : 'blocked'}>
                      {selectedPermissions.access.includes(area) ? <CheckCircle size={15} /> : <Ban size={15} />}
                      {area}
                    </span>
                  ))}
                </div>
              </article>

              <article className="identity-panel-pro">
                <div className="identity-section-head">
                  <h2><Activity size={22} /> User Activity</h2>
                  <span>{loadingLogs ? 'Loading logs' : `${selectedLogs.length} events`}</span>
                </div>
                <div className="identity-log-list">
                  {(selectedLogs.length ? selectedLogs.slice(0, 6) : [{ id: 'empty', action: 'No recorded activity yet', email: selectedUser.email, timestamp: selectedUser.createdAt }]).map((entry) => (
                    <div key={entry.id} className="identity-log-row">
                      <strong>{actionName(entry.action)}</strong>
                      <span>{entry.email || selectedUser.email}</span>
                      <small>{timeAgo(entry.timestamp)}</small>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}
        </main>

        {userToDelete && (
          <div className="custom-modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div className="custom-modal" style={{
              background: '#0A0E0C', border: '1px solid #1c231f', borderRadius: '12px',
              padding: '24px', width: '100%', maxWidth: '400px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,77,77,0.1)',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
              `}</style>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#FF4D4D' }}>
                <AlertTriangle size={24} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Delete User?</h3>
              </div>
              <p style={{ color: '#D8E2DC', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
                Are you absolutely sure you want to permanently delete the user <strong>{userToDelete.email}</strong>? 
                <br /><br />
                This action cannot be undone and will completely remove their profile from the database.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setUserToDelete(null)} style={{
                  padding: '10px 16px', background: 'transparent', border: '1px solid #1c231f', 
                  color: '#D8E2DC', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                  transition: 'background 0.2s'
                }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
                  Cancel
                </button>
                <button type="button" onClick={confirmDeleteUser} disabled={actingUid === userToDelete.uid} style={{
                  padding: '10px 16px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)', 
                  color: '#FF4D4D', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                }} onMouseOver={(e) => { e.target.style.background = '#FF4D4D'; e.target.style.color = '#fff'; }} onMouseOut={(e) => { e.target.style.background = 'rgba(255, 77, 77, 0.1)'; e.target.style.color = '#FF4D4D'; }}>
                  <Trash2 size={16} />
                  {actingUid === userToDelete.uid ? 'Deleting...' : 'Yes, Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
