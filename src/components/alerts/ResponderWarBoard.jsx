import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function ResponderWarBoard() {
  const teams = [
    { name: "Ops Team", status: "Available", load: 20, active: 3 },
    { name: "Maintenance", status: "Overloaded", load: 95, active: 12 },
    { name: "Network Team", status: "Available", load: 40, active: 2 }
  ];

  return (
    <motion.div 
      className="mission-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Users size={18} color="#a8b5ae" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Responder War Board</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {teams.map(team => (
          <div key={team.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: team.load > 80 ? 'var(--color-critical)' : 'var(--color-normal)' }} />
                <strong style={{ fontSize: '14px', color: '#fff' }}>{team.name}</strong>
              </div>
              <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{team.active} alerts assigned</span>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase' }}>Workload</span>
                <span style={{ fontSize: '10px', color: team.load > 80 ? 'var(--color-critical)' : '#fff' }}>{team.load}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: `${team.load}%`, height: '100%', background: team.load > 80 ? 'var(--color-critical)' : 'var(--color-normal)', borderRadius: '2px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
