import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, X } from 'lucide-react';

export default function ConfigurationDiffReview({ onConfirm, onCancel }) {
  const diffs = [
    { setting: 'System Maintenance Mode', old: 'Disabled', new: 'Enabled', type: 'danger' },
    { setting: 'Auto Sync Enabled', old: 'True', new: 'False', type: 'warning' }
  ];

  return (
    <div className="cfg-modal-overlay">
      <motion.div 
        className="cfg-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} color="var(--gold)" /> Configuration Diff Review
          </h3>
          <button className="interactive-btn" onClick={onCancel} style={{ padding: '4px', background: 'transparent', minHeight: 'auto' }}>
            <X size={16} color="#a8b5ae" />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '13px', color: '#a8b5ae', margin: '0 0 24px 0' }}>
            You are about to save changes that significantly impact platform behavior. Please review the diff below before confirming.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {diffs.map((d, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${d.type === 'danger' ? 'rgba(255,77,77,0.3)' : 'rgba(255,170,0,0.3)'}`, borderRadius: '4px', padding: '16px' }}>
                <strong style={{ fontSize: '14px', color: '#fff', display: 'block', marginBottom: '12px' }}>{d.setting}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, background: 'rgba(255,77,77,0.1)', padding: '8px 12px', borderRadius: '4px', color: '#a8b5ae', textDecoration: 'line-through', fontSize: '13px' }}>
                    {d.old}
                  </div>
                  <ArrowRight size={16} color="#a8b5ae" />
                  <div style={{ flex: 1, background: 'rgba(212,175,55,0.1)', padding: '8px 12px', borderRadius: '4px', color: 'var(--gold)', fontWeight: 'bold', fontSize: '13px' }}>
                    {d.new}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="interactive-btn" onClick={onCancel} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
            Cancel Edit
          </button>
          <button className="interactive-btn" onClick={onConfirm} style={{ padding: '10px 24px', background: 'var(--gold)', color: '#000', fontWeight: 'bold' }}>
            Confirm & Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
