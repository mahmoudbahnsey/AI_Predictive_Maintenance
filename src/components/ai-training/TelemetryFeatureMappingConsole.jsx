import { motion } from 'framer-motion';
import { GitMerge } from 'lucide-react';

export default function TelemetryFeatureMappingConsole() {
  const mappings = [
    { target: "Voltage", source: "v_out", type: "Float", status: "MAPPED" },
    { target: "Temperature", source: "temp_c", type: "Float", status: "MAPPED" },
    { target: "Fault Class", source: "fault_code", type: "Categorical", status: "MAPPED" },
    { target: "Timestamp", source: "---", type: "Datetime", status: "MISSING" }
  ];

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <GitMerge size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Feature Mapping</h3>
      </div>

      <div className="sys-table-container">
        <table className="sys-table" style={{ fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ color: '#a8b5ae' }}>VoltIQ AI Feature</th>
              <th style={{ color: '#a8b5ae' }}>Dataset Column</th>
              <th style={{ color: '#a8b5ae' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((m, i) => (
              <tr key={i}>
                <td><strong style={{ color: '#fff' }}>{m.target}</strong> <span style={{ fontSize: '10px', color: '#5a6b63', display: 'block' }}>{m.type}</span></td>
                <td>
                  <select className="ai-select" style={{ padding: '6px', fontSize: '12px' }} defaultValue={m.source}>
                    <option>{m.source}</option>
                    <option>ts_raw</option>
                  </select>
                </td>
                <td>
                  <span className="admin-badge" style={{ borderColor: m.status === 'MAPPED' ? 'var(--color-normal)' : 'var(--color-critical)', color: m.status === 'MAPPED' ? 'var(--color-normal)' : 'var(--color-critical)' }}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button className="interactive-btn" style={{ padding: '8px 16px', fontSize: '11px', background: 'var(--gold)', color: '#000', fontWeight: 'bold', minHeight: 'auto' }}>Save Mapping</button>
        <button className="interactive-btn" style={{ padding: '8px 16px', fontSize: '11px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto' }}>Auto Map</button>
      </div>
    </motion.div>
  );
}
