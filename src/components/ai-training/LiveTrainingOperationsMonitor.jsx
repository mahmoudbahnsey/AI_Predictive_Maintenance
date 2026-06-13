import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function LiveTrainingOperationsMonitor({ active, stage, setStage }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (active) {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setStage(10); // done
            return 100;
          }
          if (p > 20) setStage(4);
          if (p > 60) setStage(5);
          if (p > 90) setStage(6);
          return p + 2;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [active, setStage]);

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Activity size={18} color={active ? 'var(--gold)' : '#a8b5ae'} />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Live Operations Monitor</h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: '#fff' }}>Training Progress</span>
        <span style={{ fontSize: '12px', color: 'var(--gold)', fontFamily: 'monospace' }}>{progress}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
        <motion.div 
          style={{ height: '100%', background: 'var(--gold)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="ai-grid-2">
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px' }}>
          <span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '8px' }}>Current Stage</span>
          <strong style={{ fontSize: '14px', color: '#fff' }}>
            {!active ? "IDLE" : progress < 100 ? "MODEL TRAINING" : "VALIDATION COMPLETE"}
          </strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px' }}>
          <span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '8px' }}>Est. Time Remaining</span>
          <strong style={{ fontSize: '14px', color: '#fff', fontFamily: 'monospace' }}>
            {!active ? "--:--" : progress < 100 ? `00:${String(Math.floor((100 - progress) / 2)).padStart(2, '0')}` : "00:00"}
          </strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px' }}>
          <span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '8px' }}>Val Accuracy</span>
          <strong style={{ fontSize: '16px', color: active && progress > 60 ? 'var(--color-normal)' : '#fff', fontFamily: 'monospace' }}>
            {!active ? "--%" : progress > 60 ? `${(80 + (progress/5)).toFixed(1)}%` : "Calculating..."}
          </strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px' }}>
          <span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '8px' }}>Loss</span>
          <strong style={{ fontSize: '16px', color: '#fff', fontFamily: 'monospace' }}>
            {!active ? "--" : progress > 0 ? (0.5 - (progress * 0.004)).toFixed(4) : "--"}
          </strong>
        </div>
      </div>
    </motion.div>
  );
}
