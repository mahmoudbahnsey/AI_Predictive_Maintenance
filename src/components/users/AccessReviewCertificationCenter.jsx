import { motion } from 'framer-motion';
import { FileCheck } from 'lucide-react';

export default function AccessReviewCertificationCenter() {
  return (
    <motion.div className="idt-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <h2 className="idt-title">
        <FileCheck size={20} color="#a8b5ae" /> Access Review & Certification
      </h2>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '4px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '24px', color: '#fff', margin: '0 0 8px 0' }}>7 Users Due</h3>
        <p style={{ fontSize: '13px', color: '#a8b5ae', margin: '0 0 24px 0' }}>Quarterly identity access review is currently pending.</p>
        <button className="interactive-btn" style={{ background: 'var(--color-normal)', color: '#000', fontWeight: 'bold', padding: '10px 24px', fontSize: '13px' }}>
          Start Access Certification
        </button>
      </div>
    </motion.div>
  );
}
