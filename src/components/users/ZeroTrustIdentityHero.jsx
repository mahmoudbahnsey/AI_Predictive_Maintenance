import { motion } from 'framer-motion';
import { Shield, Users, UserPlus, KeyRound } from 'lucide-react';
import { identityHeroStats } from '../../data/mockUsersData';

export default function ZeroTrustIdentityHero() {
  return (
    <motion.div 
      className="idt-panel"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ padding: '40px', borderBottom: '2px solid var(--gold)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ display: 'inline-block', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
            Admin Identity Authority Layer
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-1px', color: '#fff', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Shield size={36} color="var(--gold)" />
            Zero-Trust Identity Command Center
          </h1>
          <p style={{ color: '#a8b5ae', fontSize: '14px', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
            Govern VoltIQ users, roles, permissions, invitations, access scopes, identity risk, privileged access, and administrative approvals from one secure enterprise control layer.
          </p>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(0,255,136,0.05)', border: '2px solid rgba(0,255,136,0.3)' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid var(--color-normal)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 4s linear infinite' }} />
            <div>
              <strong style={{ fontSize: '24px', color: 'var(--color-normal)', display: 'block', lineHeight: 1 }}>{identityHeroStats.postureScore}</strong>
              <span style={{ fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase' }}>Posture</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cfg-grid-3" style={{ marginTop: '40px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', borderLeft: '2px solid var(--color-normal)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(0,255,136,0.1)', padding: '12px', borderRadius: '8px' }}>
            <Users size={24} color="var(--color-normal)" />
          </div>
          <div>
            <strong style={{ fontSize: '24px', color: '#fff', display: 'block' }}>{identityHeroStats.active} <span style={{ fontSize: '14px', color: '#a8b5ae' }}>/ {identityHeroStats.total}</span></strong>
            <span style={{ fontSize: '12px', color: '#a8b5ae', textTransform: 'uppercase' }}>Active Users</span>
          </div>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', borderLeft: '2px solid var(--gold)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '12px', borderRadius: '8px' }}>
            <KeyRound size={24} color="var(--gold)" />
          </div>
          <div>
            <strong style={{ fontSize: '24px', color: '#fff', display: 'block' }}>{identityHeroStats.privileged} <span style={{ fontSize: '14px', color: '#a8b5ae' }}>({identityHeroStats.admin} Admins)</span></strong>
            <span style={{ fontSize: '12px', color: '#a8b5ae', textTransform: 'uppercase' }}>Privileged Access</span>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', borderLeft: '2px solid var(--color-warning)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255,170,0,0.1)', padding: '12px', borderRadius: '8px' }}>
            <UserPlus size={24} color="var(--color-warning)" />
          </div>
          <div>
            <strong style={{ fontSize: '24px', color: '#fff', display: 'block' }}>{identityHeroStats.pendingInvites}</strong>
            <span style={{ fontSize: '12px', color: '#a8b5ae', textTransform: 'uppercase' }}>Pending Invites</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
