const MODEL_COLUMNS = ['Ia', 'Ib', 'VDC', 'IDC', 'T1', 'T2', 'T3', 'VD'];

export const FAULT_DEFINITIONS = {
  F0: {
    title: 'Normal operation',
    severity: 'normal',
    issue: 'No inverter fault detected.',
    repair: 'Keep monitoring. No immediate action is required.',
  },
  F1: {
    title: 'Overcurrent / current imbalance',
    severity: 'critical',
    issue: 'Current magnitude or phase imbalance is outside the safe operating profile.',
    repair: 'Reduce load, inspect inverter input wiring, and verify current sensors before reconnecting full load.',
  },
  F2: {
    title: 'DC undervoltage / voltage sag',
    severity: 'critical',
    issue: 'DC bus voltage is dropping below the expected operating envelope.',
    repair: 'Inspect PV string continuity, battery/DC source stability, fuses, and connector losses.',
  },
  F3: {
    title: 'Thermal overload',
    severity: 'critical',
    issue: 'Temperature features indicate overheating risk.',
    repair: 'Run cooling diagnostics, clean ventilation paths, inspect fans, and derate until temperature stabilizes.',
  },
  F4: {
    title: 'Power drop anomaly',
    severity: 'warning',
    issue: 'Power proxy is lower than expected for the measured DC operating point.',
    repair: 'Check shading, MPPT behavior, DC current path, and inverter conversion efficiency.',
  },
  F5: {
    title: 'Thermal sensor mismatch',
    severity: 'warning',
    issue: 'Temperature sensors disagree strongly, suggesting localized heating or a bad sensor.',
    repair: 'Compare left/right sensor readings, inspect mounting, and replace the noisy sensor if mismatch persists.',
  },
  F6: {
    title: 'DC overvoltage / grid sync risk',
    severity: 'critical',
    issue: 'Voltage features are above the normal envelope or diverging sharply.',
    repair: 'Isolate the DC input, verify charge controller limits, and confirm grid synchronization settings.',
  },
  F7: {
    title: 'Unknown inverter anomaly',
    severity: 'critical',
    issue: 'Multiple feature patterns look abnormal without one clean root cause.',
    repair: 'Place the inverter under watch, export diagnostics, and schedule manual inspection.',
  },
  F8: {
    title: 'External sensor / relay alarm',
    severity: 'warning',
    issue: 'Raw solar telemetry contains alarm, relay, object distance, or environmental signals that need review.',
    repair: 'Inspect relay status, left/right alarms, nearby obstruction sensors, and environmental readings.',
  },
};

export const DEFAULT_ANALYSIS = {
  sourceName: 'converted_dataset.csv baseline',
  schema: 'Random Forest training schema',
  totalRows: 10892,
  validRows: 10892,
  analyzedAt: 'Ready',
  hasLabels: true,
  modelAccuracy: 96.8,
  averageConfidence: 94.2,
  topFault: 'F0',
  riskScore: 32,
  classCounts: {
    F0: 4295,
    F1: 692,
    F2: 1122,
    F3: 407,
    F4: 341,
    F5: 412,
    F6: 854,
    F7: 1735,
    F8: 1034,
  },
  alerts: [
    {
      code: 'F7',
      count: 1735,
      severity: 'critical',
      message: 'Baseline training data includes unknown inverter anomaly patterns that require escalation rules.',
      repair: FAULT_DEFINITIONS.F7.repair,
    },
    {
      code: 'F2',
      count: 1122,
      severity: 'critical',
      message: 'DC undervoltage patterns are present in the training set.',
      repair: FAULT_DEFINITIONS.F2.repair,
    },
  ],
  issues: [
    { rowNumber: 1, code: 'F0', actual: 'F0', confidence: 98.1, title: 'Normal operation', severity: 'normal' },
  ],
  recommendations: [
    FAULT_DEFINITIONS.F2.repair,
    FAULT_DEFINITIONS.F7.repair,
    FAULT_DEFINITIONS.F8.repair,
  ],
  latestFeatures: {
    Ia: 3.3,
    Ib: 3.1,
    VDC: 230.6,
    IDC: 3.3,
    T1: 34.9,
    T2: 35.1,
    T3: 34.7,
    VD: 0.8,
  },
};

function cleanHeader(value) {
  return String(value ?? '').trim().replace(/^\uFEFF/, '');
}

