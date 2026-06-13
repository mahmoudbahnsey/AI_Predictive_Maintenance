import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity } from 'lucide-react';

const mockPowerData = [
  { time: '08:00', power: 200 },
  { time: '09:00', power: 450 },
  { time: '10:00', power: 600 },
  { time: '11:00', power: 850 },
  { time: '12:00', power: 1000 },
  { time: '13:00', power: 980 },
  { time: '14:00', power: 750 },
];

const mockFaultDist = [
  { name: 'F0', count: 1200 },
  { name: 'F1', count: 45 },
  { name: 'F3', count: 12 },
  { name: 'F7', count: 2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(12, 17, 14, 0.9)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '8px 12px', borderRadius: '4px', color: '#fff' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#a8b5ae' }}>{label}</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>
          {payload[0].value} {payload[0].name === 'power' ? 'W' : 'Rows'}
        </p>
      </div>
    );
  }
  return null;
};

export default function PerformanceIntelligence({ powerData = mockPowerData, faultDist = mockFaultDist }) {
  return (
    <motion.div 
      className="cc-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div className="telemetry-panel-header" style={{ marginBottom: '8px' }}>
        <h2><Activity size={24} style={{ color: 'var(--gold)' }} /> Performance Intelligence</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Peak Power</span>
          <strong style={{ display: 'block', fontSize: '22px', color: '#fff', fontFamily: 'monospace', marginTop: '4px' }}>1,000 W</strong>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Output</span>
          <strong style={{ display: 'block', fontSize: '22px', color: '#fff', fontFamily: 'monospace', marginTop: '4px' }}>690 W</strong>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Class</span>
          <strong style={{ display: 'block', fontSize: '22px', color: 'var(--color-normal)', fontFamily: 'monospace', marginTop: '4px' }}>F0</strong>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '11px', color: '#a8b5ae', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fault Rate</span>
          <strong style={{ display: 'block', fontSize: '22px', color: '#fff', fontFamily: 'monospace', marginTop: '4px' }}>4.8%</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', flex: 1, minHeight: '260px' }}>
        
        {/* Power Trend */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: '#a8b5ae', marginBottom: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Power Output Trend (W)</span>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#5a6b63" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#5a6b63" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="power" stroke="var(--gold)" strokeWidth={2} fillOpacity={1} fill="url(#colorPower)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fault Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: '#a8b5ae', marginBottom: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>AI Class Distribution</span>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faultDist} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#5a6b63" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#5a6b63" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" fill="var(--color-normal)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
