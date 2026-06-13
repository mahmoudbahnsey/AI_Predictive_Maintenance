import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export default function DeploymentReadinessGate() {
  const checks = [
    { label: "Data Quality Passed", status: "PASS" },
    { label: "F1 Score > 0.95", status: "PASS" },
    { label: "False Alarm Rate < 1%", status: "PASS" },
    { label: "Admin Approval", status: "FAIL" }
  ];

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <ShieldAlert size={18} color="var(--color-critical)" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Deployment Gate</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px' }}>
            <span style={{ fontSize: '13px', color: '#fff' }}>{c.label}</span>
            {c.status === 'PASS' ? <CheckCircle size={16} color="var(--color-normal)" /> : <XCircle size={16} color="var(--color-critical)" />}
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,77,77,0.1)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--color-critical)', marginBottom: '24px' }}>
        <strong style={{ display: 'block', fontSize: '12px', color: 'var(--color-critical)', marginBottom: '4px' }}>Deployment Blocked</strong>
        <span style={{ fontSize: '12px', color: '#fff' }}>Model v4.3.0-candidate requires manual Admin approval before it can replace the live model.</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="interactive-btn" style={{ flex: 1, padding: '12px', background: 'var(--color-normal)', color: '#000', fontWeight: 'bold', minHeight: 'auto' }}>Approve & Deploy</button>
        <button className="interactive-btn" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto' }}>Reject Candidate</button>
      </div>
    </motion.div>
  );
}
