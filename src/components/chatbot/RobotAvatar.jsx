import { motion } from 'framer-motion';

export default function RobotAvatar({ status = 'online', size = 32 }) {
  // status: 'online', 'thinking', 'alert'
  
  const getEyeColor = () => {
    switch (status) {
      case 'thinking': return '#ff9800';
      case 'alert': return '#f44336';
      default: return '#4caf50';
    }
  };

  const getEyeAnimation = () => {
    if (status === 'thinking') {
      return { opacity: [0.4, 1, 0.4], transition: { repeat: Infinity, duration: 1.5 } };
    }
    if (status === 'alert') {
      return { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 0.8 } };
    }
    return { opacity: 1 };
  };

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <line x1="32" y1="16" x2="32" y2="4" stroke="#a8b5ae" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="4" r="2" fill="var(--gold)" />
        
        {/* Head Base */}
        <rect x="12" y="16" width="40" height="36" rx="12" fill="#141414" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        
        {/* Face Screen */}
        <rect x="18" y="22" width="28" height="20" rx="6" fill="#0f0f0f" stroke="var(--gold)" strokeWidth="1" strokeOpacity="0.3" />
        
        {/* Eyes */}
        <motion.circle cx="25" cy="32" r="3" fill={getEyeColor()} animate={getEyeAnimation()} />
        <motion.circle cx="39" cy="32" r="3" fill={getEyeColor()} animate={getEyeAnimation()} />
        
        {/* Expression (Mouth/Alert) */}
        {status === 'alert' ? (
          <path d="M 28 40 L 36 40" stroke="#f44336" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <path d="M 28 38 Q 32 42 36 38" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </div>
  );
}
