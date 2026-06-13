import { ShieldCheck, LogOut, Edit2, Trash2 } from 'lucide-react';

export default function UserAccessDetailCockpit({ user }) {
  if (!user) return null;

  return (
    <div>
      <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
        User Access Detail Cockpit
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <strong style={{ fontSize: '18px', color: '#fff', display: 'block' }}>{user.name}</strong>
          <span style={{ fontSize: '13px', color: '#a8b5ae' }}>{user.email}</span>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '16px', marginBottom: '24px' }}>
        <div className="cfg-grid-2" style={{ gap: '16px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#5a6b63', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Role</span>
            <strong style={{ color: user.role === 'Administrator' ? 'var(--gold)' : '#fff', fontSize: '13px' }}>{user.role}</strong>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#5a6b63', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Status</span>
            <strong style={{ color: user.status === 'Active' ? 'var(--color-normal)' : 'var(--color-warning)', fontSize: '13px' }}>{user.status}</strong>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#5a6b63', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Assigned Systems</span>
            <strong style={{ color: '#fff', fontSize: '13px' }}>{user.systems}</strong>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#5a6b63', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Last Login</span>
            <strong style={{ color: '#fff', fontSize: '13px' }}>{user.lastLogin}</strong>
          </div>
        </div>
      </div>

      <h4 style={{ fontSize: '12px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Access Scope</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px' }}>
          <span style={{ fontSize: '13px', color: '#fff' }}>Platform Analytics</span>
          <ShieldCheck size={14} color="var(--color-normal)" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px' }}>
          <span style={{ fontSize: '13px', color: '#fff' }}>Emergency Alerts</span>
          <ShieldCheck size={14} color={user.role === 'Administrator' || user.role === 'Operator' ? 'var(--color-normal)' : '#5a6b63'} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px' }}>
          <span style={{ fontSize: '13px', color: '#fff' }}>AI Model Training</span>
          <ShieldCheck size={14} color={user.role === 'Administrator' ? 'var(--gold)' : '#5a6b63'} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className="interactive-btn" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <Edit2 size={14} /> Edit Role & Permissions
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="interactive-btn" style={{ flex: 1, background: 'rgba(255,170,0,0.1)', color: 'var(--color-warning)', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px', border: '1px solid rgba(255,170,0,0.2)' }}>
            <LogOut size={14} /> Suspend
          </button>
          <button className="interactive-btn" style={{ flex: 1, background: 'transparent', color: 'var(--color-critical)', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px', border: '1px solid rgba(255,77,77,0.3)' }}>
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
