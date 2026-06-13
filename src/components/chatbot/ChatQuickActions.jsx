import { motion } from 'framer-motion';

export default function ChatQuickActions({ actions, onActionClick }) {
  if (!actions || actions.length === 0) return null;

  return (
    <motion.div 
      className="chat-quick-actions"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {actions.map((action, i) => (
        <button 
          key={i} 
          className="chat-quick-action-chip"
          onClick={() => onActionClick(action)}
        >
          {action}
        </button>
      ))}
    </motion.div>
  );
}
