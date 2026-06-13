import { motion } from 'framer-motion';

export default function AiDiagnosticVisual({ state }) {
  // state: 'normal', 'warning', 'critical'
  
  const color = `var(--color-${state})`;
  
  // A subtle scanning line overlay
  const scanLineVariants = {
    animate: {
      top: ['-10%', '110%'],
      transition: { repeat: Infinity, duration: 4, ease: "linear" }
    }
  };

  return (
    <div className="ai-visual-panel">
      <div className="ai-visual-grid-bg" />
      
      {/* Animated scan line overlay */}
      <motion.div 
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          boxShadow: `0 0 20px ${color}`,
          opacity: 0.6,
          zIndex: 10
        }}
        variants={scanLineVariants}
        animate="animate"
      />

      <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet" style={{ position: 'relative', zIndex: 5 }}>
        
        {/* Nodes */}
        {/* Solar Panel */}
        <g transform="translate(80, 100)">
          <rect x="-30" y="-30" width="60" height="60" rx="8" fill="rgba(0,0,0,0.6)" stroke="#a8b5ae" strokeWidth="2" />
          <path d="M-15 -10 L15 -10 M-15 10 L15 10 M-10 -20 L-10 20 M10 -20 L10 20" stroke="#a8b5ae" strokeWidth="1.5" />
          <text x="0" y="45" fill="#a8b5ae" fontSize="12" textAnchor="middle" letterSpacing="1">ARRAY</text>
        </g>

        {/* Inverter Core */}
        <g transform="translate(250, 100)">
          <rect x="-45" y="-50" width="90" height="100" rx="12" fill="rgba(0,0,0,0.8)" stroke={color} strokeWidth="3" />
          <motion.path 
            d="M-5 -20 L5 -20 L-2 -5 L10 -5 L-5 20 L2 5 L-10 5 Z" 
            fill="none" stroke={color} strokeWidth="2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: state === 'critical' ? 0.8 : 2 }}
          />
          <motion.circle 
            cx="0" cy="0" r="30" 
            fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 4"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />
          
          <text x="0" y="68" fill={color} fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="1">VoltIQ</text>
          <text x="0" y="82" fill={color} fontSize="10" textAnchor="middle" letterSpacing="1">INVERTER AI</text>
          
          {/* Status glow behind inverter */}
          <motion.circle 
            cx="0" cy="0" r="60" 
            fill={color} 
            style={{ mixBlendMode: 'screen' }}
            animate={{ opacity: state === 'critical' ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </g>

        {/* Home / Load */}
        <g transform="translate(420, 100)">
          <path d="M-20 10 L-20 -10 L0 -25 L20 -10 L20 10 Z" fill="rgba(0,0,0,0.6)" stroke="#a8b5ae" strokeWidth="2" />
          <text x="0" y="45" fill="#a8b5ae" fontSize="12" textAnchor="middle" letterSpacing="1">LOAD</text>
        </g>

        {/* Connection Lines */}
        <path d="M110 100 L205 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <path d="M295 100 L400 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />

        {/* Energy Flow Animation */}
        <motion.circle r="4" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          animate={{ cx: [110, 205] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          cy="100"
        />
        <motion.circle r="4" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          animate={{ cx: [110, 205] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }}
          cy="100"
        />

        <motion.circle r="4" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          animate={{ cx: [295, 400] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
          cy="100"
        />
        <motion.circle r="4" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          animate={{ cx: [295, 400] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.95 }}
          cy="100"
        />

      </svg>
    </div>
  );
}
