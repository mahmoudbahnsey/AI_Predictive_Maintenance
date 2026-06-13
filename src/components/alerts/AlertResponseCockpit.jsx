import { motion } from 'framer-motion';
import { ArrowUpRight, Check, BellOff, Map } from 'lucide-react';

export default function AlertResponseCockpit({ alert }) {
  if (!alert) return null;

  return (
    <motion.div 
      key={alert.id} // Forces re-render on selection change
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}
    >
      {/* Cockpit Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: alert.severity === 'critical' ? 'rgba(255,77,77,0.05)' : 'rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#a8b5ae', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {alert.id} <span style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>{alert.status}</span>
            </span>
            <h2 style={{ fontSize: '24px', margin: '4px 0 8px 0', color: '#fff' }}>{alert.type}</h2>
            <span style={{ fontSize: '14px', color: '#e3ebe7' }}>{alert.message}</span>
          </div>
        </div>

        <div className="al-grid-4">
          <div><span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase' }}>Source Device</span><span style={{ fontSize: '12px', color: '#fff' }}>{alert.device}</span></div>
          <div><span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase' }}>Trigger Value</span><strong style={{ fontSize: '14px', color: alert.severity === 'critical' ? 'var(--color-critical)' : 'var(--color-warning)' }}>{alert.value}</strong> <span style={{ fontSize: '10px', color: '#5a6b63' }}>(Limit: {alert.threshold})</span></div>
          <div><span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase' }}>Escalation Level</span><span style={{ fontSize: '12px', color: '#fff' }}>{alert.escalationLevel}</span></div>
          <div><span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase' }}>Assigned To</span><span style={{ fontSize: '12px', color: '#fff' }}>{alert.assignedTo}</span></div>
        </div>
      </div>

      {/* Recommended Action & Primary Buttons */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ fontSize: '12px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '8px' }}>AI Recommended Action</h3>
        <p style={{ fontSize: '14px', color: '#fff', margin: '0 0 16px 0', lineHeight: 1.5, padding: '12px', background: 'rgba(212,175,55,0.05)', borderLeft: '2px solid var(--gold)', borderRadius: '4px' }}>
          {alert.recommendedAction}
        </p>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="interactive-btn" style={{ padding: '10px 16px', background: 'var(--color-normal)', color: '#000', fontWeight: 'bold', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} /> Acknowledge Alert
          </button>
          <button className="interactive-btn" style={{ padding: '10px 16px', background: 'rgba(255,77,77,0.1)', color: 'var(--color-critical)', border: '1px solid rgba(255,77,77,0.3)', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpRight size={16} /> Escalate
          </button>
          <button className="interactive-btn" style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Map size={16} /> Open Source
          </button>
          <button className="interactive-btn" style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <BellOff size={16} /> Mute
          </button>
        </div>
      </div>

      {/* Response History */}
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '12px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '16px' }}>Response History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alert.history.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#5a6b63', fontFamily: 'monospace', width: '40px' }}>{h.time}</span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === alert.history.length - 1 ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: '13px', color: i === alert.history.length - 1 ? '#fff' : '#a8b5ae' }}>{h.event}</span>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
