import { motion } from 'framer-motion';
import { Settings, ShieldCheck, ServerCrash } from 'lucide-react';
import { heroSettingsStats } from '../../data/mockSettingsData';

export default function PlatformControlNexusHero() {
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
        </h1>
        <p style={{ color: '#a8b5ae', fontSize: '14px', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
          Manage your account preferences, system appearance, alerts, and performance thresholds in one place.
        </p>
      </div>
    </motion.div>
  );
}
