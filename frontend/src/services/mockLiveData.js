const limits = {
  voltage: { min: 94.8, max: 96.2, step: 0.04 },
  current: { min: -31.5, max: -28.5, step: 0.15 },
  power: { min: -3.2, max: -2.4, step: 0.08 },
  capacity: { min: 25, max: 30, step: 0.08 },
  energy: { min: 2500, max: 2800, step: 4 },
};

const values = {
  voltage: 95.6,
  current: -30,
  power: -2.87,
  capacity: 27.42,
  energy: 2641,
};

function nextValue(key) {
  const cfg = limits[key];

  const delta = (Math.random() - 0.5) * cfg.step;

  values[key] += delta;

  if (values[key] > cfg.max) values[key] = cfg.max;

  if (values[key] < cfg.min) values[key] = cfg.min;

  return Number(values[key].toFixed(2));
}

export function generateLivePacket() {
  return {
    timestamp: new Date().toLocaleTimeString(),

    voltage: nextValue("voltage"),

    current: nextValue("current"),

    power: nextValue("power"),

    capacity: nextValue("capacity"),

    energy: nextValue("energy"),
  };
}