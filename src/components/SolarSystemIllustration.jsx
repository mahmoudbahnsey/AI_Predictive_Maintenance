import { Zap } from 'lucide-react';

export default function SolarSystemIllustration() {
  const pct = 99.9;

  return (
    <div className="au-illustration-container">
      {/* ── CINEMATIC BACKGROUND SVG ── */}
      <svg className="au-illustration-svg" viewBox="0 0 580 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldLaserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffd97d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            <animate attributeName="x1" from="-100%" to="100%" dur="5s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0%" to="200%" dur="5s" repeatCount="indefinite" />
          </linearGradient>
          
          <linearGradient id="panelGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd97d" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#d4af37" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#120f0c" stopOpacity="0.6" />
          </linearGradient>

          <filter id="premiumGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Energy Pulse line gradient */}
          <linearGradient id="pulseLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── SUBTLE FLOOR GRID ── */}
        <g stroke="#d4af37" strokeOpacity="0.03" strokeWidth="1">
          <line x1="290" y1="200" x2="290" y2="350" />
          <line x1="290" y1="200" x2="150" y2="350" />
          <line x1="290" y1="200" x2="430" y2="350" />
          <line x1="290" y1="200" x2="10" y2="350" />
          <line x1="290" y1="200" x2="570" y2="350" />
          <line x1="0" y1="230" x2="580" y2="230" strokeOpacity="0.01" />
          <line x1="0" y1="260" x2="580" y2="260" strokeOpacity="0.02" />
          <line x1="0" y1="300" x2="580" y2="300" strokeOpacity="0.04" />
        </g>

        {/* ── ENERGY FLOW LINES (Connecting the system) ── */}
        {/* Central intelligence node */}
        <circle cx="290" cy="180" r="4" fill="#ffd97d" filter="url(#premiumGlow)" className="au-pulse-node" />
        <circle cx="290" cy="180" r="1" fill="#fff" />
        
        {/* Lines from panel to center node */}
        <path d="M 290 100 L 290 180" stroke="url(#pulseLineGrad)" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 4" className="au-energy-flow" />
        
        {/* Lines from center node to cards */}
        <path d="M 290 180 L 150 180" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.15" />
        <path d="M 290 180 L 460 180" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.15" />
        
        {/* Animated laser floor lines */}
        <line x1="40" y1="280" x2="540" y2="280" stroke="url(#goldLaserGrad)" strokeWidth="1.5" filter="url(#premiumGlow)" />

        {/* ── ISOMETRIC 3D SOLAR PANEL ── */}
        <g transform="translate(290, 70) scale(1.15)" className="au-panel-float">
          {/* Shadow */}
          <polygon points="-80,70 80,70 120,100 -40,100" fill="#000" fillOpacity="0.5" filter="blur(10px)" />

          {/* Main glass panel */}
          <polygon 
            points="-60,0 100,0 60,60 -100,60" 
            fill="url(#panelGlassGrad)" 
            stroke="#ffd97d" 
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />
          
          {/* Inner panel lines */}
          <line x1="-80" y1="30" x2="80" y2="30" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="-20" y1="0" x2="-60" y2="60" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="20" y1="0" x2="-20" y2="60" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="60" y1="0" x2="20" y2="60" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
          
          {/* Glowing premium corners */}
          <circle cx="-60" cy="0" r="1.5" fill="#fff" filter="url(#softGlow)" />
          <circle cx="100" cy="0" r="1.5" fill="#fff" filter="url(#softGlow)" />
          <circle cx="60" cy="60" r="1.5" fill="#fff" filter="url(#softGlow)" />
          <circle cx="-100" cy="60" r="1.5" fill="#fff" filter="url(#softGlow)" />
        </g>
      </svg>

      {/* ── SYSTEM POSTURE CARD ── */}
      <div className="au-illustration-card">
        <div className="au-ill-card__ambient" />
        <span className="au-ill-card__title">System Posture</span>
        
        <div className="au-ill-gauge-wrap">
          <svg className="au-ill-gauge-svg" viewBox="0 0 100 60">
            <path d="M 15,50 A 35,35 0 0,1 85,50" fill="none" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="5" strokeLinecap="round" />
            <path 
              d="M 15,50 A 35,35 0 0,1 85,50" 
              fill="none" 
              stroke="#ffd97d" 
              strokeWidth="5" 
              strokeLinecap="round" 
              strokeDasharray="110" 
              strokeDashoffset={110 * (1 - pct / 100)}
              style={{ filter: 'drop-shadow(0 0 6px rgba(255, 217, 125, 0.4))' }}
            />
          </svg>
          <span className="au-ill-gauge-val" style={{ color: '#ffd97d' }}>{pct}%</span>
        </div>

        <span className="au-ill-card__subtitle">Intelligence Active</span>
      </div>

      {/* ── INVERTER UNIT ── */}
      <div className="au-inverter-unit">
        <div className="au-inverter-ambient" />
        <span className="au-inverter-brand">voltiq</span>
        <div className="au-inverter-screen">
          <div className="au-inverter-glow-ring" />
          <Zap size={14} className="au-inverter-icon" />
        </div>
      </div>

      {/* ── POWER CHIPS (Clean Row) ── */}
      <div className="au-chip-row">
        <div className="au-ill-badge au-ill-badge--gold">10.2 kW</div>
        <div className="au-ill-badge au-ill-badge--gold">8.7 kW</div>
        <div className="au-ill-badge au-ill-badge--muted">1.5 kW</div>
      </div>
    </div>
  );
}
