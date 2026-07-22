import { motion } from 'framer-motion';

export default function ConfigurationCommandRail({ activeSection, onSelect }) {
  // Simplified to the essentials only. Removed Appearance (global theme picker exists in header),
  // Data Sync (backend detail), and Audit (separate concern / admin logs).
  // Keeps the UI very simple and focused on the important configuration.
  const categories = [
    { id: 'account', label: 'Account & Profile' },
    { id: 'notifications', label: 'Notifications & Alerts' },
    { id: 'thresholds', label: 'System Limits & Units' },
    { id: 'monitoring', label: 'Monitoring Behavior' },
    { id: 'security', label: 'Security Preferences' },
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
          {c.label}
        </div>
      ))}
    </motion.nav>
  );
}
