import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';

export default function AlertRulesThresholdCommand() {
  const rules = [
    { name: "High Temperature", condition: "> 85°C for 5m", severity: "Critical", active: true },
    { name: "Voltage Sag", condition: "< 1400V for 10m", severity: "Warning", active: true },
    { name: "Telemetry Sync Loss", condition: "No ping > 30s", severity: "Critical", active: true },
    { name: "Dust / Efficiency", condition: "15% drop over 7d", severity: "Info", active: false }
  ];

  return (
    <motion.div 
      className="mission-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Sliders size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Alert Rules & Thresholds</h3>
      </div>

      <div className="al-grid-4">
        {rules.map(rule => (
          <div key={rule.name} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', opacity: rule.active ? 1 : 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className={`sla-badge ${rule.severity === 'Critical' ? 'sla-breached' : rule.severity === 'Warning' ? 'sla-at-risk' : 'sla-normal'}`} style={{ animation: 'none' }}>{rule.severity}</span>
              <span style={{ fontSize: '10px', color: rule.active ? 'var(--color-normal)' : '#a8b5ae' }}>{rule.active ? 'ACTIVE' : 'DISABLED'}</span>
            </div>
            <strong style={{ display: 'block', fontSize: '13px', color: '#fff', marginBottom: '4px' }}>{rule.name}</strong>
            <span style={{ fontSize: '11px', color: '#a8b5ae', fontFamily: 'monospace' }}>{rule.condition}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
