import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function UserActivityAccessIntelligence() {
  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
      <h2 className="idt-title">
        <Activity size={20} color="#a8b5ae" /> User Activity & Access Intelligence
      </h2>
      
      <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {[4, 8, 15, 22, 18, 30, 45, 38, 25, 12, 8, 5].map((val, i) => (
          <div key={i} style={{ flex: 1, background: 'rgba(0,255,136,0.2)', height: `${val}%`, borderRadius: '2px 2px 0 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--color-normal)' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
        <span style={{ fontSize: '11px', color: '#5a6b63' }}>12 Hours Ago</span>
        <span style={{ fontSize: '11px', color: '#a8b5ae' }}>Peak Login Activity</span>
        <span style={{ fontSize: '11px', color: 'var(--color-normal)' }}>Now</span>
      </div>
    </motion.div>
  );
}
