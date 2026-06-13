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

export default function Dashboard() {
  const [analysis] = useState(() => loadTelemetryAnalysis());
  const [now, setNow] = useState(new Date());
  const [activeModelVersion, setActiveModelVersion] = useState("v1.0.0-stable");
  
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

  // Simulated dynamic sensor state
  const [sensors, setSensors] = useState({
    voltage: 220,
    current: 3.2,
    power: 700,
    temperature: 35
  });

  useEffect(() => {
    // Simulate live data fluctuations for the "alive" feel
    const timer = window.setInterval(() => {
      setNow(new Date());
      setSensors(prev => ({
        voltage: +(prev.voltage + (Math.random() * 2 - 1)).toFixed(1),
        current: +(prev.current + (Math.random() * 0.2 - 0.1)).toFixed(2),
        power: Math.round(prev.power + (Math.random() * 10 - 5)),
        temperature: +(prev.temperature + (Math.random() * 0.5 - 0.25)).toFixed(1),
      }));
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  // Compute System State
  const topClass = analysis.topFault || 'F0';
  const topDef = FAULT_DEFINITIONS[topClass] || FAULT_DEFINITIONS.F0;
  
  let systemState = 'normal'; // 'normal', 'warning', 'critical'
  if (topClass !== 'F0') {
    systemState = topDef.severity; // 'warning' or 'critical'
  }
  
  const healthScore = Math.max(0, Math.min(100, 100 - analysis.riskScore));
  
  // Format alerts
  const [activeAlerts, setActiveAlerts] = useState(
    analysis.alerts.map((a, idx) => ({
      id: `alert-${idx}`,
      type: topDef.severity, // warning or critical
      message: `${topClass}: ${a.issue}`,
    }))
  );

  const handleAcknowledge = (id) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

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
              lastAnalysisTime={now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
