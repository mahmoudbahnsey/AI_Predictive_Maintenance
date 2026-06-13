import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

export default function LiveSystemNetworkMap({ fleetData }) {
  
  // Arrange nodes in a circle for the map
  const radius = 120;
  const centerX = 250;
  const centerY = 180;
  
  return (
    <motion.div 
      className="sys-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}
    >
      <div className="sys-card-header">
        <h2 className="sys-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={18} style={{ color: 'var(--gold)' }} />
          Live System Network
        </h2>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 500 360" preserveAspectRatio="xMidYMid meet">
          
          {/* Central Core */}
          <circle cx={centerX} cy={centerY} r="30" fill="rgba(212, 175, 55, 0.1)" stroke="var(--gold)" strokeWidth="2" />
          <text x={centerX} y={centerY + 4} fill="var(--gold)" fontSize="12" fontWeight="bold" textAnchor="middle">VoltIQ</text>
          
          <motion.circle 
            cx={centerX} cy={centerY} r="45" 
            fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1" strokeDasharray="4 4"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{ originX: `${centerX}px`, originY: `${centerY}px` }}
          />

          {fleetData.map((sys, index) => {
            const angle = (index / fleetData.length) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            let color = 'var(--color-normal)';
            if (sys.status === 'warning') color = 'var(--color-warning)';
            if (sys.status === 'fault') color = 'var(--color-critical)';
            if (sys.status === 'offline') color = '#5a6b63';

            return (
              <g key={sys.id}>
                {/* Connection Line */}
                <path 
                  d={`M${centerX} ${centerY} L${x} ${y}`} 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="2" 
                />
                
                {/* Energy Pulse on Line (only if online or warning) */}
                {(sys.status === 'online' || sys.status === 'warning') && (
                  <motion.circle 
                    r="3" fill={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }}
                    animate={{ 
                      cx: [x, centerX], 
                      cy: [y, centerY] 
                    }}
                    transition={{ repeat: Infinity, duration: 2 + Math.random(), delay: Math.random() * 2 }}
                  />
                )}

                {/* Node */}
                <motion.circle 
                  cx={x} cy={y} r="8" fill={color} 
                  whileHover={{ scale: 1.5 }}
                  style={{ cursor: 'pointer' }}
                >
                  <title>{sys.name}&#10;Status: {sys.status}&#10;Health: {sys.health}%</title>
                </motion.circle>
                
                {/* Node Label */}
                <text 
                  x={x} y={y + 20} 
                  fill="#a8b5ae" fontSize="10" textAnchor="middle" 
                  style={{ pointerEvents: 'none' }}
                >
                  {sys.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}
