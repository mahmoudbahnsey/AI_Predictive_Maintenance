import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { mockPermissionCategories } from '../../data/mockUsersData';

export default function ZeroTrustPermissionMatrix({ onShowSimulator }) {
  const [expandedCats, setExpandedCats] = useState([mockPermissionCategories[0].name]);

  const toggleCat = (name) => {
    setExpandedCats(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const getCellClass = (val) => {
    if (val === 'Allowed') return 'matrix-cell-allowed';
    if (val === 'Blocked') return 'matrix-cell-blocked';
    if (val === 'Review Required') return 'matrix-cell-review';
    return '';
  };

  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="idt-title" style={{ margin: 0 }}>
          <Lock size={20} color="var(--gold)" /> Zero-Trust Permission Matrix
        </h2>
        <button className="interactive-btn" onClick={onShowSimulator} style={{ background: 'var(--gold)', color: '#000', fontWeight: 'bold', padding: '8px 16px', fontSize: '12px' }}>
          Simulate Changes
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '800px' }}>
          {mockPermissionCategories.map((cat, i) => {
            const isExpanded = expandedCats.includes(cat.name);
            return (
              <div key={i} className="idt-matrix-category">
                <div className="idt-matrix-header" onClick={() => toggleCat(cat.name)}>
                  <strong style={{ color: '#fff', fontSize: '14px' }}>{cat.name}</strong>
                  {isExpanded ? <ChevronDown size={16} color="#a8b5ae" /> : <ChevronRight size={16} color="#a8b5ae" />}
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                      <table className="idt-matrix-table">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>Permission</th>
                            <th>Administrator</th>
                            <th>Operator</th>
                            <th>Viewer</th>
                            <th>Guest</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.permissions.map((p, j) => (
                            <tr key={j} style={{ background: 'rgba(0,0,0,0.2)' }}>
                              <td style={{ color: '#fff', fontWeight: 'bold' }}>{p.name}</td>
                              <td className="matrix-cell-admin">{p.admin}</td>
                              <td className={getCellClass(p.operator)}>{p.operator}</td>
                              <td className={getCellClass(p.viewer)}>{p.viewer}</td>
                              <td className={getCellClass(p.guest)}>{p.guest}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
