import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export default function AiAlertCommander() {
  const recommendations = [
    { 
      text: "Acknowledge ALT-0092 and inspect Inverter-07 temperature immediately.", 
      reason: "SLA breach imminent (<15m) for critical thermal overload.",
      priority: "CRITICAL"
    },
    { 
      text: "Create an incident from repeated F3 thermal alerts on Arizona HQ.", 
      reason: "4 identical warnings in 48 hours indicate hardware degradation.",
      priority: "HIGH"
    },
    { 
      text: "Mute repeated info alerts from Sub-array 3 (Texas) for 24 hours.", 
      reason: "Dust accumulation pattern already identified and scheduled for cleaning.",
      priority: "LOW"
    }
  ];

  return (
    <motion.div 
      className="mission-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <BrainCircuit size={18} color="var(--gold)" />
        <h3 style={{ fontSize: '16px', color: 'var(--gold)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Alert Commander</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recommendations.map((rec, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: `2px solid ${rec.priority === 'CRITICAL' ? 'var(--color-critical)' : rec.priority === 'HIGH' ? 'var(--color-warning)' : 'var(--gold)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>{rec.text}</strong>
              <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{rec.reason}</span>
            </div>
            <button className="interactive-btn" style={{ padding: '8px 16px', fontSize: '12px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', minHeight: 'auto', border: '1px solid rgba(212,175,55,0.3)' }}>
              Apply Action
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
