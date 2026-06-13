import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

export default function AccessScopeAssignmentCenter() {
  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <h2 className="idt-title">
        <Network size={20} color="#a8b5ae" /> Access Scope Assignment Center
      </h2>
      
      <div className="cfg-grid-3">
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--gold)', borderRadius: '4px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#fff', fontSize: '14px' }}>Full Platform Access</strong>
            <span className="idt-badge admin">Admin</span>
          </div>
          <p style={{ fontSize: '11px', color: '#a8b5ae', margin: '0 0 16px 0' }}>Unrestricted access to all systems, devices, and configurations.</p>
          <span style={{ fontSize: '11px', color: 'var(--gold)' }}>Assigned to: 5 Users</span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '4px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#fff', fontSize: '14px' }}>All Systems (Operational)</strong>
            <span className="idt-badge active">Operator</span>
          </div>
          <p style={{ fontSize: '11px', color: '#a8b5ae', margin: '0 0 16px 0' }}>Read/Write access to all Solar Farms and devices. No settings access.</p>
          <span style={{ fontSize: '11px', color: 'var(--color-normal)' }}>Assigned to: 24 Users</span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#fff', fontSize: '14px' }}>Custom Scope (Restricted)</strong>
            <span className="idt-badge guest">Viewer</span>
          </div>
          <p style={{ fontSize: '11px', color: '#a8b5ae', margin: '0 0 16px 0' }}>Access restricted to specific assigned systems (e.g., Solar Farm A only).</p>
          <span style={{ fontSize: '11px', color: '#5a6b63' }}>Assigned to: 13 Users</span>
        </div>
      </div>
    </motion.div>
  );
}
