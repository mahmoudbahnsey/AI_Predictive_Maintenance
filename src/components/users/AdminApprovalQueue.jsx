import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import { mockApprovals } from '../../data/mockUsersData';

export default function AdminApprovalQueue() {
  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <h2 className="idt-title" style={{ color: 'var(--gold)' }}>
        <CheckSquare size={20} /> Admin Approval Queue
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockApprovals.map((app, i) => (
          <div key={i} style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '16px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <strong style={{ fontSize: '13px', color: '#fff' }}>{app.action}</strong>
              <span className={`idt-badge ${app.risk === 'Critical' ? 'danger' : 'pending'}`}>{app.risk} Risk</span>
            </div>
            <p style={{ fontSize: '11px', color: '#a8b5ae', margin: '0 0 16px 0' }}>Target: {app.target} | Requested by: {app.requestedBy}</p>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="interactive-btn" style={{ flex: 1, background: 'var(--gold)', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '8px' }}>Approve</button>
              <button className="interactive-btn" style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '8px' }}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
