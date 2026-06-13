import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Trash2 } from 'lucide-react';

export default function AiTrainingHistoryTable({ models, onDeleteModel }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.6 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Database size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Training History</h3>
      </div>

      <div className="sys-table-container">
        <table className="sys-table">
          <thead>
            <tr>
              <th>Training ID</th>
              <th>Version & Dataset</th>
              <th>Status</th>
              <th>Acc / F1</th>
              <th>Trained By</th>
              <th>Deployment</th>
              <th style={{ textAlign: 'center', width: '60px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m, idx) => (
              <motion.tr 
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 + (idx * 0.05) }}
              >
                <td><strong style={{ color: '#fff', fontFamily: 'monospace' }}>{m.id}</strong></td>
                <td>
                  <strong style={{ display: 'block', color: '#fff' }}>{m.version}</strong>
                  <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{m.dataset}</span>
                </td>
                <td>
                  <span className="admin-badge" style={{ borderColor: m.status === 'DEPLOYED' ? 'var(--color-normal)' : m.status === 'CANDIDATE' ? 'var(--gold)' : 'rgba(255,255,255,0.2)', color: m.status === 'DEPLOYED' ? 'var(--color-normal)' : m.status === 'CANDIDATE' ? 'var(--gold)' : '#a8b5ae' }}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'block', color: '#fff' }}>{m.accuracy}</span>
                  <span style={{ fontSize: '11px', color: '#a8b5ae' }}>F1: {m.f1}</span>
                </td>
                <td>
                  <span style={{ display: 'block', color: '#fff' }}>{m.trainedBy}</span>
                  <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{m.completed.split(' ')[0]}</span>
                </td>
                <td>
                  <span style={{ color: m.deployment === 'LIVE' ? 'var(--color-normal)' : m.deployment === 'BLOCKED' ? 'var(--color-critical)' : '#a8b5ae' }}>{m.deployment}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {onDeleteModel && (
                    <button 
                      onClick={() => setDeleteTarget(m.id)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: '#ef4444', 
                        cursor: 'pointer', 
                        padding: '6px', 
                        borderRadius: '4px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="Delete Entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(5, 5, 4, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              style={{
                background: 'rgba(18, 16, 10, 0.98)',
                border: '1px solid rgba(245, 185, 20, 0.3)',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '440px',
                width: '100%',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.85), 0 0 30px rgba(245, 185, 20, 0.15)',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <Trash2 size={24} />
              </div>
              
              <h4 style={{ fontSize: '18px', color: '#fff', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Confirm Deletion
              </h4>
              
              <p style={{ color: 'var(--voltiq-text-muted)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '28px' }}>
                Are you sure you want to permanently remove training run <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{deleteTarget}</strong>? This action cannot be undone.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setDeleteTarget(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDeleteModel(deleteTarget);
                    setDeleteTarget(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#ef4444',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#d32f2f'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
