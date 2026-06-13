import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function DataQualityTrainingReadinessEngine() {
  const stats = [
    { label: "Missing Values", val: "0.02%", status: "PASS" },
    { label: "Duplicate Rows", val: "14", status: "WARN" },
    { label: "Noise Score", val: "Low", status: "PASS" }
  ];

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <ShieldCheck size={18} color="var(--color-normal)" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Training Readiness</h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '8px solid var(--color-normal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <strong style={{ fontSize: '24px', color: '#fff', fontFamily: 'monospace' }}>98</strong>
          <span style={{ fontSize: '10px', color: '#a8b5ae' }}>SCORE</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '13px', color: '#fff', margin: '0 0 16px 0', lineHeight: 1.5 }}>Dataset is clean and feature mapping is complete. Model is ready for training.</p>
          <button className="interactive-btn" style={{ padding: '8px 16px', fontSize: '11px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto' }}>Generate Quality Report</button>
        </div>
      </div>

      <div className="ai-grid-3">
        {stats.map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', borderLeft: `2px solid ${s.status === 'PASS' ? 'var(--color-normal)' : 'var(--color-warning)'}` }}>
            <span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</span>
            <strong style={{ fontSize: '16px', color: '#fff', fontFamily: 'monospace' }}>{s.val}</strong>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
