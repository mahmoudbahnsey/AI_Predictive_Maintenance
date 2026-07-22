import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Cpu, AlertTriangle, CheckCircle, TrendingUp, BarChart2 } from 'lucide-react';
import { loadTelemetryAnalysis } from '../../utils/faultAnalyzer';

// Advanced AI synthesis data mappings
const AI_SUMMARIES = {
  "Executive Intelligence Summary": {
    "Executive": "Fleet operations yielded optimal performance, with aggregate efficiency at 97.4%. Asset-level generation metrics remain robust, with negligible degradation. AI narrative synthesis projects a 1.2% increase in capacity next quarter under normalized meteorological conditions. Strategic recommendation: continue standard preventive cycles.",
    "Operations": "Uptime metrics achieved target SLAs. Control logs indicate localized thermal alerts were mitigated within average limits (12 mins vs 15 min SLA). Primary efficiency levels remain steady at 97.4%. Operations directive: inspect cooling fans in Nevada cluster B.",
    "Technical": "Harmonic distortion indexes and inverter thermal dissipation profiles align with baseline values. System telemetry coverage maintained at 99.8%. Recommended action: calibrate grid-tie telemetry sensors on Nevada Solar 3.",
    "Compliance": "VoltIQ compliance metrics confirm zero environmental, safety, or grid interface infractions. Data integrity validations returned a 99.8% confidence coefficient. Financial-to-capacity output logs verified against regulatory guidelines."
  },
  "Device Health Report": {
    "Executive": "Device degradation trends remain under control, averaging 0.4% annually. A small subset of telemetry interfaces shows intermittent polling loss, which does not affect primary energy yields. ROI on sensor replacements is highly favorable.",
    "Operations": "Device availability index is currently at 98.6%. Thermal stress markers detected on Arizona Combiner Array B. Maintenance schedule updated to include module cleaning and connector retorquing next Tuesday.",
    "Technical": "Voltage drift anomalies detected on Battery Storage Unit B3 (voltage variance +1.2V). Polling frequency logs show micro-dropouts on telemetry bus 4. Recommended firmware patch 4.2.1 deployment.",
    "Compliance": "Calibration schedules for all electrical sensors are within certification windows. All device diagnostics comply with IEEE 1547 interconnection standards."
  },
  "Fault & Incident Report": {
    "Executive": "Unplanned downtime represents less than 0.15% of capacity. MTBF (Mean Time Between Faults) has increased by 18% following the AI predictive maintenance patch. Total financial exposure from faults is negligible.",
    "Operations": "Incident response logs show 18 active faults, of which 14 are minor communications dropouts. Nevada Inverter N1 logged a high-temperature threshold breach, which cleared automatically. Average truck roll dispatch avoided in 8 cases via remote resets.",
    "Technical": "Detailed diagnostic logs show repetitive F3 thermal warnings on Phase C isolator switches. Transition resistance readings suggest minor galvanic oxidation on terminal pins. Re-torque and contact cleaning recommended.",
    "Compliance": "All critical safety fault flags were logged and routed to safety controllers within <2.0 seconds. Compliance logs are archived in the encrypted immutable ledger."
  },
  "Alerts & SLA Report": {
    "Executive": "SLA compliance on critical operations is at 99.2%, exceeding our contract targets of 98.0%. Team response times have decreased under the new AI alerts routing system, resulting in minimal power leakage.",
    "Operations": "Total alert volume was 245 over the period, with 12 critical, 88 warning, and 145 informational alerts. Peak alert velocity occurred during storm conditions on Tuesday, handled by the automated escalation path within 45 seconds.",
    "Technical": "Alert routing latency is stable at 85ms. Critical trap notifications from grid interfaces are verified in the secondary queue. No packet loss reported across alert gateway.",
    "Compliance": "Audit trail confirms all notifications and critical alert escalations were logged with cryptographic timestamps, meeting all audit requirements."
  },
  "AI Training Performance Report": {
    "Executive": "AI anomaly detection models have achieved a 96.8% precision score. The ROI on training is realized by avoiding 3 catastrophic inverter failures, showing direct capital preservation.",
    "Operations": "Model precision stands at 96.8% and recall at 94.2%. False positive rate has decreased to 0.4% after introducing the updated filter datasets. Telemetry training pipeline has processed 42GB of sensor logs.",
    "Technical": "Epoch loss curve converged at 0.042. Model weights updated on edge nodes. Inference latency stands at 24ms per system payload. GPU resource utilization averaged 72% during training.",
    "Compliance": "AI training data pipelines conform to strict privacy guidelines, verifying that no user-identifiable data was loaded into training sets."
  },
  "Security & Audit Report": {
    "Executive": "All security protocols are operational. Internal security scores remain at AA+, with zero unauthorized access attempts. Compliance certifications are fully updated.",
    "Operations": "Audit log confirms 1,420 user actions recorded. Access controls updated for 3 new technicians. Suspended user accounts successfully purged from real-time databases.",
    "Technical": "TLS 1.3 protocol enforced across all telemetry endpoints. Security patch 2026-6 applied. Intrusion detection system logged zero anomalies. API key rotation completed successfully.",
    "Compliance": "SOC2 Type II compliance verified for all dashboard services. Audit exports generated for external reviewers, showing 100% trace coverage."
  },
  "Fleet Operations Summary": {
    "Executive": "Fleet capacity utilization remains in the upper quartile. System integration of the new Arizona array is 100% complete, generating immediate energy surplus.",
    "Operations": "Total energy output reached 1.42 GWh. Operational efficiency is at 98.4%. Field agent schedules optimized by AI, saving 14% on transit fuel.",
    "Technical": "Active power curves match optimal models. Reactive power offset values are within acceptable bounds (+/- 0.02 VAR). Power quality indices are clean.",
    "Compliance": "Grid connection agreements for all systems are verified. Power output compliance matches regional utility dispatch requirements."
  }
};

