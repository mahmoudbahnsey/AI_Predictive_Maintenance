import { motion } from 'framer-motion';

function PremiumNumberInput({ value, onChange, style = {} }) {
  const val = value ?? 0;

  const emit = (newVal) => {
    onChange({ target: { value: newVal } });
  };

  const handleIncrement = () => {
    const newVal = Number(val) + 1;
    emit(newVal);
  };

  const handleDecrement = () => {
    const newVal = Number(val) - 1;
    emit(newVal);
  };

  const handleInputChange = (e) => {
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

export default function UnitsLimitsThresholdControl({ onChange, thresholds, onUpdateThresholds, isAdmin }) {
  // thresholds prop is the REAL data from Firebase (or fallback)
  const current = thresholds || { tempWarning: 65, tempCritical: 85, voltWarning: 110, offlineTimeout: 15 };

  const handleFieldChange = (field) => (e) => {
    const newVal = Number(e.target.value);
    const updated = { ...current, [field]: newVal };
    if (onUpdateThresholds) {
      onUpdateThresholds(updated);
    }
    if (onChange) onChange();
  };

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <h2 className="cfg-title">System Limits & Units {isAdmin ? '' : <span style={{fontSize:'10px',opacity:0.6}}>(view only — admin can tune)</span>}</h2>
      
      <div className="cfg-grid-2">
        <div className="cfg-field">
          <label className="cfg-label">High Temp Warning (°C)</label>
          <PremiumNumberInput 
            value={current.tempWarning} 
            onChange={handleFieldChange('tempWarning')} 
            style={{ borderColor: 'var(--color-warning)' }} 
          />
          <span style={{ fontSize: '10px', color: '#a8b5ae', marginTop: '4px', display: 'block' }}>Warning temperature limit. Persisted in real-time to Firebase.</span>
        </div>
        <div className="cfg-field">
          <label className="cfg-label">High Temp Critical (°C)</label>
          <PremiumNumberInput 
            value={current.tempCritical} 
            onChange={handleFieldChange('tempCritical')} 
            style={{ borderColor: 'var(--color-critical)' }} 
          />
          <span style={{ fontSize: '10px', color: '#a8b5ae', marginTop: '4px', display: 'block' }}>Critical danger limit. Persisted in real-time to Firebase.</span>
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Low Voltage Warning (V)</label>
          <PremiumNumberInput 
            value={current.voltWarning} 
            onChange={handleFieldChange('voltWarning')} 
          />
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Offline Timeout (Mins)</label>
          <PremiumNumberInput 
            value={current.offlineTimeout} 
            onChange={handleFieldChange('offlineTimeout')} 
          />
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: '10px', color: '#5a6b63' }}>
        These values feed the live fault detection engine and alerts. Changes saved via the Save flow are immediately available to the entire fleet command surface.
      </div>
    </motion.div>
  );
}
