import { motion } from 'framer-motion';
import { Send, Smartphone, Mail, Globe } from 'lucide-react';

export default function NotificationRoutingCommand() {
  const routes = [
    { name: "In-App Push", icon: <Globe size={16} />, status: "Active", pending: 0, success: "100%", color: "var(--color-normal)" },
    { name: "SMS / Mobile", icon: <Smartphone size={16} />, status: "Active", pending: 2, success: "98.5%", color: "var(--color-normal)" },
    { name: "Email Alert", icon: <Mail size={16} />, status: "Delayed", pending: 15, success: "82%", color: "var(--color-warning)" }
  ];

  return (
    <motion.div 
      className="mission-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{ marginTop: '32px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <Send size={18} color="var(--gold)" />
        <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Notification Routing Command</h3>
      </div>

      <div className="al-grid-3">
        {routes.map(route => (
          <div key={route.name} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.05)`, borderLeft: `2px solid ${route.color}`, padding: '16px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                {route.icon} <strong style={{ fontSize: '14px' }}>{route.name}</strong>
              </div>
              <span className={`sla-badge ${route.status === 'Active' ? 'sla-normal' : 'sla-at-risk'}`}>{route.status}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase' }}>Pending</span>
                <strong style={{ fontSize: '18px', color: route.pending > 10 ? 'var(--color-warning)' : '#fff' }}>{route.pending}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '10px', color: '#a8b5ae', textTransform: 'uppercase' }}>Success Rate</span>
                <strong style={{ fontSize: '18px', color: '#fff' }}>{route.success}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