const KPI_DATA = {
  "Executive Intelligence Summary": [
    { label: "Energy Yield", val: "1.42 GWh", sub: "+4.2% MoM", trend: "up" },
    { label: "Fleet Health", val: "97.4%", sub: "Nominal", trend: "up" },
    { label: "Avg Efficiency", val: "94.2%", sub: "Optimal", trend: "up" },
    { label: "Uptime", val: "99.98%", sub: "Target Met", trend: "up" }
  ],
  "Device Health Report": [
    { label: "Active Devices", val: "1,248 Units", sub: "100% Tracked", trend: "up" },
    { label: "Availability", val: "98.62%", sub: "+0.15% gain", trend: "up" },
    { label: "Fault Rate", val: "0.24%", sub: "Low Risk", trend: "down" },
    { label: "AI Confidence", val: "98.4%", sub: "High Precision", trend: "up" }
  ],
  "Fault & Incident Report": [
    { label: "Total Incidents", val: "18 logged", sub: "-12% drop", trend: "down" },
    { label: "Avg MTTR", val: "14.2 Mins", sub: "Excellent", trend: "down" },
    { label: "SLA Adherence", val: "99.1%", sub: "Target 98%", trend: "up" },
    { label: "Critical Faults", val: "2 active", sub: "Investigating", trend: "down" }
  ],
  "Alerts & SLA Report": [
    { label: "Active Alerts", val: "4 Alerts", sub: "1 Critical", trend: "down" },
    { label: "Response SLA", val: "11.8 Mins", sub: "Goal <15m", trend: "down" },
    { label: "SLA Compliance", val: "99.42%", sub: "Optimal", trend: "up" },
    { label: "Dispatch Count", val: "12 rollouts", sub: "Scheduled", trend: "up" }
  ],
  "AI Training Performance Report": [
    { label: "Model Loss", val: "0.042 Loss", sub: "Converged", trend: "down" },
    { label: "Precision Score", val: "96.8%", sub: "F1 Optimised", trend: "up" },
    { label: "Telemetry Cover", val: "99.92%", sub: "42GB processed", trend: "up" },
    { label: "Training Epochs", val: "1,500 runs", sub: "Complete", trend: "up" }
  ],
  "Security & Audit Report": [
    { label: "Audited Events", val: "14,285", sub: "100% Integrity", trend: "up" },
    { label: "Security Alerts", val: "0 detected", sub: "Zero Incidents", trend: "down" },
    { label: "Admin Changes", val: "14 logs", sub: "Authorised", trend: "up" },
    { label: "Compliance Score", val: "AA+ Rated", sub: "SOC2 Audit", trend: "up" }
  ],
  "Fleet Operations Summary": [
    { label: "Megawatt Cap", val: "14.8 MW", sub: "Full Load", trend: "up" },
    { label: "Operating Cost", val: "$12.4k", sub: "-14% saved", trend: "down" },
    { label: "Weather Yield", val: "98.2%", sub: "High Irradiance", trend: "up" },
    { label: "Team Dispatch", val: "3 Crews", sub: "Active", trend: "up" }
  ]
};

