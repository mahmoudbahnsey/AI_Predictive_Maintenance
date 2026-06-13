import { motion } from 'framer-motion';
import { Database, UploadCloud } from 'lucide-react';

export default function DatasetIngestionCommandCenter() {
  const datasets = [
    { name: "Global_Telemetry_Q1", type: "Firebase Stream", records: "12.4M", status: "VALID", active: true },
    { name: "Nevada_Thermal_Fix.csv", type: "Manual Upload", records: "450K", status: "PARTIAL", active: false }
  ];

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Database size={18} color="var(--gold)" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Dataset Ingestion</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {datasets.map(ds => (
          <div key={ds.name} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ds.active ? 'var(--gold)' : 'rgba(255,255,255,0.05)'}`, padding: '16px', borderRadius: '4px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong style={{ fontSize: '14px', color: '#fff' }}>{ds.name}</strong>
              <span className={`admin-badge`} style={{ borderColor: ds.status === 'VALID' ? 'var(--color-normal)' : 'var(--color-warning)', color: ds.status === 'VALID' ? 'var(--color-normal)' : 'var(--color-warning)' }}>
                {ds.status}
              </span>
            </div>
            <span style={{ display: 'block', fontSize: '11px', color: '#a8b5ae', marginBottom: '16px' }}>{ds.type} • {ds.records} records</span>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {!ds.active && <button className="interactive-btn" style={{ padding: '6px 12px', fontSize: '10px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', minHeight: 'auto', border: '1px solid rgba(212,175,55,0.3)' }}>Use Dataset</button>}
              <button className="interactive-btn" style={{ padding: '6px 12px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto' }}>Preview</button>
            </div>
          </div>
        ))}
      </div>

      <button className="interactive-btn" style={{ width: '100%', marginTop: '16px', padding: '12px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <UploadCloud size={16} /> Upload New Dataset
      </button>

    </motion.div>
  );
}
