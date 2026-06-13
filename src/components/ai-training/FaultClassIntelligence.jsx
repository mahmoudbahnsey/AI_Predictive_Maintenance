import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { faultClasses } from '../../data/mockAiTrainingData';

export default function FaultClassIntelligence() {
  const distribution = [95, 12, 8, 4, 3, 2, 1, 2];

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <BarChart3 size={18} color="var(--gold)" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>F0–F7 Intelligence</h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px', marginBottom: '24px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {distribution.map((val, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '100%', height: `${val}%`, background: i === 0 ? 'var(--color-normal)' : val < 5 ? 'var(--color-critical)' : 'var(--gold)', borderRadius: '2px 2px 0 0', minHeight: '4px' }} />
            <span style={{ fontSize: '10px', color: '#a8b5ae' }}>F{i}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,170,0,0.1)', padding: '12px', borderRadius: '4px', borderLeft: '2px solid var(--color-warning)' }}>
        <strong style={{ display: 'block', fontSize: '12px', color: 'var(--color-warning)', marginBottom: '4px' }}>AI Imbalance Warning</strong>
        <p style={{ fontSize: '11px', color: '#e3ebe7', margin: 0, lineHeight: 1.5 }}>
          F5, F6, and F7 are underrepresented. Prediction reliability for these classes may be lower unless more samples are added or SMOTE balancing is applied.
        </p>
      </div>
    </motion.div>
  );
}