const FINDINGS_DATA = {
  "Executive Intelligence Summary": [
    { text: "Nevada Solar 3 achieved maximum theoretical output during peak solar irradiance.", severity: "success" },
    { text: "Thermal sensors on California Inverter cluster B registered a warning state.", severity: "warning" },
    { text: "Strategic maintenance scheduled for Arizona combiners is expected to boost efficiency by 0.8%.", severity: "success" }
  ],
  "Device Health Report": [
    { text: "Firmware version 4.2.1 successfully deployed across 95% of active string sensors.", severity: "success" },
    { text: "Battery cell resistance variance on Cabinet B3 exceeded standard bounds (+1.2V).", severity: "warning" },
    { text: "Uptime on tracker motor gearboxes maintained 100% nominal output.", severity: "success" }
  ],
  "Fault & Incident Report": [
    { text: "F3 grid overvoltage event triggered and cleared autonomously within 800ms.", severity: "success" },
    { text: "Communication dropouts on remote meter RTU-08 occurred due to cellular signal drop.", severity: "warning" },
    { text: "SLA compliance threshold was exceeded on California Solar Farm B dispatch.", severity: "success" }
  ],
  "Alerts & SLA Report": [
    { text: "Critical alerts volume decreased by 25% following AI-based noise filtration release.", severity: "success" },
    { text: "Dispatch latency on off-hours alert escalation exceeded typical boundaries by 2.4 minutes.", severity: "warning" },
    { text: "Client notification logs confirm 100% delivery of daily reports.", severity: "success" }
  ],
  "AI Training Performance Report": [
    { text: "Validation accuracy converged without overfitting on historical battery telemetry data.", severity: "success" },
    { text: "Minor sensor jitter on California Solar Farm A required pre-filtering before ingestion.", severity: "warning" },
    { text: "Loss curve achieved terminal stability at 1,500 training epochs.", severity: "success" }
  ],
  "Security & Audit Report": [
    { text: "SOC2 internal audit validated access patterns; all logs accounted for.", severity: "success" },
    { text: "3 expired developer keys rotated successfully ahead of scheduled expiration date.", severity: "success" },
    { text: "Unusual login attempt from unrecognized IP blocked by geo-fencing policies.", severity: "warning" }
  ],
  "Fleet Operations Summary": [
    { text: "Fleet output grew by 45kW following tracking optimization calibration.", severity: "success" },
    { text: "Localized cloud cover in Pacific Northwest decreased aggregate yield by 8%.", severity: "warning" },
    { text: "Preventive module washing resulted in immediate thermal efficiency improvement.", severity: "success" }
  ]
};

