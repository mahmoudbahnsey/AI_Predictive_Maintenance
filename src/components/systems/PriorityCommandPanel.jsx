import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';

export default function PriorityCommandPanel({ fleetData, onInvestigate }) {
  // Find highest risk / critical systems
  const criticalSystems = fleetData
    .filter(s => s.status === 'fault' || s.status === 'warning')
    .sort((a, b) => a.health - b.health)
    .slice(0, 3);

  return (
    <motion.div 
      className="sys-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ minHeight: '400px' }}
    >
      <div className="sys-card-header">
        <h2 className="sys-card-title">Priority Command Panel</h2>
      </div>

      <div className="priority-panel">
        {criticalSystems.length === 0 ? (
          <div style={{ color: '#a8b5ae', textAlign: 'center', padding: '40px 0' }}>
            No critical actions required at this time. All systems operating nominally.
          </div>
        ) : (
          criticalSystems.map((sys, idx) => (
            <motion.div 
              key={sys.id} 
              className={`priority-item ${sys.status === 'fault' ? 'fault' : 'warning'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              whileHover={{ scale: 1.02, x: 4 }}
              style={{ borderColor: sys.status === 'fault' ? 'var(--color-critical)' : 'var(--color-warning)' }}
            >
              <div className="priority-item-header">
                <span className="priority-item-title">{sys.name}</span>
                <div className="priority-item-icon-wrapper">
                  {sys.status === 'fault' ? (
                    <ShieldAlert size={14} color="var(--color-critical)" />
                  ) : (
                    <AlertTriangle size={14} color="var(--color-warning)" />
                  )}
                </div>
              </div>
              <div className="priority-item-description">
                {sys.faults.length > 0 ? sys.faults[0] : 'System requires attention'}
              </div>
              <div style={{ marginTop: '4px' }}>
                <button 
                  className="priority-btn" 
                  onClick={() => onInvestigate(sys)}
                >
                  Investigate <ArrowRight size={11} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
