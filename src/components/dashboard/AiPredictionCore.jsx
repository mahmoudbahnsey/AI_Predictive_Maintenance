import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Brain, Activity, Cpu, Eye, Code, Wrench, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AiDiagnosticVisual from './AiDiagnosticVisual';

export default function AiPredictionCore({ state, predictedClass, confidence, description, recommendation, modelVersion = "v4.2.0-stable" }) {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showEngine, setShowEngine] = useState(false);

  const handleRunDiagnostics = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => setScanComplete(false), 3000);
    }, 2000);
  };
  
  return (
    <motion.div 
      className={`cc-card glow-${state}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="telemetry-panel-header" style={{ marginBottom: '32px' }}>
        <h2><Brain size={28} style={{ color: 'var(--gold)' }} /> Fault Prediction Card</h2>
        <em style={{ color: `var(--color-${state})`, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {state === 'normal' ? 'Live Monitoring' : state === 'warning' ? 'Warning Analysis' : 'Critical Fault Analysis'}
        </em>
      </div>

      <div className="ai-core-container">
        
        {/* Left: Info Panel */}
        <div className="ai-info-panel">
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px' }}>
            <div style={{ color: `var(--color-${state})` }}>
              <motion.div 
                className="ai-oversized-class"
                key={predictedClass}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {predictedClass}
              </motion.div>
            </div>
            <div className="ai-oversized-confidence">
              {confidence.toFixed(1)}%
            </div>
          </div>

          <dl className="ai-meta-list">
            <dt>Fault Description</dt>
            <dd style={{ fontSize: '16px', fontWeight: '500' }}>{description}</dd>

            <dt>Model Engine</dt>
            <dd>VoltIQ {modelVersion}</dd>

            <dt>Telemetry Time</dt>
            <dd>{new Date().toLocaleTimeString()} (Live Stream)</dd>

            <dt>Action Required</dt>
            <dd style={{ color: state === 'normal' ? '#a8b5ae' : `var(--color-${state})` }}>
              {recommendation || 'Continue monitoring. No immediate action required.'}
            </dd>
          </dl>

          <div className="ai-actions">
            <button className="ai-btn primary" onClick={() => navigate('/systems')}>
              <Eye size={16} /> View Details
            </button>
            <button className="ai-btn" onClick={handleRunDiagnostics} disabled={isScanning}>
              {isScanning ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'inline-flex' }}><Activity size={16} /></motion.div> Running...</>
              ) : scanComplete ? (
                <><CheckCircle size={16} color="var(--color-normal)" /> Complete</>
              ) : (
                <><Activity size={16} /> Run Diagnostics</>
              )}
            </button>
            <button className="ai-btn" onClick={() => setShowEngine(true)}>
              <Code size={16} /> Expand AI Engine
            </button>
          </div>

          <div className="ai-chips">
            <div className="ai-chip">
              <motion.div 
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-normal)' }}
                animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
              />
              Monitoring Sensors
            </div>
            <div className="ai-chip">
              <Cpu size={12} /> Learning Baseline
            </div>
            <div className="ai-chip">
              <Wrench size={12} /> Prediction Ready
            </div>
          </div>

        </div>

        {/* Right: Visual Diagnostic Panel */}
        <AiDiagnosticVisual state={state} />

      </div>

      {/* AI Engine JSON Modal using Portal */}
      {showEngine && createPortal(
        <div className="custom-modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="custom-modal" style={{
            background: '#0A0E0C', border: '1px solid var(--gold)', borderRadius: '12px',
            width: '100%', maxWidth: '600px', overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.2)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)' }}>
                <Code size={18} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>VoltIQ Core AI Engine</h3>
              </div>
              <button onClick={() => setShowEngine(false)} style={{ background: 'transparent', border: 'none', color: '#a8b5ae', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px', background: '#050706' }}>
              <pre style={{ margin: 0, color: '#e3ebe7', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
{JSON.stringify({
  model: `VoltIQ ${modelVersion}`,
  architecture: "RandomForestClassifier",
  hyperparameters: {
    n_estimators: 100,
    max_depth: null,
    min_samples_split: 2
  },
  live_input_vector: {
    voltage: 234.5,
    current: 45.2,
    temperature: 58.1,
    vibration: 0.03
  },
  output: {
    predicted_class: predictedClass,
    confidence_score: confidence,
    risk_level: state
  },
  timestamp: new Date().toISOString()
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>,
        document.body
      )}

    </motion.div>
  );
}
