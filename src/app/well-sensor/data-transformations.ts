export function toCelsius(arbUnits: number): number {
  return arbUnits / 100;
}

export function getMaxArbUnits(resolution: number): number {
  return Math.pow(2, resolution) - 1;
}

export function toMeters(
  arbUnits: number,
  minCurrent: number, // A
  maxCurrent: number, // A
  r: number, // Ohm
  maxDepth: number, // m
  maxVoltage: number, // V
  resolution: number // bit
): number {
  const maxArbUnits = getMaxArbUnits(resolution);
  const voltage = (arbUnits * maxVoltage) / maxArbUnits;
  const current = voltage / r;
  const meters =
    (maxDepth * (current - minCurrent)) / (maxCurrent - minCurrent);
  return Math.round(meters * 100) / 100;
}

export function getDepth(
  arbUnits: number,
  referenceDepth: number, // m
  minCurrent: number, // A
  maxCurrent: number, // A
  r: number, // Ohm
  maxDepth: number, // m
  voltage: number, // V
  resolution: number // bit
): number {
  return (
    referenceDepth -
    toMeters(arbUnits, minCurrent, maxCurrent, r, maxDepth, voltage, resolution)
  );
}
