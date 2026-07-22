import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, push } from 'firebase/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) acc[key.trim()] = rest.join('=').trim();
  return acc;
}, {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

function normalizeSolarPayload(body = {}) {
  const parseNumber = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const pick = (aliases) => {
    for (const key of aliases) {
      if (body[key] !== undefined && body[key] !== null && body[key] !== '') return body[key];
    }
    return null;
  };

  const solarVolt = parseNumber(pick(['Solar_Volt', 'solar_voltage', 'solarVolt']));
  const solarCurrent = parseNumber(pick(['Solar_Current', 'solar_current', 'solarCurrent']));
  const batteryVolt = parseNumber(pick(['Battery_Volt', 'battery_voltage', 'batteryVolt']));
  const batteryCurrent = parseNumber(pick(['Battery_Current', 'battery_current', 'batteryCurrent']));
  const tempLeft = parseNumber(pick(['Temperature_L', 'temperature', 'tempLeft']));
  const tempRight = parseNumber(pick(['Temperature_R', 'tempRight']));
  const voltage = batteryVolt ?? solarVolt;
  const current = batteryCurrent ?? solarCurrent;
  const temperature = tempRight ?? tempLeft;
  const power = voltage != null && current != null ? Math.round(Math.abs(voltage * current)) : null;

  return {
    deviceId: String(pick(['deviceId', 'device_id', 'id']) || 'solar-monitor-1'),
    deviceName: String(pick(['deviceName', 'device_name', 'name']) || 'Solar Monitor'),
    solarVolt,
    solarCurrent,
    batteryVolt,
    batteryCurrent,
    tempLeft,
    tempRight,
    voltage,
    current,
    temperature,
    power,
    raw: body,
  };
}

const samplePayload = normalizeSolarPayload({
  deviceId: 'solar-monitor-1',
  deviceName: 'Solar Monitor',
  Solar_Volt: 24.5,
  Solar_Current: 3.2,
  Battery_Volt: 12.8,
  Battery_Current: 4.1,
  Temperature_L: 32.5,
  Temperature_R: 33.1,
  Humadity_L: 48,
  Humadity_R: 46,
  Relay_Status: 'on',
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

async function uploadSolarLive() {
  const email = process.env.VOLTIQ_ADMIN_EMAIL || 'admin@voltiq.com';
  const password = process.env.VOLTIQ_ADMIN_PASSWORD || 'Admin123!';

  const cred = await signInWithEmailAndPassword(auth, email, password);
  const receivedAt = Date.now();
  const deviceId = samplePayload.deviceId.replace(/[.#$[\]]/g, '_');
  const latestPayload = {
    ...samplePayload,
    receivedAt,
    source: 'solar-monitor-upload-script',
  };

  await Promise.all([
    set(ref(db, `solarMonitors/${deviceId}/latest`), latestPayload),
    push(ref(db, `solarMonitors/${deviceId}/history`), {
      voltage: samplePayload.voltage,
      current: samplePayload.current,
      power: samplePayload.power,
      temperature: samplePayload.temperature,
      solarVolt: samplePayload.solarVolt,
      solarCurrent: samplePayload.solarCurrent,
      batteryVolt: samplePayload.batteryVolt,
      batteryCurrent: samplePayload.batteryCurrent,
      receivedAt,
    }),
  ]);

  console.log('Solar live data uploaded successfully.');
  console.log(JSON.stringify({
    deviceId,
    receivedAt,
    apiEndpoint: 'https://voltiq-dashboard.web.app/api/data',
    telemetry: {
      solarVolt: samplePayload.solarVolt,
      solarCurrent: samplePayload.solarCurrent,
      batteryVolt: samplePayload.batteryVolt,
      batteryCurrent: samplePayload.batteryCurrent,
      voltage: samplePayload.voltage,
      current: samplePayload.current,
      power: samplePayload.power,
      temperature: samplePayload.temperature,
    },
  }, null, 2));
  console.log(`Uploaded by: ${cred.user.email}`);
  process.exit(0);
}

uploadSolarLive().catch((error) => {
  console.error('Upload failed:', error.message || error);
  process.exit(1);
});