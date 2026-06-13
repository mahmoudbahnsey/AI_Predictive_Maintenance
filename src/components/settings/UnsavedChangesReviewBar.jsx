import { motion } from 'framer-motion';
import { Save, RefreshCcw, Eye } from 'lucide-react';

export default function UnsavedChangesReviewBar({ count, onSave, onDiscard }) {
  return (
    <motion.div 
      className="cfg-unsaved-bar"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-warning)', boxShadow: '0 0 10px rgba(255,170,0,0.6)' }} />
        <div>
          <strong style={{ fontSize: '15px', color: '#fff', display: 'block' }}>You have {count} unsaved {count === 1 ? 'change' : 'changes'}</strong>
          <span style={{ fontSize: '12px', color: '#a8b5ae' }}>Please save your configuration before leaving this page.</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="interactive-btn" onClick={onDiscard} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCcw size={14} /> Discard
        </button>
        <button className="interactive-btn" style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Eye size={14} /> Review
        </button>
        <button className="interactive-btn" onClick={onSave} style={{ padding: '10px 24px', background: 'var(--gold)', color: '#000', fontWeight: 'bold', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Save size={16} /> Save All
        </button>
      </div>
    </motion.div>
  );
}
