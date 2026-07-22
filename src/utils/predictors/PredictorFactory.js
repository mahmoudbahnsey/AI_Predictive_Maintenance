import { RuleBasedPredictor } from './RuleBasedPredictor';
import { RealModelPredictor } from './RealModelPredictor';

/**
 * PredictorFactory
 * 
 * Central place to decide which predictor to use.
 * 
 * Current policy:
 * - Always return RuleBasedPredictor (demo/fallback)
 * - RealModelPredictor will be enabled later once a real backend model is served.
 * 
 * This makes it trivial to switch in the future without touching many files.
 */
let currentPredictor = null;

export function getPredictor() {
  if (!currentPredictor) {
    // TODO: In the future, check if real model is available (e.g. from config or backend health)
    // For now we force the honest fallback.
    currentPredictor = new RuleBasedPredictor();
  }
  return currentPredictor;
}

/**
 * Force use of real model adapter (for testing / future activation).
 * Will throw until the real backend is ready.
 */
export function useRealModelPredictor() {
  currentPredictor = new RealModelPredictor();
  return currentPredictor;
}

export function resetToRuleBased() {
  currentPredictor = new RuleBasedPredictor();
}
