export type TableHeader = { key: string; label: string; unit?: string };
export type TableDefinition = {
  id: string;
  label: string;
  columns: TableHeader[];
  defaultRows?: number;
  aiInputKey?: string; // The column key that triggers AI generation for the row
};

export type GraphDefinition = {
  id: string;
  title: string;
  tableId: string;
  xKey: string;
  yKey: string | string[];
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  type?: "linear" | "monotone";
  equationFormat?: string;
  multiSeries?: { key: string; label: string; color: string }[];
};

export type Question = {
  q: string;
  a: string;
};

export type Experiment = {
  id: string;
  title: string;
  category: string;
  aim: string;
  apparatus: string[];
  theory: string;
  formula: string;
  standardValue: number;
  unit: string;
  tables: TableDefinition[];
  graphs: GraphDefinition[];
  questions: Question[];
};

export const experiments: Experiment[] = [
  {
    id: "bar-pendulum",
    title: "Acceleration due to Gravity (Bar Pendulum)",
    category: "Mechanics",
    aim: "To determine the acceleration due to gravity (g) using a bar pendulum.",
    apparatus: ["Bar pendulum", "Stopwatch", "Meter scale", "Knife edge support"],
    theory: "g = 4π²L/T² where L is equivalent length and T is time period.",
    formula: "g = 4π²L / T²",
    standardValue: 981,
    unit: "cm/s²",
    tables: [
      {
        id: "time-measurement",
        label: "Table 1: Time Measurement (20 Oscillations)",
        defaultRows: 19,
        aiInputKey: "dist_cg",
        columns: [
          { key: "hole_no", label: "Hole No" },
          { key: "dist_cg", label: "Dist from CG", unit: "cm" },
          { key: "t1", label: "t1", unit: "s" },
          { key: "t2", label: "t2", unit: "s" },
          { key: "t3", label: "t3", unit: "s" },
          { key: "mean_t", label: "Mean t", unit: "s" },
          { key: "T", label: "T = t/20", unit: "s" },
        ]
      }
    ],
    graphs: [
      {
        id: "l-vs-t2",
        title: "L vs T² Graph",
        tableId: "time-measurement",
        xKey: "T2",
        yKey: "dist_cg",
        xLabel: "Time period squared (T²)",
        yLabel: "Distance from CG (L)",
        xUnit: "s²",
        yUnit: "cm",
        equationFormat: "L = m·T² + c"
      }
    ],
    questions: [
      { q: "What is a compound pendulum?", a: "A rigid body oscillating about a horizontal axis is called a compound pendulum." },
      { q: "What is equivalent length?", a: "Distance between centre of suspension and centre of oscillation." },
      { q: "What is time period?", a: "Time taken for one complete oscillation." },
      { q: "Why take 20 oscillations?", a: "To reduce error in time measurement." },
      { q: "Formula for g?", a: "g = 4π²L/T²" }
    ]
  },
  {
    id: "youngs-modulus",
    title: "Young's Modulus (Bending of Beam)",
    category: "Properties of Matter",
    aim: "To determine Young's Modulus of the material of a rectangular beam by the method of bending.",
    apparatus: ["Rectangular beam", "Knife edges", "Screw gauge", "Vernier caliper", "Weights"],
    theory: "Young's modulus Y = MgL³ / 4bd³δ.",
    formula: "Y = (M·g·l³) / (4·b·d³·δ)",
    standardValue: 1.2e11,
    unit: "dyne/cm²",
    tables: [
      {
        id: "thickness",
        label: "Table 1: Thickness (Screw Gauge)",
        defaultRows: 5,
        aiInputKey: "n",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "pitch", label: "Pitch", unit: "cm" },
          { key: "lc", label: "Least Count", unit: "cm" },
          { key: "icsr", label: "ICSR" },
          { key: "n", label: "No. Rotations N" },
          { key: "psr", label: "PSR = N×P", unit: "cm" },
          { key: "diff", label: "Diff (I-F)" },
          { key: "csr", label: "CSR", unit: "cm" },
          { key: "total", label: "Total Reading", unit: "cm" },
        ]
      },
      {
        id: "breadth",
        label: "Table 2: Breadth (Vernier Caliper)",
        defaultRows: 5,
        aiInputKey: "vc",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "msr", label: "Main Scale Reading (MSR)", unit: "cm" },
          { key: "vc", label: "Vernier Coincidence (VC)" },
          { key: "vsr", label: "VSR = VC×LC", unit: "cm" },
          { key: "total", label: "Total Reading", unit: "cm" },
        ]
      },
      {
        id: "depression",
        label: "Table 3: Load vs Depression",
        defaultRows: 6,
        aiInputKey: "load",
        columns: [
          { key: "obs", label: "Obs" },
          { key: "load", label: "Load", unit: "gm" },
          { key: "inc", label: "Increasing Reading", unit: "cm" },
          { key: "dec", label: "Decreasing Reading", unit: "cm" },
          { key: "mean", label: "Mean Reading", unit: "cm" },
          { key: "depression", label: "Depression δ", unit: "cm" },
        ]
      }
    ],
    graphs: [
      {
        id: "load-vs-dep",
        title: "Load vs Depression",
        tableId: "depression",
        xKey: "depression",
        yKey: "load",
        xLabel: "Depression (δ)",
        yLabel: "Load (M)",
        xUnit: "cm",
        yUnit: "gm"
      }
    ],
    questions: [
      { q: "What is Young's modulus?", a: "Ratio of stress to strain within elastic limit." },
      { q: "State Hooke's Law.", a: "Stress is directly proportional to strain within elastic limit." }
    ]
  },
  {
    id: "rigidity-modulus",
    title: "Rigidity Modulus (Barton's Apparatus)",
    category: "Properties of Matter",
    aim: "To determine the rigidity modulus (η) of the material of a wire.",
    apparatus: ["Barton's apparatus", "Weights", "Vernier caliper", "Screw gauge"],
    theory: "η = (gd⁴l) / (πr⁴θ).",
    formula: "η = (g·d⁴·l) / (π·r⁴·θ)",
    standardValue: 8.22e11,
    unit: "dyne/cm²",
    tables: [
      {
        id: "twist",
        label: "Table 3: Load vs Twist",
        defaultRows: 6,
        aiInputKey: "load",
        columns: [
          { key: "obs", label: "Obs" },
          { key: "load", label: "Load", unit: "kg" },
          { key: "inc", label: "Scale Reading Inc", unit: "cm" },
          { key: "dec", label: "Scale Reading Dec", unit: "cm" },
          { key: "mean", label: "Mean Angle", unit: "deg" },
          { key: "twist", label: "Twist θ", unit: "deg" },
        ]
      }
    ],
    graphs: [
      {
        id: "load-vs-twist",
        title: "Load vs Twist Angle",
        tableId: "twist",
        xKey: "twist",
        yKey: "load",
        xLabel: "Twist angle (θ)",
        yLabel: "Load applied",
        xUnit: "deg",
        yUnit: "kg"
      }
    ],
    questions: [
      { q: "What is rigidity modulus?", a: "Ratio of shear stress to shear strain." }
    ]
  },
  {
    id: "surface-tension",
    title: "Surface Tension (Capillary Rise)",
    category: "Fluid Mechanics",
    aim: "Determine the surface tension of a liquid using the capillary rise method.",
    apparatus: ["Capillary tube", "Traveling microscope", "Beaker", "Liquid"],
    theory: "T = (r·h·ρ·g) / 2.",
    formula: "T = (r·h·ρ·g) / 2",
    standardValue: 72,
    unit: "dyne/cm",
    tables: [
      {
        id: "final-calc",
        label: "Table 3: Final Calculation",
        defaultRows: 3,
        aiInputKey: "r",
        columns: [
          { key: "tube", label: "Tube" },
          { key: "h", label: "Height h", unit: "cm" },
          { key: "r", label: "Radius r", unit: "cm" },
          { key: "T", label: "Surface Tension T", unit: "dyne/cm" },
        ]
      }
    ],
    graphs: [
      {
        id: "h-vs-invr",
        title: "Graph of h vs 1/r",
        tableId: "final-calc",
        xKey: "inv_r",
        yKey: "h",
        xLabel: "1/r",
        yLabel: "Height of rise (h)",
        xUnit: "cm⁻¹",
        yUnit: "cm"
      }
    ],
    questions: [
      { q: "What is surface tension?", a: "Force per unit length acting along surface of liquid." }
    ]
  },
  {
    id: "sonometer",
    title: "Sonometer (Laws of Vibration)",
    category: "Acoustics",
    aim: "To verify the laws of transverse vibration of strings using a sonometer.",
    apparatus: ["Sonometer", "Tuning forks", "Weights"],
    theory: "Frequency n = (1/2l)√(T/m).",
    formula: "n = (1/2l)√(T/m)",
    standardValue: 256,
    unit: "Hz",
    tables: [
      {
        id: "law-length",
        label: "Table 1: Frequency vs Length (Constant Weight)",
        defaultRows: 5,
        aiInputKey: "freq",
        columns: [
          { key: "obs_no", label: "Obs" },
          { key: "freq", label: "Frequency n", unit: "Hz" },
          { key: "inc", label: "Length Increasing", unit: "cm" },
          { key: "dec", label: "Length Decreasing", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "inv_l", label: "1/l", unit: "cm⁻¹" },
        ]
      },
      {
        id: "law-tension",
        label: "Table 2: Tension vs Length (Constant Frequency)",
        defaultRows: 5,
        aiInputKey: "tension",
        columns: [
          { key: "obs_no", label: "Obs" },
          { key: "tension", label: "Tension T", unit: "N" },
          { key: "inc", label: "Length Increasing", unit: "cm" },
          { key: "dec", label: "Length Decreasing", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "sqrt_T", label: "√T", unit: "√N" },
        ]
      }
    ],
    graphs: [
      {
        id: "law-len-graph",
        title: "Verification of Law of Length",
        tableId: "law-length",
        xKey: "inv_l",
        yKey: "freq",
        xLabel: "1/l",
        yLabel: "Frequency (n)",
        xUnit: "cm⁻¹",
        yUnit: "Hz"
      },
      {
        id: "law-ten-graph",
        title: "Verification of Law of Tension",
        tableId: "law-tension",
        xKey: "sqrt_T",
        yKey: "mean_l",
        xLabel: "√T",
        yLabel: "Length (l)",
        xUnit: "√N",
        yUnit: "cm"
      }
    ],
    questions: [
      { q: "Law of length?", a: "n ∝ 1/l." },
      { q: "Law of tension?", a: "n ∝ √T." }
    ]
  },
  {
    id: "newtons-rings",
    title: "Newton's Rings",
    category: "Optics",
    aim: "To determine the wavelength of sodium light using Newton's Rings.",
    apparatus: ["Sodium lamp", "Traveling microscope", "Plano-convex lens", "Glass plate"],
    theory: "λ = (D²m - D²n) / [4R(m - n)].",
    formula: "λ = (D²m - D²n) / [4R(m - n)]",
    standardValue: 5893,
    unit: "Å",
    tables: [
      {
        id: "rings",
        label: "Observation Table (Rings)",
        defaultRows: 10,
        aiInputKey: "ring_no",
        columns: [
          { key: "ring_no", label: "Ring No" },
          { key: "initial", label: "Initial Reading", unit: "cm" },
          { key: "final", label: "Final Reading", unit: "cm" },
          { key: "diameter", label: "Diameter D", unit: "cm" },
          { key: "d2", label: "D²", unit: "cm²" },
        ]
      }
    ],
    graphs: [
      {
        id: "n-vs-d2",
        title: "Graph of D² vs Ring Number",
        tableId: "rings",
        xKey: "ring_no",
        yKey: "d2",
        xLabel: "Ring number (n)",
        yLabel: "D²",
        xUnit: "",
        yUnit: "cm²"
      }
    ],
    questions: [
      { q: "Why rings circular?", a: "Because air film thickness is circular." }
    ]
  },
  {
    id: "laser-wavelength",
    title: "LASER Wavelength using Grating",
    category: "Optics",
    aim: "To determine the wavelength of a LASER beam using a diffraction grating.",
    apparatus: ["LASER source", "Diffraction grating", "Screen"],
    theory: "mλ = (a+b)sinθ.",
    formula: "λ = (a+b)sinθ / m",
    standardValue: 6328,
    unit: "Å",
    tables: [
      {
        id: "laser-obs",
        label: "Observation Table",
        defaultRows: 8,
        aiInputKey: "order",
        columns: [
          { key: "order", label: "Order m" },
          { key: "y", label: "y", unit: "cm" },
          { key: "D", label: "D", unit: "cm" },
          { key: "sin_theta", label: "sinθ" },
          { key: "lambda", label: "λ", unit: "Å" },
        ]
      }
    ],
    graphs: [
      {
        id: "m-vs-sintheta",
        title: "Graph of sinθ vs Order",
        tableId: "laser-obs",
        xKey: "order",
        yKey: "sin_theta",
        xLabel: "Order (m)",
        yLabel: "sinθ",
        xUnit: "",
        yUnit: ""
      }
    ],
    questions: [
      { q: "LASER stands for?", a: "Light Amplification by Stimulated Emission of Radiation." }
    ]
  },
  {
    id: "rc-circuit",
    title: "RC Circuit (Charging & Discharging)",
    category: "Electricity",
    aim: "Study the charging and discharging of a capacitor in an RC circuit.",
    apparatus: ["Resistor", "Capacitor", "Power supply", "Voltmeter", "Stopwatch"],
    theory: "Time constant τ = RC.",
    formula: "τ = RC",
    standardValue: 10,
    unit: "s",
    tables: [
      {
        id: "rc-data",
        label: "Time-Voltage Table",
        defaultRows: 20,
        aiInputKey: "time",
        columns: [
          { key: "time", label: "Time", unit: "s" },
          { key: "v_charge", label: "Charging Voltage", unit: "V" },
          { key: "v_discharge", label: "Discharging Voltage", unit: "V" },
        ]
      }
    ],
    graphs: [
      {
        id: "time-vs-vc",
        title: "Charging Curve",
        tableId: "rc-data",
        xKey: "time",
        yKey: "v_charge",
        xLabel: "Time",
        yLabel: "Voltage (V)",
        xUnit: "s",
        yUnit: "V",
        type: "monotone"
      }
    ],
    questions: [
      { q: "What is time constant?", a: "Time to reach 63% of final voltage." }
    ]
  },
  {
    id: "bjt-ce",
    title: "BJT Characteristics (Common Emitter)",
    category: "Electronics",
    aim: "Find input and output resistance of a BJT in CE configuration.",
    apparatus: ["BJT", "Variable DC supply", "Ammeters", "Voltmeters"],
    theory: "Ri = ΔVBE / ΔIB.",
    formula: "Ri = ΔVBE / ΔIB",
    standardValue: 1000,
    unit: "Ω",
    tables: [
      {
        id: "input-char",
        label: "Input Characteristics",
        defaultRows: 10,
        aiInputKey: "vbe",
        columns: [
          { key: "vbe", label: "VBE", unit: "V" },
          { key: "ib_1v", label: "IB at VCE=1V", unit: "µA" },
          { key: "ib_4v", label: "IB at VCE=4V", unit: "µA" },
          { key: "ib_8v", label: "IB at VCE=8V", unit: "µA" },
        ]
      }
    ],
    graphs: [
      {
        id: "input-graph",
        title: "Input Characteristics",
        tableId: "input-char",
        xKey: "vbe",
        yKey: ["ib_1v", "ib_4v", "ib_8v"],
        xLabel: "VBE (V)",
        yLabel: "IB (µA)",
        xUnit: "V",
        yUnit: "µA",
        type: "monotone",
        multiSeries: [
          { key: "ib_1v", label: "VCE=1V", color: "#3b82f6" },
          { key: "ib_4v", label: "VCE=4V", color: "#ef4444" },
          { key: "ib_8v", label: "VCE=8V", color: "#10b981" }
        ]
      }
    ],
    questions: [
      { q: "Define current gain?", a: "β = Ic / Ib." }
    ]
  },
  {
    id: "metre-bridge",
    title: "Metre Bridge (Resistance)",
    category: "Electricity",
    aim: "Determine unknown resistance using a Metre Bridge.",
    apparatus: ["Metre bridge", "Galvanometer", "Resistance box", "Unknown resistance"],
    theory: "P/Q = l1/l2.",
    formula: "P = Q * (l1 / l2)",
    standardValue: 10,
    unit: "Ω",
    tables: [
      {
        id: "resistance",
        label: "Observation Table",
        defaultRows: 10,
        aiInputKey: "res_p",
        columns: [
          { key: "res_p", label: "Known Res P", unit: "Ω" },
          { key: "l1", label: "l1", unit: "cm" },
          { key: "l2", label: "l2 = 100 - l1", unit: "cm" },
        ]
      }
    ],
    graphs: [],
    questions: [
      { q: "What is null point?", a: "Point of zero current in galvanometer." }
    ]
  },
  {
    id: "pn-junction",
    title: "PN Junction Diode",
    category: "Electronics",
    aim: "To study the V-I characteristics of a PN junction diode.",
    apparatus: ["PN diode", "Voltmeter", "Ammeter", "Power supply"],
    theory: "Current follows exponential relationship.",
    formula: "I = Is * (e^(V/ηVt) - 1)",
    standardValue: 0.7,
    unit: "V",
    tables: [
      {
        id: "characteristics",
        label: "V-I Characteristics",
        defaultRows: 10,
        aiInputKey: "v_f",
        columns: [
          { key: "v_f", label: "Voltage", unit: "V" },
          { key: "i_f", label: "Current", unit: "mA" },
        ]
      }
    ],
    graphs: [
      {
        id: "forward-graph",
        title: "V-I Characteristics",
        tableId: "characteristics",
        xKey: "v_f",
        yKey: "i_f",
        xLabel: "Voltage (V)",
        yLabel: "Current (mA)",
        xUnit: "V",
        yUnit: "mA",
        type: "monotone"
      }
    ],
    questions: [
      { q: "What is knee voltage?", a: "Voltage where current increases rapidly." }
    ]
  }
];

export const standardValues = [
  { name: "Acceleration due to gravity (g)", value: "981 cm/s²" },
  { name: "Sodium light wavelength (λ)", value: "5893 Å" },
  { name: "Young's Modulus (Copper)", value: "12.4 x 10¹¹ dyne/cm²" },
  { name: "Rigidity Modulus (Steel)", value: "8.22 x 10¹¹ dyne/cm²" }
];
