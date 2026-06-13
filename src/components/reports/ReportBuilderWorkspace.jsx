import { useState, useRef, useEffect } from 'react';
import { Settings, RefreshCw, FileText, FileSpreadsheet, Mail, Save } from 'lucide-react';

function CustomSelect({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="builder-section" ref={containerRef}>
      {label && <label className="builder-label">{label}</label>}
      <div className="volt-select-container">
        <div 
          className={`volt-select-trigger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{value}</span>
          <span style={{ 
            fontSize: '9px', 
            transition: 'transform 0.2s ease', 
            transform: isOpen ? 'rotate(180deg)' : 'none',
            color: 'var(--gold)',
            marginLeft: '8px'
          }}>▼</span>
        </div>
        {isOpen && (
          <div className="volt-select-options-list">
            {options.map(opt => (
              <div 
                key={opt}
                className={`volt-select-option-item ${opt === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportBuilderWorkspace({ config, setConfig, onExport, triggerRebuild }) {
  const updateConfig = (key, val) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  const updateSection = (sectionKey, val) => {
    setConfig(prev => ({
      ...prev,
      includeSections: {
        ...prev.includeSections,
        [sectionKey]: val
      }
    }));
  };

  return (
    <div className="pub-panel">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '28px', 
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)', 
        paddingBottom: '16px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={18} color="var(--gold)" />
          <h3 style={{ fontSize: '15px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
            Report Parameters
          </h3>
        </div>
        <button 
          onClick={triggerRebuild}
          className="interactive-btn" 
          style={{ 
            padding: '6px 12px', 
            minHeight: 'auto', 
            fontSize: '11px', 
            background: 'rgba(212,175,55,0.08)', 
            border: '1px solid rgba(212,175,55,0.2)',
            color: 'var(--gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Re-run AI synthesis and refresh preview"
        >
          <RefreshCw size={12} /> Regenerate
        </button>
      </div>

      {/* Group 1: Core Scope & Type */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '20px' }}>
        <CustomSelect 
          label="Report Template Type"
          value={config.type}
          options={[
            "Executive Intelligence Summary",
            "Device Health Report",
            "Fault & Incident Report",
            "Alerts & SLA Report",
            "AI Training Performance Report",
            "Security & Audit Report",
            "Fleet Operations Summary"
          ]}
          onChange={(val) => updateConfig('type', val)}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <CustomSelect 
            label="Scope / Target"
            value={config.scope}
            options={["All HQ Systems", "Nevada Solar 3", "Arizona Array B", "Global Fleet"]}
            onChange={(val) => updateConfig('scope', val)}
          />
          
          <CustomSelect 
            label="Date Range"
            value={config.dateRange}
            options={["Last 7 Days", "Last 30 Days", "Current Quarter", "Year to Date"]}
            onChange={(val) => updateConfig('dateRange', val)}
          />
        </div>
      </div>

      {/* Group 2: AI & Narrative Settings */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '1px', fontWeight: 'bold' }}>
          AI Intelligence Setup
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'center' }}>
          <CustomSelect 
            label="Audience Tone"
            value={config.tone}
            options={["Executive", "Operations", "Technical", "Compliance"]}
            onChange={(val) => updateConfig('tone', val)}
          />

          <div className="builder-section" style={{ marginBottom: '22px' }}>
            <label className="builder-label">AI Narrative Engine</label>
            <label className="custom-checkbox-label">
              <input 
                type="checkbox" 
                className="custom-checkbox-input"
                checked={config.includeAi} 
                onChange={(e) => updateConfig('includeAi', e.target.checked)} 
              />
              <span style={{ fontSize: '12px' }}>Enable AI Text</span>
            </label>
          </div>
        </div>
      </div>

      {/* Group 3: Document Content Selection */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px', fontWeight: 'bold' }}>
          Report Sections
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <label className="custom-checkbox-label">
            <input 
              type="checkbox" 
              className="custom-checkbox-input"
              checked={config.includeSections.kpi} 
              onChange={(e) => updateSection('kpi', e.target.checked)} 
            />
            <span>KPI Snapshot</span>
          </label>
          
          <label className="custom-checkbox-label">
            <input 
              type="checkbox" 
              className="custom-checkbox-input"
              checked={config.includeSections.findings} 
              onChange={(e) => updateSection('findings', e.target.checked)} 
            />
            <span>Key Findings</span>
          </label>

          <label className="custom-checkbox-label">
            <input 
              type="checkbox" 
              className="custom-checkbox-input"
              checked={config.includeSections.trends} 
              onChange={(e) => updateSection('trends', e.target.checked)} 
            />
            <span>Trend Charts</span>
          </label>

          <label className="custom-checkbox-label">
            <input 
              type="checkbox" 
              className="custom-checkbox-input"
              checked={config.includeSections.faults} 
              onChange={(e) => updateSection('faults', e.target.checked)} 
            />
            <span>Incident Summary</span>
          </label>

          <label className="custom-checkbox-label">
            <input 
              type="checkbox" 
              className="custom-checkbox-input"
              checked={config.includeSections.devices} 
              onChange={(e) => updateSection('devices', e.target.checked)} 
            />
            <span>Device Health</span>
          </label>

          <label className="custom-checkbox-label">
            <input 
              type="checkbox" 
              className="custom-checkbox-input"
              checked={config.includeSections.recommendations} 
              onChange={(e) => updateSection('recommendations', e.target.checked)} 
            />
            <span>Action Plan</span>
          </label>

          <label className="custom-checkbox-label" style={{ gridColumn: 'span 2' }}>
            <input 
              type="checkbox" 
              className="custom-checkbox-input"
              checked={config.includeSections.footer} 
              onChange={(e) => updateSection('footer', e.target.checked)} 
            />
            <span>Compliance Notice & Footer</span>
          </label>
        </div>
      </div>

      {/* Group 4: Exports and Generation */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <CustomSelect 
            label="Default Export Format"
            value={config.format}
            options={["PDF Document", "CSV Sheet", "XLSX Worksheet", "Secure Email"]}
            onChange={(val) => updateConfig('format', val)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            className="interactive-btn" 
            onClick={() => onExport(config.format || "PDF Document")}
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'var(--gold)', 
              color: '#000', 
              fontWeight: '800', 
              minHeight: 'auto', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px',
              border: 'none',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
            }}
          >
            <FileText size={16} /> Execute Publishing & Export
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button 
              className="interactive-btn"
              onClick={() => onExport("XLSX Worksheet")}
              style={{ 
                padding: '10px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)',
                minHeight: 'auto',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <FileSpreadsheet size={13} color="var(--gold)" /> Excel
            </button>
            <button 
              className="interactive-btn"
              onClick={() => onExport("Secure Email")}
              style={{ 
                padding: '10px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)',
                minHeight: 'auto',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Mail size={13} color="var(--gold)" /> Email Report
            </button>
          </div>

          <button 
            className="interactive-btn"
            onClick={() => onExport("Save Template")}
            style={{ 
              padding: '10px', 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(212, 175, 55, 0.1)',
              color: 'var(--gold)',
              minHeight: 'auto',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '4px'
            }}
          >
            <Save size={13} /> Save Custom Publishing Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
