import { motion } from 'framer-motion';

export default function ChatMessage({ message, isBot }) {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      className={`chat-message-wrapper ${isBot ? 'bot' : 'user'}`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="chat-message">
        {message}
      </div>
      <div className="chat-message-time">{timeStr}</div>
    </motion.div>
  );
}