export default function BoardroomReportPreview({ config, rebuildToken }) {
  const [loadingState, setLoadingState] = useState('ready');
  const [analysis, setAnalysis] = useState(() => loadTelemetryAnalysis());

  useEffect(() => {
    const refreshAnalysis = () => setAnalysis(loadTelemetryAnalysis());
    window.addEventListener('storage', refreshAnalysis);
    window.addEventListener('voltiq-analysis-updated', refreshAnalysis);
    return () => {
      window.removeEventListener('storage', refreshAnalysis);
      window.removeEventListener('voltiq-analysis-updated', refreshAnalysis);
    };
  }, []);

  // Trigger simulated loading flow when config changes
  useEffect(() => {
    setLoadingState('preparing');

    const prepTimer = setTimeout(() => {
      setLoadingState('synthesis');
    }, 400);

    const renderTimer = setTimeout(() => {
      setLoadingState('rendering');
    }, 800);

    const readyTimer = setTimeout(() => {
      setLoadingState('ready');
    }, 1200);

    return () => {
      clearTimeout(prepTimer);
      clearTimeout(renderTimer);
      clearTimeout(readyTimer);
    };
  }, [config.type, config.scope, config.dateRange, config.tone, config.includeAi, rebuildToken]);

  // Selected template-specific datasets
  const activeSummary = AI_SUMMARIES[config.type]?.[config.tone] || AI_SUMMARIES["Executive Intelligence Summary"]["Executive"];
  let activeKpis = KPI_DATA[config.type] || KPI_DATA["Executive Intelligence Summary"];
  let activeFindings = FINDINGS_DATA[config.type] || FINDINGS_DATA["Executive Intelligence Summary"];

  // Inject real data if available
  if (analysis && analysis.validRows > 0) {
    activeKpis = [
      { label: "Valid Rows", val: analysis.validRows.toLocaleString(), sub: "Analyzed", trend: "up" },
      { label: "Healthy Rate", val: (analysis.healthyRate ?? 50) + "%", sub: "Nominal", trend: (analysis.healthyRate ?? 50) > 50 ? "up" : "down" },
      { label: "Top Fault", val: analysis.topFault, sub: "Detected", trend: "down" },
      { label: "Confidence", val: analysis.averageConfidence.toFixed(1) + "%", sub: "Model", trend: "up" }
    ];

    if (analysis.alerts && analysis.alerts.length > 0) {
      activeFindings = analysis.alerts.map(a => ({
        text: a.message + ' (Recommendation: ' + a.repair + ')',
        severity: a.severity === 'critical' ? 'warning' : 'success'
      }));
    } else {
      activeFindings = [
        { text: "No significant anomalies detected in the current telemetry window.", severity: "success" }
      ];
    }
  }

  // Render responsive customized SVG trend charts based on template type
  const renderTrendChart = () => {
    switch (config.type) {
      case "Fault & Incident Report":
        return (
          <div style={{ padding: '16px', background: '#fafafa', borderRadius: '6px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#666', fontWeight: 'bold' }}>INCIDENT COUNT BY CATEGORY</span>
              <span style={{ fontSize: '11px', color: '#d4af37' }}>Total: 18 Incidents</span>
            </div>
            <svg viewBox="0 0 500 120" style={{ width: '100%', height: '120px' }}>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#eee" strokeDasharray="3,3" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#eee" strokeDasharray="3,3" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#ccc" />
              
              {/* Bars */}
              <rect x="70" y="40" width="30" height="60" fill="#ec5e5e" rx="2" />
              <rect x="170" y="70" width="30" height="30" fill="#d4af37" rx="2" />
              <rect x="270" y="30" width="30" height="70" fill="#d4af37" rx="2" />
              <rect x="370" y="85" width="30" height="15" fill="#a8b5ae" rx="2" />
              
              {/* Labels */}
              <text x="85" y="115" fontSize="10" textAnchor="middle" fill="#555">Thermal</text>
              <text x="185" y="115" fontSize="10" textAnchor="middle" fill="#555">Inverter</text>
              <text x="285" y="115" fontSize="10" textAnchor="middle" fill="#555">Grid Tie</text>
              <text x="385" y="115" fontSize="10" textAnchor="middle" fill="#555">Sensor</text>
            </svg>
          </div>
        );
      case "AI Training Performance Report":
        return (
          <div style={{ padding: '16px', background: '#fafafa', borderRadius: '6px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#666', fontWeight: 'bold' }}>EPOCH LOSS CURVE</span>
              <span style={{ fontSize: '11px', color: '#15803d' }}>Final Loss: 0.042</span>
            </div>
            <svg viewBox="0 0 500 120" style={{ width: '100%', height: '120px' }}>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#eee" strokeDasharray="3,3" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#eee" strokeDasharray="3,3" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#ccc" />
              
              {/* Loss Line Curve */}
              <path 
                d="M 40 25 Q 120 100, 240 102 T 480 105" 
                fill="none" 
                stroke="#d4af37" 
                strokeWidth="2.5" 
              />
              <path 
                d="M 40 25 Q 120 100, 240 102 T 480 105 L 480 100 L 40 100 Z" 
                fill="url(#goldGradient)" 
                opacity="0.08" 
              />
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );
      default:
        return (
          <div style={{ padding: '16px', background: '#fafafa', borderRadius: '6px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#666', fontWeight: 'bold' }}>OPERATIONAL PERFORMANCE TREND</span>
              <span style={{ fontSize: '11px', color: '#15803d' }}>Uptime Peak: 99.98%</span>
            </div>
            <svg viewBox="0 0 500 120" style={{ width: '100%', height: '120px' }}>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#eee" strokeDasharray="3,3" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#eee" strokeDasharray="3,3" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#ccc" />
              
              {/* Performance Trend Area Line */}
              <path 
                d="M 40 80 L 100 75 L 160 85 L 220 50 L 280 62 L 340 45 L 400 38 L 480 22" 
                fill="none" 
                stroke="#d4af37" 
                strokeWidth="2.5" 
              />
              <path 
                d="M 40 80 L 100 75 L 160 85 L 220 50 L 280 62 L 340 45 L 400 38 L 480 22 L 480 100 L 40 100 Z" 
                fill="url(#performanceGradient)" 
                opacity="0.08" 
              />
              <defs>
                <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="document-preview-container">
      {/* Dynamic simulated generation state overlay */}
      <AnimatePresence mode="wait">
        {loadingState !== 'ready' && (
          <motion.div 
            className="generation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="generator-pulse-ring" />
            <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}>
              {loadingState === 'preparing' && "Preparing Data Matrix..."}
              {loadingState === 'synthesis' && "Building AI Narrative Summary..."}
              {loadingState === 'rendering' && "Rendering Document Canvas..."}
            </div>
            <div style={{ color: '#a8b5ae', fontSize: '11px', marginTop: '6px' }}>
              Optimizing for Boardroom Quality
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="document-workspace">
        {/* Under-page sheets layers for authentic boardroom ledger aesthetic */}
        <div className="document-stack-bg-2" />
        <div className="document-stack-bg" />
        
        {/* Main white document paper canvas */}
        <div className="document-page">
          
          {/* Cover Header / Logo */}
          <div className="document-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h1 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '900', color: '#000', letterSpacing: '1px' }}>
                  VOLT<span style={{ color: '#d4af37' }}>IQ</span>
                </h1>
                <span style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '2.5px', fontWeight: 'bold' }}>
                  Enterprise Intelligence Suite
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '11px', color: '#1a1a1a', fontWeight: '700' }}>
                  {config.dateRange}
                </span>
                <span style={{ display: 'block', fontSize: '9px', color: '#777', marginTop: '2px' }}>
                  Generated: {new Date().toISOString().split('T')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Title and Metadata */}
          <div>
            <span style={{ 
              fontSize: '10px', 
              color: '#d4af37', 
              textTransform: 'uppercase', 
              fontWeight: 'bold', 
              letterSpacing: '1px', 
              background: 'rgba(212,175,55,0.08)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              CONFIDENTIAL // BOARDROOM BRIEF
            </span>
            <h2 style={{ fontSize: '26px', color: '#111', marginTop: '16px', marginBottom: '6px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              {config.type}
            </h2>
            <span style={{ display: 'block', fontSize: '12px', color: '#666', fontWeight: '500' }}>
              Target Fleet Scope: <strong style={{ color: '#111' }}>{config.scope}</strong> | Audience: <strong style={{ color: '#111' }}>{config.tone} Mode</strong>
            </span>
          </div>

          {/* Section: Executive Summary (AI Narrative) */}
          {config.includeAi && (
            <div style={{ 
              background: '#fcfbf7', 
              padding: '20px 24px', 
              borderLeft: '4px solid #d4af37', 
              marginTop: '28px',
              borderRadius: '0 6px 6px 0',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Cpu size={14} color="#d4af37" />
                <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#d4af37', margin: 0, letterSpacing: '1.5px', fontWeight: 'bold' }}>
                  AI Synthesized Narrative Summary
                </h3>
              </div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#333', margin: 0, fontStyle: 'italic' }}>
                "{activeSummary}"
              </p>
            </div>
          )}

          {/* Section: KPI Snapshot */}
          {config.includeSections.kpi && (
            <div>
              <div className="doc-section-title">Key Performance Indicators</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {activeKpis.map((kpi, idx) => (
                  <div key={idx} className="doc-kpi-card">
                    <span style={{ display: 'block', fontSize: '9px', color: '#777', textTransform: 'uppercase', fontWeight: '600' }}>
                      {kpi.label}
                    </span>
                    <strong style={{ display: 'block', fontSize: '16px', color: '#111', margin: '4px 0', fontFamily: 'monospace' }}>
                      {kpi.val}
                    </strong>
                    <span style={{ 
                      fontSize: '9px', 
                      color: kpi.trend === 'up' ? '#15803d' : '#ec5e5e',
                      fontWeight: '700'
                    }}>
                      {kpi.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Key Findings */}
          {config.includeSections.findings && (
            <div>
              <div className="doc-section-title">Critical Findings & Highlights</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeFindings.map((finding, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'start', 
                    gap: '12px', 
                    background: '#fafafa', 
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: '1px solid #eee'
                  }}>
                    {finding.severity === 'success' ? (
                      <CheckCircle size={15} color="#15803d" style={{ marginTop: '2px' }} />
                    ) : (
                      <AlertTriangle size={15} color="#d4af37" style={{ marginTop: '2px' }} />
                    )}
                    <span style={{ fontSize: '12.5px', color: '#333', lineHeight: 1.5 }}>
                      {finding.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Trend Analysis Charts */}
          {config.includeSections.trends && (
            <div>
              <div className="doc-section-title">Trend Performance Analysis</div>
              {renderTrendChart()}
            </div>
          )}

          {/* Section: Incident & Fault Summary */}
          {config.includeSections.faults && (
            <div>
              <div className="doc-section-title">Telemetry Incident Ledger</div>
              <table className="doc-grid-table">
                <thead>
                  <tr>
                    <th>Alert Class</th>
                    <th>Frequency</th>
                    <th>Avg Mitigate Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>F3 Thermal Overload</td>
                    <td>8 instances</td>
                    <td>12.4 Mins</td>
                    <td><span className="doc-badge success">RESOLVED</span></td>
                  </tr>
                  <tr>
                    <td>F1 Telemetry Offline</td>
                    <td>4 instances</td>
                    <td>4.2 Mins</td>
                    <td><span className="doc-badge success">RESOLVED</span></td>
                  </tr>
                  <tr>
                    <td>Inverter Voltage Sag</td>
                    <td>3 instances</td>
                    <td>18.5 Mins</td>
                    <td><span className="doc-badge warning">INVESTIGATING</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Section: Device Intelligence */}
          {config.includeSections.devices && (
            <div>
              <div className="doc-section-title">Device Health Intelligence</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ border: '1px solid #eee', padding: '14px', borderRadius: '6px' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Strongest Assets (100% Nominal)
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#333', lineHeight: '1.8' }}>
                    <li>Nevada Battery Storage Cabinet A</li>
                    <li>HQ Solar Substation Grid-tie</li>
                    <li>Inverter Cluster C-4</li>
                  </ul>
                </div>
                <div style={{ border: '1px solid #eee', padding: '14px', borderRadius: '6px' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Maintenance Target Candidates
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#333', lineHeight: '1.8' }}>
                    <li style={{ color: '#ec5e5e' }}>Combiner Array Arizona B3 (Anomalies)</li>
                    <li style={{ color: '#d4af37' }}>Tracker Gearbox Nevada Unit 04</li>
                    <li>Telemetry Grid interface RTU-02</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section: Recommendations & Action Plan */}
          {config.includeSections.recommendations && (
            <div>
              <div className="doc-section-title">Executive Action Plan</div>
              <table className="doc-grid-table">
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Action Recommended</th>
                    <th>Target Area</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="doc-badge critical">URGENT</span></td>
                    <td>Replace thermal sensor on combiner array B3</td>
                    <td>Arizona Array B</td>
                  </tr>
                  <tr>
                    <td><span className="doc-badge warning">WARNING</span></td>
                    <td>Schedule sensor calibration and cleaning</td>
                    <td>Nevada Solar 3</td>
                  </tr>
                  <tr>
                    <td><span className="doc-badge success">NORMAL</span></td>
                    <td>Execute standard weekly data compression audit</td>
                    <td>Global Fleet Control</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Footer & Compliance */}
          {config.includeSections.footer && (
            <div style={{ 
              marginTop: '48px', 
              borderTop: '1px solid #eee', 
              paddingTop: '20px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '10px', 
              color: '#888',
              alignItems: 'center'
            }}>
              <div>
                <span>Generated via VoltIQ Command Center v4.2 // Security Level AA</span>
              </div>
              <div>
                <span>Page 1 of 1 // Data Coverage: 99.8%</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
