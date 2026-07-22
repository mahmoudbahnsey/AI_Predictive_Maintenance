import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../config/firebase';
import { normalizeSolarTelemetry } from '../utils/solarTelemetryNormalizer';

function pickLatestMonitor(monitors = {}) {
  const devices = Object.entries(monitors)
    .map(([id, payload]) => ({ id, ...(payload?.latest || {}) }))
    .filter((device) => device.receivedAt);

  if (devices.length === 0) return null;

  return devices.sort((a, b) => (b.receivedAt || 0) - (a.receivedAt || 0))[0];
}

export function useSolarMonitorLive() {
  const [liveMonitor, setLiveMonitor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const monitorsRef = ref(db, 'solarMonitors');
    const unsubscribe = onValue(
      monitorsRef,
      (snapshot) => {
        const latest = pickLatestMonitor(snapshot.val() || {});
        setLiveMonitor(latest);
        setLoading(false);
      },
      () => {
        setLiveMonitor(null);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const isLive = Boolean(liveMonitor?.receivedAt);
  const isStale = isLive && Date.now() - liveMonitor.receivedAt > 90_000;

  const normalized = liveMonitor ? normalizeSolarTelemetry(liveMonitor) : null;

  const sensors = isLive && normalized
    ? {
        voltage: normalized.voltage != null ? +Number(normalized.voltage).toFixed(1) : null,
        current: normalized.current != null ? +Number(normalized.current).toFixed(2) : null,
        power: normalized.power != null ? Math.round(Number(normalized.power)) : null,
        temperature: normalized.temperature != null ? +Number(normalized.temperature).toFixed(1) : null,
        solarVolt: normalized.solarVolt,
        solarCurrent: normalized.solarCurrent,
        batteryVolt: normalized.batteryVolt,
        batteryCurrent: normalized.batteryCurrent,
      }
    : null;

  return {
    liveMonitor,
    sensors,
    isLive,
    isStale,
    loading,
    lastReceivedAt: liveMonitor?.receivedAt || null,
    deviceName: liveMonitor?.deviceName || liveMonitor?.id || null,
  };
}