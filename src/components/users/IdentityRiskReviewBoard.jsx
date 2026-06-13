import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { privilegedRisks } from '../../data/mockUsersData';

export default function IdentityRiskReviewBoard() {
  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <h2 className="idt-title" style={{ color: 'var(--color-critical)' }}>
        <ShieldAlert size={20} /> Identity Risk & Review Board
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {privilegedRisks.map((risk, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: `2px solid ${risk.severity === 'CRITICAL' ? 'var(--color-critical)' : 'var(--color-warning)'}` }}>
            <div>
              <strong style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '4px' }}>{risk.risk}</strong>
              <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{risk.user} ({risk.role}) - Last active: {risk.lastActive}</span>
            </div>
            <button className="interactive-btn" style={{ padding: '6px 12px', fontSize: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              {risk.action}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
