import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Volume2, VolumeX, Trash2, StopCircle } from 'lucide-react';
import WattsonAvatar from './WattsonAvatar';
import WattsonModeSelector from './WattsonModeSelector';
import WattsonContextChips from './WattsonContextChips';
import WattsonMessage from './WattsonMessage';
import WattsonQuickActions from './WattsonQuickActions';
import TypingIndicator from './TypingIndicator';

export default function WattsonPanel({ 
  isOpen, 
  onClose, 
  messages, 
  onSendMessage, 
  isTyping, 
  mood, 
  onClearChat, 
  onTypingStart, 
  onTypingEnd, 
  soundEnabled = true, 
  onToggleSound,
  eyeOffset,
  mode,
  onModeChange,
  connectionStatus,
  currentPath,
  userRole,
  onStopGenerating,
  onModifyMessage,
  onRegenerateMessage
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.trim().length > 0) {
      onTypingStart();
    } else {
      onTypingEnd();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    onSendMessage(inputValue);
    setInputValue('');
    onTypingEnd();
  };

  const handleModeSelect = (newMode) => {
    if (typeof onModeChange === 'function') {
      onModeChange(newMode);
    }
  };

  const getCurrentModeLabel = () => {
    switch (mode) {
      case 'analyze': return 'Analyze';
      case 'diagnose': return 'Diagnose';
      case 'summarize': return 'Summarize';
      case 'report': return 'Report';
      case 'troubleshoot': return 'Troubleshoot';
      default: return 'Ask';
    }
  };

  const getStatusLabel = () => {
    const modeLabel = getCurrentModeLabel();
    const baseMood = (() => {
      switch (mood) {
        case 'thinking': return 'Thinking...';
        case 'sleeping': return 'Sleeping';
        case 'sleepy': return 'Getting sleepy';
        case 'annoyed': return 'Annoyed';
        case 'focused': return 'Listening...';
        case 'warning': return 'Warning';
        case 'critical': return 'Critical';
        case 'scanning': return 'Scanning...';
        default: return 'Online';
      }
    })();
    return `${modeLabel} • ${baseMood}`;
  };

  const getPlaceholderText = () => {
    const route = currentPath.split('/').filter(Boolean).pop() || 'dashboard';
    const modeLabel = getCurrentModeLabel().toLowerCase();

    let base;
    switch (route) {
      case 'dashboard':
        base = 'system health, power, voltage, or AI prediction';
        break;
      case 'alerts':
        base = 'which alert needs attention first';
        break;
      case 'reports':
        base = 'how to generate an executive report';
        break;
      case 'ai-training':
        base = 'model accuracy, dataset quality, or deployment readiness';
        break;
      case 'settings':
        base = 'configuration, time zones, or account settings';
        break;
      default:
        base = 'faults, inverter issues, reports, or system status';
    }

    switch (mode) {
      case 'summarize':
        return `Summarize ${base}...`;
      case 'analyze':
        return `Analyze trends in ${base}...`;
      case 'diagnose':
        return `Diagnose issues with ${base}...`;
      case 'report':
        return `Prepare a report about ${base}...`;
      case 'troubleshoot':
        return `Troubleshoot ${base}...`;
      default:
        return `Ask Wattson about ${base}...`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="wattson-panel-container"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="wattson-panel-header">
            <div className="wattson-header-info">
              <WattsonAvatar mood={mood} size={42} eyeOffset={eyeOffset} />
              <div className="wattson-identity">
                <h3>Wattson</h3>
                <p>VoltIQ AI Energy Assistant</p>
                <div className="wattson-status-indicator">
                  <span className={`status-dot ${mood}`}></span>
                  <span>{getStatusLabel()}</span>
                </div>
              </div>
            </div>
            <div className="wattson-header-actions">
              <button
                type="button"
                className={`icon-btn ${soundEnabled ? 'is-active' : ''}`}
                onClick={onToggleSound}
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                aria-label={soundEnabled ? 'Mute Wattson sounds' : 'Enable Wattson sounds'}
                aria-pressed={soundEnabled}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button className="icon-btn" onClick={onClearChat} title="Clear chat"><Trash2 size={16} /></button>
              <button className="icon-btn" onClick={onClose} title="Close"><X size={18} /></button>
            </div>
          </div>

          {/* Mode Selector */}
          <WattsonModeSelector activeMode={mode} onModeChange={handleModeSelect} />

          {/* Context Chips status line */}
          <WattsonContextChips 
            connectionStatus={connectionStatus} 
            currentPath={currentPath} 
            userRole={userRole} 
          />

          {/* Messages Area */}
          <div className="wattson-messages-area">
            {messages.map((msg, idx) => (
              <WattsonMessage
                key={msg.id}
                msg={msg}
                mood={mood}
                isLatestBot={msg.isBot && idx === messages.length - 1}
                onModify={onModifyMessage}
                onRegenerate={() => onRegenerateMessage(msg.id)}
                onQuickAction={onSendMessage}
              />
            ))}
            {isTyping && (
              <div className="wattson-message-card">
                 <div className="wattson-message-avatar">
                   <WattsonAvatar mood="thinking" size={32} eyeOffset={eyeOffset} />
                 </div>
                 <div className="wattson-message-content">
                   <TypingIndicator />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Actions */}
          <WattsonQuickActions 
            currentPath={currentPath} 
            onActionClick={onSendMessage} 
          />

          {/* Input Area */}
          <div className="wattson-input-container">
            <textarea 
              className="wattson-textarea" 
              placeholder={getPlaceholderText()} 
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={onTypingStart}
              onBlur={onTypingEnd}
              disabled={isTyping}
            />
            
            <div className="wattson-input-footer">
              {isTyping ? (
                <button 
                  type="button"
                  className="wattson-btn-stop"
                  onClick={onStopGenerating}
                >
                  <StopCircle size={14} /> Stop Generating
                </button>
              ) : (
                <>
                  <button 
                    type="button"
                    className="wattson-btn-outline"
                    onClick={(e) => { e.preventDefault(); onSendMessage("Analyze system"); }}
                  >
                    Analyze
                  </button>
                  <button 
                    type="button"
                    className="wattson-btn-solid"
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                  >
                    <Send size={14} /> Send
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
