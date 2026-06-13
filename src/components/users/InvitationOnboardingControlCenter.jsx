import { motion } from 'framer-motion';
import { Mail, Clock, RefreshCw, XCircle } from 'lucide-react';
import { mockInvitations } from '../../data/mockUsersData';

export default function InvitationOnboardingControlCenter() {
  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <h2 className="idt-title">
        <Mail size={20} color="#a8b5ae" /> Invitation & Onboarding Control Center
      </h2>
      
      <div className="sys-table-container">
        <table className="sys-table" style={{ fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ color: '#a8b5ae' }}>Invitee Email</th>
              <th style={{ color: '#a8b5ae' }}>Proposed Role</th>
              <th style={{ color: '#a8b5ae' }}>Scope</th>
              <th style={{ color: '#a8b5ae' }}>Status</th>
              <th style={{ color: '#a8b5ae' }}>Sent</th>
              <th style={{ color: '#a8b5ae' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockInvitations.map((inv, i) => (
              <tr key={i}>
                <td><strong style={{ color: '#fff' }}>{inv.email}</strong></td>
                <td><span className={`idt-badge ${inv.role === 'Guest' ? 'guest' : 'active'}`}>{inv.role}</span></td>
                <td><span style={{ color: '#a8b5ae' }}>{inv.scope}</span></td>
                <td>
                  <span style={{ color: inv.status === 'Pending' ? 'var(--color-warning)' : '#5a6b63', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {inv.status === 'Pending' && <Clock size={12} />}
                    {inv.status}
                  </span>
                </td>
                <td><span style={{ color: '#5a6b63' }}>{inv.sent}</span></td>
                <td>
                  {inv.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="interactive-btn" style={{ padding: '4px 8px', fontSize: '10px', background: 'rgba(255,255,255,0.05)' }}><RefreshCw size={10} style={{marginRight: '4px'}}/> Resend</button>
                      <button className="interactive-btn" style={{ padding: '4px 8px', fontSize: '10px', background: 'transparent', border: '1px solid rgba(255,77,77,0.3)', color: 'var(--color-critical)' }}><XCircle size={10} style={{marginRight: '4px'}}/> Revoke</button>
                    </div>
                  ) : (
                    <span style={{ color: '#5a6b63', fontSize: '10px' }}>No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
