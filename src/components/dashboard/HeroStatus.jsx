import { motion } from 'framer-motion';
import { Activity, Clock, Zap } from 'lucide-react';

export default function HeroStatus({ state, healthScore, lastAnalysisTime, liveFeedLabel = 'Live AI Monitoring Active' }) {
  // state: 'normal', 'warning', 'critical'
  
  const statusLabels = {
    normal: 'System Stable',
    warning: 'Warning Active',
    critical: 'Fault Detected',
  };

  return (
    <motion.div 
      className={`cc-card glow-${state} hero-status-card`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="hero-orb-container">
        <motion.div 
          className={`hero-orb ${state}`}
          animate={{ 
            scale: state === 'critical' ? [1, 1.2, 1] : state === 'warning' ? [1, 1.1, 1] : [1, 1.05, 1],
            opacity: state === 'critical' ? [0.6, 1, 0.6] : [0.8, 1, 0.8]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: state === 'critical' ? 0.8 : state === 'warning' ? 1.5 : 3,
            ease: "easeInOut"
          }}
        />
        <Zap size={24} style={{ position: 'absolute', color: `var(--color-${state})` }} />
      </div>

      <div className="hero-info">
        <h1>{statusLabels[state] || 'System Status'}</h1>
        <p>
          <span style={{ color: `var(--color-${state})` }}><Activity size={16} /> {liveFeedLabel}</span>
          <span>•</span>
          <span><Clock size={16} /> Last Scan: {lastAnalysisTime}</span>
        </p>
      </div>

      <div className="hero-stats">
        <div className="hero-stat-item">
          <motion.strong 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ color: healthScore < 80 ? 'var(--color-critical)' : 'var(--color-normal)' }}
          >
            {healthScore.toFixed(1)}%
          </motion.strong>
          <span>System Health</span>
        </div>
        <div className="hero-stat-item">
          <strong>144</strong>
          <span>Nodes Active</span>
        </div>
      </div>
    </motion.div>
  );
}
