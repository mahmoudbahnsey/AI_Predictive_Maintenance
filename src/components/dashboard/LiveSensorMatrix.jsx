import { motion } from 'framer-motion';
import { Zap, Activity, Gauge, Thermometer } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function LiveSensorMatrix({ sensors }) {
  // sensors: { voltage, current, power, temperature }
  
  const cards = [
    { id: 'v', icon: Zap, label: 'Grid Voltage', value: sensors.voltage, unit: 'V', color: '#e3ebe7' },
    { id: 'i', icon: Activity, label: 'Output Current', value: sensors.current, unit: 'A', color: '#e3ebe7' },
    { id: 'p', icon: Gauge, label: 'Active Power', value: sensors.power, unit: 'W', color: 'var(--gold)' },
    { id: 't', icon: Thermometer, label: 'Inverter Temp', value: sensors.temperature, unit: '°C', color: sensors.temperature > 60 ? 'var(--color-critical)' : '#e3ebe7' },
  ];

  return (
    <div className="sensor-matrix-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div 
            key={card.id}
            className="matrix-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: 0.2 + (idx * 0.1) }}
            whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', borderColor: 'rgba(212, 175, 55, 0.3)' }}
          >
            <div className="matrix-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icon size={16} style={{ color: 'var(--gold)' }} /> {card.label}</span>
              <motion.div 
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-normal)' }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: idx * 0.5 }}
              />
            </div>
            
            <div className="matrix-value" style={{ color: card.color }}>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={card.value} // re-animate slightly when value changes if we wanted to
              >
                {card.value}
              </motion.span>
              <span style={{ fontSize: '14px', color: '#a8b5ae', marginLeft: '4px' }}>{card.unit}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
