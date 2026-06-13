import {
  Activity,
  AlertTriangle,
  Bell,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  Zap,
  Cpu,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const mainItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', id: 'dashboard' },
  { icon: Zap, label: 'Systems', path: '/systems', id: 'systems' },
  { icon: Bell, label: 'Alerts', path: '/alerts', id: 'alerts' },
  { icon: FileText, label: 'Reports', path: '/reports', id: 'reports' },
];

export default function Sidebar({ active = 'dashboard' }) {
  const [now, setNow] = useState(new Date());
  const { isAdmin } = useAuth();

  const systemItems = [
    ...(isAdmin ? [{ icon: Cpu, label: 'AI Training Center', path: '/ai-training', id: 'ai-training' }] : []),
    { icon: Settings, label: 'Settings', path: '/settings', id: 'settings' },
    ...(isAdmin ? [{ icon: Users, label: 'Users', path: '/users', id: 'users' }] : []),
  ];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
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
          <strong>{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</strong>
          <small><i /> Live</small>
        </div>
      </div>
    </aside>
  );
}
