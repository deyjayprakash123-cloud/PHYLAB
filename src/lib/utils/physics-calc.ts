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

export function generateSimulatedData(experimentId: string, principalValue: number): Record<string, any[]> {
  const data: Record<string, any[]> = {};
  const addNoise = (val: number, range: number) => val + (Math.random() - 0.5) * range;

  switch (experimentId) {
    case 'bar-pendulum': {
      const g = principalValue;
      const k = 28.8; // radius of gyration for 1m bar
      const rows1 = [];
      for (let i = 1; i <= 19; i++) {
        const dist = Math.abs(i - 10) * 5; // holes every 5cm
        const T = dist === 0 ? 0 : 2 * Math.PI * Math.sqrt((k * k + dist * dist) / (dist * g));
        const tMean = T * 20;
        rows1.push({
          hole_no: i.toString(),
          dist_cg: dist.toFixed(2),
          t1: addNoise(tMean, 0.4).toFixed(2),
          t2: addNoise(tMean, 0.4).toFixed(2),
          t3: addNoise(tMean, 0.4).toFixed(2),
          mean_t: tMean.toFixed(2),
          T: T.toFixed(3)
        });
      }
      data['time-measurement'] = rows1;

      const L_vals = [60, 75, 90];
      data['eq-len-calc'] = L_vals.map((L, idx) => {
        const T = 2 * Math.PI * Math.sqrt(L / g);
        return {
          set_no: (idx + 1).toString(),
          L1: L.toFixed(2),
          L2: L.toFixed(2),
          mean_L: L.toFixed(2),
          T: T.toFixed(3),
          T2: (T * T).toFixed(3),
          L_T2: (L / (T * T)).toFixed(3)
        };
      });
      break;
    }

    case 'youngs-modulus': {
      const Y = principalValue;
      const l = 60, b = 2, d = 0.5, g_acc = 981;
      const loads = [0, 500, 1000, 1500, 2000, 2500];
      
      data['thickness'] = Array.from({ length: 5 }, (_, i) => ({
        obs_no: (i + 1).toString(), pitch: "0.1", lc: "0.001", icsr: "0", n: "5", psr: "0.5", diff: "12", csr: "0.012", total: addNoise(d, 0.005).toFixed(3), mean_d: d.toFixed(3)
      }));
      data['breadth'] = Array.from({ length: 5 }, (_, i) => ({
        obs_no: (i + 1).toString(), msr: "2.0", vc: "4", vsr: "0.04", total: addNoise(b, 0.01).toFixed(2), mean_b: b.toFixed(2)
      }));

      data['depression'] = loads.map((M, i) => {
        const delta = (M * g_acc * Math.pow(l, 3)) / (4 * b * Math.pow(d, 3) * Y);
        return {
          obs: (i + 1).toString(),
          load: M.toString(),
          inc: addNoise(delta, 0.02).toFixed(3),
          dec: addNoise(delta, 0.02).toFixed(3),
          mean: delta.toFixed(3),
          depression: delta.toFixed(3)
        };
      });
      break;
    }

    case 'rigidity-modulus': {
      const eta = principalValue;
      const l = 60, r = 0.05, d_cyl = 4, g_acc = 981;
      const loads = [0.5, 1, 1.5, 2, 2.5, 3];
      
      data['twist'] = loads.map((M, i) => {
        const theta = (M * 1000 * g_acc * d_cyl * l) / (Math.PI * Math.pow(r, 4) * eta) * (180 / Math.PI);
        return {
          obs: (i + 1).toString(),
          load: M.toString(),
          inc: addNoise(theta, 0.1).toFixed(2),
          dec: addNoise(theta, 0.1).toFixed(2),
          mean: theta.toFixed(2),
          twist: theta.toFixed(2)
        };
      });
      break;
    }

    case 'surface-tension': {
      const T_val = principalValue;
      const rho = 1, g_acc = 981;
      const radii = [0.02, 0.03, 0.04];
      
      data['final-calc'] = radii.map((r, i) => {
        const h = (2 * T_val) / (r * rho * g_acc);
        return {
          tube: (i + 1).toString(),
          h: addNoise(h, 0.1).toFixed(2),
          r: r.toFixed(3),
          inv_r: (1/r).toFixed(2),
          T: T_val.toFixed(2)
        };
      });
      break;
    }

    case 'sonometer': {
      const n = principalValue;
      const m = 0.01; // linear density
      const tensions = [9.8, 19.6, 29.4, 39.2, 49.0];
      
      data['law-length'] = Array.from({ length: 5 }, (_, i) => {
        const freq = (i + 1) * 100;
        const l = (1 / (2 * freq)) * Math.sqrt(9.8 / m);
        return {
          obs_no: (i + 1).toString(),
          freq: freq.toString(),
          inc: addNoise(l * 100, 0.2).toFixed(2),
          dec: addNoise(l * 100, 0.2).toFixed(2),
          mean_l: (l * 100).toFixed(2),
          inv_l: (1 / (l * 100)).toFixed(4),
          nl: (freq * l * 100).toFixed(2)
        };
      });

      data['law-tension'] = tensions.map((T, i) => {
        const l = (1 / (2 * n)) * Math.sqrt(T / m);
        return {
          obs_no: (i + 1).toString(),
          tension: T.toFixed(2),
          inc: addNoise(l * 100, 0.2).toFixed(2),
          dec: addNoise(l * 100, 0.2).toFixed(2),
          mean_l: (l * 100).toFixed(2),
          l2: Math.pow(l * 100, 2).toFixed(2),
          T_l2: (T / Math.pow(l * 100, 2)).toFixed(5),
          sqrt_T: Math.sqrt(T).toFixed(3)
        };
      });
      break;
    }

    case 'newtons-rings': {
      const lambda = principalValue * 1e-8; // to cm
      const R = 100;
      data['rings'] = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map(n => {
        const D = Math.sqrt(4 * R * lambda * n);
        return {
          ring_no: n.toString(),
          initial: "0.00",
          final: D.toFixed(4),
          diameter: D.toFixed(4),
          d2: (D * D).toFixed(5)
        };
      });
      break;
    }

    case 'laser-wavelength': {
      const lambda = principalValue * 1e-8;
      const d = 1 / 600;
      const D_screen = 100;
      data['laser-obs'] = [1, 2, 3, 4].map(m => {
        const sinTheta = (m * lambda) / d;
        const theta = Math.asin(sinTheta);
        const y = D_screen * Math.tan(theta);
        return {
          obs: m.toString(),
          lines: "600",
          grating: d.toFixed(6),
          order: m.toString(),
          y: addNoise(y, 0.1).toFixed(3),
          D: D_screen.toString(),
          sin_theta: sinTheta.toFixed(5),
          lambda: principalValue.toString()
        };
      });
      break;
    }

    case 'rc-circuit': {
      const tau = principalValue;
      const V0 = 5;
      data['rc-data'] = Array.from({ length: 20 }, (_, i) => {
        const t = (i + 1) * 2;
        const Vc = V0 * (1 - Math.exp(-t / tau));
        const Vd = V0 * Math.exp(-t / tau);
        return {
          time: t.toString(),
          v_charge: addNoise(Vc, 0.05).toFixed(3),
          v_discharge: addNoise(Vd, 0.05).toFixed(3)
        };
      });
      break;
    }

    case 'bjt-ce': {
      const beta = principalValue;
      data['input-char'] = Array.from({ length: 10 }, (_, i) => {
        const vbe = 0.5 + i * 0.03;
        const ib = Math.exp((vbe - 0.6) / 0.026);
        return {
          vbe: vbe.toFixed(2),
          ib_1v: (ib * 1.1).toFixed(2),
          ib_4v: ib.toFixed(2),
          ib_8v: (ib * 0.9).toFixed(2)
        };
      });
      data['output-char'] = Array.from({ length: 10 }, (_, i) => {
        const vce = i * 1;
        const ib_base = 150;
        return {
          vce: vce.toString(),
          ic_125: (125 * beta / 1000 * (1 + vce / 100)).toFixed(2),
          ic_150: (150 * beta / 1000 * (1 + vce / 100)).toFixed(2),
          ic_175: (175 * beta / 1000 * (1 + vce / 100)).toFixed(2)
        };
      });
      break;
    }

    case 'metre-bridge': {
      const Q = principalValue;
      const P_vals = [1, 3, 6, 9, 12, 15, 18, 21, 24, 27];
      data['resistance'] = P_vals.map((P, i) => {
        const l1 = (100 * P) / (P + Q);
        return {
          obs: (i + 1).toString(),
          res_p: P.toString(),
          l1: addNoise(l1, 0.5).toFixed(2),
          l2: (100 - l1).toFixed(2),
          q: Q.toFixed(2)
        };
      });
      break;
    }

    case 'pn-junction': {
      const Vk = principalValue;
      data['characteristics'] = Array.from({ length: 10 }, (_, i) => {
        const vf = i * 0.1;
        const vr = i * 2;
        const if_curr = vf < Vk ? 0 : Math.exp((vf - Vk) / 0.05);
        const ir_curr = 0.01 * (1 + vr / 50);
        return {
          forward_voltage: vf.toFixed(2),
          forward_current: addNoise(if_curr, 0.1).toFixed(2),
          reverse_voltage: vr.toFixed(2),
          reverse_current: addNoise(ir_curr, 0.005).toFixed(3)
        };
      });
      break;
    }
  }

  return data;
}
