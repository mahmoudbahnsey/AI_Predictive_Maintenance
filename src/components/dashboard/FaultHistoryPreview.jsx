import { motion } from 'framer-motion';
import { History } from 'lucide-react';

const rowVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

export default function FaultHistoryPreview({ history = [] }) {
  // Use mock history if empty
  const displayHistory = history.length > 0 ? history.slice(0, 4) : [
    { id: 'EV-1042', class: 'F3', desc: 'High Temp Warning', severity: 'warning', time: '10 mins ago' },
    { id: 'EV-1041', class: 'F0', desc: 'Normal Operation', severity: 'normal', time: '1 hour ago' },
    { id: 'EV-1040', class: 'F7', desc: 'Unknown Impedance', severity: 'critical', time: '2 hours ago' },
    { id: 'EV-1039', class: 'F0', desc: 'Normal Operation', severity: 'normal', time: '5 hours ago' },
  ];

  return (
    <motion.div 
      className="cc-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="telemetry-panel-header" style={{ marginBottom: '16px' }}>
        <h2><History size={24} style={{ color: 'var(--gold)' }} /> Recent Activity</h2>
      </div>

      <table className="cc-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Description</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayHistory.map((item, idx) => (
            <motion.tr 
              key={item.id}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.5 + (idx * 0.1) }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              <td><strong>{item.class}</strong></td>
              <td>{item.desc}</td>
              <td style={{ color: '#a8b5ae', fontSize: '12px' }}>{item.time}</td>
              <td>
                <span className={`cc-badge ${item.severity}`}>
                  {item.severity}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