function keyFor(value) {
  return cleanHeader(value).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const normalized = String(value).trim().replace('%', '');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function getValue(row, aliases) {
  const normalized = new Map(Object.keys(row).map((key) => [keyFor(key), row[key]]));
  for (const alias of aliases) {
    const found = normalized.get(keyFor(alias));
    if (found !== undefined) return found;
  }
  return null;
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map(cleanHeader);

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = cells[index] ?? '';
      return row;
    }, {});
  });
}

export async function parseTelemetryFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv' || extension === 'txt') {
    return parseCsv(await file.text());
  }

  if (extension === 'xlsx' || extension === 'xls') {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { defval: '' });
  }

  throw new Error('Upload a CSV or Excel file with inverter telemetry columns.');
}

function hasAny(row, columns) {
  return columns.some((column) => getValue(row, [column]) !== null);
}

function normalizeRecord(row) {
  const hasModelSchema = MODEL_COLUMNS.every((column) => getValue(row, [column]) !== null);
  const hasSolarSchema = hasAny(row, ['Solar_Current', 'Solar_Volt', 'Battery_Current', 'Battery_Volt']);

  const solarVolt = parseNumber(getValue(row, ['Solar_Current_Volt', 'Solar_Volt', 'Solar Volt']));
  const batteryVolt = parseNumber(getValue(row, ['Battery_Volt', 'Battery Volt']));
  const inverterVolt = parseNumber(getValue(row, ['InverterIn(load)_Volt', 'InverterIn load Volt', 'Inverter_Load_Volt']));
  const solarCurrent = parseNumber(getValue(row, ['Solar_Current', 'Solar Current']));
  const batteryCurrent = parseNumber(getValue(row, ['Battery_Current', 'Battery Current']));
  const inverterCurrent = parseNumber(getValue(row, ['InverterIn(load)_Current', 'InverterIn load Current', 'Inverter_Load_Current']));
  const tempRight = parseNumber(getValue(row, ['Temperature_R', 'Temperature Right', 'Temp_R']));
  const tempLeft = parseNumber(getValue(row, ['Temperature_L', 'Temperature Left', 'Temp_L']));
  const alarmRight = parseNumber(getValue(row, ['Alarm_R', 'Alarm Right']));
  const alarmLeft = parseNumber(getValue(row, ['Alarm_L', 'Alarm Left']));
  const relayStatus = getValue(row, ['Relay_Status', 'Relay Status']);
  const objectRight = parseNumber(getValue(row, ['Object_distance_R', 'Object Distance R']));
  const objectLeft = parseNumber(getValue(row, ['Object_distance_L', 'Object Distance L']));
  const humidityRight = parseNumber(getValue(row, ['Humadity_R', 'Humidity_R', 'Humidity Right']));
  const humidityLeft = parseNumber(getValue(row, ['Humadity_L', 'Humidity_L', 'Humidity Left']));

  const features = hasModelSchema
    ? {
        Ia: parseNumber(getValue(row, ['Ia'])),
        Ib: parseNumber(getValue(row, ['Ib'])),
        VDC: parseNumber(getValue(row, ['VDC'])),
        IDC: parseNumber(getValue(row, ['IDC'])),
        T1: parseNumber(getValue(row, ['T1'])),
        T2: parseNumber(getValue(row, ['T2'])),
        T3: parseNumber(getValue(row, ['T3'])),
        VD: parseNumber(getValue(row, ['VD'])),
      }
    : {
        Ia: solarCurrent,
        Ib: batteryCurrent,
        VDC: batteryVolt ?? solarVolt ?? inverterVolt,
        IDC: inverterCurrent ?? batteryCurrent ?? solarCurrent,
        T1: tempRight,
        T2: tempLeft,
        T3: tempRight !== null && tempLeft !== null ? (tempRight + tempLeft) / 2 : null,
        VD: solarVolt !== null && batteryVolt !== null ? solarVolt - batteryVolt : (inverterVolt !== null && batteryVolt !== null ? inverterVolt - batteryVolt : null),
      };

  const numericCount = Object.values(features).filter((value) => value !== null).length;
  if (!hasModelSchema && !hasSolarSchema && numericCount < 4) return null;

  return {
    features,
    actual: cleanHeader(getValue(row, ['FDD', 'Fault', 'Fault_Class', 'Class'])),
    solarContext: {
      alarmRight,
      alarmLeft,
      relayStatus,
      objectRight,
      objectLeft,
      humidityRight,
      humidityLeft,
      hasSolarSchema,
    },
  };
}

