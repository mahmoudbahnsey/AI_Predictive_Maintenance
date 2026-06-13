import { motion } from 'framer-motion';
import { AlertOctagon, ArrowRight } from 'lucide-react';
import { mockAlerts } from '../../data/mockAlertsData';

export default function ImmediateActionCommandBar() {
  const urgent = mockAlerts.find(alt => alt.severity === 'critical');
  if (!urgent) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mission-panel pulse-critical"
      style={{ 
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(255,77,77,0.1)', padding: '12px', borderRadius: '50%' }}>
          <AlertOctagon size={24} color="var(--color-critical)" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            IMMEDIATE ACTION REQUIRED: {urgent.type}
            <span style={{ fontSize: '11px', background: 'var(--color-critical)', color: '#000', padding: '2px 8px', borderRadius: '2px', fontWeight: 'bold' }}>{urgent.status}</span>
          </h3>
          <span style={{ fontSize: '13px', color: '#e3ebe7', display: 'block', marginTop: '4px' }}>
            {urgent.device} ({urgent.system}) | {urgent.message} | SLA: {urgent.slaRemaining}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="interactive-btn" style={{ padding: '10px 20px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto' }}>
          Assign Responder
        </button>
        <button className="interactive-btn" style={{ padding: '10px 20px', fontSize: '12px', background: 'var(--color-critical)', color: '#000', fontWeight: 'bold', minHeight: 'auto' }}>
          Acknowledge & Escalate <ArrowRight size={16} style={{ marginLeft: '4px' }} />
        </button>
      </div>
    </motion.div>
  );
}
