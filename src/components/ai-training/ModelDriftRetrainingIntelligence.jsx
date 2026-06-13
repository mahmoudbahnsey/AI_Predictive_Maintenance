import { motion } from 'framer-motion';
import { ActivitySquare } from 'lucide-react';

export default function ModelDriftRetrainingIntelligence() {
  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1.4 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <ActivitySquare size={18} color="var(--color-warning)" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Model Drift Intelligence</h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '6px solid var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <strong style={{ fontSize: '18px', color: '#fff', fontFamily: 'monospace' }}>12%</strong>
          <span style={{ fontSize: '8px', color: '#a8b5ae' }}>DRIFT</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '13px', color: '#fff', margin: '0 0 8px 0', lineHeight: 1.5 }}>Slight data drift detected in F3 (Thermal) predictions compared to training baseline.</p>
          <span style={{ fontSize: '11px', color: 'var(--color-warning)' }}>Retraining recommended in 14 days.</span>
        </div>
      </div>
      
      <button className="interactive-btn" style={{ width: '100%', padding: '12px', background: 'rgba(255,170,0,0.1)', color: 'var(--color-warning)', border: '1px solid rgba(255,170,0,0.3)', minHeight: 'auto' }}>
        Schedule Retraining
      </button>
    </motion.div>
  );
}
