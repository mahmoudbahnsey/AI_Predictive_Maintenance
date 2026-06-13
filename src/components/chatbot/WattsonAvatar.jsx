import { motion } from 'framer-motion';

const moodClassMap = {
  annoyed: 'annoyed',
  critical: 'critical',
  focused: 'focused',
  happy: 'happy',
  idle: 'idle',
  online: 'idle',
  scanning: 'scanning',
  sleeping: 'sleeping',
  sleepy: 'sleeping',
  thinking: 'thinking',
  waking: 'happy',
  warning: 'warning',
};

function getAvatarMotion() {
  return {
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 0 },
  };
}

export default function WattsonAvatar({ mood = 'idle', size = 48, isHovered = false, eyeOffset = { x: 0, y: 0, blink: false } }) {
  const moodClass = moodClassMap[mood] || 'idle';

  return (
    <motion.div
      className={`wattson-avatar-3d mood-${moodClass} ${isHovered ? 'is-hovered' : ''}`}
      style={{ '--wattson-size': `${size}px` }}
      animate={getAvatarMotion()}
      whileHover={{ scale: 1 }}
    >
      <svg className="wattson-svg-bot" viewBox="0 0 128 128" role="img" aria-label="Wattson AI assistant">
        <defs>
          <radialGradient id="wsAura" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wsMetal" x1="21" y1="12" x2="103" y2="118" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f9fbf2" />
            <stop offset="0.28" stopColor="#abb6af" />
            <stop offset="0.66" stopColor="#27312f" />
            <stop offset="1" stopColor="#0c1110" />
          </linearGradient>
          <linearGradient id="wsDarkMetal" x1="33" y1="44" x2="88" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#46524d" />
            <stop offset="0.56" stopColor="#1b2422" />
            <stop offset="1" stopColor="#080d0c" />
          </linearGradient>
          <linearGradient id="wsVisor" x1="40" y1="31" x2="88" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#151d1b" />
            <stop offset="0.55" stopColor="#050808" />
            <stop offset="1" stopColor="#1c2522" />
          </linearGradient>
          <radialGradient id="wsEye" cx="38%" cy="35%" r="68%">
            <stop offset="0" stopColor="#fff8ca" />
            <stop offset="0.42" stopColor="currentColor" />
            <stop offset="1" stopColor="#2b2004" />
          </radialGradient>
          <radialGradient id="wsCore" cx="38%" cy="30%" r="75%">
            <stop offset="0" stopColor="#fff8c6" />
            <stop offset="0.48" stopColor="currentColor" />
            <stop offset="1" stopColor="#151005" />
          </radialGradient>
          <filter id="wsGlow" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="3.1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wsShadow" x="-30%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.52" />
          </filter>
        </defs>

        <ellipse className="ws-aura" cx="64" cy="62" rx="55" ry="50" fill="url(#wsAura)" />
        <ellipse className="ws-ground" cx="64" cy="118" rx="34" ry="7" />

        <motion.g className="ws-bot" filter="url(#wsShadow)">
          <g className="ws-antenna">
            <path d="M64 24V12" />
            <circle cx="64" cy="9" r="5.2" />
          </g>

          <g className="ws-arms">
            <motion.g className="ws-arm ws-arm-left">
              <path d="M42 75C32 78 29 86 33 94" />
              <circle cx="33" cy="96" r="5.6" />
            </motion.g>
            <motion.g className="ws-arm ws-arm-right">
              <path d="M86 75C96 78 99 86 95 94" />
              <circle cx="95" cy="96" r="5.6" />
            </motion.g>
          </g>

          <g className="ws-legs">
            <path className="ws-leg ws-leg-left" d="M55 101L51 115" />
            <path className="ws-leg ws-leg-right" d="M73 101L77 115" />
            <ellipse className="ws-foot" cx="50" cy="118" rx="9" ry="4.6" />
            <ellipse className="ws-foot" cx="78" cy="118" rx="9" ry="4.6" />
          </g>

          <path className="ws-body" d="M40 69C42 58 50 52 64 52C78 52 86 58 88 69L91 96C92 106 84 112 75 112H53C44 112 36 106 37 96L40 69Z" />
          <path className="ws-body-shine" d="M48 60C52 56 58 55 65 55C56 62 52 78 53 106H47C43 104 41 101 42 96L44 72C44 67 46 63 48 60Z" />
          <rect className="ws-neck" x="55" y="49" width="18" height="10" rx="5" />
          <circle className="ws-core" cx="64" cy="82" r="11" filter="url(#wsGlow)" />
          <path className="ws-core-mark" d="M65 75L59 84H64L62 90L70 80H65L68 75H65Z" />
          <circle className="ws-status-ring" cx="64" cy="102" r="5.8" />
          <path className="ws-status-signal" d="M60 102H68" />

          <ellipse className="ws-ear ws-ear-left" cx="28" cy="46" rx="8.5" ry="12" />
          <ellipse className="ws-ear ws-ear-right" cx="100" cy="46" rx="8.5" ry="12" />
          <path className="ws-head" d="M34 35C38 24 48 19 64 19C80 19 90 24 94 35C98 49 91 62 78 66H50C37 62 30 49 34 35Z" />
          <path className="ws-head-shine" d="M44 27C50 23 58 22 68 22C56 29 49 42 50 61C41 58 36 49 38 38C39 33 41 29 44 27Z" />
          <rect className="ws-face" x="41" y="33" width="46" height="25" rx="12" />
          <path className="ws-face-glint" d="M48 37H62" />
          <path className="ws-brow ws-brow-left" d="M51 40L59 39" />
          <path className="ws-brow ws-brow-right" d="M69 39L77 40" />
          <motion.circle 
            className="ws-eye ws-eye-left" 
            cx={55.5} 
            cy={47} 
            r={eyeOffset?.blink ? 0.5 : 4.2} 
            animate={{ x: eyeOffset?.x || 0, y: eyeOffset?.y || 0 }} 
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            filter="url(#wsGlow)" 
          />
          <motion.circle 
            className="ws-eye ws-eye-right" 
            cx={72.5} 
            cy={47} 
            r={eyeOffset?.blink ? 0.5 : 4.2} 
            animate={{ x: eyeOffset?.x || 0, y: eyeOffset?.y || 0 }} 
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            filter="url(#wsGlow)" 
          />
          <motion.circle 
            className="ws-eye-shine" 
            cx={54.2} 
            cy={45.4} 
            r={eyeOffset?.blink ? 0 : 1} 
            animate={{ x: eyeOffset?.x || 0, y: eyeOffset?.y || 0 }} 
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          />
          <motion.circle 
            className="ws-eye-shine" 
            cx={71.2} 
            cy={45.4} 
            r={eyeOffset?.blink ? 0 : 1} 
            animate={{ x: eyeOffset?.x || 0, y: eyeOffset?.y || 0 }} 
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          />
          <path className="ws-mouth" d="M59 53Q64 56 69 53" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
