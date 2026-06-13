import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Crosshair } from 'lucide-react';

export default function FleetHealthRadar({ fleetData }) {
  
  // Transform fleet data into a radar shape
  // For demonstration, we'll map the first 6 systems
  const radarData = fleetData.slice(0, 6).map(sys => ({
    name: sys.id,
    health: sys.health,
    fullMark: 100,
  }));

  return (
    <motion.div 
      className="sys-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="sys-card-header">
        <h2 className="sys-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crosshair size={18} style={{ color: 'var(--gold)' }} />
          Fleet Health Radar
        </h2>
      </div>

      <div style={{ width: '100%', height: '300px', position: 'relative' }}>
        
        {/* Animated Radar Sweep */}
        <motion.div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '150px',
            height: '150px',
            background: 'conic-gradient(from 0deg, transparent 70%, rgba(212, 175, 55, 0.1) 95%, rgba(212, 175, 55, 0.4) 100%)',
            borderRadius: '50%',
            transformOrigin: '0 0',
            zIndex: 1,
            pointerEvents: 'none'
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />

        <div style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#a8b5ae', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="System Health" dataKey="health" stroke="var(--gold)" fill="var(--gold)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
