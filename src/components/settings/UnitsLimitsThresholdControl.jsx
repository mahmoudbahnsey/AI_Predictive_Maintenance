import { motion } from 'framer-motion';
import { useState } from 'react';
import { initialSettingsState } from '../../data/mockSettingsData';

function PremiumNumberInput({ defaultValue, onChange, style = {} }) {
  const [val, setVal] = useState(defaultValue || 0);

  const handleIncrement = () => {
    const newVal = Number(val) + 1;
    setVal(newVal);
    onChange({ target: { value: newVal } });
  };

  const handleDecrement = () => {
    const newVal = Number(val) - 1;
    setVal(newVal);
    onChange({ target: { value: newVal } });
  };

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setVal(newVal);
    onChange(e);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input 
        type="number" 
        className="cfg-input" 
        value={val} 
        onChange={handleInputChange} 
        style={{ ...style, paddingRight: '46px' }} 
      />
      <div style={{
        position: 'absolute',
        right: '6px',
        top: '6px',
        bottom: '6px',
        display: 'flex',
        flexDirection: 'column',
        width: '28px',
        gap: '2px',
        zIndex: 5
      }}>
        <button
          type="button"
          onClick={handleIncrement}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '4px 4px 2px 2px',
            color: '#a8b5ae',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            lineHeight: 1,
            padding: 0,
            transition: 'all 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.color = '#a8b5ae';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
          }}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '2px 2px 4px 4px',
            color: '#a8b5ae',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            lineHeight: 1,
            padding: 0,
            transition: 'all 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.color = '#a8b5ae';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
          }}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export default function UnitsLimitsThresholdControl({ onChange }) {
  const { thresholds } = initialSettingsState;

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <h2 className="cfg-title">System Limits & Units</h2>
      
      <div className="cfg-grid-2">
        <div className="cfg-field">
          <label className="cfg-label">High Temp Warning (°C)</label>
          <PremiumNumberInput defaultValue={thresholds.tempWarning} onChange={onChange} style={{ borderColor: 'var(--color-warning)' }} />
          <span style={{ fontSize: '10px', color: '#a8b5ae', marginTop: '4px', display: 'block' }}>Warning temperature limit.</span>
        </div>
        <div className="cfg-field">
          <label className="cfg-label">High Temp Critical (°C)</label>
          <PremiumNumberInput defaultValue={thresholds.tempCritical} onChange={onChange} style={{ borderColor: 'var(--color-critical)' }} />
          <span style={{ fontSize: '10px', color: '#a8b5ae', marginTop: '4px', display: 'block' }}>Critical danger limit.</span>
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Low Voltage Warning (V)</label>
          <PremiumNumberInput defaultValue={thresholds.voltWarning} onChange={onChange} />
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Offline Timeout (Mins)</label>
          <PremiumNumberInput defaultValue={thresholds.offlineTimeout} onChange={onChange} />
        </div>
      </div>
    </motion.div>
  );
}
