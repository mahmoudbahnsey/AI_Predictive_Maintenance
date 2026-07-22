import { motion } from 'framer-motion';
import { Save, RefreshCcw, Eye, AlertTriangle } from 'lucide-react';

export default function UnsavedChangesReviewBar({ onSave, onDiscard, onReview }) {
  return (
    <motion.div 
      className="cfg-unsaved-bar"
      initial={{ opacity: 0, y: 80, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
    >
      {/* Left: brand-aligned accent + message (counter removed) */}
      <div className="cfg-unsaved-bar__left">
        <div className="cfg-unsaved-bar__icon">
          <AlertTriangle size={18} />
        </div>
        <div className="cfg-unsaved-bar__text">
          <div className="cfg-unsaved-bar__title">
            Unsaved changes
          </div>
          <div className="cfg-unsaved-bar__subtitle">
            Please save your configuration before leaving this page.
          </div>
        </div>
      </div>

      {/* Right: action buttons — completely restyled */}
      <div className="cfg-unsaved-bar__actions">
        <button 
          type="button" 
          className="cfg-bar-btn cfg-bar-btn--ghost" 
          onClick={onDiscard}
        >
          <RefreshCcw size={15} />
          <span>Discard</span>
        </button>

        <button 
          type="button" 
          className="cfg-bar-btn cfg-bar-btn--outline" 
          onClick={onReview} 
          disabled={!onReview}
        >
          <Eye size={15} />
          <span>Review</span>
        </button>

        <button 
          type="button" 
          className="cfg-bar-btn cfg-bar-btn--primary" 
          onClick={onSave}
        >
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>
    </motion.div>
  );
}
