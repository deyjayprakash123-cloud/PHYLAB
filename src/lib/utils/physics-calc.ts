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

/**
 * Generates realistic laboratory readings by solving experiment equations in reverse.
 * Adds 1-3% experimental noise to ensure authenticity.
 */
export function generateSimulatedData(experimentId: string, principalValue: number): Record<string, any[]> {
  const data: Record<string, any[]> = {};
  
  // Helper to add 1-3% noise
  const addNoise = (val: number, percent = 0.02) => {
    const factor = 1 + (Math.random() - 0.5) * percent;
    return val * factor;
  };

  switch (experimentId) {
    case 'bar-pendulum': {
      const g = principalValue; // Target g (cm/s^2)
      const k = 28.8; // Radius of gyration
      const holeDistances = [5, 10, 15, 20, 25, 30, 35, 40, 45, 0, 45, 40, 35, 30, 25, 20, 15, 10, 5];
      
      data['time-measurement'] = holeDistances.map((dist, i) => {
        if (dist === 0) return { hole_no: (i + 1).toString(), dist_cg: "0", t1: "0", t2: "0", t3: "0", mean_t: "0", T: "0" };
        const T_theoretical = 2 * Math.PI * Math.sqrt((k * k + dist * dist) / (dist * g));
        const t_total = T_theoretical * 20;
        const t1 = addNoise(t_total, 0.01).toFixed(2);
        const t2 = addNoise(t_total, 0.01).toFixed(2);
        const t3 = addNoise(t_total, 0.01).toFixed(2);
        const mean = ((parseFloat(t1) + parseFloat(t2) + parseFloat(t3)) / 3).toFixed(2);
        return {
          hole_no: (i + 1).toString(),
          dist_cg: dist.toString(),
          t1, t2, t3,
          mean_t: mean,
          T: (parseFloat(mean) / 20).toFixed(3)
        };
      });

      const L_vals = [60, 75, 90];
      data['eq-len-calc'] = L_vals.map((L, i) => {
        const T_val = 2 * Math.PI * Math.sqrt(L / g);
        const T_noisy = addNoise(T_val, 0.005);
        return {
          set_no: (i + 1).toString(),
          L1: L.toString(),
          L2: L.toString(),
          mean_L: L.toString(),
          T: T_noisy.toFixed(3),
          T2: (T_noisy * T_noisy).toFixed(3),
          L_T2: (L / (T_noisy * T_noisy)).toFixed(3)
        };
      });
      break;
    }

    case 'youngs-modulus': {
      const Y = principalValue; // Target Y (dyne/cm^2)
      const l = 60, b = 2, d = 0.5, g_acc = 981;
      const loads = [0, 500, 1000, 1500, 2000, 2500];
      
      data['thickness'] = Array.from({ length: 5 }, (_, i) => ({
        obs_no: (i + 1).toString(), pitch: "0.1", lc: "0.001", icsr: "0", n: "5", psr: "0.5", diff: "12", csr: "0.012", total: addNoise(d, 0.005).toFixed(3), mean_d: d.toFixed(3)
      }));
      data['breadth'] = Array.from({ length: 5 }, (_, i) => ({
        obs_no: (i + 1).toString(), msr: "2.0", vc: "4", vsr: "0.04", total: addNoise(b, 0.01).toFixed(2), mean_b: b.toFixed(2)
      }));

      data['depression'] = loads.map((M, i) => {
        const delta_base = (M * g_acc * Math.pow(l, 3)) / (4 * b * Math.pow(d, 3) * Y);
        const delta = addNoise(delta_base, 0.02);
        return {
          obs: (i + 1).toString(),
          load: M.toString(),
          inc: addNoise(delta, 0.01).toFixed(3),
          dec: addNoise(delta, 0.01).toFixed(3),
          mean: delta.toFixed(3),
          depression: delta.toFixed(3)
        };
      });
      break;
    }

    case 'rigidity-modulus': {
      const eta = principalValue; // Target Rigidity (dyne/cm^2)
      const l = 60, r = 0.05, d_cyl = 4, g_acc = 981;
      const loads = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
      
      data['twist'] = loads.map((M, i) => {
        const theta_rad = (M * 1000 * g_acc * d_cyl * l) / (Math.PI * Math.pow(r, 4) * eta);
        const theta_deg = theta_rad * (180 / Math.PI);
        const theta = addNoise(theta_deg, 0.03);
        return {
          obs: (i + 1).toString(),
          load: M.toString(),
          inc: addNoise(theta, 0.01).toFixed(2),
          dec: addNoise(theta, 0.01).toFixed(2),
          mean: theta.toFixed(2),
          twist: theta.toFixed(2)
        };
      });
      break;
    }

    case 'surface-tension': {
      const T_target = principalValue; // dyne/cm
      const rho = 1, g_acc = 981;
      const radii = [0.02, 0.03, 0.04];
      
      data['final-calc'] = radii.map((r, i) => {
        const h_base = (2 * T_target) / (r * rho * g_acc);
        const h = addNoise(h_base, 0.02);
        return {
          tube: (i + 1).toString(),
          h: h.toFixed(2),
          r: r.toFixed(3),
          inv_r: (1/r).toFixed(2),
          T: T_target.toFixed(2)
        };
      });
      break;
    }

    case 'sonometer': {
      const n_target = principalValue; // Hz
      const m_linear = 0.01; // g/cm
      const tuningForks = [256, 320, 384, 480, 512];
      const tensions = [980, 1960, 2940, 3920, 4900]; // dyne (M*g)

      data['law-length'] = tuningForks.map((freq, i) => {
        const l_base = (1 / (2 * freq)) * Math.sqrt(98000 / m_linear); // T = 100g
        const l = addNoise(l_base, 0.02);
        return {
          obs_no: (i + 1).toString(),
          freq: freq.toString(),
          inc: addNoise(l, 0.005).toFixed(2),
          dec: addNoise(l, 0.005).toFixed(2),
          mean_l: l.toFixed(2),
          inv_l: (1 / l).toFixed(4),
          nl: (freq * l).toFixed(2)
        };
      });

      data['law-tension'] = tensions.map((T, i) => {
        const l_base = (1 / (2 * n_target)) * Math.sqrt(T / m_linear);
        const l = addNoise(l_base, 0.02);
        return {
          obs_no: (i + 1).toString(),
          tension: (T/981).toFixed(2),
          inc: addNoise(l, 0.005).toFixed(2),
          dec: addNoise(l, 0.005).toFixed(2),
          mean_l: l.toFixed(2),
          l2: (l * l).toFixed(2),
          T_l2: (T / (l * l)).toFixed(6),
          sqrt_T: Math.sqrt(T).toFixed(3)
        };
      });
      break;
    }

    case 'newtons-rings': {
      const lambda = principalValue * 1e-8; // Angstrom to cm
      const R = 100;
      const ringNumbers = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
      data['rings'] = ringNumbers.map(n => {
        const D_base = Math.sqrt(4 * R * lambda * n);
        const D = addNoise(D_base, 0.015);
        return {
          ring_no: n.toString(),
          initial: "0.000",
          final: D.toFixed(4),
          diameter: D.toFixed(4),
          d2: (D * D).toFixed(5)
        };
      });
      break;
    }

    case 'laser-wavelength': {
      const lambda = principalValue * 1e-8; // cm
      const d_grating = 1 / 600; // cm
      const D_screen = 100;
      data['laser-obs'] = [1, 2, 3, 4].map(m => {
        const sinTheta = (m * lambda) / d_grating;
        const theta = Math.asin(sinTheta);
        const y_val = D_screen * Math.tan(theta);
        const y_noisy = addNoise(y_val, 0.02);
        return {
          obs: m.toString(),
          lines: "600",
          grating: d_grating.toFixed(6),
          order: m.toString(),
          y: y_noisy.toFixed(3),
          D: D_screen.toString(),
          sin_theta: (y_noisy / Math.sqrt(y_noisy * y_noisy + D_screen * D_screen)).toFixed(5),
          lambda: principalValue.toString()
        };
      });
      break;
    }

    case 'rc-circuit': {
      const tau = principalValue; // s
      const V0 = 5;
      data['rc-data'] = Array.from({ length: 20 }, (_, i) => {
        const t = (i + 1) * 2;
        const Vc = V0 * (1 - Math.exp(-t / tau));
        const Vd = V0 * Math.exp(-t / tau);
        return {
          time: t.toString(),
          v_charge: addNoise(Vc, 0.015).toFixed(3),
          v_discharge: addNoise(Vd, 0.015).toFixed(3)
        };
      });
      break;
    }

    case 'bjt-ce': {
      const beta = principalValue;
      data['input-char'] = Array.from({ length: 10 }, (_, i) => {
        const vbe = 0.5 + i * 0.05;
        const ib = 5 * Math.exp((vbe - 0.6) / 0.026);
        return {
          vbe: vbe.toFixed(2),
          ib_1v: addNoise(ib * 1.1, 0.02).toFixed(2),
          ib_4v: addNoise(ib, 0.02).toFixed(2),
          ib_8v: addNoise(ib * 0.9, 0.02).toFixed(2)
        };
      });
      data['output-char'] = Array.from({ length: 10 }, (_, i) => {
        const vce = i * 1.5;
        const ib_levels = [125, 150, 175];
        return {
          vce: vce.toFixed(1),
          ic_125: addNoise(125 * beta / 1000 * (1 + vce / 100), 0.02).toFixed(2),
          ic_150: addNoise(150 * beta / 1000 * (1 + vce / 100), 0.02).toFixed(2),
          ic_175: addNoise(175 * beta / 1000 * (1 + vce / 100), 0.02).toFixed(2)
        };
      });
      break;
    }

    case 'metre-bridge': {
      const Q_target = principalValue;
      const P_vals = [2, 5, 8, 12, 15, 20, 25, 30, 40, 50];
      data['resistance'] = P_vals.map((P, i) => {
        const l1_theoretical = (100 * P) / (P + Q_target);
        const l1 = addNoise(l1_theoretical, 0.01);
        return {
          obs: (i + 1).toString(),
          res_p: P.toString(),
          l1: l1.toFixed(2),
          l2: (100 - l1).toFixed(2),
          q: Q_target.toFixed(2)
        };
      });
      break;
    }

    case 'pn-junction': {
      const knee_v = principalValue;
      data['characteristics'] = Array.from({ length: 10 }, (_, i) => {
        const vf = i * 0.08;
        const vr = i * 5;
        const if_curr = vf < knee_v ? 0.01 : 5 * Math.exp((vf - knee_v) / 0.05);
        const ir_curr = 0.05 * (1 + vr / 50);
        return {
          forward_voltage: vf.toFixed(2),
          forward_current: addNoise(if_curr, 0.03).toFixed(2),
          reverse_voltage: vr.toFixed(1),
          reverse_current: addNoise(ir_curr, 0.02).toFixed(3)
        };
      });
      break;
    }
  }

  return data;
}
