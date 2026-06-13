import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export default function AiModelFoundryHero({ models = [] }) {
  // Find the currently active deployed model
  const deployedModel = models.find(m => m.status === 'DEPLOYED' || m.deployment === 'LIVE') || {
    version: "v1.0.0-stable",
    accuracy: "91.4%",
    records: "8.5K",
    driftRisk: "Low"
  };

  const liveModel = deployedModel.version || "v1.0.0-stable";
  const valAcc = deployedModel.accuracy || "91.4%";
  const records = deployedModel.records || "8.5K";
  const driftRisk = deployedModel.driftRisk || "Low";
  
  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ padding: '40px', background: 'rgba(5,5,5,1)', borderBottom: '2px solid var(--gold)' }}
    >
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-1px', color: '#fff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Cpu size={40} color="var(--gold)" />
          AI Model Foundry
        </h1>
        <p style={{ color: '#a8b5ae', fontSize: '14px', maxWidth: '750px', margin: 0, lineHeight: 1.6 }}>
          Train, validate, version, deploy, and govern VoltIQ’s AI fault prediction engine using solar telemetry, F0–F7 labels, and production-grade model controls.
        </p>
      </div>

      <div className="ai-grid-4" style={{ position: 'relative', zIndex: 10, marginTop: '40px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--gold)' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', letterSpacing: '1px', marginBottom: '8px' }}>Live Production Model</span>
          <strong style={{ fontSize: '32px', color: '#fff', fontFamily: 'monospace' }}>{liveModel}</strong>
        </div>
        <div style={{ background: 'rgba(0,180,255,0.05)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid #38bdf8' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '1px', marginBottom: '8px' }}>Validation Accuracy</span>
          <strong style={{ fontSize: '32px', color: '#38bdf8', fontFamily: 'monospace' }}>{valAcc}</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid #a8b5ae' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', letterSpacing: '1px', marginBottom: '8px' }}>Dataset Records</span>
          <strong style={{ fontSize: '32px', color: '#fff', fontFamily: 'monospace' }}>{records}</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--color-warning)' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', letterSpacing: '1px', marginBottom: '8px' }}>Model Drift Risk</span>
          <strong style={{ fontSize: '32px', color: 'var(--color-warning)', fontFamily: 'monospace' }}>{driftRisk}</strong>
        </div>
      </div>
      
    </motion.div>
  );
}
