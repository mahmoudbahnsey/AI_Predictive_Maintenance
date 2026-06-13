import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import UserAccessDetailCockpit from './UserAccessDetailCockpit';

export default function UserDirectoryCommandBoard({ users, selectedUser, onSelectUser }) {
  const getBadgeClass = (status) => {
    if (status === 'Active') return 'active';
    if (status === 'Suspended' || status === 'Locked') return 'danger';
    if (status === 'Review Required' || status === 'Pending') return 'pending';
    return 'guest';
  };

  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <h2 className="idt-title">
        <Users size={20} color="#a8b5ae" /> User Directory Command Board
      </h2>
      
      <div className="idt-master-detail">
        {/* Left: Master List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#a8b5ae' }}>Showing {users.length} users</span>
            <input type="text" className="cfg-input" placeholder="Search identity..." style={{ width: '200px', padding: '6px 12px', minHeight: 'auto' }} />
          </div>

          <div className="idt-user-grid">
            {users.map(u => (
              <div 
                key={u.id} 
                className={`idt-user-card ${selectedUser.id === u.id ? 'active' : ''}`}
                onClick={() => onSelectUser(u)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                    {u.name.charAt(0)}
                  </div>
                  <span className={`idt-badge ${getBadgeClass(u.status)}`}>{u.status}</span>
                </div>
                
                <strong style={{ fontSize: '15px', color: '#fff', display: 'block', marginBottom: '4px' }}>{u.name}</strong>
                <span style={{ fontSize: '12px', color: '#a8b5ae', display: 'block', marginBottom: '12px' }}>{u.email}</span>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={`idt-badge ${u.role === 'Administrator' ? 'admin' : 'guest'}`} style={{ border: 'none' }}>{u.role}</span>
                  <span className="idt-badge guest" style={{ border: 'none' }}>Risk: {u.riskScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sticky Detail Cockpit */}
        <div className="idt-cockpit-wrapper">
          <UserAccessDetailCockpit user={selectedUser} />
        </div>
      </div>
    </motion.div>
  );
}
