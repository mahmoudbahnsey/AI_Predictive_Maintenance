#!/usr/bin/env python3
"""
VoltIQ Real AI Training Pipeline - Production Grade
===================================================

This script performs REAL supervised training on labeled inverter telemetry data.

Requirements (install once):
    pip install pandas numpy scikit-learn joblib
    # Optional for stronger model:
    pip install lightgbm xgboost

Usage (local or Colab):
    cd AI_Predictive_Maintenance
    python train_real_pipeline.py --version 3.0

It will:
- Load labeled data (must have FDD / Fault_Class column)
- Compute engineered features (powerEst, currentImbalance, deltaT, voltageDropPct, avgTemp, tempRise indicators)
- Proper stratified train / val / test split (unseen test)
- Class balancing
- Train strong model (LightGBM > XGBoost > GradientBoosting fallback)
- Full evaluation with per-class metrics
- Compare to a simple baseline for "before/after F7 bias"
- Save ALL artifacts under artifacts/v{version}-{date}/
- Generate model_card.md, metrics, confusion matrix, feature_schema, etc.

This is the ONLY real training. The React UI training is marked as Simulation.

After running, copy the metrics and model_card into your docs or UI notes.
To use the model for inference in production, load the .joblib + scaler + feature list.
"""

import os
import sys
import json
import argparse
import warnings
from datetime import datetime
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import (accuracy_score, classification_report, confusion_matrix,
                             precision_recall_fscore_support, f1_score)
import joblib

# Try stronger boosters
try:
    import lightgbm as lgb
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False

try:
    import xgboost as xgb
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "converted_dataset.csv")

# Colab-friendly: if running in Colab and file not found, try /content or upload prompt
if not os.path.exists(DATA_PATH):
    if 'google.colab' in sys.modules:
        print("Running in Colab - attempting to find or prompt for dataset...")
        # Try common Colab locations
        for candidate in ["/content/converted_dataset.csv", "/content/AI_Predictive_Maintenance/converted_dataset.csv"]:
            if os.path.exists(candidate):
                DATA_PATH = candidate
                break
        else:
            from google.colab import files
            print("Please upload converted_dataset.csv")
            uploaded = files.upload()
            DATA_PATH = list(uploaded.keys())[0]

