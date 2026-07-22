import { motion } from 'framer-motion';
import { History } from 'lucide-react';

export default function SettingsActivityAuditLog({ logs = [] }) {
  // logs prop is REAL activityLogs from Firebase (loaded only for admins)
  const displayLogs = (logs && logs.length > 0) ? logs.slice(0, 8).map((log) => ({
    setting: log.action || 'Config Update',
    oldVal: log.details?.old || '-',
    newVal: log.details?.new || (log.details ? JSON.stringify(log.details).slice(0,60) : 'updated'),
    by: log.email || log.uid?.substring(0,8) || 'system',
    time: log.timestamp ? new Date(log.timestamp).toLocaleString() : '—',
    status: 'Saved'
  })) : [
    { setting: 'No recent admin activity yet', oldVal: '-', newVal: '-', by: '-', time: '—', status: 'Info' }
  ];

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      <h2 className="cfg-title">
        <History size={20} color="#a8b5ae" /> Settings Activity & Audit Log (Real)
      </h2>
      <p style={{ color: '#a8b5ae', fontSize: '11px' }}>Live from activityLogs (admin view only)</p>
      
      <div className="sys-table-container">
        <table className="sys-table" style={{ fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ color: '#a8b5ae' }}>Action / Setting</th>
              <th style={{ color: '#a8b5ae' }}>Details</th>
              <th style={{ color: '#a8b5ae' }}>By</th>
              <th style={{ color: '#a8b5ae' }}>Timestamp</th>
              <th style={{ color: '#a8b5ae' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayLogs.map((log, i) => (
              <tr key={i}>
                <td><strong style={{ color: '#fff' }}>{log.setting}</strong></td>
                <td><span style={{ color: '#fff' }}>{log.newVal}</span> {log.oldVal !== '-' && <span style={{ color: '#5a6b63', textDecoration: 'line-through' }}> (was {log.oldVal})</span>}</td>
                <td>{log.by}</td>
                <td>{log.time}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button className="interactive-btn" style={{ marginTop: '16px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', fontSize: '12px', minHeight: 'auto' }}>
        Export Full Audit Log (to CSV)
      </button>
    </motion.div>
  );
}
