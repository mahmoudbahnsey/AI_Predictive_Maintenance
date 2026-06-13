import { motion } from 'framer-motion';
import { FileSignature } from 'lucide-react';

export default function AiGovernanceAuditTrail() {
  const events = [
    { action: "Deployed v4.2.0-stable", user: "Auto-Retrain", time: "Jun 10, 08:35", status: "Approved" },
    { action: "Rolled back v4.1.5", user: "Mike R.", time: "May 15, 06:40", status: "Approved" }
  ];

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1.5 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <FileSignature size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Governance & Audit Trail</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {events.map((ev, i) => (
          <div key={i} style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ fontSize: '13px', color: '#fff' }}>{ev.action}</strong>
              <span style={{ fontSize: '10px', color: 'var(--color-normal)', textTransform: 'uppercase' }}>{ev.status}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#a8b5ae' }}>By: {ev.user} • {ev.time}</span>
          </div>
        ))}
      </div>

      <button className="interactive-btn" style={{ width: '100%', marginTop: '24px', padding: '12px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto' }}>
        Export Full Audit Trail
      </button>
    </motion.div>
  );
}
