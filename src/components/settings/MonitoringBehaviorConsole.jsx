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

export default function MonitoringBehaviorConsole({ onChange, monitoring, onUpdateMonitoring }) {
  // monitoring prop is REAL from Firebase
  const current = monitoring || { showVoltage: true, showTemp: true, showAI: true, animations: true };

  const handleToggle = (key) => (nextVal) => {
    const updated = { ...current, [key]: nextVal };
    if (onUpdateMonitoring) onUpdateMonitoring(updated);
    if (onChange) onChange();
  };

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <h2 className="cfg-title">Monitoring Behavior Console</h2>
      <p style={{ color: '#a8b5ae', fontSize: '12px', marginTop: '-8px' }}>Settings persisted live to Firebase and affect all dashboards.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ToggleRow label="Show Voltage Telemetry" desc="Display raw voltage data on device cards." checked={current.showVoltage} onChange={handleToggle('showVoltage')} />
        <ToggleRow label="Show Temperature Telemetry" desc="Display inverter temperature readings." checked={current.showTemp} onChange={handleToggle('showTemp')} />
        <ToggleRow label="Show AI Confidence Scores" desc="Overlay F0-F7 AI prediction confidence on charts." checked={current.showAI} onChange={handleToggle('showAI')} />
        <ToggleRow label="Enable Dashboard Animations" desc="Use GPU-accelerated motion for live data." checked={current.animations} onChange={handleToggle('animations')} />
      </div>
    </motion.div>
  );
}
