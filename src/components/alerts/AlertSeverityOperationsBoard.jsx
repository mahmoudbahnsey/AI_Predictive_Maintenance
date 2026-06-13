import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export default function AlertSeverityOperationsBoard() {
  const stats = [
    { label: "Critical", count: 4, trend: "+2", color: "var(--color-critical)" },
    { label: "Warning", count: 12, trend: "-1", color: "var(--color-warning)" },
    { label: "Info", count: 26, trend: "0", color: "var(--color-normal)" }
  ];

  return (
    <motion.div 
      className="mission-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <ShieldAlert size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Alert Severity Board</h3>
      </div>

      <div className="al-grid-3">
        {stats.map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: `2px solid ${s.color}` }}>
            <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', marginBottom: '8px' }}>{s.label}</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <strong style={{ fontSize: '24px', color: s.color, fontFamily: 'monospace' }}>{s.count}</strong>
              <span style={{ fontSize: '11px', color: s.trend.startsWith('+') ? 'var(--color-critical)' : '#a8b5ae', paddingBottom: '4px' }}>{s.trend} since yesterday</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
