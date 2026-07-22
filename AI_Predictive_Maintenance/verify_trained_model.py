#!/usr/bin/env python3
"""
Verification Script for Real Trained Model (v3.0+)

Run this AFTER you have executed train_real_pipeline.py successfully.

It will:
- Load the latest (or specified) model + scaler
- Pick 5 samples from the test set (or provided CSV)
- Run predict + predict_proba
- Print results with probabilities

Usage:
    python verify_trained_model.py --artifacts-dir artifacts/v3.0-20240614-1200
    # or point to your latest run
"""

import os
import sys
import argparse
import json
import joblib
import pandas as pd
import numpy as np

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--artifacts-dir", required=True, help="Path to the artifacts/vX.Y-... folder")
    parser.add_argument("--test-samples", default=5, type=int)
    args = parser.parse_args()

    artifacts_dir = args.artifacts_dir

    model_path = os.path.join(artifacts_dir, "model.joblib")
    scaler_path = os.path.join(artifacts_dir, "scaler.joblib")
    pipeline_path = os.path.join(artifacts_dir, "feature_pipeline.json")
    metrics_path = os.path.join(artifacts_dir, "metrics.json")

    for p in [model_path, scaler_path, pipeline_path]:
        if not os.path.exists(p):
            print(f"ERROR: Missing {p}. Did you run train_real_pipeline.py?")
            sys.exit(1)

    print(f"Loading real artifacts from: {artifacts_dir}")

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    with open(pipeline_path) as f:
        pipeline = json.load(f)

    feature_cols = pipeline["feature_cols"]
    print(f"Model type: {type(model).__name__}")
    print(f"Expected features: {len(feature_cols)}")

    # For verification we need some test data. Use the original dataset for demo
    # In real use, you would load a proper held-out test CSV
    base_csv = os.path.join(os.path.dirname(artifacts_dir), "..", "converted_dataset.csv")
    if not os.path.exists(base_csv):
        base_csv = "converted_dataset.csv"  # try current dir

    if os.path.exists(base_csv):
        df = pd.read_csv(base_csv)
        print(f"Using data from {base_csv} for verification samples")
        # Quick engineer (same as training script)
        df["powerEst"] = df["VDC"] * df["IDC"]
        df["currentImbalance"] = (df["Ia"] - df["Ib"]).abs()
        df["avgTemp"] = df[["T1","T2","T3"]].mean(axis=1)
        df["deltaT"] = df[["T1","T2","T3"]].max(axis=1) - df[["T1","T2","T3"]].min(axis=1)
        df["voltageDropPct"] = np.where(df["VDC"].abs() > 5, (df["VD"].abs() / df["VDC"].abs()) * 100, 0)
        df["tempRiseHigh"] = (df["deltaT"] > 12).astype(int)
        df["highCurrent"] = (df[["Ia","Ib","IDC"]].abs().max(axis=1) > 15).astype(int)

        X = df[feature_cols].fillna(0).values
        # Take last N rows as "test-like"
        samples = X[-args.test_samples:]
        probs = model.predict_proba(scaler.transform(samples))
        preds = model.predict(scaler.transform(samples))

        print(f"\n=== Verification: Predicting on {args.test_samples} samples ===")
        for i in range(len(samples)):
            print(f"Sample {i+1}: Predicted={preds[i]}, Probs={np.round(probs[i], 3)}")
    else:
        print("Could not find dataset for sample verification. Provide --test-csv in future runs.")
        # Fallback: random
        dummy = np.random.randn(args.test_samples, len(feature_cols))
        probs = model.predict_proba(scaler.transform(dummy))
        print("Dummy verification (no real test data found):")
        print(probs)

    print("\nVerification complete. If you see reasonable probabilities above, the real model is working.")

if __name__ == "__main__":
    main()