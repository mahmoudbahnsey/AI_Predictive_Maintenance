import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div 
      className="typing-indicator"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </motion.div>
  );
}
