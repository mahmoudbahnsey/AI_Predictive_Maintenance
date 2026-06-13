import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function ConfigurationCommandRail({ activeSection, onSelect, unsavedCount }) {
  const categories = [
    { id: 'account', label: 'Account & Profile' },
    { id: 'appearance', label: 'Appearance & Theme' },
    { id: 'notifications', label: 'Notifications & Alerts' },
    { id: 'thresholds', label: 'System Limits & Units' }
  ];

  return (
    <motion.nav 
      className="cfg-rail"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {categories.map(c => (
        <div 
          key={c.id} 
          className={`rail-item ${activeSection === c.id ? 'active' : ''}`}
          onClick={() => onSelect(c.id)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {c.locked && <Lock size={12} color="#5a6b63" />}
            {c.label}
          </span>
          {c.unsaved && <div className="rail-dot unsaved" />}
          {c.error && !c.unsaved && <div className="rail-dot error" />}
        </div>
      ))}
    </motion.nav>
  );
}
