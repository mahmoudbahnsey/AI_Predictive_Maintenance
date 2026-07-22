import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase';
import Sidebar from '../../components/Sidebar';
import CommandHeader from '../../components/CommandHeader';
import HeroStatus from '../../components/dashboard/HeroStatus';
import AiPredictionCore from '../../components/dashboard/AiPredictionCore';
import LiveSensorMatrix from '../../components/dashboard/LiveSensorMatrix';
import SmartAlertStrip from '../../components/dashboard/SmartAlertStrip';
import PerformanceIntelligence from '../../components/dashboard/PerformanceIntelligence';
import FaultHistoryPreview from '../../components/dashboard/FaultHistoryPreview';
import AiInferenceSandbox from '../../components/dashboard/AiInferenceSandbox';
import { loadTelemetryAnalysis, FAULT_DEFINITIONS } from '../../utils/faultAnalyzer';
import { useSolarMonitorLive } from '../../hooks/useSolarMonitorLive';

export default function Dashboard() {
  const [analysis, setAnalysis] = useState(() => loadTelemetryAnalysis());
  const [now, setNow] = useState(new Date());
  const [activeModelVersion, setActiveModelVersion] = useState("v5.2-strong-rf-stable");
  const { sensors: liveSensors, isLive, isStale, deviceName, lastReceivedAt } = useSolarMonitorLive();

  // React to new data ingested from Data Intake page
  useEffect(() => {
    const refreshAnalysis = () => setAnalysis(loadTelemetryAnalysis());
    window.addEventListener('storage', refreshAnalysis);
    window.addEventListener('voltiq-analysis-updated', refreshAnalysis);

    return () => {
      window.removeEventListener('storage', refreshAnalysis);
      window.removeEventListener('voltiq-analysis-updated', refreshAnalysis);
    };
  }, []);

  // Fetch active model from Firebase database
  useEffect(() => {
    const modelsRef = ref(db, 'aiModels');
    const unsubscribe = onValue(modelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let list = [];
        if (Array.isArray(data)) {
          list = data.filter(Boolean);
        } else {
          list = Object.keys(data).map(key => ({
            ...data[key],
            id: key
          }));
        }
        const deployed = list.find(m => m.status === 'DEPLOYED' || m.deployment === 'LIVE');
        if (deployed) {
          setActiveModelVersion(deployed.version);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Live sensor values seeded from the latest ingested telemetry (real data you enter)
  const [sensors, setSensors] = useState({
    voltage: 220,
    current: 3.2,
    power: 700,
    temperature: 35
  });

  // Prefer live Solar Monitor telemetry from Firebase; fall back to uploaded analysis.
  useEffect(() => {
    if (isLive && liveSensors) {
      setSensors({
        voltage: liveSensors.voltage ?? 0,
        current: liveSensors.current ?? 0,
        power: liveSensors.power ?? 0,
        temperature: liveSensors.temperature ?? 0,
      });
      return;
    }

    const lf = analysis.latestFeatures || {};
    const baseVoltage = lf.VDC != null ? +(Number(lf.VDC)).toFixed(1) : 220;
    const baseCurrent = lf.IDC != null ? +(Number(lf.IDC)).toFixed(2) : 3.2;
    const baseTemp = lf.T1 != null ? +(Number(lf.T1)).toFixed(1) : 35;
    const basePower = (lf.VDC != null && lf.IDC != null)
      ? Math.round(Math.abs(Number(lf.VDC) * Number(lf.IDC)))
      : 700;

    setSensors({
      voltage: baseVoltage,
      current: baseCurrent,
      power: basePower,
      temperature: baseTemp,
    });
  }, [analysis, isLive, liveSensors]);

  // Keep clock fresh; only simulate fluctuations when no live device feed is connected.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
      if (isLive) return;
      setSensors(prev => ({
        voltage: +(prev.voltage + (Math.random() * 1.2 - 0.6)).toFixed(1),
        current: +(prev.current + (Math.random() * 0.12 - 0.06)).toFixed(2),
        power: Math.round(prev.power + (Math.random() * 6 - 3)),
        temperature: +(prev.temperature + (Math.random() * 0.35 - 0.18)).toFixed(1),
      }));
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isLive]);

  // Compute System State from the CURRENT (possibly newly ingested) analysis
  const topClass = analysis.topFault || 'F0';
  const topDef = FAULT_DEFINITIONS[topClass] || FAULT_DEFINITIONS.F0;

  let systemState = 'normal'; // 'normal', 'warning', 'critical'
  if (topClass !== 'F0') {
    systemState = topDef.severity; // 'warning' or 'critical'
  }

  const healthScore = Math.max(0, Math.min(100, 100 - (analysis.riskScore || 30)));

  // Alerts: re-derive from the latest analysis whenever it changes (data you ingested)
  // We keep a local acknowledged set so user can still dismiss individual alerts
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState(new Set());

  const baseAlerts = (analysis.alerts || []).map((a, idx) => ({
    id: `alert-${idx}-${analysis.analyzedAt || ''}`, // include timestamp so new ingest resets ids
    type: topDef.severity,
    message: `${topClass}: ${a.issue || a.message || 'Anomaly detected'}`,
  }));

  const activeAlerts = baseAlerts.filter(a => !acknowledgedAlertIds.has(a.id));

  const handleAcknowledge = (id) => {
    setAcknowledgedAlertIds(prev => new Set(prev).add(id));
  };

  // When a completely new analysis is ingested, clear previous acknowledges so fresh alerts appear
  useEffect(() => {
    // Heuristic: if analyzedAt changed or sourceName changed, reset acknowledged
    setAcknowledgedAlertIds(new Set());
  }, [analysis.analyzedAt, analysis.sourceName]);

  return (
    <div className="dashboard voltiq-shell">
      <Sidebar active="dashboard" />
      <div className="dashboard-main">
        <CommandHeader activePage="dashboard" />
        
        <SmartAlertStrip alerts={activeAlerts} onAcknowledge={handleAcknowledge} />

        <main className="telemetry-dashboard-page">
          <div className="command-center-layout">
            
            <HeroStatus 
              state={systemState} 
              healthScore={healthScore} 
              lastAnalysisTime={
                isLive && lastReceivedAt
                  ? new Date(lastReceivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
              liveFeedLabel={
                isLive
                  ? `${deviceName || 'Solar Monitor'} • ${isStale ? 'Signal delayed' : 'Live device feed'}`
                  : 'Live AI Monitoring Active'
              }
            />
            
            <AiPredictionCore 
              state={systemState}
              predictedClass={topClass}
              confidence={analysis.averageConfidence || 98.5}
              description={topDef.issue}
              recommendation={topDef.repair}
              modelVersion={activeModelVersion}
            />
            
            <LiveSensorMatrix sensors={sensors} />

            <AiInferenceSandbox />

            <div className="cc-grid-bottom">
              <PerformanceIntelligence />
              <FaultHistoryPreview />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