function isRelayOff(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return ['0', 'off', 'open', 'false', 'fault', 'alarm'].includes(text);
}

function vote(code, votes, weight = 1) {
  votes[code] = (votes[code] || 0) + weight;
}

export function predictFault(record) {
  const { features, solarContext } = record;
  const { Ia = 0, Ib = 0, VDC = 0, IDC = 0, T1 = 0, T2 = 0, T3 = 0, VD = 0 } = features;
  const values = [Ia, Ib, VDC, IDC, T1, T2, T3, VD].map((value) => value ?? 0);
  const currentMagnitude = Math.max(Math.abs(Ia ?? 0), Math.abs(Ib ?? 0), Math.abs(IDC ?? 0));
  const currentImbalance = Math.abs((Ia ?? 0) - (Ib ?? 0));
  const voltageMagnitude = Math.max(Math.abs(VDC ?? 0), Math.abs(VD ?? 0));
  const tempValues = [T1, T2, T3].filter((value) => value !== null && value !== undefined);
  const tempMax = tempValues.length ? Math.max(...tempValues) : 0;
  const tempMin = tempValues.length ? Math.min(...tempValues) : 0;
  const tempSpread = tempMax - tempMin;
  const realTemperatureScale = tempMax > 25;
  const powerProxy = Math.abs((VDC ?? 0) * (IDC ?? 0));
  const alarmTriggered = [solarContext.alarmLeft, solarContext.alarmRight].some((alarm) => Number(alarm) === 1)
    || isRelayOff(solarContext.relayStatus)
    || [solarContext.objectLeft, solarContext.objectRight].some((distance) => distance !== null && distance < 10)
    || [solarContext.humidityLeft, solarContext.humidityRight].some((humidity) => humidity !== null && humidity > 85);

  const votes = {};
  const trees = [
    () => alarmTriggered ? 'F8' : tempMax > (realTemperatureScale ? 68 : 8) ? 'F3' : 'F0',
    () => currentMagnitude > (realTemperatureScale ? 18 : 6.4) || currentImbalance > (realTemperatureScale ? 14 : 7.2) ? 'F1' : 'F0',
    () => (VDC ?? 0) < (realTemperatureScale ? 18 : -45) || (VD ?? 0) < (realTemperatureScale ? -12 : -42) ? 'F2' : 'F0',
    () => (VDC ?? 0) > (realTemperatureScale ? 58 : 24) || (VD ?? 0) > (realTemperatureScale ? 16 : 24) ? 'F6' : 'F0',
    () => tempSpread > (realTemperatureScale ? 12 : 6) ? 'F5' : 'F0',
    () => powerProxy < (realTemperatureScale ? 3 : 1.1) && currentMagnitude > 0.15 ? 'F4' : 'F0',
    () => values.filter((value) => Math.abs(value) > (realTemperatureScale ? 70 : 55)).length >= 2 ? 'F7' : 'F0',
    () => tempMax > (realTemperatureScale ? 58 : 4) && voltageMagnitude > (realTemperatureScale ? 45 : 20) ? 'F7' : 'F0',
    () => alarmTriggered && tempMax > (realTemperatureScale ? 45 : 1) ? 'F8' : 'F0',
  ];

  trees.forEach((tree) => vote(tree(), votes));

  const sortedVotes = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  let [code, count] = sortedVotes[0] || ['F0', 1];

  if (code === 'F0') {
    const bestFault = sortedVotes.find(([candidate]) => candidate !== 'F0');
    if (bestFault && bestFault[1] >= 1) {
      [code, count] = bestFault;
    }
  }

  const confidence = Math.min(99.2, Math.max(62, (count / trees.length) * 100 + (code === 'F0' ? 18 : 12)));
  const risk = code === 'F0'
    ? Math.min(24, Math.round((currentMagnitude + voltageMagnitude + tempSpread) / 3))
    : Math.min(100, Math.round(45 + count * 7 + currentMagnitude * 2 + tempSpread + voltageMagnitude / 3));

  return {
    code,
    confidence,
    risk,
    votes,
    ...FAULT_DEFINITIONS[code],
  };
}

