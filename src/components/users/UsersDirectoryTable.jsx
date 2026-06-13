import { motion } from 'framer-motion';

export default function UsersDirectoryTable({ users }) {
  const getBadgeClass = (status) => {
    if (status === 'Active') return 'active';
    if (status === 'Suspended' || status === 'Locked') return 'danger';
    if (status === 'Review Required' || status === 'Pending') return 'pending';
    return 'guest';
  };

  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
      <h2 className="idt-title">Users Directory</h2>
      
      <div className="sys-table-container">
        <table className="sys-table" style={{ fontSize: '13px' }}>
          <thead>
            <tr>
              <th style={{ color: '#a8b5ae' }}>Name & Email</th>
              <th style={{ color: '#a8b5ae' }}>Role</th>
              <th style={{ color: '#a8b5ae' }}>Status</th>
              <th style={{ color: '#a8b5ae' }}>Assigned Systems</th>
              <th style={{ color: '#a8b5ae' }}>Last Login</th>
              <th style={{ color: '#a8b5ae' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>
                  <strong style={{ color: '#fff', display: 'block' }}>{u.name}</strong>
                  <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{u.email}</span>
                </td>
                <td><span className={`idt-badge ${u.role === 'Administrator' ? 'admin' : 'guest'}`}>{u.role}</span></td>
                <td><span className={`idt-badge ${getBadgeClass(u.status)}`}>{u.status}</span></td>
                <td><span style={{ color: '#a8b5ae' }}>{u.systems}</span></td>
                <td><span style={{ color: '#a8b5ae' }}>{u.lastLogin}</span></td>
                <td>
                  <button className="interactive-btn" style={{ padding: '4px 12px', fontSize: '11px', background: 'rgba(255,255,255,0.05)' }}>
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
