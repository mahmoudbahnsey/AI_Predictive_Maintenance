import { motion } from 'framer-motion';

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
      <div>
        <strong style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '4px' }}>{label}</strong>
        <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{desc}</span>
      </div>
      <div className={`cfg-toggle ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
        <div className="cfg-toggle-thumb" />
      </div>
    </div>
  );
}

export default function SecurityPreferenceLayer({ onChange, security, onUpdateSecurity }) {
  // security prop is REAL from Firebase (admin controlled)
  const current = security || { sessionTimeout: 60, requireConfirmation: true, auditLogging: true };

  const handleNumber = (e) => {
    const updated = { ...current, sessionTimeout: parseInt(e.target.value) || 60 };
    if (onUpdateSecurity) onUpdateSecurity(updated);
    if (onChange) onChange();
  };

  const handleToggle = (key) => (nextVal) => {
    const updated = { ...current, [key]: nextVal };
    if (onUpdateSecurity) onUpdateSecurity(updated);
    if (onChange) onChange();
  };

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
      <h2 className="cfg-title">Security Preference Layer</h2>
      <p style={{ color: '#a8b5ae', fontSize: '12px', marginTop: '-8px' }}>Platform security config persisted in Firebase (admin only for global changes).</p>
      
      <div className="cfg-field">
        <label className="cfg-label">Session Timeout (Minutes)</label>
        <input type="number" className="cfg-input" value={current.sessionTimeout} onChange={handleNumber} style={{ width: '200px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ToggleRow label="Require Confirmation for Dangerous Actions" desc="Shows a modal before deleting or resetting data." checked={current.requireConfirmation} onChange={handleToggle('requireConfirmation')} />
        <ToggleRow label="Enable Settings Audit Logging" desc="Tracks who changed what setting and when." checked={current.auditLogging} onChange={handleToggle('auditLogging')} />
        <ToggleRow label="Lock Advanced Settings" desc="Require password re-entry to access advanced controls." checked={true} onChange={() => {}} />
      </div>
    </motion.div>
  );
}
