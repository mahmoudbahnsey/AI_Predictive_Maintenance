import { BasePredictor, PredictionSource } from './PredictorInterface';

/**
 * RealModelPredictor
 * 
 * Placeholder / Adapter for the future production model (LightGBM served from backend).
 * 
 * When a real model is available:
 *   - This class will call a backend endpoint (POST /predict)
 *   - It will receive the standardized response defined in prediction_contract.json
 * 
 * For now it throws / returns a clear "not available" signal so the system
 * can fall back to the Rule-Based predictor.
 */
export class RealModelPredictor extends BasePredictor {
  constructor() {
    super();
    this.modelVersion = "not-loaded";
    this.modelType = "LightGBM";
    this.isRealModel = false;
  }

  /**
   * @param {import('./PredictorInterface').TelemetryRow[]} rows
   * @returns {import('./PredictorInterface').PredictionResult}
   */
  predict(rows) {
    // In the future this will do:
    // 1. Compute engineered features using the exact schema from the contract
    // 2. POST to backend /predict with the rows
    // 3. Return the response (which must match the contract)

    throw new Error(
      "RealModelPredictor is not connected yet. " +
      "A real trained model (model.joblib) must be served from a backend first. " +
      "Falling back to Rule-Based predictor."
    );
  }

  getModelInfo() {
    return {
      modelVersion: this.modelVersion,
      modelType: this.modelType,
      predictionSource: PredictionSource.REAL_LIGHTGBM,
      isRealModel: this.isRealModel,
      artifactChecksum: null,
      status: "NOT_LOADED"
    };
  }
}
