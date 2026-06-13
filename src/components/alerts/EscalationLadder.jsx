import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function EscalationLadder() {
  const steps = [
    { level: "Detected", count: 42, color: "#fff" },
    { level: "Pending Ack", count: 6, color: "var(--color-warning)" },
    { level: "Assigned", count: 18, color: "var(--color-normal)" },
    { level: "Escalated", count: 2, color: "var(--color-critical)" },
    { level: "Incident Created", count: 1, color: "var(--gold)" }
  ];

  return (
    <motion.div 
      className="mission-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <TrendingUp size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Escalation Ladder</h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', paddingTop: '16px' }}>
        {/* Connecting Line */}
        <div style={{ position: 'absolute', top: '32px', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />

        {steps.map((step, idx) => (
          <div key={idx} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: 'rgba(0,0,0,0.8)', border: `2px solid ${step.color}`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '12px', fontWeight: 'bold', color: step.color,
              marginBottom: '12px',
              boxShadow: `0 0 10px ${step.color}33`
            }}>
              {step.count}
            </div>
            <strong style={{ fontSize: '11px', color: '#fff', textTransform: 'uppercase', textAlign: 'center' }}>{step.level}</strong>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
