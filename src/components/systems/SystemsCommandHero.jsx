import { motion } from 'framer-motion';

export default function SystemsCommandHero({ stats }) {
  
  return (
    <motion.div 
      className="fleet-hero"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="fleet-hero-content">
        <h1>Systems Command Center</h1>
        <p>Live operational overview of the entire VoltIQ solar fleet. Monitoring {stats.total} systems globally with AI diagnostics active.</p>
        
        <div className="hero-stats-row">
          <div className="hero-stat">
            <strong style={{ color: 'var(--color-normal)' }}>{stats.online}</strong>
            <span>Online</span>
          </div>
          <div className="hero-stat">
            <strong style={{ color: 'var(--color-warning)' }}>{stats.warning}</strong>
            <span>Warning</span>
          </div>
          <div className="hero-stat">
            <strong style={{ color: 'var(--color-critical)' }}>{stats.fault}</strong>
            <span>Fault</span>
          </div>
          <div className="hero-stat">
            <strong style={{ color: '#5a6b63' }}>{stats.offline}</strong>
            <span>Offline</span>
          </div>
          <div className="hero-stat">
            <strong style={{ color: '#fff' }}>{stats.avgHealth}%</strong>
            <span>Avg Health</span>
          </div>
        </div>
      </div>

      <div className="fleet-hero-visual">
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
          {/* Animated Core Ring */}
          <motion.circle 
            cx="200" cy="150" r="100" 
            fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" strokeDasharray="4 8"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{ originX: '200px', originY: '150px' }}
          />
          <motion.circle 
            cx="200" cy="150" r="140" 
            fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="2 12"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            style={{ originX: '200px', originY: '150px' }}
          />

          {/* Central Core */}
          <motion.circle 
            cx="200" cy="150" r="30" 
            fill="rgba(212, 175, 55, 0.1)" stroke="var(--gold)" strokeWidth="2"
            animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 10px rgba(212,175,55,0.2)', '0 0 30px rgba(212,175,55,0.6)', '0 0 10px rgba(212,175,55,0.2)'] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <text x="200" y="154" fill="var(--gold)" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="1">VoltIQ</text>

          {/* Orbiting Nodes */}
          {/* Node 1 - Healthy */}
          <g transform="translate(130, 80)">
            <line x1="0" y1="0" x2="70" y2="70" stroke="var(--color-normal)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
            <motion.circle cx="0" cy="0" r="8" fill="var(--color-normal)" 
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
            />
          </g>

          {/* Node 2 - Warning */}
          <g transform="translate(280, 90)">
            <line x1="0" y1="0" x2="-80" y2="60" stroke="var(--color-warning)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
            <motion.circle cx="0" cy="0" r="6" fill="var(--color-warning)" 
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </g>

          {/* Node 3 - Fault */}
          <g transform="translate(100, 200)">
            <line x1="0" y1="0" x2="100" y2="-50" stroke="var(--color-critical)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
            <motion.circle cx="0" cy="0" r="10" fill="rgba(255, 77, 77, 0.2)" stroke="var(--color-critical)" strokeWidth="2"
              animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
            />
            <circle cx="0" cy="0" r="4" fill="var(--color-critical)" />
          </g>

          {/* Node 4 - Healthy */}
          <g transform="translate(300, 220)">
            <line x1="0" y1="0" x2="-100" y2="-70" stroke="var(--color-normal)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
            <motion.circle cx="0" cy="0" r="6" fill="var(--color-normal)" 
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2.5 }}
            />
          </g>
          
        </svg>
      </div>
    </motion.div>
  );
}