ARTIFACTS_ROOT = os.path.join(BASE_DIR, "artifacts")

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Real engineered features as specified."""
    df = df.copy()
    # Core raw
    for col in ["Ia", "Ib", "VDC", "IDC", "T1", "T2", "T3", "VD"]:
        if col not in df.columns:
            df[col] = np.nan

    # Engineered
    df["powerEst"] = df["VDC"] * df["IDC"]
    df["currentImbalance"] = (df["Ia"] - df["Ib"]).abs()
    df["avgTemp"] = df[["T1", "T2", "T3"]].mean(axis=1)
    df["deltaT"] = df[["T1", "T2", "T3"]].max(axis=1) - df[["T1", "T2", "T3"]].min(axis=1)
    df["voltageDropPct"] = np.where(
        df["VDC"].abs() > 5,
        (df["VD"].abs() / df["VDC"].abs()) * 100,
        0.0
    )
    # Temp rise indicators (simple, can be extended with rolling if time series)
    df["tempRiseHigh"] = (df["deltaT"] > 12).astype(int)
    df["highCurrent"] = (df[["Ia", "Ib", "IDC"]].abs().max(axis=1) > 15).astype(int)

    return df

def load_and_prepare_data():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}. Place converted_dataset.csv in AI_Predictive_Maintenance/")

    df = pd.read_csv(DATA_PATH)
    df.columns = [c.strip() for c in df.columns]

    # Find label column
    label_col = None
    for cand in ["FDD", "Fault", "Fault_Class", "Class", "label", "Label"]:
        if cand in df.columns:
            label_col = cand
            break

    if label_col is None:
        raise ValueError("No label column (FDD / Fault_Class etc.) found. This pipeline requires labeled data for supervised training.")

    # Engineer features
    df = engineer_features(df)

    feature_cols = ["Ia", "Ib", "VDC", "IDC", "T1", "T2", "T3", "VD",
                    "powerEst", "currentImbalance", "avgTemp", "deltaT",
                    "voltageDropPct", "tempRiseHigh", "highCurrent"]

    X = df[feature_cols].fillna(0).values
    y = df[label_col].astype(str).values

    # Encode labels
    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    print(f"Loaded {len(df)} rows")
    print(f"Label column: {label_col}")
    print(f"Classes: {list(le.classes_)}")
    print(f"Engineered features: {feature_cols}")

    return X, y_enc, le, feature_cols, label_col, df

def train_strong_model(X_train, y_train, X_val, y_val, feature_cols):
    """Train the strongest available model."""
    if HAS_LGBM:
        print("Training LightGBM (preferred)...")
        model = lgb.LGBMClassifier(
            n_estimators=300,
            learning_rate=0.05,
            num_leaves=31,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        )
        model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
        model_type = "LightGBM"
    elif HAS_XGB:
        print("Training XGBoost...")
        model = xgb.XGBClassifier(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=6,
            objective="multi:softprob",
            num_class=len(np.unique(y_train)),
            use_label_encoder=False,
            eval_metric="mlogloss",
            random_state=42,
        )
        model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
        model_type = "XGBoost"
    else:
        print("Falling back to sklearn GradientBoostingClassifier...")
        model = GradientBoostingClassifier(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=5,
            random_state=42,
        )
        model.fit(X_train, y_train)
        model_type = "GradientBoosting (sklearn)"

    return model, model_type

def evaluate(y_true, y_pred, le, prefix=""):
    acc = accuracy_score(y_true, y_pred)
    print(f"\n{prefix}Accuracy: {acc:.4f}")

    report = classification_report(y_true, y_pred, target_names=le.classes_, output_dict=True, zero_division=0)
    print(classification_report(y_true, y_pred, target_names=le.classes_, zero_division=0))

    prec, rec, f1, sup = precision_recall_fscore_support(y_true, y_pred, average=None, labels=range(len(le.classes_)))

    per_class = {}
    for i, cls in enumerate(le.classes_):
        per_class[cls] = {
            "precision": float(prec[i]),
            "recall": float(rec[i]),
            "f1": float(f1[i]),
            "support": int(sup[i]),
        }

    cm = confusion_matrix(y_true, y_pred, labels=range(len(le.classes_)))

    # F7 specific (if exists)
    f7_idx = None
    for i, cls in enumerate(le.classes_):
        if str(cls).upper() == "F7":
            f7_idx = i
            break

    f7_stats = {}
    if f7_idx is not None:
        f7_stats["F7_recall"] = float(rec[f7_idx])
        # False positive rate for F7: predicted F7 but true not F7 / all not F7
        total_not_f7 = (y_true != f7_idx).sum()
        fp_f7 = ((y_pred == f7_idx) & (y_true != f7_idx)).sum()
        f7_stats["F7_false_positive_rate"] = float(fp_f7 / max(total_not_f7, 1))
        f7_stats["F7_support"] = int(sup[f7_idx])

    # Healthy (F0) precision
    f0_idx = None
    for i, cls in enumerate(le.classes_):
        if str(cls).upper() == "F0":
            f0_idx = i
            break
    healthy_precision = float(prec[f0_idx]) if f0_idx is not None else None

    # Overall false alarm (any fault predicted when F0)
    false_alarm = ((y_pred != f0_idx) & (y_true == f0_idx)).sum() / max((y_true == f0_idx).sum(), 1) if f0_idx is not None else None

    # Missed fault rate (F0 predicted when fault)
    missed_fault = ((y_pred == f0_idx) & (y_true != f0_idx)).sum() / max((y_true != f0_idx).sum(), 1) if f0_idx is not None else None

    return {
        "accuracy": float(acc),
        "per_class": per_class,
        "f7_stats": f7_stats,
        "healthy_precision": healthy_precision,
        "false_alarm_rate": float(false_alarm) if false_alarm is not None else None,
        "missed_fault_rate": float(missed_fault) if missed_fault is not None else None,
        "confusion_matrix": cm.tolist(),
        "class_names": list(le.classes_),
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", default="3.0", help="Model version, e.g. 3.0")
    args = parser.parse_args()

    version = args.version
    run_date = datetime.now().strftime("%Y%m%d-%H%M")
    out_dir = os.path.join(ARTIFACTS_ROOT, f"v{version}-{run_date}")
    os.makedirs(out_dir, exist_ok=True)

    print("=" * 70)
    print(f"VOLTIQ REAL TRAINING PIPELINE v{version}")
    print(f"Output dir: {out_dir}")
    print("=" * 70)

    X, y, le, feature_cols, label_col, df = load_and_prepare_data()

    # Stratified splits (train 70%, val 15%, test 15%)
    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y, test_size=0.15, stratify=y, random_state=42
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=0.1765, stratify=y_temp, random_state=42  # ~15% of original
    )

    print(f"\nSplits: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)} (stratified, unseen test)")

    # Scale
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_val_s = scaler.transform(X_val)
    X_test_s = scaler.transform(X_test)

    # Train strong model
    strong_model, model_type = train_strong_model(X_train_s, y_train, X_val_s, y_val, feature_cols)

    # Evaluate on unseen test
    y_pred_strong = strong_model.predict(X_test_s)
    strong_metrics = evaluate(y_test, y_pred_strong, le, prefix="Strong Model (Test) ")

    # Baseline (simple RF without engineered features or balancing) for before/after
    print("\n--- Baseline (simple RandomForest on raw features only) ---")
    baseline = RandomForestClassifier(n_estimators=100, random_state=42, class_weight=None)
    baseline.fit(X_train[:, :8], y_train)  # only raw 8 features
    y_pred_base = baseline.predict(X_test[:, :8])
    baseline_metrics = evaluate(y_test, y_pred_base, le, prefix="Baseline (Test) ")

    # F7 bias comparison
    f7_before = baseline_metrics["f7_stats"].get("F7_recall", 0)
    f7_after = strong_metrics["f7_stats"].get("F7_recall", 0)
    print(f"\nF7 Recall improvement: {f7_before*100:.1f}% -> {f7_after*100:.1f}%")

    # Save artifacts
    joblib.dump(strong_model, os.path.join(out_dir, "model.joblib"))
    joblib.dump(scaler, os.path.join(out_dir, "scaler.joblib"))

    feature_pipeline = {
        "feature_cols": feature_cols,
        "engineered": ["powerEst", "currentImbalance", "avgTemp", "deltaT", "voltageDropPct", "tempRiseHigh", "highCurrent"],
        "label_encoder": list(le.classes_),
        "original_label_col": label_col,
    }
    with open(os.path.join(out_dir, "feature_pipeline.json"), "w") as f:
        json.dump(feature_pipeline, f, indent=2)

    with open(os.path.join(out_dir, "metrics.json"), "w") as f:
        json.dump({
            "version": version,
            "run_date": run_date,
            "model_type": model_type,
            "n_train": len(X_train),
            "n_val": len(X_val),
            "n_test": len(X_test),
            "strong": strong_metrics,
            "baseline": baseline_metrics,
            "f7_bias_before_after": {
                "before_recall": f7_before,
                "after_recall": f7_after,
            }
        }, f, indent=2)

    # Confusion matrices
    with open(os.path.join(out_dir, "confusion_matrix_strong.json"), "w") as f:
        json.dump({"matrix": strong_metrics["confusion_matrix"], "classes": strong_metrics["class_names"]}, f, indent=2)

    with open(os.path.join(out_dir, "class_report_strong.json"), "w") as f:
        json.dump(strong_metrics["per_class"], f, indent=2)

    # Feature schema
    schema = {
        "raw_features": ["Ia", "Ib", "VDC", "IDC", "T1", "T2", "T3", "VD"],
        "engineered_features": feature_cols[8:],
        "required_for_inference": feature_cols,
    }
    with open(os.path.join(out_dir, "feature_schema.json"), "w") as f:
        json.dump(schema, f, indent=2)

    # Model card
    card = f"""# VoltIQ Model Card - v{version}

