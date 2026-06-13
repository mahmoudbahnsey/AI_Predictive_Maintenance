import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import CommandHeader from '../../components/CommandHeader';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Database,
  FileText,
  Search,
  Settings,
  Shield,
  Users,
  Zap,
  Filter,
  CheckCircle
} from 'lucide-react';
import { FAULT_DEFINITIONS, loadTelemetryAnalysis } from '../../utils/faultAnalyzer';

const pageConfig = {
  systems: {
    title: 'Systems',
    subtitle: 'Manage every connected energy site from one command view.',
    icon: Zap,
    headers: ['Site Name', 'Status', 'Devices', 'Health Score'],
    metrics: [['184', 'Active systems'], ['98.6%', 'Average uptime'], ['12', 'In maintenance']],
    rows: [
      ['California Solar Farm A', 'Online', '412 devices', '99.8%'],
      ['Nevada Solar 3', 'Warning', '289 devices', '87.4%'],
      ['Arizona HQ Array', 'Online', '1,175 devices', '98.1%'],
      ['Texas Wind + Solar', 'Online', '892 devices', '100%']
    ],
  },
  devices: {
    title: 'Devices',
    subtitle: 'Track inverter, sensor, meter and gateway status in real time.',
    icon: Database,
    headers: ['Device ID', 'Type', 'Status', 'Reading'],
    metrics: [['3,481', 'Connected devices'], ['85', 'Critical'], ['412', 'Warnings']],
    rows: [
      ['INV-2841', 'Inverter', 'Online', '42 C'],
      ['INV-1922', 'Inverter', 'Warning', '68 C'],
      ['SNS-771', 'Sensor', 'Online', '38 C'],
      ['MTR-544', 'Meter', 'Online', '31 C']
    ],
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Production, consumption, export and fleet efficiency trends.',
    icon: BarChart3,
    headers: ['Report Name', 'Status', 'Range', 'State'],
    metrics: [['142.8 MWh', 'Production today'], ['118.3 MWh', 'Consumption'], ['94%', 'Efficiency']],
    rows: [
      ['Production vs consumption', 'Ready', 'Last 24h', 'Live'],
      ['Grid export trends', 'Ready', 'Monthly', 'Healthy'],
      ['Peak demand hours', 'Ready', 'Weekly', 'Review'],
      ['Site efficiency ranking', 'Ready', 'All sites', 'Live']
    ],
  },

  alerts: {
    title: 'Alerts',
    subtitle: 'Prioritized live alerts from systems and devices.',
    icon: Bell,
    headers: ['Alert Description', 'Severity', 'Source', 'Time'],
    metrics: [['7', 'Critical'], ['23', 'Warning'], ['41', 'Acknowledged']],
    rows: [
      ['INV-2841 temperature critical', 'Critical', 'Nevada Solar 3', '2m ago'],
      ['Grid export dropped 18%', 'Warning', 'California Farm A', '14m ago'],
      ['Gateway reconnect loop', 'Warning', 'Arizona HQ', '31m ago'],
      ['Firmware mismatch', 'Minor', 'Texas Wind + Solar', '1h ago']
    ],
  },
  reports: {
    title: 'Reports',
    subtitle: 'Generate and review operational, fault and security reports.',
    icon: FileText,
    headers: ['Report Type', 'Format', 'Frequency', 'Status'],
    metrics: [['18', 'Generated'], ['6', 'Scheduled'], ['100%', 'Export success']],
    rows: [
      ['Energy Production Report', 'PDF', 'Today', 'Ready'],
      ['Fault Summary', 'CSV', 'Yesterday', 'Ready'],
      ['Device Performance', 'PDF', 'Weekly', 'Scheduled'],
      ['Security Activity', 'CSV', 'Monthly', 'Ready']
    ],
  },
  settings: {
    title: 'Settings',
    subtitle: 'Configure account, workspace preferences and notifications.',
    icon: Settings,
    headers: ['Setting Group', 'Status', 'Configuration', 'State'],
    metrics: [['Masterpiece', 'Theme'], ['Live', 'Realtime updates'], ['UTC+02', 'Timezone']],
    rows: [
      ['Account profile', 'Configured', 'User settings', 'Active'],
      ['Notifications', 'Enabled', 'Email + in-app', 'Active'],
      ['Realtime refresh', 'Enabled', '15 seconds', 'Active'],
      ['Data retention', '90 days', 'Workspace', 'Active']
    ],
  },
  users: {
    title: 'Users',
    subtitle: 'Invite operators, review roles and control team access.',
    icon: Users,
    headers: ['User Name', 'Role', 'Status', 'Last Active'],
    metrics: [['24', 'Team members'], ['5', 'Admins'], ['100%', 'Coverage']],
    rows: [
      ['VoltiQ Admin', 'Administrator', 'Active', 'Just now'],
      ['Jordan Hale', 'Manager', 'Active', '2h ago'],
      ['Sam Patel', 'Technician', 'Active', 'Yesterday'],
      ['Mona Adel', 'Viewer', 'Pending', 'Invited']
    ],
  },
  security: {
    title: 'Security Center',
    subtitle: 'Monitor access posture, sessions and admin control health.',
    icon: Shield,
    headers: ['Security Policy', 'Recommendation', 'Target', 'Status'],
    metrics: [['94', 'Security score'], ['2FA', 'Authentication'], ['4', 'Active sessions']],
    rows: [
      ['Two-factor authentication', 'Recommended', 'All admins', 'Review'],
      ['Password strength', 'Strong', 'Workspace', 'Healthy'],
      ['Active sessions', '4 sessions', 'Current user', 'Normal'],
      ['Database rules', 'Protected', 'Realtime DB', 'Healthy']
    ],
  },
  logs: {
    title: 'Logs',
    subtitle: 'Audit user, system and security events with clear operational context.',
    icon: Activity,
    headers: ['Actor', 'Action', 'Target', 'Result'],
    metrics: [['128', 'Events today'], ['4', 'Admin actions'], ['0', 'Blocked attempts']],
    rows: [
      ['VoltiQ Admin', 'Acknowledged alert', 'INV-1922', 'Success'],
      ['System', 'Device health sync', 'Fleet', 'Success'],
      ['Jordan Hale', 'Generated report', 'Monthly PDF', 'Success'],
      ['Security', 'Rules check', 'Realtime DB', 'Protected']
    ],
  },
};

