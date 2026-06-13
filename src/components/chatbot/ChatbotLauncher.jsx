import RobotAvatar from './RobotAvatar';

export default function ChatbotLauncher({ isOpen, onClick, status = 'online', hasUnread = false }) {
  return (
    <div 
      className="chatbot-launcher"
      onClick={onClick}
      aria-label="Toggle VoltIQ Bot"
      style={{
        transform: isOpen ? 'scale(0.8) translateY(20px)' : 'none',
        opacity: isOpen ? 0 : 1,
        pointerEvents: isOpen ? 'none' : 'auto'
      }}
    >
      <RobotAvatar status={status} size={40} />
      {!isOpen && (
        <div className={`chatbot-status-dot ${hasUnread ? 'thinking' : status}`} />
      )}
    </div>
  );
}
