export type DataPoint = {
  x: number;
  y: number;
  [key: string]: number | string; 
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

export function generateRowFromInput(
  experimentId: string, 
  tableId: string, 
  inputKey: string, 
  inputValue: string, 
  standardValue: number,
  existingRow: any
): any {
  const val = parseFloat(inputValue);
  if (isNaN(val)) return { ...existingRow, [inputKey]: inputValue };

  const g_acc = 981;

  switch (experimentId) {
    case 'bar-pendulum': {
      if (inputKey === 'dist_cg') {
        const L = val;
        const g = standardValue;
        const T_theoretical = 2 * Math.PI * Math.sqrt(L / g);
        const t_total = T_theoretical * 20;
        const t1 = addNoise(t_total, 0.01).toFixed(2);
        const t2 = t_total.toFixed(2);
        const t3 = addNoise(t_total, 0.01).toFixed(2);
        const mean = ((parseFloat(t1) + parseFloat(t2) + parseFloat(t3)) / 3).toFixed(2);
        const T_calc = (parseFloat(mean) / 20);
        return {
          ...existingRow,
          dist_cg: inputValue,
          t1, t2, t3,
          mean_t: mean,
          T: T_calc.toFixed(3)
        };
      }
      break;
    }
    case 'youngs-modulus': {
      if (tableId === 'depression' && inputKey === 'load') {
        const M = val;
        const Y = standardValue;
        const l = 60, b = 2, d = 0.5;
        const delta_base = (M * g_acc * Math.pow(l, 3)) / (4 * b * Math.pow(d, 3) * Y);
        const delta = addNoise(delta_base, 0.02);
        return {
          ...existingRow,
          load: inputValue,
          msr_inc: delta.toFixed(3),
          msr_dec: delta.toFixed(3),
          mean: delta.toFixed(3),
          depression: delta.toFixed(3)
        };
      }
      break;
    }
    case 'rigidity-modulus': {
      if (tableId === 'twist' && inputKey === 'load') {
        const M = val;
        const eta = standardValue;
        const l = 60, r = 0.05, d_cyl = 4;
        const theta_rad = (M * 1000 * g_acc * d_cyl * l) / (Math.PI * Math.pow(r, 4) * eta);
        const theta_deg = theta_rad * (180 / Math.PI);
        const theta = addNoise(theta_deg, 0.03);
        return {
          ...existingRow,
          load: inputValue,
          inc: theta.toFixed(2),
          dec: theta.toFixed(2),
          mean: theta.toFixed(2),
          twist: theta.toFixed(2)
        };
      }
      break;
    }
    case 'surface-tension': {
      if (inputKey === 'r') {
        const r = val;
        const T = standardValue;
        const h_base = (2 * T) / (r * 1 * g_acc);
        const h = addNoise(h_base, 0.02);
        return {
          ...existingRow,
          r: inputValue,
          h: h.toFixed(2),
          T: standardValue.toFixed(2)
        };
      }
      break;
    }
    case 'sonometer': {
      if (inputKey === 'freq') {
        const n = val;
        const T = 98000; 
        const m_lin = 0.01;
        const l_base = (1 / (2 * n)) * Math.sqrt(T / m_lin);
        const l = addNoise(l_base, 0.02);
        return {
          ...existingRow,
          freq: inputValue,
          inc: l.toFixed(2),
          dec: l.toFixed(2),
          mean_l: l.toFixed(2),
          inv_l: (1/l).toFixed(4),
          nl: (n * l).toFixed(2)
        };
      }
      break;
    }
    case 'newtons-rings': {
      if (inputKey === 'ring_no') {
        const n = val;
        const lambda = standardValue * 1e-8;
        const R = 100;
        const D_base = Math.sqrt(4 * R * lambda * n);
        const D = addNoise(D_base, 0.015);
        return {
          ...existingRow,
          ring_no: inputValue,
          initial: "0.000",
          final: D.toFixed(4),
          diameter: D.toFixed(4),
          d2: (D * D).toFixed(5)
        };
      }
      break;
    }
    case 'laser-wavelength': {
      if (inputKey === 'order') {
        const m = val;
        const lambda = standardValue * 1e-8;
        const d_grating = 1 / 600;
        const D_screen = 100;
        const sinTheta = (m * lambda) / d_grating;
        const theta = Math.asin(sinTheta);
        const y_val = D_screen * Math.tan(theta);
        const y = addNoise(y_val, 0.02);
        return {
          ...existingRow,
          order: inputValue,
          y: y.toFixed(3),
          D: D_screen.toString(),
          sin_theta: (y / Math.sqrt(y * y + D_screen * D_screen)).toFixed(5),
          lambda: standardValue.toString()
        };
      }
      break;
    }
    case 'rc-circuit': {
      if (inputKey === 'time') {
        const t = val;
        const tau = standardValue;
        const V0 = 5;
        const Vc = V0 * (1 - Math.exp(-t / tau));
        const Vd = V0 * Math.exp(-t / tau);
        return {
          ...existingRow,
          time: inputValue,
          v_charge: addNoise(Vc, 0.01).toFixed(3),
          v_discharge: addNoise(Vd, 0.01).toFixed(3)
        };
      }
      break;
    }
    case 'bjt-ce': {
      if (inputKey === 'vbe') {
        const vbe = val;
        const beta = 150;
        const vt = 0.026;
        const is = 1e-12;
        const ib = is * (Math.exp(vbe / vt) - 1) * 1e6;
        return {
          ...existingRow,
          vbe: inputValue,
          ib_1v: addNoise(ib, 0.05).toFixed(2),
          ib_4v: addNoise(ib * 1.1, 0.05).toFixed(2),
          ib_8v: addNoise(ib * 1.2, 0.05).toFixed(2)
        };
      }
      break;
    }
    case 'metre-bridge': {
      if (inputKey === 'res_p') {
        const P = val;
        const Q = standardValue;
        const l1 = (100 * P) / (P + Q);
        const l1_noisy = addNoise(l1, 0.01);
        return {
          ...existingRow,
          res_p: inputValue,
          l1: l1_noisy.toFixed(2),
          l2: (100 - l1_noisy).toFixed(2),
          q: standardValue.toString()
        };
      }
      break;
    }
    case 'pn-junction': {
      if (inputKey === 'v') {
        const v = val;
        const vt = 0.026;
        const is = 1e-9;
        const i_f = is * (Math.exp(v / (1.5 * vt)) - 1) * 1e3;
        const i_r = is * 1e3 * Math.exp(v/10); 
        return {
          ...existingRow,
          f_v: inputValue,
          f_i: addNoise(i_f, 0.05).toFixed(3),
          r_v: inputValue,
          r_i: addNoise(i_r, 0.05).toFixed(3)
        };
      }
      break;
    }
  }

  return { ...existingRow, [inputKey]: inputValue };
}
