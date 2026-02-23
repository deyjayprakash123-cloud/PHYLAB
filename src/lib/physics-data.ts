export type TableHeader = { key: string; label: string; unit?: string };
export type TableDefinition = {
  id: string;
  label: string;
  columns: TableHeader[];
};

export type Experiment = {
  id: string;
  title: string;
  category: string;
  aim: string;
  apparatus: string[];
  theory: string;
  formula: string;
  standardValue?: number;
  unit: string;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  tables: TableDefinition[];
};

export const experiments: Experiment[] = [
  {
    id: "bar-pendulum",
    title: "Acceleration due to Gravity (Bar Pendulum)",
    category: "Mechanics",
    aim: "To determine the acceleration due to gravity (g) using a bar pendulum.",
    apparatus: ["Bar pendulum", "Stopwatch", "Meter scale", "Knife edge support"],
    theory: "A bar pendulum is a physical pendulum. The time period T of a physical pendulum for small oscillations is given by T = 2π√(I/mgL).",
    formula: "g = 4π²L/T²",
    standardValue: 981,
    unit: "cm/s²",
    xLabel: "Length",
    yLabel: "Time Period Squared",
    xUnit: "cm",
    yUnit: "s²",
    tables: [
      {
        id: "time-measurement",
        label: "Table 1: Time Measurement",
        columns: [
          { key: "hole_no", label: "Hole No." },
          { key: "dist_cg", label: "Dist from C.G", unit: "cm" },
          { key: "t1", label: "t1", unit: "s" },
          { key: "t2", label: "t2", unit: "s" },
          { key: "t3", label: "t3", unit: "s" },
          { key: "mean_t", label: "Mean t", unit: "s" },
          { key: "T", label: "T = t/20", unit: "s" },
        ]
      },
      {
        id: "eq-len-calc",
        label: "Table 2: Equivalent Length Calculation",
        columns: [
          { key: "sl_no", label: "Sl No." },
          { key: "eq_len", label: "Eq. Length L", unit: "cm" },
          { key: "T_period", label: "Time Period T", unit: "s" },
          { key: "L_T2", label: "L/T²" },
        ]
      }
    ],
  },
  {
    id: "youngs-modulus",
    title: "Young’s Modulus (Bending of Beam)",
    category: "Properties of Matter",
    aim: "To determine Young’s Modulus of the material of a rectangular beam by the method of bending.",
    apparatus: ["Rectangular beam", "Knife edges", "Spherometer", "Weights"],
    theory: "Young's modulus Y = MgL³ / 4bd³δ, where M is load and δ is depression.",
    formula: "Y = (M * g * L³) / (4 * b * d³ * δ)",
    standardValue: 2e12,
    unit: "dyne/cm²",
    xLabel: "Mass",
    yLabel: "Depression",
    xUnit: "g",
    yUnit: "cm",
    tables: [
      {
        id: "thickness",
        label: "Table 1: Thickness (Screw Gauge)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "icsr", label: "ICSR" },
          { key: "n_rot", label: "N (Rotations)" },
          { key: "psr", label: "PSR" },
          { key: "diff", label: "Diff (I-F)" },
          { key: "csr", label: "CSR" },
          { key: "total", label: "Total", unit: "cm" },
        ]
      },
      {
        id: "breadth",
        label: "Table 2: Breadth (Vernier Caliper)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "msr", label: "MSR", unit: "cm" },
          { key: "vc", label: "VC" },
          { key: "vsr", label: "VSR" },
          { key: "total", label: "Total", unit: "cm" },
        ]
      },
      {
        id: "depression",
        label: "Table 3: Depression Measurement",
        columns: [
          { key: "load", label: "Load", unit: "g" },
          { key: "msr_inc", label: "MSR (Inc)", unit: "cm" },
          { key: "vc_inc", label: "VC (Inc)" },
          { key: "total_inc", label: "Total (a)", unit: "cm" },
          { key: "msr_dec", label: "MSR (Dec)", unit: "cm" },
          { key: "vc_dec", label: "VC (Dec)" },
          { key: "total_dec", label: "Total (b)", unit: "cm" },
          { key: "mean", label: "Mean (a+b)/2", unit: "cm" },
          { key: "depression", label: "Depression δ", unit: "cm" },
        ]
      }
    ],
  },
  {
    id: "rigidity-modulus",
    title: "Rigidity Modulus (Barton's Apparatus)",
    category: "Properties of Matter",
    aim: "To determine the rigidity modulus (η) of the material of a wire.",
    apparatus: ["Barton's apparatus", "Weights", "Vernier caliper", "Screw gauge"],
    theory: "Rigidity modulus η = (g * d^4 * l) / (π * r^4 * θ), where θ is twist angle.",
    formula: "η = (g * d^4 * l) / (π * r^4 * θ)",
    unit: "dyne/cm²",
    xLabel: "Load",
    yLabel: "Twist Angle",
    xUnit: "g",
    yUnit: "deg",
    tables: [
      {
        id: "radius",
        label: "Table 1: Radius of Metallic Bar (Screw Gauge)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "psr", label: "PSR" },
          { key: "csr", label: "CSR" },
          { key: "total", label: "Total", unit: "cm" },
        ]
      },
      {
        id: "diameter",
        label: "Table 2: Diameter of Cylinder (Vernier Caliper)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "msr", label: "MSR" },
          { key: "vsr", label: "VSR" },
          { key: "total", label: "Total", unit: "cm" },
        ]
      },
      {
        id: "twist",
        label: "Table 3: Twist Angle (Scale Measurement)",
        columns: [
          { key: "load", label: "Load", unit: "kg" },
          { key: "end1_inc", label: "End I (Inc)" },
          { key: "end2_inc", label: "End II (Inc)" },
          { key: "end1_dec", label: "End I (Dec)" },
          { key: "end2_dec", label: "End II (Dec)" },
          { key: "mean_angle", label: "Mean Angle" },
          { key: "twist", label: "Twist θ", unit: "deg" },
        ]
      }
    ],
  },
  {
    id: "surface-tension",
    title: "Surface Tension (Capillary Rise)",
    category: "Fluid Mechanics",
    aim: "Determine the surface tension of a liquid using the capillary rise method.",
    apparatus: ["Capillary tube", "Traveling microscope", "Beaker", "Liquid"],
    theory: "Surface tension T = (r * h * ρ * g) / 2.",
    formula: "T = (r * h * ρ * g) / 2",
    standardValue: 72,
    unit: "dyne/cm",
    xLabel: "Bore Radius",
    yLabel: "Height of Rise",
    xUnit: "cm",
    yUnit: "cm",
    tables: [
      {
        id: "height",
        label: "Table 1: Height Measurement",
        columns: [
          { key: "tube_no", label: "Tube No" },
          { key: "total_r1", label: "Total R1 (Meniscus)" },
          { key: "total_r", label: "Total R (Needle)" },
          { key: "h", label: "h = R1 - R", unit: "cm" },
        ]
      },
      {
        id: "diameter",
        label: "Table 2: Diameter Measurement",
        columns: [
          { key: "tube_no", label: "Tube No" },
          { key: "d1", label: "D1 (LHS-RHS)", unit: "cm" },
          { key: "d2", label: "D2 (Lower-Upper)", unit: "cm" },
          { key: "mean_d", label: "Mean D", unit: "cm" },
        ]
      },
      {
        id: "final-calc",
        label: "Final Calculation Table",
        columns: [
          { key: "tube_no", label: "Tube No" },
          { key: "h", label: "h", unit: "cm" },
          { key: "r", label: "r", unit: "cm" },
          { key: "T", label: "T", unit: "dyne/cm" },
        ]
      }
    ],
  },
  {
    id: "sonometer",
    title: "Sonometer (Laws of Vibration)",
    category: "Acoustics",
    aim: "To verify the laws of transverse vibration of strings using a sonometer.",
    apparatus: ["Sonometer", "Tuning forks", "Weights", "Hanger"],
    theory: "Frequency n = (1/2l)√(T/m).",
    formula: "n ∝ 1/l and n ∝ √T",
    unit: "Hz",
    xLabel: "Length",
    yLabel: "Frequency",
    xUnit: "cm",
    yUnit: "Hz",
    tables: [
      {
        id: "const-weight",
        label: "Table 1: Constant Weight",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "freq", label: "Frequency", unit: "Hz" },
          { key: "l_inc", label: "l (Inc)", unit: "cm" },
          { key: "l_dec", label: "l (Dec)", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "inv_l", label: "1/l" },
          { key: "nl", label: "n × l" },
        ]
      },
      {
        id: "const-freq",
        label: "Table 2: Constant Frequency",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "tension", label: "Tension", unit: "N" },
          { key: "l_inc", label: "l (Inc)", unit: "cm" },
          { key: "l_dec", label: "l (Dec)", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "l2", label: "l²" },
          { key: "T_l2", label: "T/l²" },
        ]
      }
    ],
  },
  {
    id: "newtons-rings",
    title: "Newton’s Rings",
    category: "Optics",
    aim: "To determine the wavelength of sodium light using Newton’s Rings.",
    apparatus: ["Sodium lamp", "Traveling microscope", "Plano-convex lens"],
    theory: "λ = (D²m - D²n) / [4R(m - n)].",
    formula: "λ = (D²m - D²n) / [4R(m - n)]",
    standardValue: 5890,
    unit: "Å",
    xLabel: "Ring Number",
    yLabel: "Diameter Squared",
    xUnit: "n",
    yUnit: "mm²",
    tables: [
      {
        id: "rings",
        label: "Observation Table: Ring Diameters",
        columns: [
          { key: "ring_no", label: "Ring No" },
          { key: "icsr", label: "ICSR" },
          { key: "fcsr", label: "FCSR" },
          { key: "diff", label: "Diff (I-F)" },
          { key: "diameter", label: "Diameter (D)", unit: "mm" },
          { key: "d2", label: "D²", unit: "mm²" },
        ]
      }
    ],
  },
  {
    id: "laser-wavelength",
    title: "LASER Wavelength using Grating",
    category: "Optics",
    aim: "To determine the wavelength of a LASER beam using a diffraction grating.",
    apparatus: ["LASER source", "Diffraction grating", "Screen", "Scale"],
    theory: "mλ = (a+b)sinθ ≈ (a+b)y/√(y²+D²).",
    formula: "λ = ((a+b) * y) / (m * √(y² + D²))",
    unit: "Å",
    xLabel: "Order",
    yLabel: "Deflection Ratio",
    xUnit: "m",
    yUnit: "ratio",
    tables: [
      {
        id: "laser-obs",
        label: "Observation Table",
        columns: [
          { key: "sl_no", label: "Sl No" },
          { key: "lines_cm", label: "Lines/cm" },
          { key: "grating_elem", label: "Grating Element (a+b)" },
          { key: "order", label: "Order (m)" },
          { key: "ym", label: "ym", unit: "cm" },
          { key: "D", label: "D", unit: "cm" },
          { key: "sin_theta", label: "sinθ" },
          { key: "lambda", label: "λ", unit: "Å" },
        ]
      }
    ],
  },
  {
    id: "rc-circuit",
    title: "RC Circuit (Charging & Discharging)",
    category: "Electricity",
    aim: "Study the charging and discharging of a capacitor in an RC circuit.",
    apparatus: ["Resistor", "Capacitor", "Power supply", "Voltmeter", "Stopwatch"],
    theory: "Time constant τ = RC. At τ, V = 0.63 Vmax during charging.",
    formula: "τ = RC",
    unit: "s",
    xLabel: "Time",
    yLabel: "Voltage",
    xUnit: "s",
    yUnit: "V",
    tables: [
      {
        id: "rc-data",
        label: "Charging & Discharging Table",
        columns: [
          { key: "time", label: "Time", unit: "s" },
          { key: "v_charge", label: "Charging Voltage", unit: "V" },
          { key: "v_discharge", label: "Discharging Voltage", unit: "V" },
        ]
      }
    ],
  },
  {
    id: "bjt-ce",
    title: "BJT Characteristics (Common Emitter)",
    category: "Electronics",
    aim: "Find input and output resistance of a BJT in CE configuration.",
    apparatus: ["BJT", "Variable DC supply", "Ammeters", "Voltmeters"],
    theory: "Input resistance Ri = ΔVBE / ΔIB, Output resistance Ro = ΔVCE / ΔIC.",
    formula: "R = ΔV / ΔI",
    unit: "Ω",
    xLabel: "Voltage",
    yLabel: "Current",
    xUnit: "V",
    yUnit: "mA",
    tables: [
      {
        id: "input-char",
        label: "Table 1: Input Characteristics",
        columns: [
          { key: "vbe", label: "VBE", unit: "V" },
          { key: "ib_1v", label: "IB at VCE=1V", unit: "µA" },
          { key: "ib_4v", label: "IB at 4V", unit: "µA" },
          { key: "ib_8v", label: "IB at 8V", unit: "µA" },
        ]
      },
      {
        id: "output-char",
        label: "Table 2: Output Characteristics",
        columns: [
          { key: "vce", label: "VCE", unit: "V" },
          { key: "ic_125", label: "IC at IB=125µA", unit: "mA" },
          { key: "ic_150", label: "IC at 150µA", unit: "mA" },
          { key: "ic_175", label: "IC at 175µA", unit: "mA" },
        ]
      }
    ],
  },
  {
    id: "metre-bridge",
    title: "Metre Bridge (Resistance)",
    category: "Electricity",
    aim: "Determine unknown resistance using a Metre Bridge.",
    apparatus: ["Metre bridge", "Galvanometer", "Resistance box", "Unknown resistance"],
    theory: "P/Q = l1/l2 -> P = Q(l1/l2).",
    formula: "P = Q * (l1 / l2)",
    unit: "Ω",
    xLabel: "Length l1",
    yLabel: "Resistance Q",
    xUnit: "cm",
    yUnit: "Ω",
    tables: [
      {
        id: "resistance",
        label: "Observation Table",
        columns: [
          { key: "p_res", label: "Resistance P", unit: "Ω" },
          { key: "l1", label: "l1", unit: "cm" },
          { key: "l2", label: "l2 (100-l1)", unit: "cm" },
          { key: "q_res", label: "Q = (l1/l2)×P", unit: "Ω" },
        ]
      }
    ],
  },
  {
    id: "pn-junction",
    title: "PN Junction Diode",
    category: "Electronics",
    aim: "To study the V-I characteristics of a PN junction diode.",
    apparatus: ["PN diode", "Voltmeter", "Ammeter", "Variable DC power supply"],
    theory: "Current follows exponential relationship in forward bias.",
    formula: "I = Is * (e^(V/ηVt) - 1)",
    unit: "mA",
    xLabel: "Voltage",
    yLabel: "Current",
    xUnit: "V",
    yUnit: "mA",
    tables: [
      {
        id: "pn-data",
        label: "V-I Observation Table",
        columns: [
          { key: "v_forward", label: "Forward Voltage", unit: "V" },
          { key: "i_forward", label: "Forward Current", unit: "mA" },
          { key: "v_reverse", label: "Reverse Voltage", unit: "V" },
          { key: "i_reverse", label: "Reverse Current", unit: "µA" },
        ]
      }
    ],
  }
];

export const standardValues = [
  { name: "Acceleration due to gravity (g)", value: "981 cm/s²" },
  { name: "Density of water", value: "1 g/cm³" },
  { name: "Sodium light wavelength (λ)", value: "5890–5896 Å" },
  { name: "Surface tension of water", value: "69–72 dyne/cm" },
  { name: "Young's Modulus (Copper)", value: "12.4 x 10¹¹ dyne/cm²" },
  { name: "Plank's Constant (h)", value: "6.626 x 10⁻³⁴ J·s" },
  { name: "Speed of Light (c)", value: "3 x 10⁸ m/s" }
];
