import { useState, useMemo, useEffect } from 'react';
import { Cpu, Gauge, Wrench, ShieldAlert, Sparkles } from 'lucide-react';
import { ruleBasedPredictFault as calcFault } from '../../utils/faultAnalyzer';

export default function AiInferenceSandbox() {
  const [ia, setIa] = useState(1.0);
  const [ib, setIb] = useState(-5.8);
  const [vdc, setVdc] = useState(-22.0);
  const [idc, setIdc] = useState(-0.25);
  const [t1, setT1] = useState(-7.2);
  const [t2, setT2] = useState(-6.5);
  const [t3, setT3] = useState(-5.7);
  const [vd, setVd] = useState(-7.3);
  const [alarmLeft, setAlarmLeft] = useState(0);
  const [relayStatus, setRelayStatus] = useState('on');

  // Selected Preset State for Card Highlights
  const [selectedPreset, setSelectedPreset] = useState('F0');

  const presets = [
    { code: 'F0', label: 'Reset to Normal', desc: 'System healthy & running', color: 'var(--color-normal)', rgb: '101, 216, 59' },
    { code: 'F1', label: 'Current Imbalance', desc: 'Phase current delta > 7.2A', color: '#38bdf8', rgb: '56, 189, 248' },
    { code: 'F2', label: 'Voltage Sag', desc: 'DC bus voltage drops < -45V', color: 'var(--color-warning)', rgb: '240, 165, 38' },
    { code: 'F3', label: 'Thermal Anomaly', desc: 'Heatsink temperature > 68°C', color: 'var(--color-critical)', rgb: '239, 68, 68' },
    { code: 'F4', label: 'Power Drop Anomaly', desc: 'Low conversion efficiency', color: '#c084fc', rgb: '192, 132, 252' },
    { code: 'F5', label: 'Sensor Mismatch', desc: 'Thermal spread delta > 12°C', color: '#a8b5ae', rgb: '168, 181, 174' },
    { code: 'F6', label: 'DC Overvoltage', desc: 'DC bus voltage exceeds 58V', color: '#fb923c', rgb: '251, 146, 60' },
    { code: 'F7', label: 'Unknown Anomaly', desc: 'Extreme multi-signal vectors', color: 'var(--color-critical)', rgb: '239, 68, 68' },
    { code: 'F8', label: 'External Alarm', desc: 'Safety relay / sensor trip', color: 'var(--color-warning)', rgb: '240, 165, 38' }
  ];

  // Compute live prediction
  const prediction = useMemo(() => {
    const record = {
      features: {
        Ia: Number(ia),
        Ib: Number(ib),
        VDC: Number(vdc),
        IDC: Number(idc),
        T1: Number(t1),
        T2: Number(t2),
        T3: Number(t3),
        VD: Number(vd),
      },
      solarContext: {
        alarmLeft: alarmLeft,
        alarmRight: 0,
        relayStatus: relayStatus,
        objectLeft: 100,
        objectRight: 100,
        humidityLeft: 45,
        humidityRight: 45,
        hasSolarSchema: false,
      }
    };
    return calcFault(record);
  }, [ia, ib, vdc, idc, t1, t2, t3, vd, alarmLeft, relayStatus]);

  // Trigger Telegram Alerts on Fault Code Change
  useEffect(() => {
    const isEnabled = localStorage.getItem('voltiq.telegram.enabled') === 'true';
    const chatId = localStorage.getItem('voltiq.telegram.chatId');
    
    if (!isEnabled || !chatId || prediction.code === 'F0') return;
    
    // Debounce Telegram alerts by 1.5 seconds to prevent slider drag spam
    const delayDebounce = setTimeout(async () => {
      const { sendTelegramFaultAlert } = await import('../../utils/telegramService');
      sendTelegramFaultAlert(chatId, {
        code: prediction.code,
        title: prediction.title,
        severity: prediction.severity,
        issue: prediction.issue,
        repair: prediction.repair,
        confidence: prediction.confidence
      });
    }, 1500);
    
    return () => clearTimeout(delayDebounce);
  }, [prediction.code, prediction.title, prediction.severity, prediction.issue, prediction.repair, prediction.confidence]);

  const handleToggleAlarm = () => {
    const nextVal = alarmLeft === 1 ? 0 : 1;
    setAlarmLeft(nextVal);
    if (nextVal === 1) {
      setSelectedPreset('F8');
    } else {
      setSelectedPreset('F0');
      setIa(1.0); setIb(-5.8); setVdc(-22.0); setIdc(-0.25); setT1(-7.2); setT2(-6.5); setT3(-5.7); setVd(-7.3);
    }
  };

  const handleToggleRelay = () => {
    const nextStatus = relayStatus === 'off' ? 'on' : 'off';
    setRelayStatus(nextStatus);
    if (nextStatus === 'off') {
      setSelectedPreset('F8');
      setIa(0.0);
      setIb(0.0);
      setVdc(0.0);
      setIdc(0.0);
      setT1(20.0);
      setT2(20.0);
      setT3(20.0);
      setVd(0.0);
    } else {
      setSelectedPreset('F0');
      setIa(1.0); setIb(-5.8); setVdc(-22.0); setIdc(-0.25); setT1(-7.2); setT2(-6.5); setT3(-5.7); setVd(-7.3);
    }
  };

  // Load Preset Handler
  const loadPreset = (code) => {
    setSelectedPreset(code);
    switch (code) {
      case 'F0': // Normal
        setIa(1.0); setIb(-5.8); setVdc(-22.0); setIdc(-0.25); setT1(-7.2); setT2(-6.5); setT3(-5.7); setVd(-7.3);
        setAlarmLeft(0); setRelayStatus('on');
        break;
      case 'F1': // Current Imbalance
        setIa(19.5); setIb(2.5); setVdc(45.0); setIdc(8.5); setT1(-7.2); setT2(-6.5); setT3(-5.7); setVd(5.0);
        setAlarmLeft(0); setRelayStatus('on');
        break;
      case 'F2': // Voltage Sag
        setIa(0.5); setIb(-5.2); setVdc(-85.0); setIdc(-1.2); setT1(-7.2); setT2(-6.5); setT3(-5.7); setVd(-48.0);
        setAlarmLeft(0); setRelayStatus('on');
        break;
      case 'F3': // Thermal Overload
        setIa(2.5); setIb(-2.1); setVdc(40.0); setIdc(4.5); setT1(78.5); setT2(68.0); setT3(67.0); setVd(10.0);
        setAlarmLeft(0); setRelayStatus('on');
        break;
      case 'F4': // Power Drop Anomaly (Adjusted temps to prevent F3 voting overlap)
        setIa(5.0); setIb(4.8); setVdc(0.2); setIdc(2.0); setT1(5.0); setT2(4.8); setT3(4.5); setVd(0.1);
        setAlarmLeft(0); setRelayStatus('on');
        break;
      case 'F5': // Thermal Sensor Mismatch (Lowered VDC to prevent F6/F7 voting overlap)
        setIa(1.5); setIb(-4.8); setVdc(24.0); setIdc(3.0); setT1(65.0); setT2(25.0); setT3(24.0); setVd(2.0);
        setAlarmLeft(0); setRelayStatus('on');
        break;
      case 'F6': // DC Overvoltage (Lowered temps to prevent F7 voting overlap)
        setIa(1.2); setIb(-3.5); setVdc(160.0); setIdc(1.5); setT1(3.0); setT2(2.5); setT3(2.0); setVd(35.0);
        setAlarmLeft(0); setRelayStatus('on');
        break;
      case 'F7': // Unknown Inverter Anomaly
        setIa(75.0); setIb(-75.0); setVdc(150.0); setIdc(12.0); setT1(85.0); setT2(80.0); setT3(35.0); setVd(25.0);
        setAlarmLeft(0); setRelayStatus('on');
        break;
      case 'F8': // External Sensor / Relay Alarm (Raised temps to trigger tree 8 F8 vote)
        setIa(1.0); setIb(-5.8); setVdc(-22.0); setIdc(-0.25); setT1(20.0); setT2(19.5); setT3(18.0); setVd(-7.3);
        setAlarmLeft(1); setRelayStatus('off');
        break;
      default:
        break;
    }
  };

  const severityColor = prediction.severity === 'critical' 
    ? 'var(--color-critical)' 
    : prediction.severity === 'warning' 
      ? 'var(--color-warning)' 
      : 'var(--color-normal)';

  return (
    <div className="cc-card animate-slide-up" style={{ marginTop: '12px', border: '1px solid rgba(245, 185, 20, 0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
          <Cpu size={22} style={{ color: 'var(--gold)' }} />
          Interactive AI Inference Laboratory (F0 - F8)
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Simulate real-time inverter faults</span>
      </div>

      {/* Preset Scenarios Responsive Grid */}
      <div className="presets-grid">
        {presets.map(p => {
          const isActive = selectedPreset === p.code;
          return (
            <button
              key={p.code}
              className={`preset-card-btn ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? p.color : 'rgba(255, 255, 255, 0.05)',
                background: isActive ? `rgba(${p.rgb}, 0.08)` : 'rgba(255, 255, 255, 0.01)',
                boxShadow: isActive ? `0 0 20px rgba(${p.rgb}, 0.2), inset 0 0 10px rgba(${p.rgb}, 0.03)` : 'none',
                borderLeft: `4px solid ${p.color}`,
                color: isActive ? p.color : undefined
              }}
              onClick={() => loadPreset(p.code)}
              title={p.desc}
            >
              <div 
                className="preset-code-badge"
                style={{
                  background: isActive ? p.color : undefined,
                  color: isActive ? '#050504' : undefined,
                  borderColor: isActive ? p.color : undefined,
                  boxShadow: isActive ? `0 0 8px ${p.color}` : undefined
                }}
              >
                {p.code}
              </div>
              <div className="preset-info">
                <span className="preset-label" style={{ color: isActive ? p.color : undefined }}>{p.label}</span>
                <span className="preset-desc">{p.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="sandbox-main-grid">
        
        {/* Left Column: Parameter Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Current Sensors */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gauge size={14} /> Current Signals (Ia, Ib, IDC)
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <label className="cyber-form-label">Current Phase A (Ia)</label>
                  <strong style={{ fontFamily: 'monospace' }}>{ia.toFixed(2)} A</strong>
                </div>
                <input 
                  type="range" min="-15" max="85" step="0.1" value={ia} 
                  onChange={(e) => setIa(Number(e.target.value))}
                  className="cyber-slider"
                />
              </div>

              <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <label className="cyber-form-label">Current Phase B (Ib)</label>
                  <strong style={{ fontFamily: 'monospace' }}>{ib.toFixed(2)} A</strong>
                </div>
                <input 
                  type="range" min="-85" max="25" step="0.1" value={ib} 
                  onChange={(e) => setIb(Number(e.target.value))}
                  className="cyber-slider"
                />
              </div>

              <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <label className="cyber-form-label">DC Current Input (IDC)</label>
                  <strong style={{ fontFamily: 'monospace' }}>{idc.toFixed(2)} A</strong>
                </div>
                <input 
                  type="range" min="-10" max="20" step="0.1" value={idc} 
                  onChange={(e) => setIdc(Number(e.target.value))}
                  className="cyber-slider"
                />
              </div>
            </div>
          </div>

          {/* Voltage Sensors */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gauge size={14} /> Voltage Levels (VDC, VD)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <label className="cyber-form-label">DC Bus Voltage (VDC)</label>
                  <strong style={{ fontFamily: 'monospace' }}>{vdc.toFixed(1)} V</strong>
                </div>
                <input 
                  type="range" min="-200" max="400" step="1" value={vdc} 
                  onChange={(e) => setVdc(Number(e.target.value))}
                  className="cyber-slider"
                />
              </div>

              <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <label className="cyber-form-label">Voltage Difference (VD)</label>
                  <strong style={{ fontFamily: 'monospace' }}>{vd.toFixed(1)} V</strong>
                </div>
                <input 
                  type="range" min="-80" max="80" step="0.5" value={vd} 
                  onChange={(e) => setVd(Number(e.target.value))}
                  className="cyber-slider"
                />
              </div>
            </div>
          </div>

          {/* Heat and Thermal Sensors */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gauge size={14} /> Temperature Readings (T1, T2, T3)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <label className="cyber-form-label">Heat Sink Temp (T1)</label>
                  <strong style={{ fontFamily: 'monospace' }}>{t1.toFixed(1)} °C</strong>
                </div>
                <input 
                  type="range" min="-30" max="120" step="0.5" value={t1} 
                  onChange={(e) => setT1(Number(e.target.value))}
                  className="cyber-slider"
                />
              </div>

              <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <label className="cyber-form-label">Internal Transformer Temp (T2)</label>
                  <strong style={{ fontFamily: 'monospace' }}>{t2.toFixed(1)} °C</strong>
                </div>
                <input 
                  type="range" min="-30" max="120" step="0.5" value={t2} 
                  onChange={(e) => setT2(Number(e.target.value))}
                  className="cyber-slider"
                />
              </div>

              <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <label className="cyber-form-label">Ambient Air Temp (T3)</label>
                  <strong style={{ fontFamily: 'monospace' }}>{t3.toFixed(1)} °C</strong>
                </div>
                <input 
                  type="range" min="-30" max="120" step="0.5" value={t3} 
                  onChange={(e) => setT3(Number(e.target.value))}
                  className="cyber-slider"
                />
              </div>
            </div>
          </div>

          {/* External Sensors (F8 Toggles) */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gauge size={14} /> F8 External Control Deck
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              {/* Card 1: Obstruction / External Sensor Alarm */}
              <div 
                className={`cyber-control-card ${alarmLeft === 1 ? 'active-warning' : ''}`}
                onClick={handleToggleAlarm}
              >
                <div className="control-card-header">
                  <span className="control-card-title">Obstruction Sensor (Alarm_L)</span>
                  <div className={`status-dot ${alarmLeft === 1 ? 'warning-pulse' : ''}`} />
                </div>
                <p className="control-card-desc">Simulate physical obstruction blocking solar irradiance path.</p>
                <div className="cyber-toggle-wrapper">
                  <span className="toggle-label">{alarmLeft === 1 ? 'SENSOR ALARM: ACTIVE' : 'SENSOR ALARM: CLEAR'}</span>
                  <div className={`cyber-switch ${alarmLeft === 1 ? 'on' : ''}`}>
                    <div className="cyber-switch-handle" />
                  </div>
                </div>
              </div>

              {/* Card 2: Inverter Safety Relay */}
              <div 
                className={`cyber-control-card ${relayStatus === 'off' ? 'active-critical' : ''}`}
                onClick={handleToggleRelay}
              >
                <div className="control-card-header">
                  <span className="control-card-title">Safety Relay (Relay_Status)</span>
                  <div className={`status-dot ${relayStatus === 'off' ? 'critical-pulse' : 'success-pulse'}`} />
                </div>
                <p className="control-card-desc">Tripping the safety relay triggers immediate electrical shutdown.</p>
                <div className="cyber-toggle-wrapper">
                  <span className="toggle-label">{relayStatus === 'off' ? 'RELAY STATUS: OFF (TRIPPED)' : 'RELAY STATUS: ON (NORMAL)'}</span>
                  <div className={`cyber-switch ${relayStatus === 'off' ? 'tripped' : ''}`}>
                    <div className="cyber-switch-handle" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: AI Inference Outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(12, 17, 14, 0.95) 0%, rgba(5, 7, 6, 0.98) 100%)',
            border: `1px solid ${severityColor}`,
            boxShadow: `0 8px 30px rgba(0, 0, 0, 0.6), 0 0 15px ${severityColor}15`,
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '280px',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '12px', right: '12px',
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(255,255,255,0.03)',
              padding: '4px 10px',
              borderRadius: '100px',
              fontSize: '10px',
              color: '#8c9f93',
              border: '1px solid rgba(255,255,255,0.05)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <Sparkles size={10} color="var(--gold)" /> Real-Time Predictor
            </div>

            <div 
              className={`ai-pulse-circle ${prediction.code !== 'F0' ? 'anomaly' : ''}`}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: `3px solid ${severityColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                color: severityColor,
                fontFamily: 'monospace',
                marginBottom: '16px',
                '--glow-color': severityColor,
                transition: 'all 0.3s ease'
              }}
            >
              {prediction.code}
            </div>

            <h3 style={{ fontSize: '18px', margin: '0 0 6px 0', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {prediction.title}
            </h3>
            
            <span style={{ 
              fontSize: '11px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              color: severityColor,
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              {prediction.severity.toUpperCase()} SEVERITY
            </span>

            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '20px' }} />

            {/* Inference Confidence and Risk */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', fontSize: '13px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#8c9f93' }}>Inference Confidence</span>
                  <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{prediction.confidence.toFixed(1)}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: `${prediction.confidence}%`, height: '100%', background: severityColor, borderRadius: '3px', boxShadow: `0 0 8px ${severityColor}` }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#8c9f93' }}>Calculated System Risk</span>
                  <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{prediction.risk}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: `${prediction.risk}%`, height: '100%', background: prediction.risk > 50 ? 'var(--color-critical)' : prediction.risk > 20 ? 'var(--color-warning)' : 'var(--color-normal)', borderRadius: '3px' }} />
                </div>
              </div>
            </div>

          </div>

          {prediction.code !== 'F0' && (
            <div style={{ background: 'rgba(255, 77, 77, 0.03)', border: '1px solid rgba(255, 77, 77, 0.1)', borderRadius: '10px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ShieldAlert size={18} color="var(--color-critical)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#ff4d4d', fontWeight: 'bold' }}>Anomalous Pattern Detected</h5>
                <p style={{ margin: 0, fontSize: '12px', color: '#8c9f93', lineHeight: '1.4' }}>{prediction.issue}</p>
              </div>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Wrench size={18} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>Recommended Repair Action</h5>
              <p style={{ margin: 0, fontSize: '12px', color: '#8c9f93', lineHeight: '1.4' }}>{prediction.repair}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