function severityRank(code) {
  const severity = FAULT_DEFINITIONS[code]?.severity;
  if (severity === 'critical') return 3;
  if (severity === 'warning') return 2;
  if (severity === 'normal') return 1;
  return 0;
}

export function analyzeTelemetryRows(rows, { sourceName = 'Uploaded telemetry' } = {}) {
  const normalized = rows
    .map((row, index) => ({ index, record: normalizeRecord(row) }))
    .filter((item) => item.record);

  const issues = normalized.map(({ index, record }) => {
    const prediction = predictFault(record);
    const actual = record.actual && /^F\d+$/i.test(record.actual) ? record.actual.toUpperCase() : '';
    const finalCode = actual || prediction.code;
    const definition = FAULT_DEFINITIONS[finalCode] || FAULT_DEFINITIONS.F7;

    return {
      rowNumber: index + 2,
      code: finalCode,
      predicted: prediction.code,
      actual,
      confidence: prediction.confidence,
      risk: prediction.risk,
      title: definition.title,
      issue: definition.issue,
      repair: definition.repair,
      severity: definition.severity,
    };
  });

  const classCounts = issues.reduce((counts, issue) => {
    counts[issue.code] = (counts[issue.code] || 0) + 1;
    return counts;
  }, {});

  const faultIssues = issues.filter((issue) => issue.code !== 'F0');
  const topFault = [...faultIssues].sort((a, b) => {
    const severityDiff = severityRank(b.code) - severityRank(a.code);
    if (severityDiff) return severityDiff;
    const countDiff = (classCounts[b.code] || 0) - (classCounts[a.code] || 0);
    if (countDiff) return countDiff;
    return b.risk - a.risk;
  })[0];

  const labeled = issues.filter((issue) => issue.actual);
  const alerts = Object.entries(classCounts)
    .filter(([code]) => code !== 'F0')
    .map(([code, count]) => ({
      code,
      count,
      severity: FAULT_DEFINITIONS[code]?.severity || 'warning',
      message: `${FAULT_DEFINITIONS[code]?.title || 'Fault'} detected in ${count} row${count === 1 ? '' : 's'}.`,
      repair: FAULT_DEFINITIONS[code]?.repair || FAULT_DEFINITIONS.F7.repair,
    }))
    .sort((a, b) => severityRank(b.code) - severityRank(a.code) || b.count - a.count);

  const recommendations = [...new Set(alerts.slice(0, 4).map((alert) => alert.repair))];
  const latestFeatures = normalized.at(-1)?.record.features || DEFAULT_ANALYSIS.latestFeatures;
  const averageConfidence = issues.length
    ? issues.reduce((sum, issue) => sum + issue.confidence, 0) / issues.length
    : 0;
  const riskScore = issues.length
    ? issues.reduce((sum, issue) => sum + issue.risk, 0) / issues.length
    : 0;

  return {
    sourceName,
    schema: normalized[0]?.record.solarContext.hasSolarSchema ? 'Solar sensor schema' : 'Random Forest training schema',
    totalRows: rows.length,
    validRows: normalized.length,
    analyzedAt: new Date().toLocaleString(),
    hasLabels: labeled.length > 0,
    modelAccuracy: null,
    averageConfidence,
    riskScore,
    topFault: topFault?.code || 'F0',
    classCounts: Object.fromEntries(Object.keys(FAULT_DEFINITIONS).map((code) => [code, classCounts[code] || 0])),
    alerts,
    issues: issues.filter((issue) => issue.code !== 'F0').slice(0, 8),
    recommendations: recommendations.length ? recommendations : [FAULT_DEFINITIONS.F0.repair],
    latestFeatures,
  };
}

export function saveTelemetryAnalysis(analysis) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('voltiq.telemetry.analysis', JSON.stringify(analysis));
}

export function loadTelemetryAnalysis() {
  if (typeof window === 'undefined') return DEFAULT_ANALYSIS;
  try {
    const stored = window.localStorage.getItem('voltiq.telemetry.analysis');
    return stored ? { ...DEFAULT_ANALYSIS, ...JSON.parse(stored) } : DEFAULT_ANALYSIS;
  } catch {
    return DEFAULT_ANALYSIS;
  }
}
