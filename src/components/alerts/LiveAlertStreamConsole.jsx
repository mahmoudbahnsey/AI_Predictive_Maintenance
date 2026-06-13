import { motion } from 'framer-motion';

export default function LiveAlertStreamConsole({ alerts, selectedAlertId, onSelectAlert }) {
  
  return (
    <>
      {alerts.map((alert, idx) => {
        const isActive = alert.id === selectedAlertId;
        const severityClass = `alert-severity-${alert.severity}`;

        return (
          <motion.div 
            key={alert.id}
            className={`alert-stream-card ${severityClass} ${isActive ? 'active' : ''}`}
            onClick={() => onSelectAlert(alert.id)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#fff', fontFamily: 'monospace', fontWeight: 'bold' }}>{alert.id}</span>
                {alert.status === 'UNACKNOWLEDGED' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-critical)', animation: 'pulseText 1s infinite' }} />}
              </div>
              <span className={`sla-badge sla-${alert.slaState}`}>{alert.slaRemaining || 'N/A'}</span>
            </div>
            
            <strong style={{ display: 'block', fontSize: '14px', color: isActive ? 'var(--gold)' : '#fff', marginBottom: '4px' }}>
              {alert.type}
            </strong>
            <span style={{ display: 'block', fontSize: '11px', color: '#a8b5ae', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {alert.message}
            </span>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#5a6b63', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
              <span>{alert.device}</span>
              <span>{alert.timeTriggered}</span>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}
