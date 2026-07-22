function parseNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function pick(body, aliases) {
  for (const key of aliases) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
      return body[key];
    }
  }
  return null;
}

function normalizeSolarPayload(body = {}) {
  const solarVolt = parseNumber(pick(body, [
    "Solar_Volt", "Solar Volt", "solar_voltage", "solarVolt", "solar_volt", "pv_voltage", "pvVoltage",
  ]));
  const solarCurrent = parseNumber(pick(body, [
    "Solar_Current", "Solar Current", "solar_current", "solarCurrent", "solar_amp", "pv_current", "pvCurrent",
  ]));
  const batteryVolt = parseNumber(pick(body, [
    "Battery_Volt", "Battery Volt", "battery_voltage", "batteryVolt", "battery_volt",
  ]));
  const batteryCurrent = parseNumber(pick(body, [
    "Battery_Current", "Battery Current", "battery_current", "batteryCurrent", "battery_amp",
  ]));
  const inverterVolt = parseNumber(pick(body, [
    "InverterIn(load)_Volt", "Inverter_Load_Volt", "inverter_voltage", "inverterVolt", "load_voltage",
  ]));
  const inverterCurrent = parseNumber(pick(body, [
    "InverterIn(load)_Current", "Inverter_Load_Current", "inverter_current", "inverterCurrent", "load_current",
  ]));
  const tempLeft = parseNumber(pick(body, [
    "Temperature_L", "Temperature Left", "temp_left", "tempLeft", "temperature_l", "temperature",
  ]));
  const tempRight = parseNumber(pick(body, [
    "Temperature_R", "Temperature Right", "temp_right", "tempRight", "temperature_r",
  ]));
  const humidityLeft = parseNumber(pick(body, [
    "Humadity_L", "Humidity_L", "Humidity Left", "humidity_l", "humidity_left", "humidity",
  ]));
  const humidityRight = parseNumber(pick(body, [
    "Humadity_R", "Humidity_R", "Humidity Right", "humidity_r", "humidity_right",
  ]));
  const alarmLeft = parseNumber(pick(body, ["Alarm_L", "Alarm Left", "alarm_l", "alarm_left"]));
  const alarmRight = parseNumber(pick(body, ["Alarm_R", "Alarm Right", "alarm_r", "alarm_right"]));
  const objectLeft = parseNumber(pick(body, [
    "Object_distance_L", "Object Distance L", "object_distance_l", "object_left",
  ]));
  const objectRight = parseNumber(pick(body, [
    "Object_distance_R", "Object Distance R", "object_distance_r", "object_right",
  ]));
  const relayStatus = pick(body, ["Relay_Status", "Relay Status", "relay_status", "relayStatus"]);

  const voltage = batteryVolt ?? solarVolt ?? inverterVolt;
  const current = inverterCurrent ?? batteryCurrent ?? solarCurrent;
  const temperature = tempRight ?? tempLeft;
  const power = (voltage != null && current != null) ? Math.round(Math.abs(voltage * current)) : null;

  return {
    deviceId: String(pick(body, ["deviceId", "device_id", "id"]) || "solar-monitor-1"),
    deviceName: String(pick(body, ["deviceName", "device_name", "name"]) || "Solar Monitor"),
    solarVolt,
    solarCurrent,
    batteryVolt,
    batteryCurrent,
    inverterVolt,
    inverterCurrent,
    tempLeft,
    tempRight,
    humidityLeft,
    humidityRight,
    alarmLeft,
    alarmRight,
    objectLeft,
    objectRight,
    relayStatus,
    voltage,
    current,
    temperature,
    power,
    raw: body,
  };
}

function hasTelemetry(normalized) {
  return [
    normalized.solarVolt,
    normalized.solarCurrent,
    normalized.batteryVolt,
    normalized.batteryCurrent,
    normalized.inverterVolt,
    normalized.inverterCurrent,
    normalized.tempLeft,
    normalized.tempRight,
    normalized.voltage,
    normalized.current,
    normalized.temperature,
    normalized.power,
  ].some((value) => value !== null);
}

module.exports = {
  normalizeSolarPayload,
  hasTelemetry,
};