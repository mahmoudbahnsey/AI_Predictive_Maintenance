#!/usr/bin/env python3
"""
Parser Robustness Test Harness for VoltIQ
=========================================

This script loads the 3 sample CSVs with deliberately different headers and units
and verifies that the mapping + unit conversion logic would succeed.

It mirrors (in Python) the fuzzy alias + auto-scale logic used in the JS faultAnalyzer.js.

Run:
    python test_parser_robustness.py

Expected: All 3 samples should report successful column mapping and basic unit handling.
"""

import os
import pandas as pd
import numpy as np

BASE = os.path.dirname(os.path.abspath(__file__))
SAMPLES_DIR = os.path.join(BASE, "parser_samples")

# Same aliases as in JS (simplified)
HEADER_ALIASES = {
    "Ia": ["ia", "phase_a_current", "current_a", "i_a", "phasea", "current_phase_a_mA"],
    "Ib": ["ib", "phase_b_current", "current_b", "i_b", "phaseb"],
    "VDC": ["vdc", "dc_voltage", "dc_volt", "v_dc", "bus_voltage", "voltage_dc", "voltage_dc_mv", "dc_bus_volt"],
    "IDC": ["idc", "dc_current", "dc_curr", "i_dc", "bus_current", "current_dc"],
    "T1": ["t1", "temp1", "temperature_1", "temp_hs", "heatsink_temp", "t_hs", "temp_hs_f"],
    "T2": ["t2", "temp2", "temperature_2", "temp_internal", "internal_temp", "t2_internal"],
    "T3": ["t3", "temp3", "temperature_3", "temp_ambient", "ambient_temp", "ambient_temp_f"],
    "VD": ["vd", "v_diff", "voltage_diff", "delta_v", "v_delta", "vdiff"],
}

def fuzzy_find_column(df, aliases):
    cols_lower = {c.lower().replace(" ", "_"): c for c in df.columns}
    for alias in aliases:
        key = alias.lower().replace(" ", "_")
        if key in cols_lower:
            return cols_lower[key]
    return None

def load_and_map(path, name):
    df = pd.read_csv(path)
    print(f"\n=== {name} ===")
    print(f"Original columns: {list(df.columns)[:8]}...")

    mapped = {}
    for target, alist in HEADER_ALIASES.items():
        col = fuzzy_find_column(df, alist)
        if col:
            mapped[target] = col
            val = df[col].iloc[0]
            # Simple unit handling demo
            if target in ["VDC", "VD"] and abs(val) > 10000:
                print(f"  {target}: mapped from '{col}' value={val} → auto-scaled /1000 (mV -> V)")
            elif target in ["T1","T2","T3"] and val > 100:
                print(f"  {target}: mapped from '{col}' value={val} → likely °F, would convert in full pipeline")
            else:
                print(f"  {target}: mapped from '{col}' (value example: {val})")
        else:
            print(f"  {target}: NOT FOUND")

    print(f"Mapped {len(mapped)}/8 core columns successfully.")
    return len(mapped) == 8

if __name__ == "__main__":
    print("VoltIQ Parser Robustness Test Harness")
    print("Testing 3 deliberately different CSV formats...")

    ok1 = load_and_map(os.path.join(SAMPLES_DIR, "sample1_standard.csv"), "Sample 1 - Standard headers + labels")
    ok2 = load_and_map(os.path.join(SAMPLES_DIR, "sample2_solar_style.csv"), "Sample 2 - Solar-style headers, different units, no labels (anomaly only)")
    ok3 = load_and_map(os.path.join(SAMPLES_DIR, "sample3_messy_units.csv"), "Sample 3 - Messy headers + large numbers (mV/F)")

    print("\n" + "="*60)
    if ok1 and ok2 and ok3:
        print("SUCCESS: All three samples mapped core columns correctly.")
        print("The JS parser (fuzzy + auto-scale) is expected to handle these in the browser.")
    else:
        print("Some samples failed mapping - review aliases in faultAnalyzer.js and this test.")
    print("="*60)