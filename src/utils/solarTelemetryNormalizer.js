function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function pick(body, aliases) {
  for (const key of aliases) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
      return body[key];
    }
  }
  return null;
}

export function normalizeSolarTelemetry(body = {}) {
  const solarVolt = parseNumber(pick(body, [
    'Solar_Volt', 'Solar Volt', 'solar_voltage', 'solarVolt', 'solar_volt', 'pv_voltage', 'pvVoltage',
  ]));
  const solarCurrent = parseNumber(pick(body, [
    'Solar_Current', 'Solar Current', 'solar_current', 'solarCurrent', 'solar_amp', 'pv_current', 'pvCurrent',
  ]));
  const batteryVolt = parseNumber(pick(body, [
    'Battery_Volt', 'Battery Volt', 'battery_voltage', 'batteryVolt', 'battery_volt',
  ]));
  const batteryCurrent = parseNumber(pick(body, [
    'Battery_Current', 'Battery Current', 'battery_current', 'batteryCurrent', 'battery_amp',
  ]));
  const inverterVolt = parseNumber(pick(body, [
    'InverterIn(load)_Volt', 'Inverter_Load_Volt', 'inverter_voltage', 'inverterVolt', 'load_voltage',
  ]));
  const inverterCurrent = parseNumber(pick(body, [
    'InverterIn(load)_Current', 'Inverter_Load_Current', 'inverter_current', 'inverterCurrent', 'load_current',
  ]));
  const tempLeft = parseNumber(pick(body, [
    'Temperature_L', 'Temperature Left', 'temp_left', 'tempLeft', 'temperature_l', 'temperature',
  ]));
  const tempRight = parseNumber(pick(body, [
    'Temperature_R', 'Temperature Right', 'temp_right', 'tempRight', 'temperature_r',
  ]));

  const voltage = body.voltage != null ? parseNumber(body.voltage) : (batteryVolt ?? solarVolt ?? inverterVolt);
  const current = body.current != null ? parseNumber(body.current) : (inverterCurrent ?? batteryCurrent ?? solarCurrent);
  const temperature = body.temperature != null ? parseNumber(body.temperature) : (tempRight ?? tempLeft);
  const power = body.power != null
    ? parseNumber(body.power)
    : (voltage != null && current != null ? Math.round(Math.abs(voltage * current)) : null);

  return {
    deviceId: String(pick(body, ['deviceId', 'device_id', 'id']) || 'solar-monitor-1'),
    deviceName: String(pick(body, ['deviceName', 'device_name', 'name']) || 'Solar Monitor'),
    solarVolt,
    solarCurrent,
    batteryVolt,
    batteryCurrent,
    voltage,
    current,
    temperature,
    power,
    receivedAt: body.receivedAt || null,
  };
}