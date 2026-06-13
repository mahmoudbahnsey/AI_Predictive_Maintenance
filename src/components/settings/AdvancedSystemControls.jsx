import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

function ToggleRowDanger({ label, desc, initialChecked, onChange }) {
  const [active, setActive] = useState(initialChecked);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '4px', background: 'rgba(255,77,77,0.05)' }}>
      <div>
        <strong style={{ fontSize: '13px', color: 'var(--color-critical)', display: 'block', marginBottom: '4px' }}>{label}</strong>
        <span style={{ fontSize: '11px', color: '#e3ebe7' }}>{desc}</span>
      </div>
      <div className={`cfg-toggle ${active ? 'active danger' : ''}`} onClick={() => { setActive(!active); onChange(); }}>
        <div className="cfg-toggle-thumb" />
      </div>
    </div>
  );
}

export default function AdvancedSystemControls({ onChange }) {
  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
      <h2 className="cfg-title" style={{ color: 'var(--color-critical)' }}>
        <AlertTriangle size={20} /> Advanced System Controls
      </h2>
      
      <p style={{ fontSize: '13px', color: '#a8b5ae', marginBottom: '24px', lineHeight: 1.5 }}>
        These settings directly affect the core operation of VoltIQ. Only modify them if you understand the implications.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ToggleRowDanger label="System Maintenance Mode" desc="Takes the platform offline for non-admins." initialChecked={false} onChange={onChange} />
        <ToggleRowDanger label="Debug Logging Mode" desc="Increases log verbosity. May impact performance." initialChecked={false} onChange={onChange} />
        <ToggleRowDanger label="Bypass AI Deployment Gate" desc="Allows models to deploy without admin approval." initialChecked={false} onChange={onChange} />
      </div>

      <button className="interactive-btn" style={{ marginTop: '24px', background: 'transparent', border: '1px solid var(--color-critical)', color: 'var(--color-critical)', padding: '12px 24px', minHeight: 'auto' }}>
        Clear System Cache
      </button>
    </motion.div>
  );
}