function EmptyState({ title }) {
  return (
    <div className="ops-empty">
      <CheckCircle size={48} className="ops-empty-icon" />
      <h3>{title}</h3>
      <p>No operational anomalies detected. Your system is running smoothly.</p>
    </div>
  );
}

function buildConnectedConfig(pathKey, baseConfig, analysis) {
  const topDefinition = FAULT_DEFINITIONS[analysis.topFault] || FAULT_DEFINITIONS.F0;
  const faultRows = Object.entries(analysis.classCounts || {})
    .filter(([code]) => code !== 'F0')
    .reduce((sum, [, count]) => sum + count, 0);
  const criticalAlerts = (analysis.alerts || []).filter((alert) => alert.severity === 'critical').length;
  const healthScore = Math.max(0, Math.min(100, 100 - analysis.riskScore)).toFixed(1);
  const connectedNote = `Connected to ${analysis.sourceName}. Last analysis: ${analysis.analyzedAt}.`;

  if (pathKey === 'analytics') {
    return {
      ...baseConfig,
      subtitle: `Live Random Forest analytics from uploaded telemetry. ${connectedNote}`,
      metrics: [
        [analysis.validRows.toLocaleString(), 'Rows analyzed'],
        [`${analysis.averageConfidence.toFixed(1)}%`, 'Avg confidence'],
        [`${Math.round(analysis.riskScore)}/100`, 'Risk score'],
      ],
      rows: [
        ['Top detected class', analysis.topFault, analysis.schema, topDefinition.severity],
        ['Model confidence', `${analysis.averageConfidence.toFixed(1)}%`, analysis.hasLabels ? 'Labeled data' : 'Prediction only', 'Live'],
        ['Fault rows', faultRows.toLocaleString(), `${analysis.totalRows.toLocaleString()} uploaded`, faultRows ? 'Review' : 'Healthy'],
        ['Latest source', analysis.sourceName, analysis.analyzedAt, 'Synced'],
      ],
    };
  }



  if (pathKey === 'alerts') {
    const rows = (analysis.alerts?.length ? analysis.alerts : [
      { message: 'No live fault alert is required.', severity: 'normal', code: 'F0', repair: FAULT_DEFINITIONS.F0.repair },
    ]).map((alert) => [
      alert.message,
      alert.severity === 'critical' ? 'Critical' : alert.severity === 'warning' ? 'Warning' : 'Normal',
      alert.code,
      alert.severity === 'normal' ? 'Clear' : 'Notify user',
    ]);

    return {
      ...baseConfig,
      subtitle: `User alerts are generated from the uploaded telemetry result. ${connectedNote}`,
      metrics: [
        [(analysis.alerts || []).length.toLocaleString(), 'Active alerts'],
        [criticalAlerts.toLocaleString(), 'Critical'],
        [analysis.topFault, 'Leading class'],
      ],
      rows,
    };
  }

  if (pathKey === 'reports') {
    return {
      ...baseConfig,
      subtitle: `Reports summarize the current AI decision, repairs, and uploaded source file. ${connectedNote}`,
      metrics: [
        [analysis.sourceName, 'Current source'],
        [analysis.schema, 'Data schema'],
        [`${healthScore}%`, 'System health'],
      ],
      rows: [
        ['AI Fault Analysis Report', 'PDF', analysis.analyzedAt, 'Ready'],
        ['Telemetry Classification Export', 'CSV', `${analysis.validRows.toLocaleString()} rows`, 'Ready'],
        ['Repair Recommendation Sheet', 'XLSX', `${analysis.recommendations?.length || 1} actions`, 'Ready'],
        ['User Alert Dispatch Log', 'PDF', `${analysis.alerts?.length || 0} alerts`, 'Synced'],
      ],
    };
  }

  if (pathKey === 'systems') {
    return {
      ...baseConfig,
      subtitle: `Fleet state is connected to the latest model decision. ${connectedNote}`,
      metrics: [
        ['184', 'Active systems'],
        [`${healthScore}%`, 'AI health'],
        [analysis.topFault, 'Watch class'],
      ],
      rows: [
        ['VoltiQ Main Inverter Fleet', analysis.alerts?.length ? 'Warning' : 'Online', `${analysis.validRows.toLocaleString()} rows`, `${healthScore}%`],
        ['Random Forest Analyzer', 'Online', analysis.schema, `${analysis.averageConfidence.toFixed(1)}%`],
        ['User Alert Pipeline', analysis.alerts?.length ? 'Warning' : 'Healthy', `${analysis.alerts?.length || 0} alerts`, analysis.alerts?.length ? 'Review' : 'Healthy'],
        ['Repair Recommendation Engine', 'Online', `${analysis.recommendations?.length || 1} actions`, 'Ready'],
      ],
    };
  }

  if (pathKey === 'devices') {
    const features = analysis.latestFeatures || {};

    return {
      ...baseConfig,
      subtitle: `Device readings mirror the latest uploaded inverter telemetry. ${connectedNote}`,
      metrics: [
        [`${Number(features.VDC || 0).toFixed(1)}V`, 'Voltage'],
        [`${Number(features.IDC || features.Ia || 0).toFixed(1)}A`, 'Current'],
        [`${Number(features.T1 || 0).toFixed(1)}C`, 'Temperature'],
      ],
      rows: [
        ['INV-MODEL', 'Inverter', analysis.alerts?.length ? 'Warning' : 'Online', analysis.topFault],
        ['SNS-VDC', 'Voltage Sensor', 'Online', `${Number(features.VDC || 0).toFixed(1)}V`],
        ['SNS-IDC', 'Current Sensor', 'Online', `${Number(features.IDC || features.Ia || 0).toFixed(1)}A`],
        ['SNS-TEMP', 'Thermal Sensor', Number(features.T1 || 0) > 58 ? 'Warning' : 'Online', `${Number(features.T1 || 0).toFixed(1)}C`],
      ],
    };
  }

  if (pathKey === 'logs') {
    return {
      ...baseConfig,
      subtitle: `Audit trail for AI analysis, alert generation, and page synchronization. ${connectedNote}`,
      metrics: [
        [analysis.analyzedAt, 'Last analysis'],
        [analysis.topFault, 'Model result'],
        [`${analysis.alerts?.length || 0}`, 'Alerts created'],
      ],
      rows: [
        ['AI Analyzer', `Classified ${analysis.validRows.toLocaleString()} rows`, analysis.sourceName, 'Success'],
        ['Alert Engine', `${analysis.alerts?.length || 0} user alerts prepared`, analysis.topFault, 'Synced'],
        ['Repair Engine', topDefinition.repair, analysis.topFault, 'Ready'],
        ['Dashboard', 'Stored analysis for all pages', 'localStorage', 'Success'],
      ],
    };
  }

  return {
    ...baseConfig,
    subtitle: `${baseConfig.subtitle} ${connectedNote}`,
  };
}

