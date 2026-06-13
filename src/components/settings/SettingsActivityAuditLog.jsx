import { motion } from 'framer-motion';
import { auditLogs } from '../../data/mockSettingsData';
import { History } from 'lucide-react';

export default function SettingsActivityAuditLog() {
  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      <h2 className="cfg-title">
        <History size={20} color="#a8b5ae" /> Settings Activity & Audit Log
      </h2>
      
      <div className="sys-table-container">
        <table className="sys-table" style={{ fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ color: '#a8b5ae' }}>Setting Changed</th>
              <th style={{ color: '#a8b5ae' }}>Previous Value</th>
              <th style={{ color: '#a8b5ae' }}>New Value</th>
              <th style={{ color: '#a8b5ae' }}>Changed By</th>
              <th style={{ color: '#a8b5ae' }}>Timestamp</th>
              <th style={{ color: '#a8b5ae' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log, i) => (
              <tr key={i}>
                <td><strong style={{ color: '#fff' }}>{log.setting}</strong></td>
                <td><span style={{ color: '#5a6b63', textDecoration: 'line-through' }}>{log.oldVal}</span></td>
                <td><span style={{ color: '#fff' }}>{log.newVal}</span></td>
                <td>{log.by}</td>
                <td><span style={{ color: 'var(--gold)' }}>{log.time}</span></td>
                <td><span style={{ color: 'var(--color-normal)' }}>{log.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button className="interactive-btn" style={{ marginTop: '16px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', fontSize: '12px', minHeight: 'auto' }}>
        Export Full Audit Log
      </button>
    </motion.div>
  );
}
