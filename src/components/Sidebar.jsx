import {
  Bell,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  Zap,
  Cpu,
  Database,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const mainItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', id: 'dashboard' },
  { icon: Zap, label: 'Systems', path: '/systems', id: 'systems' },
  { icon: Bell, label: 'Alerts', path: '/alerts', id: 'alerts' },
  { icon: FileText, label: 'Reports', path: '/reports', id: 'reports' },
  { icon: Database, label: 'Data Intake', path: '/data', id: 'data' },
];

function parseTimezoneOffset(tz) {
  if (!tz || tz === 'UTC') return 0;
  const match = tz.match(/UTC([+-])?(\d+)(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  const hours = parseInt(match[2], 10) || 0;
  const mins = parseInt(match[3], 10) || 0;
  return sign * (hours + mins / 60);
}

function formatTimeInZone(date, timezone) {
  const offset = parseTimezoneOffset(timezone);
  // Work from true UTC components of the real instant
  let totalMins = (date.getUTCHours() * 60 + date.getUTCMinutes()) + (offset * 60);
  // normalize to [0, 24*60)
  totalMins = ((totalMins % (24 * 60)) + (24 * 60)) % (24 * 60);
  let h24 = Math.floor(totalMins / 60);
  let mins = Math.floor(totalMins % 60);
  const secs = date.getUTCSeconds();
  // 12-hour format to match previous display style
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  const ampm = h24 < 12 ? 'AM' : 'PM';
  const pad = (n) => String(n).padStart(2, '0');
  // hour as 'numeric' (no leading zero for single digit)
  return `${h12}:${pad(mins)}:${pad(secs)} ${ampm}`;
}

export default function Sidebar({ active = 'dashboard' }) {
  const [now, setNow] = useState(new Date());
  const [timezone, setTimezone] = useState(() => localStorage.getItem('voltiq-timezone') || 'UTC-8');
  const { isAdmin } = useAuth();

  const systemItems = [
    ...(isAdmin ? [{ icon: Cpu, label: 'AI Training Center', path: '/ai-training', id: 'ai-training' }] : []),
    { icon: Settings, label: 'Settings', path: '/settings', id: 'settings' },
    ...(isAdmin ? [{ icon: Users, label: 'Users', path: '/users', id: 'users' }] : []),
  ];

  // Live clock ticking on real time
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Listen for time zone changes from Settings (Account Identity)
  useEffect(() => {
    const handleTZChange = (e) => {
      if (e.detail && e.detail.timezone) {
        setTimezone(e.detail.timezone);
      }
    };
    window.addEventListener('voltiq-timezone-change', handleTZChange);
    return () => window.removeEventListener('voltiq-timezone-change', handleTZChange);
  }, []);

  const renderNavGroup = (title, items) => (
    <div className="sidebar-group">
      <div className="sidebar-group-title">{title}</div>
      <div className="sidebar-group-items">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive || active === item.id ? 'active' : ''}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="sidebar-header">
        <div style={{ marginBottom: '24px' }}>
          <NavLink to="/" className="au-brand" style={{ marginBottom: 0 }}>
            <Zap size={22} className="au-brand__icon" />
            <span className="au-brand__name">VoltIQ</span>
          </NavLink>
        </div>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
        {renderNavGroup('MAIN', mainItems)}
        {systemItems.length > 0 && renderNavGroup('SYSTEM', systemItems)}
      </nav>

      <div className="sidebar-footer-fixed" style={{ padding: '0 14px 8px', flexShrink: 0 }}>
        <div className="system-time-card" style={{ marginBottom: 0, marginTop: '4px' }}>
          <span>System Time</span>
          <strong>{formatTimeInZone(now, timezone)}</strong>
          <small><i /> Live</small>
        </div>
      </div>
    </aside>
  );
}
