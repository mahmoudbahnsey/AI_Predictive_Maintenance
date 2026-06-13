import { useState } from 'react';
import { Copy, Check, RefreshCw, Minimize2, Lightbulb, ListTodo, FileText } from 'lucide-react';
import WattsonAvatar from './WattsonAvatar';

export default function WattsonMessage({ 
  msg, 
  mood, 
  isLatestBot, 
  onModify, 
  onRegenerate,
  onQuickAction
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([msg.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wattson-response-${msg.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!msg.isBot) {
    return (
      <div className="user-message-bubble">
        {msg.text}
      </div>
    );
  }

  return (
    <div className="wattson-message-card">
      <div className="wattson-message-avatar">
        <WattsonAvatar mood={mood} size={32} />
      </div>
      <div className="wattson-message-content">
        <p className="wattson-message-text">{msg.text}</p>
        
        {/* Actions panel */}
        <div className="wattson-message-actions-toolbar">
          <button type="button" className="toolbar-btn" onClick={handleCopy} title="Copy response">
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
          </button>
          
          <button type="button" className="toolbar-btn" onClick={handleExport} title="Export as text file">
            <FileText size={12} />
          </button>

          {isLatestBot && (
            <>
              <button type="button" className="toolbar-btn" onClick={onRegenerate} title="Regenerate answer">
                <RefreshCw size={12} />
              </button>
              <button type="button" className="toolbar-btn" onClick={() => onModify(msg.id, 'shorter')} title="Make shorter">
                <Minimize2 size={12} />
              </button>
              <button type="button" className="toolbar-btn" onClick={() => onModify(msg.id, 'simpler')} title="Explain simpler">
                <Lightbulb size={12} />
              </button>
              <button type="button" className="toolbar-btn" onClick={() => onModify(msg.id, 'action')} title="Create action list">
                <ListTodo size={12} />
              </button>
            </>
          )}
        </div>

        {/* Dynamic suggested follow-ups for specific keyword responses */}
        {isLatestBot && msg.text.includes("Alert") && (
          <div className="wattson-followups-list">
            <button onClick={() => onQuickAction("Open Alerts")}>Go to Alerts</button>
            <button onClick={() => onQuickAction("Show critical alerts")}>Filter Critical</button>
          </div>
        )}
        {isLatestBot && msg.text.includes("fault") && (
          <div className="wattson-followups-list">
            <button onClick={() => onQuickAction("Find repeated faults")}>Analyze Frequency</button>
            <button onClick={() => onQuickAction("Suggest root cause")}>Diagnose Root Cause</button>
          </div>
        )}
      </div>
    </div>
  );
}
