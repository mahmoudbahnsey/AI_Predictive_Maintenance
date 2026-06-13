import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function AiFleetInsights({ insights }) {
  
  return (
    <motion.div 
      className="sys-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="sys-card-header">
        <h2 className="sys-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={18} style={{ color: 'var(--gold)' }} />
          AI Fleet Insights
        </h2>
        <span className="cc-badge normal">Live Analysis</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + (idx * 0.1) }}
            style={{ 
              background: 'rgba(0,0,0,0.4)', 
              padding: '12px 16px', 
              borderRadius: '6px',
              borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
              fontSize: '13px',
              color: '#e3ebe7',
              lineHeight: 1.5
            }}
          >
            {insight}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
