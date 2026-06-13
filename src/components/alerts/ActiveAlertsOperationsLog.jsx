import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { mockAlerts } from '../../data/mockAlertsData';

export default function ActiveAlertsOperationsLog() {
  return (
    <motion.div 
      className="mission-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      style={{ marginTop: '32px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Database size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Alerts Operations Log</h3>
      </div>

      <div className="sys-table-container">
        <table className="sys-table">
          <thead>
            <tr>
              <th>Alert ID</th>
              <th>Status</th>
              <th>Type / Severity</th>
              <th>Device / System</th>
              <th>SLA State</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {mockAlerts.map((alert, idx) => (
              <motion.tr 
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + (idx * 0.05) }}
              >
                <td><strong style={{ color: '#fff', fontFamily: 'monospace' }}>{alert.id}</strong></td>
                <td><span style={{ fontSize: '11px', background: alert.status === 'UNACKNOWLEDGED' ? 'var(--color-critical)' : 'rgba(255,255,255,0.1)', color: alert.status === 'UNACKNOWLEDGED' ? '#000' : '#fff', padding: '2px 8px', borderRadius: '2px', fontWeight: 'bold' }}>{alert.status}</span></td>
                <td>
                  <strong style={{ display: 'block', color: alert.severity === 'critical' ? 'var(--color-critical)' : alert.severity === 'warning' ? 'var(--color-warning)' : '#fff' }}>{alert.type}</strong>
                  <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase' }}>{alert.severity}</span>
                </td>
                <td>
                  <span style={{ display: 'block', color: '#fff' }}>{alert.device}</span>
                  <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{alert.system}</span>
                </td>
                <td><span className={`sla-badge sla-${alert.slaState}`}>{alert.slaRemaining || 'N/A'}</span></td>
                <td><span style={{ color: alert.assignedTo === 'Unassigned' ? 'var(--color-critical)' : '#a8b5ae' }}>{alert.assignedTo}</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
