import { motion } from 'framer-motion';
import { initialSettingsState } from '../../data/mockSettingsData';

export default function WorkspaceGovernance({ onChange }) {
  const { workspace } = initialSettingsState;

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <h2 className="cfg-title">Workspace Governance</h2>
      
      <div className="cfg-field">
        <label className="cfg-label">Workspace Name</label>
        <input type="text" className="cfg-input" defaultValue={workspace.name} onChange={onChange} />
      </div>

      <div className="cfg-field">
        <label className="cfg-label">Workspace Mode</label>
        <div className="cfg-grid-3">
          {['Standard', 'Monitoring', 'Maintenance', 'Executive'].map(mode => (
            <div 
              key={mode}
              style={{
                border: `1px solid ${workspace.mode === mode ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                background: workspace.mode === mode ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.02)',
                padding: '16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={onChange}
            >
              <strong style={{ color: workspace.mode === mode ? 'var(--gold)' : '#fff', fontSize: '13px' }}>{mode}</strong>
              <span style={{ display: 'block', fontSize: '11px', color: '#a8b5ae', marginTop: '4px' }}>
                {mode === 'Standard' && 'Full platform access.'}
                {mode === 'Monitoring' && 'Read-only dashboard focus.'}
                {mode === 'Maintenance' && 'Suppresses alerts.'}
                {mode === 'Executive' && 'High-level KPI focus.'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="cfg-grid-2">
        <div className="cfg-field">
          <label className="cfg-label">Auto-Refresh Interval (ms)</label>
          <input type="number" className="cfg-input" defaultValue={workspace.refreshInterval} onChange={onChange} />
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Compact Mode</label>
          <div style={{ marginTop: '8px' }}>
            <div className={`cfg-toggle ${workspace.compactMode ? 'active' : ''}`} onClick={onChange}>
              <div className="cfg-toggle-thumb" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
