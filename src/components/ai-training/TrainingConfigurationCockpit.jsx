import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function TrainingConfigurationCockpit({ onStart }) {
  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Configuration Cockpit</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '4px' }}>Base Model</label>
          <select className="ai-select">
            <option>v4.2.0-stable (Live)</option>
            <option>v4.1.5-archived</option>
            <option>Start Fresh</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '4px' }}>Training Mode</label>
          <select className="ai-select">
            <option>Full Train</option>
            <option>Quick Train (Fine-tune)</option>
            <option>Validation Only</option>
          </select>
        </div>

        <div className="ai-grid-2">
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '4px' }}>Epochs</label>
            <input type="number" defaultValue={100} className="ai-select" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '4px' }}>Train/Val Split</label>
            <select className="ai-select">
              <option>80/20</option>
              <option>70/30</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gold)' }} />
            Apply SMOTE Class Balancing
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gold)' }} />
            Early Stopping
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" style={{ accentColor: 'var(--gold)' }} />
            Auto-Deploy if Val Acc {'>'} 99%
          </label>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <button 
          className="interactive-btn" 
          onClick={onStart}
          style={{ width: '100%', padding: '16px', background: 'var(--gold)', color: '#000', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          <Play size={18} /> Start Training Run
        </button>
      </div>
    </motion.div>
  );
}