**Training Date:** {run_date}
**Model Type:** {model_type}
**Dataset:** converted_dataset.csv ({len(df)} rows)
**Labels:** {list(le.classes_)}
**Features:** {len(feature_cols)} (8 raw + 7 engineered)

## Performance on Unseen Test Set
- Accuracy: {strong_metrics['accuracy']:.4f}
- F7 Recall: {strong_metrics['f7_stats'].get('F7_recall', 'N/A')}
- Healthy (F0) Precision: {strong_metrics.get('healthy_precision', 'N/A')}
- False Alarm Rate: {strong_metrics.get('false_alarm_rate', 'N/A')}
- Missed Fault Rate: {strong_metrics.get('missed_fault_rate', 'N/A')}

## Before / After F7 Bias (baseline vs strong)
- Baseline F7 Recall: {f7_before:.3f}
- Strong F7 Recall: {f7_after:.3f}

## Artifacts
- model.joblib
- scaler.joblib
- feature_pipeline.json
- metrics.json
- confusion_matrix_strong.json
- class_report_strong.json
- feature_schema.json

## How to run inference (example)
```python
import joblib
import pandas as pd
model = joblib.load("model.joblib")
scaler = joblib.load("scaler.joblib")
# engineer features the same way, scale, predict
```

**Note:** This model was trained only on labeled data. For unlabeled inverter exports, run anomaly detection separately.
"""
    with open(os.path.join(out_dir, "model_card.md"), "w", encoding="utf-8") as f:
        f.write(card)

    # Registry entry
    registry_entry = {
        "version": f"v{version}",
        "date": run_date,
        "dataset_rows": len(df),
        "feature_count": len(feature_cols),
        "model_type": model_type,
        "artifact_dir": out_dir,
        "metrics_summary": {
            "accuracy": strong_metrics["accuracy"],
            "f7_recall": strong_metrics["f7_stats"].get("F7_recall"),
            "healthy_precision": strong_metrics.get("healthy_precision"),
        },
        "rollback_to": "v2.1"  # example
    }
    with open(os.path.join(out_dir, "registry_entry.json"), "w") as f:
        json.dump(registry_entry, f, indent=2)

    print("\n" + "=" * 70)
    print("REAL TRAINING COMPLETE")
    print(f"All artifacts saved to: {out_dir}")
    print("Key files:")
    for fname in ["model.joblib", "scaler.joblib", "metrics.json", "model_card.md", "confusion_matrix_strong.json"]:
        print(f"  - {fname}")
    print("=" * 70)
    print("\nTo use in production inference, load the artifacts above.")
    print("Run this script again with --version 3.1 after adding more labeled data.")

if __name__ == "__main__":
    main()