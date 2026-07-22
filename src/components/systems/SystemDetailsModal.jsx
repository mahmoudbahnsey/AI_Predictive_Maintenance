import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  RefreshCw, 
  CheckCircle,
  Sliders,
  ChevronDown
} from 'lucide-react';

// Custom Select Component for details modal
function CustomSelect({ options, value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || options[0];
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container ${disabled ? 'disabled' : ''}`} ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        className="custom-select-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ padding: '8px 12px', fontSize: '13px' }}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown size={14} className={`custom-select-caret ${isOpen ? 'open' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="custom-select-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{ zIndex: 1200 }}
          >
            {options.map(opt => (
              <div 
                key={opt.value} 
                className={`custom-select-option ${opt.value === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{ padding: '8px 10px', fontSize: '13px' }}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SystemDetailsModal({ system, onClose }) {
  const [aiBoost, setAiBoost] = useState(true);
  const [tempThreshold, setTempThreshold] = useState(75);
  const [reactiveOffset, setReactiveOffset] = useState('unity');
  const [silenceAlerts, setSilenceAlerts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  const [overrideLogs, setOverrideLogs] = useState([]);

  useEffect(() => {
    if (system) {
      setAiBoost(system.aiStatus === 'ready' || system.aiStatus === 'analyzing' || system.aiStatus === 'training');
      setTempThreshold(system.status === 'fault' && system.faults[0]?.includes('Temperature') ? 85 : 72);
      setReactiveOffset('unity');
      setSilenceAlerts(false);
      setIsSaving(false);
      setSaveComplete(false);
      
      const t = new Date().toISOString().substring(11, 19);
      setOverrideLogs([
        `[${t}] [LEDGER] Loaded configuration from active node ${system.id.toUpperCase()}`,
        `[${t}] [LEDGER] Firmware revision: CoreV9-RL105`,
        `[${t}] [LEDGER] AI status: ${system.aiStatus.toUpperCase()}`
      ]);
    } else {
      setOverrideLogs([]);
    }
  }, [system]);

  if (!system) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveComplete(false);
    const t0 = new Date().toISOString().substring(11, 19);
    setOverrideLogs(prev => [...prev, `[${t0}] [OVERRIDE] Initiating firmware configuration flash...`]);

    setTimeout(() => {
      const t1 = new Date().toISOString().substring(11, 19);
      setOverrideLogs(prev => [
        ...prev,
        `[${t1}] [OVERRIDE] Writing: AI_BOOST=${aiBoost ? 'ON' : 'OFF'}, MAX_TEMP=${tempThreshold}°C, PF_OFFSET=${reactiveOffset.toUpperCase()}`,
        `[${t1}] [OVERRIDE] Saving configuration checklist... Verified checksum 0xA92B`
      ]);
    }, 600);

    setTimeout(() => {
      const t2 = new Date().toISOString().substring(11, 19);
      setOverrideLogs(prev => [
        ...prev,
        `[${t2}] [OVERRIDE] SUCCESS: Flash complete. Active registers updated on node controller.`
      ]);
      setIsSaving(false);
      setSaveComplete(true);
    }, 1300);
  };

  const pfOptions = [
    { value: 'unity', label: '1.00 (Unity Power Factor)' },
    { value: 'lead', label: '0.95 (Leading Power Factor)' },
    { value: 'lag', label: '0.95 (Lagging Power Factor)' }
  ];

  return (
    <AnimatePresence>
      <div 
        className="investigate-overlay"
        onClick={() => {
          if (!isSaving) onClose();
        }}
      >
        <motion.div 
          className="investigate-modal"
          initial={{ y: 30, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          style={{ width: '820px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="investigate-modal-header" style={{ borderBottomColor: 'rgba(212, 175, 55, 0.15)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} color="var(--gold)" />
              System Detail Ledger: {system.name}
            </h3>
            <button 
              className="investigate-modal-close" 
              disabled={isSaving}
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>

          <div className="investigate-modal-body" style={{ gridTemplateColumns: '1fr 1.1fr', gap: '20px' }}>
            {/* Left Panel: Specifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="cockpit-status-card" style={{ padding: '18px' }}>
                <h4 className="cockpit-status-title" style={{ marginBottom: '12px' }}>Asset Blueprint Specification</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8A9A8F' }}>System Target ID</span>
                    <strong style={{ fontFamily: 'monospace', color: '#fff' }}>{system.id.toUpperCase()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8A9A8F' }}>Node Status</span>
                    <strong className={`cc-badge ${system.status === 'fault' ? 'critical' : system.status === 'online' ? 'normal' : system.status === 'warning' ? 'warning' : ''}`} style={{ padding: '2px 8px', fontSize: '10px' }}>
                      {system.status.toUpperCase()}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8A9A8F' }}>Geographic Location</span>
                    <strong style={{ color: '#e3ebe7' }}>{system.location}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8A9A8F' }}>Peak Output Rating</span>
                    <strong style={{ color: '#e3ebe7' }}>
                      {system.id === 'tx-wind-solar' || system.id === 'sys-004' ? '14.5 MW' : system.id === 'nv-solar-3' || system.id === 'sys-002' ? '8.0 MW' : '5.2 MW'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8A9A8F' }}>Hardware Array Type</span>
                    <strong style={{ color: '#e3ebe7', textTransform: 'capitalize' }}>
                      {system.type === 'wind' ? 'Wind / Solar Hybrid' : 'Bifacial Solar Photovoltaic'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8A9A8F' }}>Inverter Gateway Model</span>
                    <strong style={{ color: '#e3ebe7' }}>VoltIQ-CoreX Gateway</strong>
                  </div>
                </div>
              </div>

              {/* Logs display */}
              <div 
                className="telemetry-terminal" 
                style={{ 
                  height: '160px', 
                  padding: '12px', 
                  background: '#010302', 
                  border: '1px solid rgba(255,255,255,0.03)' 
                }}
              >
                <div className="telemetry-header" style={{ paddingBottom: '6px', marginBottom: '8px' }}>
                  <span>Override Commands Terminal</span>
                </div>
                <div className="telemetry-grid-lines" style={{ fontSize: '10px', gap: '4px' }}>
                  {overrideLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`log-line ${log.includes('SUCCESS') ? 'success' : log.includes('Writing') ? 'info' : 'system'}`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Operations Console Forms */}
            <form onSubmit={handleSave} className="cockpit-panel" style={{ gap: '16px' }}>
              <div className="cockpit-status-card" style={{ padding: '18px', gap: '14px' }}>
                <h4 className="cockpit-status-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sliders size={13} color="var(--gold)" />
                  Operational Override Registers
                </h4>

                {/* 1. AI Efficiency Boost Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>AI Optimization Boost</span>
                    <span style={{ fontSize: '11px', color: '#8A9A8F' }}>Enable real-time algorithmic MPPT tracking</span>
                  </div>
                  <div 
                    onClick={() => !isSaving && setAiBoost(!aiBoost)}
                    style={{
                      width: '42px',
                      height: '22px',
                      borderRadius: '100px',
                      background: aiBoost ? 'var(--color-normal)' : 'rgba(255, 255, 255, 0.08)',
                      padding: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: aiBoost ? 'flex-end' : 'flex-start',
                      transition: 'background 0.2s ease',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <motion.div 
                      layout
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    />
                  </div>
                </div>

                {/* 2. Temperature Threshold Slider */}
                <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="cyber-form-label">Max Inverter Temp Limit</label>
                    <strong style={{ fontFamily: 'monospace', fontSize: '13px', color: '#ffd458' }}>
                      {tempThreshold}°C
                    </strong>
                  </div>
                  <input 
                    type="range" 
                    min="60" 
                    max="95" 
                    className="cyber-slider"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.08)',
                      height: '4px',
                      borderRadius: '2px',
                      outline: 'none',
                      cursor: 'pointer',
                      WebkitAppearance: 'none'
                    }}
                    value={tempThreshold}
                    onChange={(e) => setTempThreshold(Number(e.target.value))}
                    disabled={isSaving}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#5a6b63', marginTop: '2px', fontFamily: 'monospace' }}>
                    <span>60°C (SAFE)</span>
                    <span>95°C (CRITICAL)</span>
                  </div>
                </div>

                {/* 3. Reactive Power Select */}
                <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                  <label className="cyber-form-label" style={{ marginBottom: '6px' }}>Reactive Power PF Offset</label>
                  <CustomSelect 
                    options={pfOptions}
                    value={reactiveOffset}
                    onChange={setReactiveOffset}
                    disabled={isSaving}
                  />
                </div>

                {/* 4. Alert Silencing checkbox */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => !isSaving && setSilenceAlerts(!silenceAlerts)}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    borderColor: silenceAlerts ? 'var(--color-warning)' : 'rgba(255,255,255,0.2)',
                    background: silenceAlerts ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '1px',
                    flexShrink: 0
                  }}>
                    {silenceAlerts && <div style={{ width: '8px', height: '8px', borderRadius: '1.5px', background: 'var(--color-warning)' }} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#fff' }}>Silence Maintenance Reminders</span>
                    <span style={{ fontSize: '11px', color: '#8A9A8F' }}>Suppress minor telemetry alert warnings for 24h</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-action-row" style={{ marginTop: 0 }}>
                <button 
                  type="button" 
                  className="cyber-btn"
                  disabled={isSaving}
                  onClick={onClose}
                >
                  Close Ledger
                </button>
                <button 
                  type="submit" 
                  className="cyber-btn primary"
                  disabled={isSaving || saveComplete}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={14} className="cyber-btn-spinner" /> Saving flash config...
                    </>
                  ) : saveComplete ? (
                    <>
                      <CheckCircle size={14} color="var(--color-normal)" /> Flash Saved!
                    </>
                  ) : (
                    'Save Configuration Override'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
