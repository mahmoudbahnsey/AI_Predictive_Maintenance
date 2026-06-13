import { useState } from 'react';
import { motion } from 'framer-motion';
import { initialSettingsState } from '../../data/mockSettingsData';

function ToggleRow({ label, desc, initialChecked, onChange }) {
  const [active, setActive] = useState(initialChecked);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
      <div>
        <strong style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '4px' }}>{label}</strong>
        <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{desc}</span>
      </div>
      <div className={`cfg-toggle ${active ? 'active' : ''}`} onClick={() => { setActive(!active); onChange(); }}>
        <div className="cfg-toggle-thumb" />
      </div>
    </div>
  );
}

export default function SecurityPreferenceLayer({ onChange }) {
  const { security } = initialSettingsState;

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
      <h2 className="cfg-title">Security Preference Layer</h2>
      
      <div className="cfg-field">
        <label className="cfg-label">Session Timeout (Minutes)</label>
        <input type="number" className="cfg-input" defaultValue={security.sessionTimeout} onChange={onChange} style={{ width: '200px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ToggleRow label="Require Confirmation for Dangerous Actions" desc="Shows a modal before deleting or resetting data." initialChecked={security.requireConfirmation} onChange={onChange} />
        <ToggleRow label="Enable Settings Audit Logging" desc="Tracks who changed what setting and when." initialChecked={security.auditLogging} onChange={onChange} />
        <ToggleRow label="Lock Advanced Settings" desc="Require password re-entry to access advanced controls." initialChecked={true} onChange={onChange} />
      </div>
    </motion.div>
  );
}
