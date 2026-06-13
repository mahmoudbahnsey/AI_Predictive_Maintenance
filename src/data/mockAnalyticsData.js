import rawFddDataset from '../../dataset/converted_dataset.csv?raw';
import { mockDeviceData } from './mockDeviceData';

const faultPalette = {
  F0: 'var(--color-normal)',
  F1: '#82ca9d',
  F2: '#8884d8',
  F3: 'var(--color-warning)',
  F4: '#ffc658',
  F5: '#ff9f1c',
  F6: '#5a6b63',
  F7: 'var(--color-critical)',
  F8: '#39cfff',
};

const parseCsv = (csvText) => {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',');
    return headers.reduce((row, header, index) => {
      row[header] = header === 'FDD' ? values[index] : Number(values[index]);
      return row;
    }, {});
  });

  return { headers, rows };
};

const { headers: datasetColumns, rows: datasetRows } = parseCsv(rawFddDataset);
const sensorColumns = datasetColumns.filter((column) => column !== 'FDD');

const faultClassCounts = datasetRows.reduce((acc, row) => {
  acc[row.FDD] = (acc[row.FDD] || 0) + 1;
  return acc;
}, {});

const columnStats = sensorColumns.reduce((acc, column) => {
  const values = datasetRows.map((row) => row[column]).filter(Number.isFinite);
  const sum = values.reduce((total, value) => total + value, 0);
  acc[column] = {
    min: Number(Math.min(...values).toFixed(2)),
    max: Number(Math.max(...values).toFixed(2)),
    mean: Number((sum / values.length).toFixed(2)),
  };
  return acc;
}, {});

const totalRows = datasetRows.length;
const healthyRows = faultClassCounts.F0 || 0;
const anomalyRows = totalRows - healthyRows;
const totalDeviceCost = mockDeviceData.reduce((sum, device) => sum + device.estimatedCostLe, 0);
const avgDeviceHealth = Math.round(mockDeviceData.reduce((sum, device) => sum + device.health, 0) / mockDeviceData.length);

const avg = (rows, column) => rows.reduce((sum, row) => sum + row[column], 0) / (rows.length || 1);

const buildTimeline = () => {
  const binCount = 24;
  const binSize = Math.ceil(datasetRows.length / binCount);

  return Array.from({ length: binCount }, (_, index) => {
    const chunk = datasetRows.slice(index * binSize, (index + 1) * binSize);
    const fddCounts = chunk.reduce((acc, row) => {
      acc[row.FDD] = (acc[row.FDD] || 0) + 1;
      return acc;
    }, {});

    const dominant = Object.entries(fddCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'F0';
    const nonHealthy = chunk.length - (fddCounts.F0 || 0);
    const vdc = Math.abs(avg(chunk, 'VDC'));
    const idc = Math.abs(avg(chunk, 'IDC'));
    const vd = Math.abs(avg(chunk, 'VD'));
    const temperature = (Math.abs(avg(chunk, 'T1')) + Math.abs(avg(chunk, 'T2')) + Math.abs(avg(chunk, 'T3'))) / 3;

    return {
      time: `${index}:00`,
      power: Number((vdc * idc).toFixed(2)),
      efficiency: Number(Math.max(0, 100 - (vd * 2.2) - ((nonHealthy / chunk.length) * 18)).toFixed(1)),
      temperature: Number(temperature.toFixed(1)),
      faultProb: Number(((nonHealthy / chunk.length) * 100).toFixed(1)),
      confidence: Number(Math.max(80, 99 - (vd / 5)).toFixed(1)),
      dominant,
    };
  });
};

export const masterTimelineData = buildTimeline();

const avgDatasetEfficiency = Number((masterTimelineData.reduce((sum, row) => sum + row.efficiency, 0) / masterTimelineData.length).toFixed(1));
const avgConfidence = Number((masterTimelineData.reduce((sum, row) => sum + row.confidence, 0) / masterTimelineData.length).toFixed(1));
const peakPowerIndex = Math.max(...masterTimelineData.map((row) => row.power));
const highestRiskWindow = masterTimelineData.reduce((max, row) => (row.faultProb > max.faultProb ? row : max), masterTimelineData[0]);

export const analyticsSourceSummary = {
  datasetFile: 'dataset/converted_dataset.csv',
  schemaFile: 'dataset/Solar Data.xlsx',
  rows: totalRows,
  columns: datasetColumns.length,
  datasetColumns,
  sensorColumns,
  columnStats,
  healthyRows,
  anomalyRows,
  healthyRate: Number(((healthyRows / totalRows) * 100).toFixed(1)),
  anomalyRate: Number(((anomalyRows / totalRows) * 100).toFixed(1)),
  faultClassCount: Object.keys(faultClassCounts).length,
  deviceCount: mockDeviceData.length,
  totalDeviceCost,
  avgDeviceHealth,
  avgDatasetEfficiency,
  avgConfidence,
  peakPowerIndex,
  highestRiskWindow,
  solarSchema: [
    'Solar_Current',
    'Solar_Volt',
    'Battery_Current',
    'Battery_Volt',
    'InverterIn(load)_Current',
    'InverterIn(load)_Volt',
    'Object_distance_R',
    'Alarm_R',
    'Object_distance_L',
    'Alarm_L',
    'Temperature_R',
    'Humadity_R',
    'Temperature_L',
    'Humadity_L',
    'LDR_value(Lighting)',
    'Relay_Status',
  ],
};

export const faultClassData = Object.entries(faultClassCounts)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([faultClass, value]) => ({
    class: `${faultClass}${faultClass === 'F0' ? ' (Healthy)' : ' dataset class'}`,
    faultClass,
    value,
    fill: faultPalette[faultClass] || 'var(--gold)',
    percentage: Number(((value / totalRows) * 100).toFixed(1)),
  }));

