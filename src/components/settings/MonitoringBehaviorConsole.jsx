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

export default function MonitoringBehaviorConsole({ onChange }) {
  const { monitoring } = initialSettingsState;

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <h2 className="cfg-title">Monitoring Behavior Console</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ToggleRow label="Show Voltage Telemetry" desc="Display raw voltage data on device cards." initialChecked={monitoring.showVoltage} onChange={onChange} />
        <ToggleRow label="Show Temperature Telemetry" desc="Display inverter temperature readings." initialChecked={monitoring.showTemp} onChange={onChange} />
        <ToggleRow label="Show AI Confidence Scores" desc="Overlay F0-F7 AI prediction confidence on charts." initialChecked={monitoring.showAI} onChange={onChange} />
        <ToggleRow label="Enable Dashboard Animations" desc="Use GPU-accelerated motion for live data." initialChecked={monitoring.animations} onChange={onChange} />
      </div>
    </motion.div>
  );
}
