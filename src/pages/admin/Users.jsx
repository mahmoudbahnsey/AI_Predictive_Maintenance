import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import { ref, onValue, update, query, limitToLast } from 'firebase/database';
import { db } from '../../config/firebase';
import { Users as UsersIcon, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { logAction, LOG_ACTIONS } from '../../utils/activityLogger';

/**
 * Admin User Management
 * Organized under pages/admin/
 */
export default function Users() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAdmin) return;

    // Limited query to reduce data transfer on free Firebase tier.
    // In production, consider pagination or Cloud Functions for larger user bases.
    const usersRef = query(ref(db, 'users'), limitToLast(100));

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([uid, profile]) => ({
        uid,
        ...profile,
      }));

      list.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      setUsers(list);
      setLoading(false);
    });

    // VIEW_USERS log removed to conserve free tier quota (frequent admin page opens were consuming bandwidth).

    return () => unsubscribe();
  }, [isAdmin]);

  const performUserAction = async (targetUser, newStatus, newRole = null) => {
    if (!isAdmin || !user) {
      alert('Permission denied');
      return;
    }

    const targetUid = targetUser.uid;
    setActionLoading(targetUid);

    try {
      const updates = { status: newStatus };
      if (newRole) updates.role = newRole;

      await update(ref(db, `users/${targetUid}`), updates);

      let actionType = '';
      if (newStatus === 'approved' && targetUser.status !== 'approved') actionType = LOG_ACTIONS.APPROVE_USER;
      else if (newStatus === 'rejected') actionType = LOG_ACTIONS.REJECT_USER;
      else if (newStatus === 'suspended') actionType = LOG_ACTIONS.SUSPEND_USER;
      else if (newRole === 'admin') actionType = LOG_ACTIONS.PROMOTE_ADMIN;
      else if (newRole === 'user') actionType = LOG_ACTIONS.DEMOTE_USER;

      if (actionType) {
        await logAction(user, actionType, {
          targetUid,
          targetEmail: targetUser.email,
          previousStatus: targetUser.status,
          newStatus,
          newRole: newRole || targetUser.role,
        });
      }
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed. Check console and database rules.');
    } finally {
      setActionLoading(null);
    }
  };

  const approveUser = (u) => performUserAction(u, 'approved');
  const rejectUser = (u) => { if (confirm(`Reject ${u.email}?`)) performUserAction(u, 'rejected'); };
  const suspendUser = (u) => { if (confirm(`Suspend ${u.email}?`)) performUserAction(u, 'suspended'); };
  const promoteToAdmin = (u) => { if (confirm(`Promote ${u.email} to ADMIN?`)) performUserAction(u, u.status || 'approved', 'admin'); };
  const demoteToUser = (u) => { if (confirm(`Demote ${u.email}?`)) performUserAction(u, u.status || 'approved', 'user'); };

  const filteredUsers = users.filter((u) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return u.status === 'pending';
    if (filter === 'approved') return u.status === 'approved';
    if (filter === 'admin') return u.role === 'admin';
    return true;
  });

  const formatDate = (ts) => ts ? new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const getStatusBadge = (status, role) => {
    if (role === 'admin') return <span className="px-2 py-0.5 text-xs bg-[#7CFF00] text-[#050B08] font-bold rounded">ADMIN</span>;
    const map = {
      approved: 'bg-emerald-900 text-emerald-400 border border-emerald-700',
      pending: 'bg-yellow-900/60 text-yellow-400 border border-yellow-700',
      rejected: 'bg-red-900/60 text-red-400 border border-red-700',
      suspended: 'bg-orange-900/60 text-orange-400 border border-orange-700',
    };
    return <span className={`px-2 py-0.5 text-xs rounded font-medium ${map[status] || 'bg-gray-800'}`}>{(status || 'UNKNOWN').toUpperCase()}</span>;
  };

  if (!isAdmin) {
    return <div className="dashboard"><Sidebar active="users" /><div className="dashboard-main flex items-center justify-center"><div className="text-center"><Shield className="mx-auto text-[#FF4D4D] mb-4" size={48} /><h2 className="text-2xl font-bold">Access Denied</h2></div></div></div>;
  }

  return (
    <div className="dashboard">
      <Sidebar active="users" />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="btn btn-ghost !p-2"><ArrowLeft size={18} /></button>
            <div>
              <h1 className="flex items-center gap-2"><UsersIcon size={22} /> User Management</h1>
              <p className="text-xs text-[#8A9A8F]">Approve, manage roles and monitor access</p>
            </div>
          </div>
          <div className="header-right text-sm text-[#8A9A8F]">{filteredUsers.length} / {users.length} users</div>
        </header>

        <div className="dashboard-content">
          <div className="flex gap-2 mb-4 flex-wrap">
            {['all', 'pending', 'approved', 'admin'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm rounded-2xl border transition ${filter === f ? 'bg-[#7CFF00] text-[#050B08] border-[#7CFF00]' : 'border-[#2E3C33] hover:bg-[#10210D]'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="card rounded-3xl p-6">
            {loading ? <div className="py-12 text-center text-[#8A9A8F]">Loading users from database...</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1F2B24] text-[#8A9A8F] text-left">
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2B24]">
                    {filteredUsers.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-[#8A9A8F]">No users found.</td></tr>}
                    {filteredUsers.map((u) => {
                      const isSelf = u.uid === user?.uid;
                      const isActing = actionLoading === u.uid;
                      return (
                        <tr key={u.uid} className="hover:bg-[#10210D]/60">
                          <td className="py-3 px-4 font-medium">{u.email}</td>
                          <td className="py-3 px-4"><span className={u.role === 'admin' ? 'text-[#7CFF00] font-semibold' : ''}>{u.role || 'user'}</span></td>
                          <td className="py-3 px-4">{getStatusBadge(u.status, u.role)}</td>
                          <td className="py-3 px-4 text-[#8A9A8F] text-xs">{formatDate(u.createdAt)}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2 flex-wrap">
                              {u.status === 'pending' && <>
                                <button onClick={() => approveUser(u)} disabled={isActing || isSelf} className="btn btn-primary !text-xs !py-1.5 !px-3 disabled:opacity-50"><CheckCircle size={14} className="mr-1" /> Approve</button>
                                <button onClick={() => rejectUser(u)} disabled={isActing} className="text-xs px-3 py-1.5 rounded-xl border border-red-800 text-red-400">Reject</button>
                              </>}
                              {u.status === 'approved' && u.role !== 'admin' && <button onClick={() => promoteToAdmin(u)} disabled={isActing || isSelf} className="text-xs px-3 py-1.5 rounded-xl border border-[#7CFF00]/40 text-[#7CFF00]">Make Admin</button>}
                              {u.role === 'admin' && !isSelf && <button onClick={() => demoteToUser(u)} disabled={isActing} className="text-xs px-3 py-1.5 rounded-xl border border-orange-700 text-orange-400">Demote</button>}
                              {(u.status === 'approved' || u.status === 'pending') && !isSelf && <button onClick={() => suspendUser(u)} disabled={isActing} className="text-xs px-3 py-1.5 rounded-xl border border-[#FF4D4D]/40 text-[#FF4D4D]">Suspend</button>}
                              {isSelf && <span className="text-xs text-[#8A9A8F] px-2 py-1">You</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-6 text-xs text-[#8A9A8F] border-t border-[#1F2B24] pt-4">
              Showing latest 100 users (limited to respect Firebase free tier data limits). All changes are applied instantly and recorded in the Activity Logs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
