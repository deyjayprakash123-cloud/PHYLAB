export type DataPoint = {
  x: number;
  y: number;
  [key: string]: number | string; // Allow for multi-series keys
};

export function calculateLinearRegression(data: DataPoint[]) {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0, equation: "Insufficient data" };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (const p of data) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
    sumYY += p.y * p.y;
  }

  const denominator = (n * sumXX - sumX * sumX);
  if (denominator === 0) return { slope: 0, intercept: 0, r2: 0, equation: "Vertical line" };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Correlation coefficient
  const rNum = n * sumXY - sumX * sumY;
  const rDen = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  const r2 = rDen === 0 ? 0 : Math.pow(rNum / rDen, 2);

  const equation = `y = ${slope.toFixed(4)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept).toFixed(4)}`;

  return { slope, intercept, r2, equation };
}

export function calculatePercentageError(observed: number, standard: number) {
  if (standard === 0) return 0;
  return Math.abs((observed - standard) / standard) * 100;
}

export function calculateMean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function calculateStdDev(values: number[]) {
  if (values.length < 2) return 0;
  const mean = calculateMean(values);
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}
