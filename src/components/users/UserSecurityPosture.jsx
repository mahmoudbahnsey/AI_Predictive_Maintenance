import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function UserSecurityPosture() {
  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <h2 className="idt-title">
        <Shield size={20} color="#a8b5ae" /> User Security Posture
      </h2>
      
      <div className="cfg-grid-2">
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px' }}>
          <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>MFA Adoption</span>
          <strong style={{ fontSize: '24px', color: 'var(--color-normal)' }}>92%</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px' }}>
          <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Failed Logins (24h)</span>
          <strong style={{ fontSize: '24px', color: 'var(--color-warning)' }}>14</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', gridColumn: 'span 2' }}>
          <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Admin Ratio</span>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '12%', background: 'var(--gold)' }} />
            <div style={{ width: '88%', background: 'rgba(255,255,255,0.2)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '10px', color: 'var(--gold)' }}>12% Admins (Healthy)</span>
            <span style={{ fontSize: '10px', color: '#a8b5ae' }}>88% Standard</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
