import { motion } from 'framer-motion';
import { DownloadCloud, History } from 'lucide-react';

export default function BackupRestoreExportControl({ onChange }) {
  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <h2 className="cfg-title">Backup, Restore & Export Control</h2>
      
      <div className="cfg-grid-2">
        <div className="cfg-field">
          <label className="cfg-label">Auto Backup Frequency</label>
          <select className="cfg-input" defaultValue="Daily" onChange={onChange}>
            <option>Hourly</option>
            <option>Daily</option>
            <option>Weekly</option>
          </select>
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Backup Destination</label>
          <select className="cfg-input" defaultValue="AWS S3" onChange={onChange}>
            <option>AWS S3 (Primary)</option>
            <option>Google Cloud Storage</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <button className="interactive-btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 24px', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DownloadCloud size={16} /> Create Manual Backup
        </button>
        <button className="interactive-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={16} /> View Restore Points
        </button>
      </div>
    </motion.div>
  );
}
