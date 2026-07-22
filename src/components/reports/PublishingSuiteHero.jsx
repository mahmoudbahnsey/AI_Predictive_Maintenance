import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { loadTelemetryAnalysis } from '../../utils/faultAnalyzer';

export default function PublishingSuiteHero() {
  const [analysis, setAnalysis] = useState(() => loadTelemetryAnalysis());

  useEffect(() => {
    const refreshAnalysis = () => setAnalysis(loadTelemetryAnalysis());
    window.addEventListener('storage', refreshAnalysis);
    window.addEventListener('voltiq-analysis-updated', refreshAnalysis);
    return () => {
      window.removeEventListener('storage', refreshAnalysis);
      window.removeEventListener('voltiq-analysis-updated', refreshAnalysis);
    };
  }, []);

  const generated = 8420 + (analysis?.validRows || 0) * 2;
  const pdfs = 6241 + (analysis?.validRows || 0);
  const scheduled = 14 + (analysis?.alerts?.length || 0);
  const dataCoverage = analysis?.healthyRate ? `${analysis.healthyRate}%` : '99.8%';

  return (
    <motion.div 
      className="pub-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ padding: '40px', background: 'rgba(5,5,5,1)', borderBottom: '2px solid var(--gold)' }}
    >
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-1px', color: '#fff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BookOpen size={40} color="var(--gold)" />
          Executive Publishing Suite
        </h1>
        <p style={{ color: '#a8b5ae', fontSize: '14px', maxWidth: '750px', margin: 0, lineHeight: 1.6 }}>
          Generate, preview, schedule, export, and archive boardroom-ready VoltIQ reports powered by AI insights, verified data, and operational intelligence.
        </p>
      </div>

      <div className="pub-grid-4" style={{ position: 'relative', zIndex: 10, marginTop: '40px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--color-normal)' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', letterSpacing: '1px', marginBottom: '8px' }}>Generated Reports</span>
          <strong style={{ fontSize: '32px', color: '#fff', fontFamily: 'monospace' }}>{generated.toLocaleString()}</strong>
        </div>
        <div style={{ background: 'rgba(212,175,55,0.05)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--gold)' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '1px', marginBottom: '8px' }}>Exported PDFs</span>
          <strong style={{ fontSize: '32px', color: 'var(--gold)', fontFamily: 'monospace' }}>{pdfs.toLocaleString()}</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid #5a6b63' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', letterSpacing: '1px', marginBottom: '8px' }}>Scheduled Delivery</span>
          <strong style={{ fontSize: '32px', color: '#fff', fontFamily: 'monospace' }}>{scheduled}</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', borderLeft: '2px solid var(--color-warning)' }}>
          <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#a8b5ae', letterSpacing: '1px', marginBottom: '8px' }}>Data Coverage</span>
          <strong style={{ fontSize: '32px', color: '#fff', fontFamily: 'monospace' }}>{dataCoverage}</strong>
        </div>
      </div>
      
    </motion.div>
  );
}
