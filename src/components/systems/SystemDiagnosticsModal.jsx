import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  RefreshCw, 
  Wrench, 
  X, 
  Clock, 
  Activity
} from 'lucide-react';

export default function SystemDiagnosticsModal({ system, onClose, setFleetData }) {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticsProgress, setDiagnosticsProgress] = useState(0);
  const [diagLogStep, setDiagLogStep] = useState('');
  const [diagnosticsComplete, setDiagnosticsComplete] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchComplete, setDispatchComplete] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [localSystem, setLocalSystem] = useState(null);

  const telemetryContainerRef = useRef(null);

  // Sync with system prop
  useEffect(() => {
    if (system) {
      setLocalSystem(system);
      setTelemetryLogs(initTelemetryLogs(system));
      setIsDiagnosing(false);
      setDiagnosticsProgress(0);
      setDiagLogStep('');
      setDiagnosticsComplete(false);
      setIsResetting(false);
      setResetComplete(false);
      setIsDispatching(false);
      setDispatchComplete(false);
    } else {
      setLocalSystem(null);
      setTelemetryLogs([]);
    }
  }, [system]);

  const initTelemetryLogs = (sys) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    return [
      { type: 'system', text: `[${timestamp}] INITIALIZING TELEMETRY STREAM FOR ${sys.name.toUpperCase()}...` },
      { type: 'info', text: `[${timestamp}] Host address: 10.230.12.${sys.id === 'tx-wind-solar' ? '45' : sys.id === 'nv-solar-3' ? '82' : '101'}` },
      { type: 'info', text: `[${timestamp}] Connection established via Satellite Uplink v4.2` },
      { type: 'info', text: `[${timestamp}] Inverter firmware core: VoltIQ-CoreX v9.81` },
      { type: sys.status === 'fault' ? 'error' : sys.status === 'warning' ? 'warning' : 'success', text: `[${timestamp}] Current status registry: ${sys.status.toUpperCase()} (${sys.health}% health)` },
      sys.faults && sys.faults.length > 0
        ? { type: 'warning', text: `[${timestamp}] Sensor flag raised: ${sys.faults.join(', ')}` }
        : { type: 'success', text: `[${timestamp}] Telemetry registers report zero active alarms.` },
      { type: 'info', text: `[${timestamp}] Operator intervention requested. Waiting for diagnostics scan...` }
    ];
  };

  useEffect(() => {
    if (!localSystem) return;

    const logInterval = setInterval(() => {
      const timestamp = new Date().toISOString().substring(11, 19);
      const logTemplates = [
        { type: 'info', text: `[${timestamp}] Sensor grid status: Nominal (32 channels online)` },
        { type: 'info', text: `[${timestamp}] Current temperature: ${(25 + Math.random() * 45).toFixed(1)}°C` },
        { type: 'info', text: `[${timestamp}] Input Frequency: ${(59.8 + Math.random() * 0.4).toFixed(3)} Hz` },
        { type: 'info', text: `[${timestamp}] Solar irradiance: ${(600 + Math.random() * 300).toFixed(0)} W/m²` },
        { type: 'info', text: `[${timestamp}] Grid coupling status: Connected (Angle phase: ${(Math.random() * 5).toFixed(2)} deg)` },
        { type: 'info', text: `[${timestamp}] Energy yield: ${(localSystem.currentPower / 1000 + (Math.random() * 5 - 2.5)).toFixed(2)} kW` }
      ];
      
      const filteredTemplates = localSystem.type === 'wind' 
        ? logTemplates.filter(t => !t.text.includes('irradiance'))
        : logTemplates;

      const randomLog = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
      setTelemetryLogs(prev => [...prev, randomLog]);
    }, 1800);

    return () => clearInterval(logInterval);
  }, [localSystem]);

  useEffect(() => {
    if (telemetryContainerRef.current) {
      telemetryContainerRef.current.scrollTop = telemetryContainerRef.current.scrollHeight;
    }
  }, [telemetryLogs]);

  const runDiagnostics = () => {
    setIsDiagnosing(true);
    setDiagnosticsProgress(0);
    setDiagnosticsComplete(false);
    setDiagLogStep('Initializing AI analysis...');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setDiagnosticsProgress(progress);

      const timestamp = new Date().toISOString().substring(11, 19);

      if (progress === 15) {
        setDiagLogStep('Pinging fault registers...');
        setTelemetryLogs(prev => [...prev, { type: 'system', text: `[${timestamp}] [DIAG] Pinging hardware registers...` }]);
      } else if (progress === 40) {
        setDiagLogStep('Reading telemetry logs...');
        setTelemetryLogs(prev => [...prev, { type: 'info', text: `[${timestamp}] [DIAG] Retrieving high-resolution frequency curves...` }]);
      } else if (progress === 65) {
        setDiagLogStep('Analyzing wave signatures...');
        setTelemetryLogs(prev => [...prev, { type: 'warning', text: `[${timestamp}] [DIAG] Alert: Signal distortion detected on Phase B.` }]);
      } else if (progress === 85) {
        setDiagLogStep('Querying Wattson\'s AI model...');
        setTelemetryLogs(prev => [...prev, { type: 'info', text: `[${timestamp}] [DIAG] Sending telemetry payload to Wattson AI Agent...` }]);
      } else if (progress >= 100) {
        clearInterval(interval);
        setDiagnosticsProgress(100);
        setDiagLogStep('Analysis Complete.');
        setTelemetryLogs(prev => [...prev, { type: 'success', text: `[${timestamp}] [DIAG] Wattson analysis generated successfully.` }]);
        setDiagnosticsComplete(true);
        setIsDiagnosing(false);
      }
    }, 100);
  };

  const triggerRemoteReset = () => {
    setIsResetting(true);
    setResetComplete(false);
    const timestamp = new Date().toISOString().substring(11, 19);
    setTelemetryLogs(prev => [...prev, { type: 'error', text: `[${timestamp}] [RESET] CRITICAL: Reset command acknowledged by operator.` }]);

    setTimeout(() => {
      const t1 = new Date().toISOString().substring(11, 19);
      setTelemetryLogs(prev => [...prev, { type: 'system', text: `[${t1}] [RESET] Disconnecting from AC grid contactors...` }]);
    }, 400);

    setTimeout(() => {
      const t2 = new Date().toISOString().substring(11, 19);
      setTelemetryLogs(prev => [...prev, { type: 'info', text: `[${t2}] [RESET] Power cycling gate drive board...` }]);
    }, 800);

    setTimeout(() => {
      const t3 = new Date().toISOString().substring(11, 19);
      setTelemetryLogs(prev => [...prev, { type: 'info', text: `[${t3}] [RESET] Zeroing current sensors and resetting alarms...` }]);
    }, 1200);

    setTimeout(() => {
      const t4 = new Date().toISOString().substring(11, 19);
      setTelemetryLogs(prev => [...prev, { type: 'success', text: `[${t4}] [RESET] Re-establishing grid connection. Syncing phase locks...` }]);
      
      if (setFleetData) {
        setFleetData(prevFleet => 
          prevFleet.map(sys => 
            sys.id === localSystem.id 
              ? { ...sys, status: 'online', health: 100, faults: [] }
              : sys
          )
        );
      }

      setLocalSystem(prev => ({
        ...prev,
        status: 'online',
        health: 100,
        faults: []
      }));

      setIsResetting(false);
      setResetComplete(true);
      setTelemetryLogs(prev => [...prev, { type: 'success', text: `[${t4}] [RESET] SUCCESS: System online and reporting 100% health.` }]);
    }, 1800);
  };

  const dispatchFieldCrew = () => {
    setIsDispatching(true);
    setDispatchComplete(false);
    
    const ticketId = localSystem.id === 'sys-004' || localSystem.id === 'tx-wind-solar' ? 'WT-4029' : 'SL-9932';
    const technician = localSystem.id === 'sys-004' || localSystem.id === 'tx-wind-solar' ? 'Sarah Connor (Lead Wind Specialist)' : 'Marcus Vance (Senior Solar Tech)';
    const eta = localSystem.id === 'sys-004' || localSystem.id === 'tx-wind-solar' ? '35 mins' : '50 mins';

    const timestamp = new Date().toISOString().substring(11, 19);
    setTelemetryLogs(prev => [...prev, { type: 'system', text: `[${timestamp}] [DISPATCH] Initiating emergency maintenance crew routing...` }]);

    setTimeout(() => {
      const t1 = new Date().toISOString().substring(11, 19);
      setTelemetryLogs(prev => [...prev, { type: 'info', text: `[${t1}] [DISPATCH] Open ticket ${ticketId} registered in JIRA-Fleet...` }]);
    }, 400);

    setTimeout(() => {
      const t2 = new Date().toISOString().substring(11, 19);
      setTelemetryLogs(prev => [...prev, { type: 'info', text: `[${t2}] [DISPATCH] Pinging closest mobile worker: ${technician}...` }]);
    }, 800);

    setTimeout(() => {
      const t3 = new Date().toISOString().substring(11, 19);
      setTelemetryLogs(prev => [...prev, { type: 'success', text: `[${t3}] [DISPATCH] Crew dispatched. Worker GPS lock acquired. ETA: ${eta}.` }]);
      setIsDispatching(false);
      setDispatchComplete(true);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {system && localSystem && (
        <div 
          className="investigate-overlay"
          onClick={() => {
            if (!isDiagnosing && !isResetting && !isDispatching) {
              onClose();
            }
          }}
        >
          <motion.div 
            className="investigate-modal"
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="investigate-modal-header">
              <h3>
                <Activity size={18} color={localSystem.status === 'fault' ? 'var(--color-critical)' : 'var(--color-warning)'} />
                System Diagnostics Cockpit: {localSystem.name}
              </h3>
              <button 
                className="investigate-modal-close" 
                disabled={isDiagnosing || isResetting || isDispatching}
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>

            <div className="investigate-modal-body">
              {/* Left Panel: Telemetry Logs */}
              <div className="telemetry-terminal">
                <div className="telemetry-header">
                  <span className="telemetry-header-title">LIVE TELEMETRY STREAM</span>
                  <span>BAUD: 115200</span>
                </div>
                <div ref={telemetryContainerRef} className="telemetry-grid-lines">
                  {telemetryLogs.map((log, index) => (
                    <div key={index} className={`log-line ${log.type}`}>
                      {log.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel: Cockpit Controls */}
              <div className="cockpit-panel">
                <div className="cockpit-status-card">
                  <div className="cockpit-status-value-row">
                    <div>
                      <h4 className="cockpit-status-title">System Status</h4>
                      <span className={`cockpit-badge ${localSystem.status}`}>
                        {localSystem.status === 'fault' ? 'CRITICAL FAULT' : localSystem.status === 'warning' ? 'WARNING ACTION' : 'NOMINAL ONLINE'}
                      </span>
                    </div>
                    <div className="cockpit-health-box">
                      <div>
                        <h4 className="cockpit-status-title" style={{ textAlign: 'right' }}>Health Status</h4>
                        <div className={`cockpit-health-circle ${localSystem.status}`}>
                          {localSystem.health}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress scanning */}
                  {(isDiagnosing || diagnosticsComplete) && (
                    <div className="diag-progress-wrapper">
                      <div className="diag-progress-header">
                        <span>{diagLogStep}</span>
                        <span>{diagnosticsProgress}%</span>
                      </div>
                      <div className="diag-progress-bar-bg">
                        <div 
                          className={`diag-progress-bar-fill ${localSystem.status}`}
                          style={{ width: `${diagnosticsProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Wattson's diagnosis bubble */}
                {diagnosticsComplete && (
                  <div className={`wattson-diag-bubble ${localSystem.status === 'online' ? 'success' : ''}`}>
                    <div className="wattson-diag-avatar-container">
                      <span style={{ fontSize: '16px' }}>🤖</span>
                    </div>
                    <div className="wattson-diag-text-content">
                      <div className="wattson-diag-author">Wattson AI Core</div>
                      <p className="wattson-diag-message">
                        {localSystem.status === 'online' 
                          ? "Look at that! Clean energy flowing at 100% health. My diagnostic work is complete. You can close this cockpit and admire the green metrics."
                          : localSystem.id === 'tx-wind-solar' || localSystem.id === 'sys-004'
                          ? "F7 - Unknown Impedance: An impedance imbalance suggests a failing grid coupling relay. Acknowledge and schedule a crew before the inverter self-destructs. Seriously, it's operating at 42% health, don't let it bake."
                          : localSystem.id === 'nv-solar-3' || localSystem.id === 'sys-002'
                          ? "F3 - High Temperature: Nevadan weather is hot, but your inverter shouldn't boil eggs. The cooling fans are likely clogged. Give it a reboot or dispatch someone to brush out the desert sand."
                          : localSystem.id === 'fl-coast-array' || localSystem.id === 'sys-007' || localSystem.name.toLowerCase().includes('florida')
                          ? "Minor Voltage Fluctuation: Probably coastal humidity or passing clouds. Keep monitoring. Or reboot it remote-reset style to clear any sticky sensor flags."
                          : localSystem.id === 'sys-005' || localSystem.name.toLowerCase().includes('oregon')
                          ? "Telemetry Connection Lost: No signal from the microgrid. Could be a local power blackout or communications transceiver lockup. A remote reset might bounce the uplink controller."
                          : `System requires attention due to: ${localSystem.faults && localSystem.faults.length > 0 ? localSystem.faults.join(', ') : 'Unknown anomaly'}. Try a remote reset.`
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions terminal */}
                <div className="cockpit-actions-terminal">
                  {!diagnosticsComplete && (
                    <button 
                      className="cyber-btn primary"
                      disabled={isDiagnosing || isResetting || isDispatching}
                      onClick={runDiagnostics}
                    >
                      {isDiagnosing ? (
                        <>
                          <RefreshCw size={14} className="cyber-btn-spinner" /> Running Scan...
                        </>
                      ) : (
                        <>
                          <Cpu size={14} /> Run AI Diagnostics
                        </>
                      )}
                    </button>
                  )}

                  {diagnosticsComplete && localSystem.status !== 'online' && (
                    <button 
                      className="cyber-btn success"
                      disabled={isResetting || isDispatching}
                      onClick={triggerRemoteReset}
                    >
                      {isResetting ? (
                        <>
                          <RefreshCw size={14} className="cyber-btn-spinner" /> Resetting Inverter...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={14} /> Trigger Remote Reset
                        </>
                      )}
                    </button>
                  )}

                  {diagnosticsComplete && localSystem.status !== 'online' && !dispatchComplete && (
                    <button 
                      className="cyber-btn accent"
                      disabled={isResetting || isDispatching}
                      onClick={dispatchFieldCrew}
                    >
                      {isDispatching ? (
                        <>
                          <RefreshCw size={14} className="cyber-btn-spinner" /> Routing Crew...
                        </>
                      ) : (
                        <>
                          <Wrench size={14} /> Dispatch Field Crew
                        </>
                      )}
                    </button>
                  )}

                  {dispatchComplete && (
                    <div style={{ 
                      background: 'rgba(239, 68, 68, 0.05)', 
                      border: '1px solid rgba(239, 68, 68, 0.15)', 
                      borderRadius: '8px', 
                      padding: '12px', 
                      fontSize: '12.5px',
                      color: '#ff8a8a',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                        <Clock size={13} /> Crew Routed (Ticket #{localSystem.id === 'tx-wind-solar' || localSystem.id === 'sys-004' ? 'WT-4029' : 'SL-9932'})
                      </div>
                      <div>Technician: {localSystem.id === 'tx-wind-solar' || localSystem.id === 'sys-004' ? 'Sarah Connor' : 'Marcus Vance'}</div>
                      <div>ETA: {localSystem.id === 'tx-wind-solar' || localSystem.id === 'sys-004' ? '35 mins' : '50 mins'}</div>
                    </div>
                  )}

                  <button 
                    className="cyber-btn"
                    disabled={isDiagnosing || isResetting || isDispatching}
                    onClick={onClose}
                  >
                    Close Cockpit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
