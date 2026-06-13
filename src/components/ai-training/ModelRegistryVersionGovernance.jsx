import { motion } from 'framer-motion';
import { Database } from 'lucide-react';

export default function ModelRegistryVersionGovernance({ models }) {
  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Database size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Model Registry & Version Governance</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {models.map(m => (
          <div key={m.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '15px', color: '#fff' }}>{m.version}</strong>
                <span className="admin-badge" style={{ borderColor: m.status === 'DEPLOYED' ? 'var(--color-normal)' : m.status === 'CANDIDATE' ? 'var(--gold)' : 'rgba(255,255,255,0.2)', color: m.status === 'DEPLOYED' ? 'var(--color-normal)' : m.status === 'CANDIDATE' ? 'var(--gold)' : '#a8b5ae' }}>
                  {m.status}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#a8b5ae' }}>{m.dataset} • Acc: {m.accuracy} • F1: {m.f1}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {m.status === 'CANDIDATE' && <button className="interactive-btn" style={{ padding: '6px 12px', fontSize: '10px', background: 'var(--color-normal)', color: '#000', fontWeight: 'bold', minHeight: 'auto' }}>Deploy</button>}
              {m.status === 'DEPLOYED' && <button className="interactive-btn" style={{ padding: '6px 12px', fontSize: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', minHeight: 'auto' }}>Rollback</button>}
              <button className="interactive-btn" style={{ padding: '6px 12px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto' }}>Compare</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
