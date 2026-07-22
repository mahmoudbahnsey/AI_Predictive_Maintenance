import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function PlatformControlNexusHero({ lastLoaded, isAdmin }) {
  const statusText = lastLoaded 
    ? `Live • Synced ${lastLoaded.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} from Firebase` 
    : 'Loading real configuration from Realtime Database...';

  return (
    <motion.div 
      className="cfg-panel"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ padding: '40px', borderBottom: '2px solid var(--gold)' }}
    >
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-1px', color: '#fff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Settings size={28} color="var(--gold)" />
          Settings
          {isAdmin && <span style={{ fontSize: '12px', background: 'rgba(212,175,55,0.15)', padding: '2px 8px', borderRadius: '3px', verticalAlign: 'middle' }}>ADMIN</span>}
        </h1>
        <p style={{ color: '#a8b5ae', fontSize: '14px', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
          Manage your account preferences, system appearance, alerts, and performance thresholds in one place.
        </p>
        <div style={{ marginTop: '12px', fontSize: '11px', color: lastLoaded ? '#7aa37a' : '#a8b5ae', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, background: lastLoaded ? '#7aa37a' : '#d4af37', borderRadius: '50%' }} />
          {statusText}
        </div>
      </div>
    </motion.div>
  );
}
