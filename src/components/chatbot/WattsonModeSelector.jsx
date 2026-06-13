import { HelpCircle, BarChart2, Activity, AlignLeft, FileText, Wrench } from 'lucide-react';

export default function WattsonModeSelector({ activeMode, onModeChange }) {
  const modes = [
    { id: 'ask', label: 'Ask', icon: HelpCircle, desc: 'General Q&A' },
    { id: 'analyze', label: 'Analyze', icon: BarChart2, desc: 'Solar trends' },
    { id: 'diagnose', label: 'Diagnose', icon: Activity, desc: 'Hardware faults' },
    { id: 'summarize', label: 'Summarize', icon: AlignLeft, desc: 'Quick digests' },
    { id: 'report', label: 'Report', icon: FileText, desc: 'Doc prep' },
    { id: 'troubleshoot', label: 'Troubleshoot', icon: Wrench, desc: 'Fix advice' }
  ];

  return (
    <div className="wattson-mode-selector-bar">
      {modes.map(mode => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            className={`wattson-mode-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => onModeChange(mode.id)}
            title={`${mode.label}: ${mode.desc}`}
          >
            <Icon size={14} />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
