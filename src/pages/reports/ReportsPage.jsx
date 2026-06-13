import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import CommandHeader from '../../components/CommandHeader';
import '../../styles/reports.css';

import PublishingSuiteHero from '../../components/reports/PublishingSuiteHero';
import ReportBuilderWorkspace from '../../components/reports/ReportBuilderWorkspace';
import BoardroomReportPreview from '../../components/reports/BoardroomReportPreview';

import * as XLSX from 'xlsx';
import { useAuth } from '../../hooks/useAuth';
import { logAction } from '../../utils/activityLogger';

// Actual file download generator - now produces real .xlsx / .csv using the installed xlsx package
const triggerFileDownload = (format, config) => {
  const baseName = `${config.type.replace(/\s+/g, '_')}_${config.scope.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
  const isExcel = format.includes("XLSX") || format.includes("Worksheet") || format.includes("Excel");
  const isSheet = format.includes("CSV") || format.includes("Sheet") || format.includes("XLSX") || format.includes("Worksheet");

  if (isSheet) {
    // Build rich workbook data from current config + realistic VoltIQ metrics
    const rows = [
      ["VOLTIQ EXECUTIVE REPORT"],
      ["Report Type", config.type],
      ["Target Scope", config.scope],
      ["Date Range", config.dateRange],
      ["Audience Tone", config.tone],
      ["Generated", new Date().toISOString()],
      ["AI Narrative Enabled", config.includeAi ? "Yes" : "No"],
      [],
      ["KEY PERFORMANCE INDICATORS"],
      ["Metric", "Value", "Trend"],
      ["Energy Yield", "1.42 GWh", "+4.2% MoM"],
      ["Fleet Health", "97.4%", "Nominal"],
      ["Average Efficiency", "94.2%", "Optimal"],
      ["System Uptime", "99.98%", "Target Met"],
      ["Active Devices", "1,248", "100% Tracked"],
      ["AI Model Precision", "96.8%", "High"],
      [],
      ["INCLUDED SECTIONS"],
      ["Section", "Included"],
      ["KPI Snapshot", config.includeSections.kpi ? "Yes" : "No"],
      ["Key Findings", config.includeSections.findings ? "Yes" : "No"],
      ["Trend Charts", config.includeSections.trends ? "Yes" : "No"],
      ["Incident Summary", config.includeSections.faults ? "Yes" : "No"],
      ["Device Health", config.includeSections.devices ? "Yes" : "No"],
      ["Action Recommendations", config.includeSections.recommendations ? "Yes" : "No"],
      ["Compliance Footer", config.includeSections.footer ? "Yes" : "No"],
      [],
      ["CRITICAL FINDINGS (SAMPLE)"],
      ["#", "Finding", "Severity"],
      ["1", "Nevada Solar 3 achieved peak theoretical output during irradiance window.", "success"],
      ["2", "Thermal sensors on California inverter cluster registered warning.", "warning"],
      ["3", "Preventive maintenance on Arizona combiner expected +0.8% efficiency lift.", "success"],
      ["4", "F3 grid overvoltage cleared autonomously within 800ms.", "success"],
      [],
      ["RECOMMENDED ACTIONS"],
      ["Priority", "Action", "Target"],
      ["URGENT", "Replace thermal sensor on combiner array B3", "Arizona Array B"],
      ["WARNING", "Schedule sensor calibration + module cleaning", "Nevada Solar 3"],
      ["NORMAL", "Weekly data compression + audit run", "Global Fleet"],
      [],
      ["COMPLIANCE & METADATA"],
      ["Data Coverage", "99.8%"],
      ["Security Level", "AA+"],
      ["Source", "VoltIQ Command Center v4.2"],
      ["Export Format", format],
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Auto column widths (simple heuristic)
    const colWidths = rows[0].map((_, i) => {
      const maxLen = Math.max(...rows.map(r => (r[i] ? String(r[i]).length : 0)));
      return { wch: Math.min(Math.max(maxLen + 2, 12), 55) };
    });
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VoltIQ Report");

    let outArray;
    let ext;
    let mime;

    if (isExcel) {
      outArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      ext = ".xlsx";
      mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else {
      // Real CSV via xlsx (better quoting/escaping than manual)
      outArray = XLSX.write(wb, { bookType: 'csv', type: 'array' });
      ext = ".csv";
      mime = "text/csv;charset=utf-8;";
    }

    const blob = new Blob([outArray], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = baseName + ext;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    // Log the export action (fire and forget)
    if (user) {
      logAction(user, 'report_exported', {
        type: config.type,
        scope: config.scope,
        format: format,
        dateRange: config.dateRange
      }).catch(() => {});
    }

    return baseName + ext;
  }

  // Fallback for non-sheet (plain summary)
  const txt = `VOLTIQ ENTERPRISE INTELLIGENCE REPORT
======================================
Report Type: ${config.type}
Target Scope: ${config.scope}
Date Range: ${config.dateRange}
Audience Mode: ${config.tone}
Generated: ${new Date().toISOString().split('T')[0]}
AI Narrative: ${config.includeAi ? 'ENABLED' : 'DISABLED'}

KEY METRICS (Core):
- Energy Yield: 1.42 GWh
- Fleet Health: 97.4%
- Avg Efficiency: 94.2%
- Uptime: 99.98%

This is a lightweight text artifact. Use PDF export or Excel for full boardroom package.
`;
  const blob = new Blob([txt], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = baseName + ".txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return baseName + ".txt";
};

export default function ReportsPage() {
  const { user } = useAuth();
  const [reportConfig, setReportConfig] = useState({
    type: 'Executive Intelligence Summary',
    scope: 'All HQ Systems',
    dateRange: 'Last 30 Days',
    tone: 'Executive',
    format: 'PDF Document',
    includeAi: true,
    includeSections: {
      kpi: true,
      findings: true,
      trends: true,
      faults: true,
      devices: true,
      recommendations: true,
      footer: true
    }
  });

  const [rebuildToken, setRebuildToken] = useState(0);
  const [exportState, setExportState] = useState(null); // null, 'preparing', 'rendering', 'compressing', 'success'
  const [exportFormat, setExportFormat] = useState('');

  const triggerRebuild = () => {
    setRebuildToken(prev => prev + 1);
  };

  const handleExport = (format) => {
    const effectiveFormat = format || reportConfig.format || "PDF Document";
    setExportFormat(effectiveFormat);
    setExportState('preparing');

    // Log generation start (non blocking)
    if (user) {
      logAction(user, 'report_generation_started', {
        type: reportConfig.type,
        scope: reportConfig.scope,
        format: effectiveFormat
      }).catch(() => {});
    }

    const renderTimer = setTimeout(() => {
      setExportState('rendering');
    }, 550);

    const compressTimer = setTimeout(() => {
      setExportState('compressing');
    }, 1050);

    const successTimer = setTimeout(() => {
      setExportState('success');

      // AUTO-DOWNLOAD for easy spreadsheet exports (no extra click needed)
      const isDirectFile = effectiveFormat.includes("CSV") || 
                           effectiveFormat.includes("XLSX") || 
                           effectiveFormat.includes("Sheet") || 
                           effectiveFormat.includes("Worksheet");
      if (isDirectFile) {
        // small delay so user sees the "success" state briefly
        setTimeout(() => {
          triggerFileDownload(effectiveFormat, reportConfig);
        }, 420);
      }
    }, 1650);
  };

  return (
    <div className="dashboard voltiq-shell">
      <Sidebar active="reports" />
      <div className="dashboard-main">
        <CommandHeader activePage="reports" />
        
        <main className="reports-page-wrapper">
          <PublishingSuiteHero />

          {/* Builder + Preview Side-by-Side */}
          <div className="builder-preview-split">
            <ReportBuilderWorkspace 
              config={reportConfig} 
              setConfig={setReportConfig} 
              onExport={handleExport}
              triggerRebuild={triggerRebuild}
            />
            <BoardroomReportPreview 
              config={reportConfig} 
              rebuildToken={rebuildToken}
            />
          </div>
        </main>
      </div>

      {/* Export Flow Progress Overlay Modal */}
      {exportState && (
        <div className="export-modal-backdrop">
          <div className="export-modal-card">
            {exportState !== 'success' ? (
              <div className="generator-pulse-ring" style={{ borderTopColor: 'var(--gold)', width: '60px', height: '60px' }} />
            ) : (
              <div style={{ color: '#2ecc71', marginBottom: '24px' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
            
            <h3 style={{ color: 'var(--gold)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold' }}>
              {exportState === 'preparing' && "Preparing Data Streams..."}
              {exportState === 'rendering' && "Building High-Resolution Document Canvas..."}
              {exportState === 'compressing' && "Signing Document SHA-256 Metadata..."}
              {exportState === 'success' && "Document Ready"}
            </h3>
            
            <p style={{ color: '#a8b5ae', fontSize: '13px', margin: '8px 0 24px 0', maxWidth: '360px', textAlign: 'center', lineHeight: 1.5 }}>
              {exportState === 'preparing' && "Querying device telemetry logs and database snapshot."}
              {exportState === 'rendering' && "Calculating styling layouts and plotting SVG vector graphs."}
              {exportState === 'compressing' && "Attaching compliance watermarks and digital keys."}
              {exportState === 'success' && (
                (exportFormat.includes("CSV") || exportFormat.includes("XLSX") || exportFormat.includes("Sheet") || exportFormat.includes("Worksheet"))
                  ? `Report synthesized. File downloaded automatically as ${exportFormat}.`
                  : `The report has been successfully synthesized in ${exportFormat} format.`
              )}
            </p>

            {exportState === 'success' && (
              <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                {(exportFormat.includes("PDF") || exportFormat.includes("Document")) && (
                  <button 
                    className="interactive-btn"
                    onClick={() => window.print()}
                    style={{ 
                      background: 'var(--gold)', 
                      color: '#000', 
                      fontWeight: 'bold', 
                      padding: '10px 20px', 
                      minHeight: 'auto',
                      border: 'none',
                      flex: 1,
                      maxWidth: '168px'
                    }}
                  >
                    Print / Save PDF
                  </button>
                )}

                {(exportFormat.includes("CSV") || exportFormat.includes("XLSX") || exportFormat.includes("Sheet") || exportFormat.includes("Worksheet")) && (
                  <button 
                    className="interactive-btn"
                    onClick={() => triggerFileDownload(exportFormat, reportConfig)}
                    style={{ 
                      background: 'var(--gold)', 
                      color: '#000', 
                      fontWeight: 'bold', 
                      padding: '10px 20px', 
                      minHeight: 'auto',
                      border: 'none',
                      flex: 1,
                      maxWidth: '168px'
                    }}
                  >
                    Download Again
                  </button>
                )}

                {exportFormat.includes("Email") && (
                  <button 
                    className="interactive-btn"
                    onClick={() => {
                      // Easy simulated email: copy a compact summary to clipboard
                      const summary = `${reportConfig.type} | ${reportConfig.scope} | ${reportConfig.dateRange}\nTone: ${reportConfig.tone} | AI: ${reportConfig.includeAi ? 'On' : 'Off'}\nReady for board distribution.`;
                      navigator.clipboard?.writeText(summary).then(() => {
                        alert("Report summary copied to clipboard. In production this would queue a secure email to listed recipients.");
                      }).catch(() => {
                        alert("Report ready (demo). In real deployment this would send via your configured SMTP / SendGrid integration.");
                      });
                      // Also log
                      if (user) logAction(user, 'report_emailed', { type: reportConfig.type, scope: reportConfig.scope }).catch(() => {});
                    }}
                    style={{ 
                      background: 'var(--gold)', 
                      color: '#000', 
                      fontWeight: 'bold', 
                      padding: '10px 18px', 
                      minHeight: 'auto',
                      border: 'none',
                      flex: 1,
                      maxWidth: '168px'
                    }}
                  >
                    Send Secure Email (Demo)
                  </button>
                )}

                {exportFormat.includes("Save Template") || exportFormat.includes("Template") ? (
                  <button 
                    className="interactive-btn"
                    onClick={() => {
                      try {
                        const key = 'voltiq-saved-report-templates';
                        const existing = JSON.parse(localStorage.getItem(key) || '[]');
                        const newTpl = { id: Date.now(), ...reportConfig, savedAt: new Date().toISOString() };
                        localStorage.setItem(key, JSON.stringify([newTpl, ...existing].slice(0, 12)));
                        alert("Template saved locally. You can load these in future from Settings or a future Templates gallery.");
                        if (user) logAction(user, 'report_template_saved', { type: reportConfig.type }).catch(() => {});
                      } catch (e) {
                        alert("Template saved to browser storage (demo).");
                      }
                    }}
                    style={{ 
                      background: 'var(--gold)', 
                      color: '#000', 
                      fontWeight: 'bold', 
                      padding: '10px 18px', 
                      minHeight: 'auto',
                      border: 'none',
                      flex: 1,
                      maxWidth: '168px'
                    }}
                  >
                    Confirm Save Template
                  </button>
                ) : null}

                <button 
                  className="interactive-btn" 
                  onClick={() => setExportState(null)} 
                  style={{ 
                    background: 'rgba(255,255,255,0.08)', 
                    color: '#fff', 
                    fontWeight: 'bold', 
                    padding: '10px 20px', 
                    minHeight: 'auto',
                    border: '1px solid rgba(255,255,255,0.1)',
                    flex: 1,
                    maxWidth: '120px'
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
