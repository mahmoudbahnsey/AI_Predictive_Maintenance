import { Cpu, WifiOff, RefreshCw, Layers } from 'lucide-react';

export default function WattsonContextChips({ connectionStatus, currentPath, userRole }) {
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Gemini Pro Connected';
      case 'fallback':
        return 'API Fallback Mode';
      case 'offline':
        return 'Offline Guidance';
      default:
        return 'System Active';
    }
  };

  const getStatusClass = () => {
    if (connectionStatus === 'connected') return 'status-connected';
    if (connectionStatus === 'offline') return 'status-offline';
    return 'status-fallback';
  };

  const formatPath = (path) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Dashboard';
    const last = segments[segments.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1).replace('-', ' ');
  };

  return (
    <div className="wattson-context-chips-panel">
      <div className={`wattson-context-chip ${getStatusClass()}`}>
        {connectionStatus === 'offline' ? <WifiOff size={11} /> : 
         connectionStatus === 'fallback' ? <RefreshCw size={11} className="spin-slow" /> : <Cpu size={11} />}
        <span>{getStatusText()}</span>
      </div>

      <div className="wattson-context-chip chip-path">
        <Layers size={11} />
        <span>Context: {formatPath(currentPath)}</span>
      </div>

      {userRole && (
        <div className="wattson-context-chip chip-role">
          <span>Role: {userRole}</span>
        </div>
      )}
    </div>
  );
}
