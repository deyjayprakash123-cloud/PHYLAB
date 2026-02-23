export type TableHeader = { key: string; label: string; unit?: string };
export type TableDefinition = {
  id: string;
  label: string;
  columns: TableHeader[];
};

export type GraphDefinition = {
  id: string;
  title: string;
  tableId: string;
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
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
  tables: TableDefinition[];
  graphs: GraphDefinition[];
};

export const experiments: Experiment[] = [
  {
    id: "bar-pendulum",
    title: "Acceleration due to Gravity (Bar Pendulum)",
    category: "Mechanics",
    aim: "To determine the acceleration due to gravity (g) using a bar pendulum.",
    apparatus: ["Bar pendulum", "Stopwatch", "Meter scale", "Knife edge support", "Telescope"],
    theory: "A bar pendulum is a physical pendulum. The time period T of a physical pendulum for small oscillations is given by T = 2π√(I/mgL).",
    formula: "g = 4π²L/T²",
    standardValue: 981,
    unit: "cm/s²",
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
          { key: "eq_len", label: "Equivalent Length L", unit: "cm" },
          { key: "T_period", label: "Time Period T", unit: "s" },
          { key: "L_T2", label: "L/T²" },
        ]
      }
    ],
    graphs: [
      {
        id: "l-vs-t",
        title: "Distance from C.G (L) vs Time Period (T)",
        tableId: "time-measurement",
        xKey: "dist_cg",
        yKey: "T",
        xLabel: "L",
        yLabel: "T",
        xUnit: "cm",
        yUnit: "s"
      },
      {
        id: "l-vs-t2",
        title: "Equivalent Length (L) vs T²",
        tableId: "eq-len-calc",
        xKey: "eq_len",
        yKey: "T_period",
        xLabel: "L",
        yLabel: "T²",
        xUnit: "cm",
        yUnit: "s²"
      }
    ]
  },
  {
    id: "youngs-modulus",
    title: "Young’s Modulus (Bending of Beam)",
    category: "Properties of Matter",
    aim: "To determine Young’s Modulus of the material of a rectangular beam by the method of bending.",
    apparatus: ["Rectangular beam", "Knife edges", "Screw gauge", "Vernier caliper", "Weights", "Spherometer"],
    theory: "Young's modulus Y = MgL³ / 4bd³δ, where M is load and δ is depression.",
    formula: "Y = (M * g * L³) / (4 * b * d³ * δ)",
    standardValue: 2e12,
    unit: "dyne/cm²",
    tables: [
      {
        id: "thickness",
        label: "Table 1: Thickness (Screw Gauge)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "icsr", label: "ICSR" },
          { key: "n_rot", label: "N (Rotations)" },
          { key: "psr", label: "PSR (N×P)" },
          { key: "diff", label: "Diff (I-F)" },
          { key: "csr", label: "CSR (Diff×LC)" },
          { key: "total", label: "Total (PSR+CSR)", unit: "cm" },
        ]
      },
      {
        id: "breadth",
        label: "Table 2: Breadth (Vernier Caliper)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "msr", label: "MSR", unit: "cm" },
          { key: "vc", label: "VC" },
          { key: "vsr", label: "VSR (VC×LC)" },
          { key: "total", label: "Total (MSR+VSR)", unit: "cm" },
        ]
      },
      {
        id: "depression",
        label: "Table 3: Depression Measurement",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "load", label: "Load", unit: "gm" },
          { key: "msr_inc", label: "MSR (Inc)" },
          { key: "vc_inc", label: "VC (Inc)" },
          { key: "vsr_inc", label: "VSR (Inc)" },
          { key: "total_inc", label: "Total (a)" },
          { key: "msr_dec", label: "MSR (Dec)" },
          { key: "vc_dec", label: "VC (Dec)" },
          { key: "vsr_dec", label: "VSR (Dec)" },
          { key: "total_dec", label: "Total (b)" },
          { key: "mean_total", label: "Mean (a+b)/2" },
          { key: "depression", label: "Depression δ", unit: "cm" },
        ]
      }
    ],
    graphs: [
      {
        id: "load-vs-dep",
        title: "Load (M) vs Depression (δ)",
        tableId: "depression",
        xKey: "load",
        yKey: "depression",
        xLabel: "Load",
        yLabel: "δ",
        xUnit: "gm",
        yUnit: "cm"
      }
    ]
  },
  {
    id: "rigidity-modulus",
    title: "Rigidity Modulus (Barton's Apparatus)",
    category: "Properties of Matter",
    aim: "To determine the rigidity modulus (η) of the material of a wire.",
    apparatus: ["Barton's apparatus", "Weights", "Vernier caliper", "Screw gauge", "Metallic bar", "Scale & telescope"],
    theory: "Rigidity modulus η = (g * d^4 * l) / (π * r^4 * θ), where θ is twist angle.",
    formula: "η = (g * d^4 * l) / (π * r^4 * θ)",
    unit: "dyne/cm²",
    tables: [
      {
        id: "radius",
        label: "Table 1: Radius of Metallic Bar (Screw Gauge)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "pitch", label: "Pitch", unit: "cm" },
          { key: "lc", label: "LC", unit: "cm" },
          { key: "icsr", label: "ICSR" },
          { key: "n_rot", label: "N (Rotations)" },
          { key: "psr", label: "PSR" },
          { key: "diff", label: "Diff" },
          { key: "csr", label: "CSR" },
          { key: "total", label: "Total", unit: "cm" },
        ]
      },
      {
        id: "diameter",
        label: "Table 2: Diameter of Cylinder (Vernier)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "lc", label: "LC" },
          { key: "msr", label: "MSR" },
          { key: "vc", label: "VC" },
          { key: "vsr", label: "VSR" },
          { key: "total", label: "Total", unit: "cm" },
        ]
      },
      {
        id: "twist",
        label: "Table 3: Twist Angle Measurement",
        columns: [
          { key: "load", label: "Load", unit: "kg" },
          { key: "end1_inc", label: "End I (Inc)" },
          { key: "end2_inc", label: "End II (Inc)" },
          { key: "end1_dec", label: "End I (Dec)" },
          { key: "end2_dec", label: "End II (Dec)" },
          { key: "mean_angle", label: "Mean Angle", unit: "deg" },
          { key: "twist", label: "Twist θ", unit: "deg" },
        ]
      }
    ],
    graphs: [
      {
        id: "load-vs-twist",
        title: "Load (M) vs Twist (θ)",
        tableId: "twist",
        xKey: "load",
        yKey: "twist",
        xLabel: "Load",
        yLabel: "θ",
        xUnit: "kg",
        yUnit: "deg"
      }
    ]
  },
  {
    id: "surface-tension",
    title: "Surface Tension (Capillary Rise)",
    category: "Fluid Mechanics",
    aim: "Determine the surface tension of a liquid using the capillary rise method.",
    apparatus: ["Capillary tube", "Traveling microscope", "Beaker", "Liquid (Water)"],
    theory: "Surface tension T = (r * h * ρ * g) / 2.",
    formula: "T = (r * h * ρ * g) / 2",
    standardValue: 72,
    unit: "dyne/cm",
    tables: [
      {
        id: "height",
        label: "Table 1: Height Measurement",
        columns: [
          { key: "tube_no", label: "Tube No" },
          { key: "msr_men", label: "MSR (Meniscus)" },
          { key: "vc_men", label: "VC" },
          { key: "vsr_men", label: "VSR" },
          { key: "total_r1", label: "Total R1", unit: "cm" },
          { key: "msr_needle", label: "MSR (Needle)" },
          { key: "vc_needle", label: "VC" },
          { key: "vsr_needle", label: "VSR" },
          { key: "total_r", label: "Total R", unit: "cm" },
          { key: "h", label: "h = R1 - R", unit: "cm" },
        ]
      },
      {
        id: "diameter",
        label: "Table 2: Diameter Measurement (LHS/RHS)",
        columns: [
          { key: "tube_no", label: "Tube No" },
          { key: "msr_lhs", label: "MSR (LHS)" },
          { key: "vc_lhs", label: "VC" },
          { key: "vsr_lhs", label: "VSR" },
          { key: "total_a", label: "Total (a)" },
          { key: "msr_rhs", label: "MSR (RHS)" },
          { key: "vc_rhs", label: "VC" },
          { key: "vsr_rhs", label: "VSR" },
          { key: "total_b", label: "Total (b)" },
          { key: "d1", label: "D1 = a - b", unit: "cm" },
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
    graphs: [
      {
        id: "r-vs-h",
        title: "Radius (r) vs Height (h)",
        tableId: "final-calc",
        xKey: "r",
        yKey: "h",
        xLabel: "r",
        yLabel: "h",
        xUnit: "cm",
        yUnit: "cm"
      }
    ]
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
    tables: [
      {
        id: "const-weight",
        label: "Table 1: Constant Weight",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "freq", label: "Frequency n", unit: "Hz" },
          { key: "l_inc", label: "l (Inc)", unit: "cm" },
          { key: "l_dec", label: "l (Dec)", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "inv_l", label: "1/l", unit: "cm⁻¹" },
          { key: "nl", label: "n × l" },
        ]
      },
      {
        id: "const-freq",
        label: "Table 2: Constant Frequency",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "tension", label: "Tension T", unit: "N" },
          { key: "l_inc", label: "l (Inc)", unit: "cm" },
          { key: "l_dec", label: "l (Dec)", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "l2", label: "l²", unit: "cm²" },
          { key: "t_l2", label: "T/l²" },
        ]
      }
    ],
    graphs: [
      {
        id: "n-vs-invl",
        title: "Frequency (n) vs 1/l",
        tableId: "const-weight",
        xKey: "inv_l",
        yKey: "freq",
        xLabel: "1/l",
        yLabel: "n",
        xUnit: "cm⁻¹",
        yUnit: "Hz"
      },
      {
        id: "t-vs-l2",
        title: "Tension (T) vs l²",
        tableId: "const-freq",
        xKey: "l2",
        yKey: "tension",
        xLabel: "l²",
        yLabel: "T",
        xUnit: "cm²",
        yUnit: "N"
      }
    ]
  },
  {
    id: "newtons-rings",
    title: "Newton’s Rings",
    category: "Optics",
    aim: "To determine the wavelength of sodium light using Newton’s Rings.",
    apparatus: ["Sodium lamp", "Traveling microscope", "Plano-convex lens", "Glass plate"],
    theory: "λ = (D²m - D²n) / [4R(m - n)].",
    formula: "λ = (D²m - D²n) / [4R(m - n)]",
    standardValue: 5890,
    unit: "Å",
    tables: [
      {
        id: "rings",
        label: "Observation Table: Ring Diameters",
        columns: [
          { key: "ring_no", label: "n" },
          { key: "icsr", label: "ICSR" },
          { key: "msr_i", label: "MSR(I)" },
          { key: "im", label: "IM" },
          { key: "fcsr", label: "FCSR" },
          { key: "msr_f", label: "MSR(F)" },
          { key: "fm", label: "FM" },
          { key: "diff_if", label: "I-F" },
          { key: "ncr", label: "NCR" },
          { key: "csr", label: "CSR" },
          { key: "psr", label: "PSR" },
          { key: "total", label: "Total Diameter D", unit: "mm" },
          { key: "d2", label: "D²", unit: "mm²" },
        ]
      }
    ],
    graphs: [
      {
        id: "n-vs-d2",
        title: "Ring Number (n) vs D²",
        tableId: "rings",
        xKey: "ring_no",
        yKey: "d2",
        xLabel: "n",
        yLabel: "D²",
        xUnit: "",
        yUnit: "mm²"
      }
    ]
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
    tables: [
      {
        id: "laser-obs",
        label: "Observation Table",
        columns: [
          { key: "sl_no", label: "Sl No" },
          { key: "lines_cm", label: "Lines/cm" },
          { key: "grating_element", label: "Grating Element (a+b)" },
          { key: "order", label: "Order m" },
          { key: "ym", label: "y (cm)", unit: "cm" },
          { key: "D_dist", label: "D (cm)", unit: "cm" },
          { key: "sin_theta", label: "sinθ" },
          { key: "lambda", label: "λ", unit: "Å" },
        ]
      }
    ],
    graphs: [
      {
        id: "m-vs-sintheta",
        title: "Order (m) vs sinθ",
        tableId: "laser-obs",
        xKey: "order",
        yKey: "sin_theta",
        xLabel: "m",
        yLabel: "sinθ",
        xUnit: "",
        yUnit: ""
      }
    ]
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
    tables: [
      {
        id: "rc-data",
        label: "Charging & Discharging Data Table",
        columns: [
          { key: "sl_no", label: "Sl No" },
          { key: "time", label: "Time", unit: "s" },
          { key: "v_charge", label: "Charging Voltage", unit: "V" },
          { key: "v_discharge", label: "Discharging Voltage", unit: "V" },
        ]
      }
    ],
    graphs: [
      {
        id: "time-vs-vc",
        title: "Time vs Charging Voltage (Vc)",
        tableId: "rc-data",
        xKey: "time",
        yKey: "v_charge",
        xLabel: "t",
        yLabel: "Vc",
        xUnit: "s",
        yUnit: "V"
      },
      {
        id: "time-vs-vd",
        title: "Time vs Discharging Voltage (Vd)",
        tableId: "rc-data",
        xKey: "time",
        yKey: "v_discharge",
        xLabel: "t",
        yLabel: "Vd",
        xUnit: "s",
        yUnit: "V"
      }
    ]
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
    tables: [
      {
        id: "input-char",
        label: "Table 1: Input Characteristics",
        columns: [
          { key: "sl_no", label: "Sl No" },
          { key: "vbe", label: "VBE (V)", unit: "V" },
          { key: "ib_1v", label: "IB at VCE=1V", unit: "µA" },
          { key: "ib_4v", label: "IB at 4V", unit: "µA" },
          { key: "ib_8v", label: "IB at 8V", unit: "µA" },
        ]
      },
      {
        id: "output-char",
        label: "Table 2: Output Characteristics",
        columns: [
          { key: "sl_no", label: "Sl No" },
          { key: "vce", label: "VCE (V)", unit: "V" },
          { key: "ic_125", label: "IC at IB=125µA", unit: "mA" },
          { key: "ic_150", label: "IC at 150µA", unit: "mA" },
          { key: "ic_175", label: "IC at 175µA", unit: "mA" },
        ]
      }
    ],
    graphs: [
      {
        id: "vbe-vs-ib",
        title: "Input Characteristics (VBE vs IB)",
        tableId: "input-char",
        xKey: "vbe",
        yKey: "ib_1v",
        xLabel: "VBE",
        yLabel: "IB",
        xUnit: "V",
        yUnit: "µA"
      },
      {
        id: "vce-vs-ic",
        title: "Output Characteristics (VCE vs IC)",
        tableId: "output-char",
        xKey: "vce",
        yKey: "ic_150",
        xLabel: "VCE",
        yLabel: "IC",
        xUnit: "V",
        yUnit: "mA"
      }
    ]
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
    tables: [
      {
        id: "resistance",
        label: "Observation Table",
        columns: [
          { key: "sl_no", label: "Sl No" },
          { key: "p_res", label: "Resistance P", unit: "Ω" },
          { key: "l1", label: "l1 (cm)", unit: "cm" },
          { key: "l2", label: "l2 = 100-l1", unit: "cm" },
          { key: "q_res", label: "Q = (l1/l2) × P", unit: "Ω" },
        ]
      }
    ],
    graphs: [
      {
        id: "l1-vs-q",
        title: "Length (l1) vs Resistance (Q)",
        tableId: "resistance",
        xKey: "l1",
        yKey: "q_res",
        xLabel: "l1",
        yLabel: "Q",
        xUnit: "cm",
        yUnit: "Ω"
      }
    ]
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
    tables: [
      {
        id: "pn-data",
        label: "V-I Observation Table",
        columns: [
          { key: "sl_no", label: "Sl No" },
          { key: "v_forward", label: "Forward Voltage", unit: "V" },
          { key: "i_forward", label: "Forward Current", unit: "mA" },
          { key: "v_reverse", label: "Reverse Voltage", unit: "V" },
          { key: "i_reverse", label: "Reverse Current", unit: "µA" },
        ]
      }
    ],
    graphs: [
      {
        id: "v-vs-i-forward",
        title: "Forward Characteristics (Vf vs If)",
        tableId: "pn-data",
        xKey: "v_forward",
        yKey: "i_forward",
        xLabel: "Vf",
        yLabel: "If",
        xUnit: "V",
        yUnit: "mA"
      },
      {
        id: "v-vs-i-reverse",
        title: "Reverse Characteristics (Vr vs Ir)",
        tableId: "pn-data",
        xKey: "v_reverse",
        yKey: "i_reverse",
        xLabel: "Vr",
        yLabel: "Ir",
        xUnit: "V",
        yUnit: "µA"
      }
    ]
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
