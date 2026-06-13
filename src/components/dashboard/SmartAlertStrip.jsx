import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

export default function SmartAlertStrip({ alerts, onAcknowledge }) {
  // alerts: array of { id, type: 'warning' | 'critical', message, action }
  
  return (
    <AnimatePresence>
      {alerts && alerts.length > 0 && (
        <motion.div 
          className={`smart-alert-strip ${alerts[0].type}`}
          initial={{ y: -100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: -100, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {alerts[0].type === 'critical' ? <ShieldAlert size={24} /> : <AlertTriangle size={24} />}
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: '14px', letterSpacing: '0.5px' }}>
              {alerts[0].type === 'critical' ? 'CRITICAL FAULT DETECTED' : 'SYSTEM WARNING'}
            </strong>
            <span style={{ fontSize: '13px', opacity: 0.9 }}>{alerts[0].message}</span>
          </div>

          <div style={{ marginLeft: '24px', display: 'flex', gap: '12px' }}>
            <button 
              className="interactive-btn" 
              style={{ padding: '6px 16px', minHeight: 'auto', background: 'rgba(255,255,255,0.1)' }}
              onClick={() => onAcknowledge(alerts[0].id)}
            >
              Acknowledge
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
