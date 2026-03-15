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
    const x = Number(p.x);
    const y = Number(p.y);
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }

  const denominator = (n * sumXX - sumX * sumX);
  if (denominator === 0) return { slope: 0, intercept: 0, r2: 0, equation: "Vertical line" };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

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

const addNoise = (val: number, percent = 0.02) => {
  const factor = 1 + (Math.random() - 0.5) * percent;
  return val * factor;
};

export function generateRowFromPrincipal(experimentId: string, tableId: string, principalValue: number, rowIndex: number, existingRow: any): any {
  switch (experimentId) {
    case 'bar-pendulum': {
      if (tableId === 'time-measurement') {
        const g = principalValue;
        const L = parseFloat(existingRow.dist_cg) || 5 + rowIndex * 5;
        const T_theoretical = 2 * Math.PI * Math.sqrt(L / g);
        const t_total = T_theoretical * 20;
        const t1 = addNoise(t_total, 0.01).toFixed(2);
        const t2 = addNoise(t_total, 0.01).toFixed(2);
        const t3 = addNoise(t_total, 0.01).toFixed(2);
        const mean = ((parseFloat(t1) + parseFloat(t2) + parseFloat(t3)) / 3).toFixed(2);
        return {
          ...existingRow,
          g_target: principalValue.toString(),
          dist_cg: L.toString(),
          t1, t2, t3,
          mean_t: mean,
          T: (parseFloat(mean) / 20).toFixed(3)
        };
      }
      break;
    }
    case 'youngs-modulus': {
      if (tableId === 'depression') {
        const Y = principalValue;
        const M = parseFloat(existingRow.load) || rowIndex * 500;
        const l = 60, b = 2, d = 0.5, g_acc = 981;
        const delta_base = (M * g_acc * Math.pow(l, 3)) / (4 * b * Math.pow(d, 3) * Y);
        const delta = addNoise(delta_base, 0.02);
        return {
          ...existingRow,
          Y_target: principalValue.toString(),
          load: M.toString(),
          inc: addNoise(delta, 0.01).toFixed(3),
          dec: addNoise(delta, 0.01).toFixed(3),
          mean: delta.toFixed(3),
          depression: delta.toFixed(3)
        };
      }
      break;
    }
    case 'rigidity-modulus': {
      if (tableId === 'twist') {
        const eta = principalValue;
        const M = parseFloat(existingRow.load) || 0.5 + rowIndex * 0.5;
        const l = 60, r = 0.05, d_cyl = 4, g_acc = 981;
        const theta_rad = (M * 1000 * g_acc * d_cyl * l) / (Math.PI * Math.pow(r, 4) * eta);
        const theta_deg = theta_rad * (180 / Math.PI);
        const theta = addNoise(theta_deg, 0.03);
        return {
          ...existingRow,
          eta_target: principalValue.toString(),
          load: M.toString(),
          inc: addNoise(theta, 0.01).toFixed(2),
          dec: addNoise(theta, 0.01).toFixed(2),
          mean: theta.toFixed(2),
          twist: theta.toFixed(2)
        };
      }
      break;
    }
    case 'surface-tension': {
      if (tableId === 'final-calc') {
        const T_target = principalValue;
        const r = parseFloat(existingRow.r) || 0.02 + rowIndex * 0.01;
        const rho = 1, g_acc = 981;
        const h_base = (2 * T_target) / (r * rho * g_acc);
        const h = addNoise(h_base, 0.02);
        return {
          ...existingRow,
          T_target: principalValue.toString(),
          r: r.toString(),
          h: h.toFixed(2),
          inv_r: (1/r).toFixed(2),
          T: T_target.toFixed(2)
        };
      }
      break;
    }
    case 'sonometer': {
      const n_target = principalValue;
      const m_linear = 0.01;
      if (tableId === 'law-length') {
        const freq = parseFloat(existingRow.freq) || 256 + rowIndex * 64;
        const l_base = (1 / (2 * freq)) * Math.sqrt(98000 / m_linear);
        const l = addNoise(l_base, 0.02);
        return {
          ...existingRow,
          n_target: principalValue.toString(),
          freq: freq.toString(),
          inc: addNoise(l, 0.005).toFixed(2),
          dec: addNoise(l, 0.005).toFixed(2),
          mean_l: l.toFixed(2),
          inv_l: (1 / l).toFixed(4),
          nl: (freq * l).toFixed(2)
        };
      } else if (tableId === 'law-tension') {
        const T = parseFloat(existingRow.tension) || 1 + rowIndex; // kg
        const T_dyn = T * 981;
        const l_base = (1 / (2 * n_target)) * Math.sqrt(T_dyn / m_linear);
        const l = addNoise(l_base, 0.02);
        return {
          ...existingRow,
          n_target: principalValue.toString(),
          tension: T.toString(),
          inc: addNoise(l, 0.005).toFixed(2),
          dec: addNoise(l, 0.005).toFixed(2),
          mean_l: l.toFixed(2),
          l2: (l * l).toFixed(2),
          T_l2: (T_dyn / (l * l)).toFixed(6),
          sqrt_T: Math.sqrt(T_dyn).toFixed(3)
        };
      }
      break;
    }
    case 'newtons-rings': {
      const lambda = principalValue * 1e-8;
      const R = 100;
      const n = parseFloat(existingRow.ring_no) || 2 + rowIndex * 2;
      const D_base = Math.sqrt(4 * R * lambda * n);
      const D = addNoise(D_base, 0.015);
      return {
        ...existingRow,
        lambda_target: principalValue.toString(),
        ring_no: n.toString(),
        initial: "0.000",
        final: D.toFixed(4),
        diameter: D.toFixed(4),
        d2: (D * D).toFixed(5)
      };
    }
    case 'laser-wavelength': {
      const lambda = principalValue * 1e-8;
      const d_grating = 1 / 600;
      const D_screen = 100;
      const m = parseFloat(existingRow.order) || 1 + Math.floor(rowIndex / 2);
      const sinTheta = (m * lambda) / d_grating;
      const theta = Math.asin(sinTheta);
      const y_val = D_screen * Math.tan(theta);
      const y_noisy = addNoise(y_val, 0.02);
      return {
        ...existingRow,
        lambda_target: principalValue.toString(),
        lines: "600",
        grating: d_grating.toFixed(6),
        order: m.toString(),
        y: y_noisy.toFixed(3),
        D: D_screen.toString(),
        sin_theta: (y_noisy / Math.sqrt(y_noisy * y_noisy + D_screen * D_screen)).toFixed(5),
        lambda: principalValue.toString()
      };
    }
    case 'rc-circuit': {
      const tau = principalValue;
      const V0 = 5;
      const t = parseFloat(existingRow.time) || (rowIndex + 1) * 2;
      const Vc = V0 * (1 - Math.exp(-t / tau));
      const Vd = V0 * Math.exp(-t / tau);
      return {
        ...existingRow,
        tau_target: principalValue.toString(),
        time: t.toString(),
        v_charge: addNoise(Vc, 0.015).toFixed(3),
        v_discharge: addNoise(Vd, 0.015).toFixed(3)
      };
    }
    case 'metre-bridge': {
      const Q_target = principalValue;
      const P = parseFloat(existingRow.res_p) || 2 + rowIndex * 3;
      const l1_theoretical = (100 * P) / (P + Q_target);
      const l1 = addNoise(l1_theoretical, 0.01);
      return {
        ...existingRow,
        Q_target: principalValue.toString(),
        res_p: P.toString(),
        l1: l1.toFixed(2),
        l2: (100 - l1).toFixed(2),
        q: Q_target.toFixed(2)
      };
    }
  }
  return existingRow;
}

export function generateSimulatedData(experimentId: string, principalValue: number): Record<string, any[]> {
  const data: Record<string, any[]> = {};
  const exp = experiments.find(e => e.id === experimentId);
  if (!exp) return {};

  exp.tables.forEach(table => {
    const rows = [];
    const numRows = table.defaultRows || 5;
    for (let i = 0; i < numRows; i++) {
      const initialRow = table.columns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {});
      rows.push(generateRowFromPrincipal(experimentId, table.id, principalValue, i, initialRow));
    }
    data[table.id] = rows;
  });

  return data;
}
