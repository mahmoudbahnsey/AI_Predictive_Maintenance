import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function SlaPressureCommand() {
  return (
    <motion.div 
      className="mission-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Clock size={18} color="var(--gold)" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>SLA Pressure Command</h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae' }}>Within SLA</span>
          <strong style={{ fontSize: '24px', color: 'var(--color-normal)' }}>38</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae' }}>At Risk (&lt;15m)</span>
          <strong style={{ fontSize: '24px', color: 'var(--color-warning)' }}>3</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae' }}>Breached</span>
          <strong style={{ fontSize: '24px', color: 'var(--color-critical)', animation: 'pulseText 1s infinite' }}>1</strong>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#e3ebe7' }}>Next SLA Breach (ALT-0092)</span>
          <strong style={{ fontSize: '14px', color: 'var(--gold)', fontFamily: 'monospace' }}>13m 42s</strong>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
          <div style={{ width: '85%', height: '100%', background: 'var(--gold)', borderRadius: '2px' }} />
        </div>
      </div>

      <button className="interactive-btn" style={{ width: '100%', marginTop: '16px', padding: '10px', fontSize: '12px', background: 'rgba(255,255,255,0.05)' }}>
        Review SLA Risk Alerts
      </button>

    </motion.div>
  );
}
