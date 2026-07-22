import { motion } from 'framer-motion';
import { Server, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function FleetKpiMatrix({ stats }) {

  const kpis = [
    { label: 'Total Systems', value: stats.total, icon: Server, color: '#e3ebe7', border: 'rgba(255,255,255,0.1)' },
    { label: 'Healthy / Online', value: stats.online, icon: CheckCircle, color: 'var(--color-normal)', border: 'rgba(67, 160, 71, 0.3)' },
    { label: 'Warning State', value: stats.warning, icon: AlertTriangle, color: 'var(--color-warning)', border: 'rgba(255, 179, 0, 0.3)' },
    { label: 'Critical Fault', value: stats.fault, icon: ShieldAlert, color: 'var(--color-critical)', border: 'rgba(255, 77, 77, 0.3)' },
  ];

  return (
    <motion.div 
      className="sys-grid-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <motion.div 
            key={index}
            className="sys-card"
            variants={itemVariants}
            style={{ borderTop: `2px solid ${kpi.border}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#a8b5ae', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {kpi.label}
              </span>
              <Icon size={18} style={{ color: kpi.color }} />
            </div>
            <strong style={{ fontSize: '36px', color: '#fff', fontFamily: 'monospace' }}>
              {kpi.value}
            </strong>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
