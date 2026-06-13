import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, X, Sparkles, Cpu, Layers, Activity, AlertTriangle } from 'lucide-react';
import { confusionMatrix, faultClasses } from '../../data/mockAiTrainingData';

export default function ConfusionMatrixMisclassificationLab() {
  const [selectedCell, setSelectedCell] = useState(null);

  const getHeatClass = (val, isDiag) => {
    if (val === 0) return '';
    if (isDiag && val > 80) return 'heat-perfect';
    if (!isDiag && val > 5) return 'heat-critical';
    if (!isDiag && val > 0) return 'heat-warning';
    return '';
  };

  const handleCellClick = (r, c, val, isDiag) => {
    if (isDiag || val === 0) return;
    
    // Custom explanation logic based on cell
    let explanation = `The model misclassified ${val} samples of ${faultClasses[r]} as ${faultClasses[c]}. `;
    let action = "Review labeled samples for these classes.";
    
    if (r === 3 && c === 4) {
      explanation = "F3 and F4 show overlapping thermal telemetry patterns. The model is detecting similar temperature rise behavior across both classes.";
      action = "Add more labeled samples, review class labels, and improve temperature-feature separation before deployment.";
    }

    setSelectedCell({ r, c, val, explanation, action });
  };

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Network size={18} color="var(--gold)" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Confusion Matrix & Misclassification Lab</h3>
      </div>

      <div className="ai-grid-2">
        <div>
          <div className="confusion-matrix">
            <div className="matrix-cell header"></div>
            {faultClasses.map((_, i) => <div key={i} className="matrix-cell header">F{i}</div>)}
            
            {confusionMatrix.map((row, r) => (
              <React.Fragment key={r}>
                <div className="matrix-cell header">F{r}</div>
                {row.map((val, c) => {
                  const isDiag = r === c;
                  return (
                    <div 
                      key={`${r}-${c}`} 
                      className={`matrix-cell ${getHeatClass(val, isDiag)}`}
                      onClick={() => handleCellClick(r, c, val, isDiag)}
                      title={`Actual F${r}, Predicted F${c}: ${val}`}
                    >
                      {val}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', marginTop: '12px', textAlign: 'center' }}>X: Predicted Class | Y: Actual Class (Click amber/red cells for AI Diagnostics)</span>
        </div>

        <div style={{ position: 'relative' }}>
          <AnimatePresence>
            {selectedCell ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-warning)', borderRadius: '4px', padding: '24px', height: '100%' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--color-warning)' }}>Misclassification Diagnostics</strong>
                  <button className="interactive-btn" onClick={() => setSelectedCell(null)} style={{ padding: '4px', background: 'transparent', minHeight: 'auto' }}><X size={14} color="#a8b5ae" /></button>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#a8b5ae', display: 'block' }}>Confusion Pair</span>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>Actual {faultClasses[selectedCell.r]} → Predicted {faultClasses[selectedCell.c]}</strong>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '12px', color: '#a8b5ae', display: 'block', marginBottom: '4px' }}>AI Explanation</span>
                  <p style={{ fontSize: '13px', color: '#fff', margin: 0, lineHeight: 1.6 }}>{selectedCell.explanation}</p>
                </div>

                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '12px', borderRadius: '4px', borderLeft: '2px solid var(--gold)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Required Action</span>
                  <p style={{ fontSize: '12px', color: '#fff', margin: 0 }}>{selectedCell.action}</p>
                </div>
              </motion.div>
            ) : (
              <div 
                style={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  background: 'rgba(255, 255, 255, 0.015)',
                  border: '1px solid rgba(255, 255, 255, 0.04)', 
                  borderRadius: '6px',
                  padding: '24px',
                  justifyContent: 'space-between',
                  minHeight: '340px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Sparkles size={16} style={{ color: 'var(--gold)' }} />
                    <span style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                      Classifier Performance Overview
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#a8b5ae', margin: '0 0 20px 0', lineHeight: '1.5' }}>
                    Select any off-diagonal cell (amber/red) in the matrix to view specific misclassification diagnostics and AI-suggested mitigation plans.
                  </p>

                  {/* 2x2 Grid of Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px', borderRadius: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#8c9f93', textTransform: 'uppercase', marginBottom: '4px' }}>
                        <Cpu size={12} />
                        Global Accuracy
                      </span>
                      <strong style={{ fontSize: '18px', color: '#fff', fontFamily: 'monospace' }}>91.4%</strong>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px', borderRadius: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#8c9f93', textTransform: 'uppercase', marginBottom: '4px' }}>
                        <Layers size={12} />
                        Mean F1-Score
                      </span>
                      <strong style={{ fontSize: '18px', color: '#fff', fontFamily: 'monospace' }}>0.88</strong>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px', borderRadius: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#8c9f93', textTransform: 'uppercase', marginBottom: '4px' }}>
                        <Activity size={12} />
                        Data Drift Risk
                      </span>
                      <strong style={{ fontSize: '13px', color: '#65d83b', display: 'block', marginTop: '4px' }}>LOW (2.1%)</strong>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px', borderRadius: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#8c9f93', textTransform: 'uppercase', marginBottom: '4px' }}>
                        <AlertTriangle size={12} />
                        Confused Pair
                      </span>
                      <strong style={{ fontSize: '12px', color: 'var(--color-warning)', display: 'block', marginTop: '4px' }}>F3 / F4 (10 samples)</strong>
                    </div>
                  </div>
                </div>

                <div 
                  style={{ 
                    background: 'rgba(101, 216, 59, 0.02)', 
                    border: '1px solid rgba(101, 216, 59, 0.08)', 
                    padding: '10px 12px', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <div className="live-pulse-dot" style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#65d83b',
                    boxShadow: '0 0 8px #65d83b'
                  }} />
                  <span style={{ fontSize: '10.5px', color: '#65d83b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    AI Recommendation Engine Online
                  </span>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
