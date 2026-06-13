import { motion, AnimatePresence } from 'framer-motion';
import WattsonAvatar from './WattsonAvatar';

export default function WattsonLauncher({
  isOpen,
  onClick,
  mood = 'idle',
  hasUnread = false,
  isDragging = false,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  eyeOffset = { x: 0, y: 0, blink: false }
}) {
  const getBadgeText = () => {
    switch (mood) {
      case 'sleeping':
      case 'sleepy':
        return 'Dreaming';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      case 'thinking':
        return 'Thinking';
      case 'focused':
        return 'Listening';
      case 'happy':
      case 'waking':
        return 'Ready';
      default:
        return 'Monitoring';
    }
  };

  return (
    <motion.button
      type="button"
      className={`chatbot-launcher wattson-launcher-custom mood-${mood} ${hasUnread ? 'has-unread' : ''} ${isDragging ? 'is-dragging' : ''}`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
      aria-label="Toggle or drag Wattson Bot"
      initial={false}
      animate={{
        scale: isOpen ? 0.82 : 1,
        y: isOpen ? 22 : 0,
        opacity: isOpen ? 0 : 1,
      }}
      style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
      whileHover="hover"
      whileTap={{ scale: 0.94 }}
    >
      <AnimatePresence>
        {!isOpen && (
          <motion.span
            className="wattson-tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            variants={{ hover: { opacity: 1, y: 0, scale: 1 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            Ask Wattson about your system.
          </motion.span>
        )}
      </AnimatePresence>

      <span className="wattson-launcher-stage">
        {hasUnread && <span className="wattson-unread-ping" />}
        <WattsonAvatar mood={hasUnread ? 'waking' : mood} size={98} eyeOffset={eyeOffset} />
      </span>

      <span className="wattson-launcher-badge">
        <span className="wattson-badge-dot" />
        {getBadgeText()}
      </span>
    </motion.button>
  );
}
