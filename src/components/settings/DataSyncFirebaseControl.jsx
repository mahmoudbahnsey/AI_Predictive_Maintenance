import { motion } from 'framer-motion';
import { initialSettingsState } from '../../data/mockSettingsData';
import { Database, RefreshCw } from 'lucide-react';

export default function DataSyncFirebaseControl({ onChange }) {
  const { sync } = initialSettingsState;

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <h2 className="cfg-title">Data Sync & Firebase Control</h2>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={24} color={sync.firebaseConnected ? "var(--color-normal)" : "var(--color-critical)"} />
          </div>
          <div>
            <strong style={{ fontSize: '15px', color: '#fff', display: 'block', marginBottom: '4px' }}>Firebase Realtime Database</strong>
            <span style={{ fontSize: '12px', color: sync.firebaseConnected ? 'var(--color-normal)' : 'var(--color-critical)' }}>
              {sync.firebaseConnected ? 'Connected & Syncing' : 'Connection Failed'}
            </span>
          </div>
        </div>
        <button className="interactive-btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 16px', fontSize: '12px', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={14} /> Test Connection
        </button>
      </div>

      <div className="cfg-grid-2">
        <div className="cfg-field">
          <label className="cfg-label">Auto Sync Enabled</label>
          <div style={{ marginTop: '8px' }}>
            <div className={`cfg-toggle ${sync.autoSync ? 'active' : ''}`} onClick={onChange}>
              <div className="cfg-toggle-thumb" />
            </div>
          </div>
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Sync Interval (Seconds)</label>
          <input type="number" className="cfg-input" defaultValue={sync.syncInterval} onChange={onChange} />
        </div>
      </div>
    </motion.div>
  );
}
