import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { heroAlertStats } from '../../data/mockAlertsData';

export default function EmergencyMissionControlHero() {
  
  return (
    <motion.div 
      className="mission-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ padding: '40px', background: 'rgba(5,5,5,1)', borderBottom: '2px solid rgba(255,77,77,0.2)' }}
    >
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-1px', color: '#fff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Activity size={40} color="var(--color-critical)" style={{ animation: 'pulseText 2s infinite' }} />
          Emergency Mission Control
        </h1>
        <p style={{ color: '#a8b5ae', fontSize: '14px', maxWidth: '650px', margin: 0, lineHeight: 1.6 }}>
          Live alert stream, emergency triage, SLA pressure, responder assignment, escalation control, and notification routing across VoltIQ systems.
        </p>
      </div>

      <div className="al-grid-4" style={{ position: 'relative', zIndex: 10, marginTop: '40px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid #5a6b63' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', letterSpacing: '1px', marginBottom: '8px' }}>Active Alerts</span>
          <strong style={{ fontSize: '32px', color: '#fff', fontFamily: 'monospace' }}>{heroAlertStats.active}</strong>
        </div>
        <div style={{ background: 'rgba(255,77,77,0.1)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--color-critical)' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-critical)', letterSpacing: '1px', marginBottom: '8px' }}>Critical Emergencies</span>
          <strong style={{ fontSize: '32px', color: 'var(--color-critical)', fontFamily: 'monospace' }}>{heroAlertStats.critical}</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--color-warning)' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', letterSpacing: '1px', marginBottom: '8px' }}>Unacknowledged</span>
          <strong style={{ fontSize: '32px', color: 'var(--color-warning)', fontFamily: 'monospace' }}>{heroAlertStats.unack}</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--gold)' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', letterSpacing: '1px', marginBottom: '8px' }}>SLA Risk / Breached</span>
          <strong style={{ fontSize: '32px', color: 'var(--gold)', fontFamily: 'monospace' }}>{heroAlertStats.slaRisk}</strong>
        </div>
      </div>
      
    </motion.div>
  );
}
