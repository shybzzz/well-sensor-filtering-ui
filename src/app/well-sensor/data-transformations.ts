export function toCelsius(arbUnits: number): number {
  return arbUnits / 100;
}

export function getMaxArbUnits(resolution: number): number {
  return Math.pow(2, resolution) - 1;
}

export function toMeters(
  arbUnits: number,
  minCurrent = 4e-3, // A
  maxCurrent = 20e-3, // A
  r = 51, // Ohm
  maxDepth = 7, // m
  maxVoltage = 3.3, // V
  resolution = 12 // bit
): number {
  const maxArbUnits = getMaxArbUnits(resolution);
  const voltage = (arbUnits * maxVoltage) / maxArbUnits;
  const current = voltage / r;
  const meters =
    ((current - minCurrent) * maxDepth) / (maxCurrent - minCurrent);
  return Math.round(meters * 100) / 100;
}

export function getDepth(
  arbUnits: number,
  referenceDepth = 7, // m
  minCurrent = 4e-3, // A
  maxCurrent = 20e-3, // A
  r = 51, // Ohm
  maxDepth = 7, // m
  voltage = 3.3, // V
  resolution = 12 // bit
): number {
  return (
    referenceDepth -
    toMeters(
      arbUnits,
      minCurrent,
      maxCurrent,
      r,
      maxDepth,
      voltage,
      resolution
    )
  );
}
