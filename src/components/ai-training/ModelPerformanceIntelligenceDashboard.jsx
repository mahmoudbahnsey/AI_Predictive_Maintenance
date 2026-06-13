import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function ModelPerformanceIntelligenceDashboard() {
  const metrics = [
    { label: "Precision", val: "97.2%", status: "Good" },
    { label: "Recall", val: "96.8%", status: "Good" },
    { label: "F1 Score", val: "0.96", status: "Good" },
    { label: "False Alarm Rate", val: "0.2%", status: "Excellent" }
  ];

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Target size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Performance Intelligence Dashboard</h3>
      </div>

      <div className="ai-grid-4">
        {metrics.map(m => (
          <div key={m.label} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--color-normal)' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '8px' }}>{m.label}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <strong style={{ fontSize: '24px', color: '#fff', fontFamily: 'monospace' }}>{m.val}</strong>
              <span style={{ fontSize: '10px', color: 'var(--color-normal)' }}>{m.status}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
