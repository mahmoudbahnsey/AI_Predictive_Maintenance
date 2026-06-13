import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { mockAuditTrail } from '../../data/mockUsersData';

export default function IdentityAuditTrail() {
  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
      <h2 className="idt-title">
        <History size={20} color="#a8b5ae" /> Identity Audit Trail
      </h2>
      
      <div className="sys-table-container">
        <table className="sys-table" style={{ fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ color: '#a8b5ae' }}>Action Performed</th>
              <th style={{ color: '#a8b5ae' }}>Target User</th>
              <th style={{ color: '#a8b5ae' }}>Performed By</th>
              <th style={{ color: '#a8b5ae' }}>Timestamp</th>
              <th style={{ color: '#a8b5ae' }}>Risk Level</th>
              <th style={{ color: '#a8b5ae' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAuditTrail.map((log, i) => (
              <tr key={i}>
                <td><strong style={{ color: '#fff' }}>{log.action}</strong></td>
                <td>{log.user}</td>
                <td>{log.by}</td>
                <td><span style={{ color: '#a8b5ae' }}>{log.time}</span></td>
                <td><span className={`idt-badge ${log.risk === 'Critical' ? 'danger' : 'guest'}`}>{log.risk}</span></td>
                <td><span style={{ color: log.status === 'Success' || log.status === 'Approved' ? 'var(--color-normal)' : 'var(--color-warning)' }}>{log.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button className="interactive-btn" style={{ marginTop: '16px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', fontSize: '12px', minHeight: 'auto' }}>
        Export Full Audit Trail
      </button>
    </motion.div>
  );
}
