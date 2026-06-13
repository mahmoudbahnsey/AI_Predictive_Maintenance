import { motion } from 'framer-motion';
import { Activity, X, ArrowRight } from 'lucide-react';

export default function PermissionChangeImpactSimulator({ onClose }) {
  return (
    <div className="cfg-modal-overlay">
      <motion.div 
        className="cfg-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--gold)" /> Permission Change Impact Simulator
          </h3>
          <button className="interactive-btn" onClick={onClose} style={{ padding: '4px', background: 'transparent', minHeight: 'auto' }}>
            <X size={16} color="#a8b5ae" />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>User Affected</span>
              <strong style={{ fontSize: '15px', color: '#fff' }}>Mike Roberts</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="idt-badge guest">Operator</span>
              <ArrowRight size={16} color="#5a6b63" />
              <span className="idt-badge admin">Administrator</span>
            </div>
          </div>

          <h4 style={{ fontSize: '12px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Impacted Scope</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid rgba(255,77,77,0.3)', borderRadius: '4px', background: 'rgba(255,77,77,0.05)' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>Platform Settings</strong>
                <span style={{ fontSize: '11px', color: 'var(--color-critical)' }}>Gains full configuration rights</span>
              </div>
              <span className="idt-badge danger">+ High Risk</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid rgba(255,170,0,0.3)', borderRadius: '4px', background: 'rgba(255,170,0,0.05)' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>User Management</strong>
                <span style={{ fontSize: '11px', color: 'var(--color-warning)' }}>Gains invite and delete rights</span>
              </div>
              <span className="idt-badge pending">+ Elevated</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="interactive-btn" onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
            Cancel Change
          </button>
          <button className="interactive-btn" onClick={onClose} style={{ padding: '10px 24px', background: 'var(--gold)', color: '#000', fontWeight: 'bold' }}>
            Confirm & Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
}