export default function OperationsPage() {
  const location = useLocation();
  const pathKey = location.pathname.split('/').filter(Boolean).pop() || 'systems';
  const [analysis, setAnalysis] = useState(() => loadTelemetryAnalysis());
  const config = useMemo(
    () => buildConnectedConfig(pathKey, pageConfig[pathKey] || pageConfig.systems, analysis),
    [analysis, pathKey],
  );
  const Icon = config.icon;

  useEffect(() => {
    const refreshAnalysis = () => setAnalysis(loadTelemetryAnalysis());
    window.addEventListener('storage', refreshAnalysis);
    window.addEventListener('voltiq-analysis-updated', refreshAnalysis);

    return () => {
      window.removeEventListener('storage', refreshAnalysis);
      window.removeEventListener('voltiq-analysis-updated', refreshAnalysis);
    };
  }, []);

  return (
    <div className="dashboard voltiq-shell">
      <Sidebar active={pathKey} />
      <div className="dashboard-main">
        <CommandHeader activePage={pathKey} />

        <main className="ops-page">
          <div className="ops-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'var(--panel-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Icon size={24} color="var(--gold)" />
              </div>
              <div>
                <h1>{config.title}</h1>
                <p>{config.subtitle}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {config.metrics.map((metric, i) => (
              <div key={i} className="ops-stat-card">
                <div className="stat-label">{metric[1]}</div>
                <div className="stat-value">{metric[0]}</div>
              </div>
            ))}
          </div>

          <div className="ops-panel">
            <div className="ops-toolbar">
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder={`Search ${config.title.toLowerCase()}...`} 
                  style={{ width: '100%', padding: '10px 14px 10px 40px', background: 'var(--velvet-deep)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                />
              </div>
              <button className="btn btn-secondary" style={{ padding: '10px 16px' }}>
                <Filter size={16} /> Filter
              </button>
            </div>

            {config.rows.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="ops-table">
                  <thead>
                    <tr>
                      {config.headers.map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {config.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ 
                            color: cell === 'Critical' || cell === 'Unresolved' ? 'var(--error)' : 
                                   cell === 'Warning' || cell === 'Minor' || cell === 'In progress' ? 'var(--warning)' :
                                   cell === 'Online' || cell === 'Healthy' || cell === 'Success' || cell === 'Resolved' || cell === 'Ready' || cell === 'Active' || cell === 'Stable' || cell === 'Clear' ? 'var(--success)' : 
                                   'var(--text)' 
                          }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title={`No ${config.title.toLowerCase()} found`} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
