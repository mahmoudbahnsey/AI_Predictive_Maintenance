import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Trash2, Minus } from 'lucide-react';
import RobotAvatar from './RobotAvatar';
import ChatMessage from './ChatMessage';
import ChatQuickActions from './ChatQuickActions';
import TypingIndicator from './TypingIndicator';

export default function ChatbotPanel({ isOpen, onClose, messages, onSendMessage, isTyping, status, quickActions, onClearChat }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="chatbot-panel"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <RobotAvatar status={status} size={36} />
              <div>
                <h3>VoltIQ Bot</h3>
                <p>Solar intelligence assistant</p>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button onClick={onClearChat} title="Clear Chat"><Trash2 size={16} /></button>
              <button onClick={onClose} title="Minimize"><Minus size={16} /></button>
              <button onClick={onClose} title="Close"><X size={18} /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages-container">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg.text} isBot={msg.isBot} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {!isTyping && quickActions && quickActions.length > 0 && (
            <ChatQuickActions 
              actions={quickActions} 
              onActionClick={(action) => onSendMessage(action)} 
            />
          )}

          {/* Input Area */}
          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="chatbot-input" 
              placeholder="Ask VoltIQ Bot anything..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="chatbot-send-btn"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={14} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