export const anomalyData = [
  {
    id: 1,
    type: 'High F7 Density',
    severity: 'critical',
    system: 'Dataset class F7',
    confidence: 97,
    cause: `${(faultClassCounts.F7 || 0).toLocaleString()} rows are labeled F7 in the source CSV, the largest non-healthy class.`,
    action: 'Inspect F7 feature ranges against VDC and VD channels',
  },
  {
    id: 2,
    type: 'Sensor Calibration Watch',
    severity: 'warning',
    system: 'ACS712 + 0-25V sensing modules',
    confidence: 91,
    cause: `VDC spans ${columnStats.VDC.min} to ${columnStats.VDC.max}, while VD spans ${columnStats.VD.min} to ${columnStats.VD.max}.`,
    action: 'Recheck ADC scaling and zero offsets',
  },
  {
    id: 3,
    type: 'Power Conversion Watch',
    severity: 'warning',
    system: '12V DC to 220V AC inverter module',
    confidence: 88,
    cause: 'Power-stage analytics should remain bounded by the 40W inverter rating from the device BOM.',
    action: 'Keep scenario simulations below rated load',
  },
  {
    id: 4,
    type: 'Healthy Baseline Coverage',
    severity: 'normal',
    system: 'F0 healthy baseline',
    confidence: 96,
    cause: `${analyticsSourceSummary.healthyRate}% of CSV rows are labeled F0 and anchor the baseline comparison.`,
    action: 'Use F0 windows for normal behavior reference',
  },
];

export const heatmapData = mockDeviceData.flatMap((device, deviceIndex) => {
  const slices = masterTimelineData.filter((_, index) => index % 2 === 0).slice(0, 12);
  return slices.map((slice, timeIndex) => {
    const devicePenalty = device.status === 'warning' ? 8 : 0;
    const classPenalty = slice.dominant === 'F0' ? 0 : Math.min(24, (faultClassCounts[slice.dominant] || 0) / 80);
    const value = Math.max(0, Math.min(100, device.health - devicePenalty - classPenalty + ((deviceIndex + timeIndex) % 3)));
    return {
      system: device.name,
      time: slice.time,
      value: Number(value.toFixed(1)),
      faultClass: slice.dominant,
    };
  });
});

export const rankingData = mockDeviceData
  .map((device) => ({
    rank: 0,
    name: device.name,
    efficiency: device.health,
    uptime: Number(Math.max(90, 100 - device.prob / 2).toFixed(1)),
    faultRate: device.prob,
    trend: device.status === 'warning' ? 'down' : device.health >= avgDeviceHealth ? 'up' : 'flat',
    cost: device.estimatedCostLe,
    type: device.type,
  }))
  .sort((a, b) => b.efficiency - a.efficiency)
  .map((device, index) => ({ ...device, rank: index + 1 }));

export const forecastData = masterTimelineData.slice(12).map((row, index) => ({
  time: `+${index + 1}h`,
  predictedOutput: Number((row.power * 100).toFixed(0)),
  confidenceUpper: Number((row.power * 112).toFixed(0)),
  confidenceLower: Number((row.power * 88).toFixed(0)),
  thermalRisk: Number(Math.min(100, row.faultProb * 0.72 + Math.max(0, row.temperature - 5) * 6).toFixed(1)),
  dominant: row.dominant,
}));

export const energyFlowData = {
  generated: Number((peakPowerIndex * 100).toFixed(0)),
  consumed: Number((peakPowerIndex * 100 * 0.66).toFixed(0)),
  exported: Number((peakPowerIndex * 100 * 0.25).toFixed(0)),
  lost: Number((peakPowerIndex * 100 * 0.09).toFixed(0)),
  lossRate: 9,
};

export const analyticsInsights = [
  { text: `${totalRows.toLocaleString()} CSV rows are now driving the analytics page instead of random mock values.`, severity: 'normal' },
  { text: `${analyticsSourceSummary.anomalyRate}% of dataset rows are non-F0 fault classes and need class-aware analysis.`, severity: 'warning' },
  { text: `F7 is the largest non-healthy class with ${(faultClassCounts.F7 || 0).toLocaleString()} rows.`, severity: 'critical' },
  { text: `The devices page contributes ${mockDeviceData.length} real BOM components with ${avgDeviceHealth}% average readiness.`, severity: 'normal' },
  { text: `Total BOM cost remains ${totalDeviceCost.toLocaleString()} LE and is used by the ranking and scenario panels.`, severity: 'gold' },
  { text: `Solar Data.xlsx schema is used as the project sensor blueprint while converted_dataset.csv supplies fault labels and feature ranges.`, severity: 'normal' },
];

export const analyticsNotes = [
  'Data source: dataset/converted_dataset.csv.',
  'Device context: src/data/mockDeviceData.js BOM components.',
  'The dataset labels F0-F8 are preserved exactly from the CSV.',
  'Solar Data.xlsx currently provides the real sensor schema used by the project.',
];
