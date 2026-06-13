import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { privilegedRisks } from '../../data/mockUsersData';

export default function PrivilegedAccessCommandStrip() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <h2 className="idt-title" style={{ color: 'var(--color-critical)', fontSize: '16px' }}>
        <AlertTriangle size={18} /> Privileged Access Command Strip
      </h2>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {privilegedRisks.map((risk, i) => (
          <div key={i} style={{ 
            minWidth: '320px', 
            background: risk.severity === 'CRITICAL' ? 'rgba(255,77,77,0.05)' : 'rgba(255,170,0,0.05)', 
            border: `1px solid ${risk.severity === 'CRITICAL' ? 'var(--color-critical)' : 'var(--color-warning)'}`,
            borderRadius: '4px', padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={14} color={risk.severity === 'CRITICAL' ? 'var(--color-critical)' : 'var(--color-warning)'} />
                <strong style={{ fontSize: '12px', color: '#fff' }}>{risk.risk}</strong>
              </div>
              <span className={`idt-badge ${risk.severity === 'CRITICAL' ? 'danger' : 'pending'}`} style={{ fontSize: '9px' }}>{risk.severity}</span>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ display: 'block', fontSize: '14px', color: '#fff' }}>{risk.user}</strong>
              <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{risk.role} • {risk.email}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#5a6b63' }}>Last active: {risk.lastActive}</span>
              <button className="interactive-btn" style={{ 
                background: risk.severity === 'CRITICAL' ? 'rgba(255,77,77,0.1)' : 'rgba(255,170,0,0.1)', 
                color: risk.severity === 'CRITICAL' ? 'var(--color-critical)' : 'var(--color-warning)',
                border: 'none', padding: '6px 12px', fontSize: '11px', minHeight: 'auto'
              }}>
                {risk.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
