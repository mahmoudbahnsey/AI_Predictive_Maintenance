import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

export default function UserCommandSearchFilters() {
  return (
    <motion.div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Search size={16} color="#a8b5ae" style={{ position: 'absolute', left: '16px', top: '12px' }} />
        <input type="text" className="cfg-input" placeholder="Search by name, email, or ID..." style={{ paddingLeft: '40px' }} />
      </div>
      
      <select className="cfg-input" style={{ width: '200px' }} defaultValue="All Roles">
        <option>All Roles</option>
        <option>Administrators</option>
        <option>Operators</option>
        <option>Viewers</option>
      </select>

      <select className="cfg-input" style={{ width: '200px' }} defaultValue="All Status">
        <option>All Status</option>
        <option>Active</option>
        <option>Suspended</option>
        <option>Review Required</option>
      </select>

      <button className="interactive-btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Filter size={16} /> Advanced
      </button>
    </motion.div>
  );
}
