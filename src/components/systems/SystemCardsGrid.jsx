import { motion } from 'framer-motion';
import { Activity, Server, Brain, Plus, Trash2 } from 'lucide-react';

export default function SystemCardsGrid({ fleetData, onDiagnostics, onViewDetails, onAddSystem, onDeleteSystem }) {
  
  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={20} style={{ color: 'var(--gold)' }} />
          Advanced System Overview
        </h2>
        <motion.button 
          className="interactive-btn"
          whileHover={{ scale: 1.02, boxShadow: "0px 0px 20px rgba(0, 240, 255, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.1) 0%, rgba(212, 175, 55, 0.1) 100%)',
            color: '#00f0ff',
            border: '1px solid rgba(212, 175, 55, 0.5)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            width: '100%', // Makes it full width like in the third image, but with much better styling
            maxWidth: '300px' // Keeps it from becoming too massive on large screens, but still prominent
          }}
          onClick={onAddSystem}
        >
          <Plus size={18} /> Add System
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transform: 'skewX(-20deg)',
            animation: 'scan-line 3s infinite'
          }} />
        </motion.button>
      </div>

      <div className="sys-grid-4">
        {fleetData.map((sys, idx) => (
          <motion.div 
            key={sys.id}
            className={`sys-card status-${sys.status}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * idx }}
          >
            <div className="sys-card-header">
              <div>
                <h3 className="sys-card-title">{sys.name}</h3>
                <span className="sys-card-id">{sys.id} | {sys.location}</span>
              </div>
              <span className={`cc-badge ${sys.status === 'fault' ? 'critical' : sys.status === 'online' ? 'normal' : sys.status === 'warning' ? 'warning' : ''}`}>
                {sys.status.toUpperCase()}
              </span>
            </div>

            <div className="sys-card-metrics">
              <div className="sys-metric">
                <span>Health</span>
                <strong style={{ color: sys.health > 85 ? 'var(--color-normal)' : sys.health > 50 ? 'var(--color-warning)' : 'var(--color-critical)' }}>
                  {sys.health}%
                </strong>
              </div>
              <div className="sys-metric">
                <span>Current Power</span>
                <strong>{(sys.currentPower / 1000).toFixed(1)} kW</strong>
              </div>
              <div className="sys-metric">
                <span>Today's Energy</span>
                <strong>{sys.todayEnergy.toFixed(1)} kWh</strong>
              </div>
              <div className="sys-metric">
                <span>AI Status</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sys.aiStatus === 'ready' ? 'var(--color-normal)' : '#a8b5ae' }}>
                  <Brain size={12} /> <span style={{ color: 'inherit', margin: 0 }}>{sys.aiStatus}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                className="interactive-btn" 
                style={{ padding: '6px 12px', fontSize: '12px', minHeight: 'auto', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}
                onClick={() => onViewDetails(sys)}
              >
                View Details
              </button>
              <button 
                className="interactive-btn" 
                style={{ padding: '6px 12px', fontSize: '12px', minHeight: 'auto', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', borderColor: 'rgba(212,175,55,0.3)', cursor: 'pointer' }}
                onClick={() => onDiagnostics(sys)}
              >
                <Activity size={12} style={{ marginRight: '4px' }} /> Diagnostics
              </button>
              <button 
                className="interactive-btn" 
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '12px', 
                  minHeight: 'auto', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  color: '#ef4444', 
                  borderColor: 'rgba(239, 68, 68, 0.3)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onClick={() => onDeleteSystem(sys.id)}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
