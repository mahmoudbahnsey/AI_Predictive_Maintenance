import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export default function TrainingLogsEventConsole() {
  const logs = [
    { time: "14:00:01", type: "success", msg: "Dataset loaded: Nevada_Thermal_Fix (450K records)" },
    { time: "14:00:05", type: "success", msg: "Feature mapping validated. 12/12 features active." },
    { time: "14:00:08", type: "warn", msg: "Missing values detected in temp_c (0.02%). Applied median imputation." },
    { time: "14:01:12", type: "success", msg: "Training started. Base model: v4.2.0-stable." },
    { time: "15:30:45", type: "success", msg: "Epoch 50/100 completed. Val Acc: 96.5%." },
    { time: "19:45:00", type: "success", msg: "Training completed. Candidate v4.3.0 saved." },
    { time: "19:45:02", type: "error", msg: "Deployment blocked: Requires Admin Approval." }
  ];

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Terminal size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Training Logs & Events</h3>
      </div>

      <div className="ai-terminal">
        {logs.map((l, i) => (
          <div key={i} className="log-line">
            <span className="log-time">[{l.time}]</span>
            <span className={`log-${l.type}`}>{l.msg}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
