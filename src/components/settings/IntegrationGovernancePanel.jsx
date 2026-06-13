import { motion } from 'framer-motion';
import { integrationStatus } from '../../data/mockSettingsData';
import { Link2, AlertCircle, CheckCircle } from 'lucide-react';

export default function IntegrationGovernancePanel({ onChange }) {
  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <h2 className="cfg-title">Integration Governance Panel</h2>
      
      <div className="cfg-grid-2">
        {integrationStatus.map((int, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', borderLeft: `2px solid ${int.status === 'CONNECTED' ? 'var(--color-normal)' : 'var(--color-warning)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#fff', display: 'block', marginBottom: '4px' }}>{int.name}</strong>
                <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase' }}>{int.type}</span>
              </div>
              {int.status === 'CONNECTED' ? <CheckCircle size={16} color="var(--color-normal)" /> : <AlertCircle size={16} color="var(--color-warning)" />}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '11px', color: '#5a6b63' }}>Last Sync: {int.lastSync}</span>
              <button className="interactive-btn" onClick={onChange} style={{ background: 'transparent', padding: '6px 12px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.1)', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link2 size={12} /> {int.status === 'CONNECTED' ? 'Configure' : 'Reconnect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
