export type TableHeader = { key: string; label: string; unit?: string };

export type AIInputField = {
  key: string;
  label: string;
  unit?: string;
  description?: string;
};

export type TableDefinition = {
  id: string;
  label: string;
  columns: TableHeader[];
  defaultRows?: number;
  aiInputFields?: AIInputField[];
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
    theory: "The acceleration due to gravity (g) is given by the formula g = 4π²L/T², where L is the equivalent length and T is the time period of oscillation.",
    formula: "g = 4π²L / T²",
    standardValue: 981,
    unit: "cm/s²",
    tables: [
      {
        id: "time-measurement",
        label: "Table 1: Time Measurement (20 Oscillations)",
        defaultRows: 19,
        columns: [
          { key: "hole_no", label: "Hole No" },
          { key: "dist_cg", label: "Dist from CG", unit: "cm" },
          { key: "t1", label: "t1", unit: "s" },
          { key: "t2", label: "t2", unit: "s" },
          { key: "t3", label: "t3", unit: "s" },
          { key: "mean_t", label: "Mean t", unit: "s" },
          { key: "T", label: "T = t/20", unit: "s" }
        ],
        aiInputFields: [
          { key: "hole_no", label: "Hole No" },
          { key: "dist_cg", label: "Dist from CG", unit: "cm" }
        ]
      },
      {
        id: "equivalent-length",
        label: "Table 2: Equivalent Length Calculation",
        defaultRows: 3,
        columns: [
          { key: "sl_no", label: "Sl No" },
          { key: "L", label: "Equiv. Length L", unit: "cm" },
          { key: "T", label: "Time Period T", unit: "s" },
          { key: "T2", label: "T²", unit: "s²" },
          { key: "L_T2", label: "L/T²", unit: "cm/s²" }
        ],
        aiInputFields: [
          { key: "L", label: "Equivalent Length L", unit: "cm" },
          { key: "T", label: "Time Period T", unit: "s" }
        ]
      }
    ],
    graphs: [
      {
        id: "l-vs-t2",
        title: "Graph of L vs T²",
        tableId: "equivalent-length",
        xKey: "T2",
        yKey: "L",
        xLabel: "Time period squared (T²)",
        yLabel: "Equivalent Length (L)",
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
      { q: "Formula for g?", a: "g = 4π²L/T²" },
      { q: "Standard value of g?", a: "981 cm/s² (or 9.8 m/s²)." },
      { q: "Why small amplitude is preferred?", a: "Because formula is valid only for small angles." },
      { q: "What is radius of gyration?", a: "Distance from axis where entire mass can be assumed concentrated." }
    ]
  },
  {
    id: "youngs-modulus",
    title: "Young's Modulus (Bending of Beam)",
    category: "Properties of Matter",
    aim: "To determine Young's Modulus of the material of a rectangular beam by the method of bending.",
    apparatus: ["Rectangular beam", "Knife edges", "Screw gauge", "Vernier caliper", "Weights"],
    theory: "Young's modulus Y is determined by the depression δ produced at the center of a beam of length l, breadth b, and thickness d when a load M is applied: Y = MgL³ / 4bd³δ.",
    formula: "Y = (M·g·l³) / (4·b·d³·δ)",
    standardValue: 1.2e11,
    unit: "dyne/cm²",
    tables: [
      {
        id: "thickness",
        label: "Table 1: Thickness (Screw Gauge)",
        defaultRows: 3,
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "pitch", label: "Pitch", unit: "cm" },
          { key: "lc", label: "LC", unit: "cm" },
          { key: "icsr", label: "ICSR" },
          { key: "n", label: "N (Rotations)" },
          { key: "psr", label: "PSR", unit: "cm" },
          { key: "diff", label: "Diff(I-F)" },
          { key: "csr", label: "CSR", unit: "cm" },
          { key: "total", label: "Total Reading", unit: "cm" }
        ],
        aiInputFields: [
          { key: "lc", label: "Least Count", unit: "cm" }
        ]
      },
      {
        id: "breadth",
        label: "Table 2: Breadth (Vernier Caliper)",
        defaultRows: 3,
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "msr", label: "MSR", unit: "cm" },
          { key: "vc", label: "VC" },
          { key: "vsr", label: "VSR", unit: "cm" },
          { key: "total", label: "MSR + VSR", unit: "cm" }
        ],
        aiInputFields: [
          { key: "msr", label: "Main Scale Reading", unit: "cm" }
        ]
      },
      {
        id: "depression",
        label: "Table 3: Load vs Depression",
        defaultRows: 6,
        columns: [
          { key: "load", label: "Load", unit: "gm" },
          { key: "msr_inc", label: "MSR Inc", unit: "cm" },
          { key: "vc_inc", label: "VC Inc" },
          { key: "vsr_inc", label: "VSR Inc", unit: "cm" },
          { key: "total_inc", label: "Total (a)", unit: "cm" },
          { key: "msr_dec", label: "MSR Dec", unit: "cm" },
          { key: "vc_dec", label: "VC Dec" },
          { key: "vsr_dec", label: "VSR Dec", unit: "cm" },
          { key: "total_dec", label: "Total (b)", unit: "cm" },
          { key: "mean", label: "Mean (a+b)/2", unit: "cm" },
          { key: "depression", label: "Depression δ", unit: "cm" }
        ],
        aiInputFields: [
          { key: "load", label: "Load", unit: "gm" }
        ]
      }
    ],
    graphs: [
      {
        id: "load-vs-dep",
        title: "Graph of Load vs Depression",
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
      { q: "What is stress?", a: "Force per unit area." },
      { q: "What is strain?", a: "Change in dimension / original dimension." },
      { q: "State Hooke's Law.", a: "Stress is directly proportional to strain within elastic limit." },
      { q: "Unit of Young's modulus?", a: "N/m² or dyne/cm²." }
    ]
  },
  {
    id: "rigidity-modulus",
    title: "Rigidity Modulus (Barton's Apparatus)",
    category: "Properties of Matter",
    aim: "To determine the rigidity modulus (η) of the material of a wire.",
    apparatus: ["Barton's apparatus", "Weights", "Vernier caliper", "Screw gauge"],
    theory: "The rigidity modulus η is determined using the torque applied to a wire of radius r and length l: η = (gd⁴l) / (πr⁴θ).",
    formula: "η = (g·d⁴·l) / (π·r⁴·θ)",
    standardValue: 8.22e11,
    unit: "dyne/cm²",
    tables: [
      {
        id: "radius",
        label: "Table 1: Radius of Rod (Screw Gauge)",
        defaultRows: 3,
        columns: [
          { key: "obs", label: "Obs" },
          { key: "pitch", label: "Pitch", unit: "cm" },
          { key: "lc", label: "LC", unit: "cm" },
          { key: "icsr", label: "ICSR" },
          { key: "n", label: "Rotations" },
          { key: "psr", label: "PSR", unit: "cm" },
          { key: "diff", label: "Diff" },
          { key: "csr", label: "CSR", unit: "cm" },
          { key: "total", label: "Total Reading", unit: "cm" }
        ],
        aiInputFields: [
          { key: "lc", label: "Least Count", unit: "cm" }
        ]
      },
      {
        id: "diameter",
        label: "Table 2: Cylinder Diameter (Vernier Caliper)",
        defaultRows: 3,
        columns: [
          { key: "obs", label: "Obs" },
          { key: "msr", label: "MSR", unit: "cm" },
          { key: "vc", label: "VC" },
          { key: "vsr", label: "VSR", unit: "cm" },
          { key: "total", label: "Total", unit: "cm" }
        ],
        aiInputFields: [
          { key: "msr", label: "Main Scale Reading", unit: "cm" }
        ]
      },
      {
        id: "twist",
        label: "Table 3: Load vs Twist",
        defaultRows: 6,
        columns: [
          { key: "load", label: "Load", unit: "kg" },
          { key: "inc", label: "Scale Reading Inc", unit: "cm" },
          { key: "dec", label: "Scale Reading Dec", unit: "cm" },
          { key: "mean", label: "Mean Angle", unit: "deg" },
          { key: "twist", label: "Twist θ", unit: "deg" }
        ],
        aiInputFields: [
          { key: "load", label: "Load", unit: "kg" }
        ]
      }
    ],
    graphs: [
      {
        id: "load-vs-twist",
        title: "Graph of Load vs Twist Angle",
        tableId: "twist",
        xKey: "twist",
        yKey: "load",
        xLabel: "Twist angle (θ)",
        yLabel: "Load",
        xUnit: "deg",
        yUnit: "kg"
      }
    ],
    questions: [
      { q: "What is rigidity modulus?", a: "Ratio of shear stress to shear strain." },
      { q: "What is torsion?", a: "Twisting of a wire due to applied torque." },
      { q: "Define torque.", a: "Product of force and perpendicular distance." }
    ]
  },
  {
    id: "surface-tension",
    title: "Surface Tension (Capillary Rise)",
    category: "Fluid Mechanics",
    aim: "Determine the surface tension of a liquid using the capillary rise method.",
    apparatus: ["Capillary tube", "Traveling microscope", "Beaker", "Liquid"],
    theory: "Surface tension T = (r·h·ρ·g) / 2 where r is radius of tube and h is height of rise.",
    formula: "T = (r·h·ρ·g) / 2",
    standardValue: 72,
    unit: "dyne/cm",
    tables: [
      {
        id: "height",
        label: "Table 1: Height Measurement",
        defaultRows: 3,
        columns: [
          { key: "tube", label: "Tube #" },
          { key: "meniscus", label: "Meniscus Reading", unit: "cm" },
          { key: "needle", label: "Needle Reading", unit: "cm" },
          { key: "h", label: "Height h", unit: "cm" }
        ],
        aiInputFields: [
          { key: "h", label: "Height h", unit: "cm" }
        ]
      },
      {
        id: "diameter",
        label: "Table 2: Diameter Measurement",
        defaultRows: 3,
        columns: [
          { key: "lhs", label: "LHS Reading", unit: "cm" },
          { key: "rhs", label: "RHS Reading", unit: "cm" },
          { key: "d1", label: "Diameter D1", unit: "cm" }
        ],
        aiInputFields: [
          { key: "d1", label: "Diameter D1", unit: "cm" }
        ]
      },
      {
        id: "final-calc",
        label: "Table 3: Final Calculation",
        defaultRows: 3,
        columns: [
          { key: "tube", label: "Tube #" },
          { key: "h", label: "Height h", unit: "cm" },
          { key: "r", label: "Radius r", unit: "cm" },
          { key: "T", label: "Surface Tension T", unit: "dyne/cm" }
        ],
        aiInputFields: [
          { key: "r", label: "Radius r", unit: "cm" }
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
        yLabel: "Height (h)",
        xUnit: "cm⁻¹",
        yUnit: "cm"
      }
    ],
    questions: [
      { q: "What is surface tension?", a: "Force per unit length acting along surface of liquid." },
      { q: "What is capillary rise?", a: "Rise of liquid in narrow tube." }
    ]
  },
  {
    id: "sonometer",
    title: "Sonometer (Laws of Vibration)",
    category: "Acoustics",
    aim: "To verify the laws of transverse vibration of strings using a sonometer.",
    apparatus: ["Sonometer", "Tuning forks", "Weights"],
    theory: "Frequency n = (1/2l)√(T/m) where T is tension and m is linear mass density.",
    formula: "n = (1/2l)√(T/m)",
    standardValue: 256,
    unit: "Hz",
    tables: [
      {
        id: "law-length",
        label: "Table 1: Frequency vs Length",
        defaultRows: 5,
        columns: [
          { key: "obs", label: "Obs" },
          { key: "freq", label: "Frequency n", unit: "Hz" },
          { key: "inc", label: "Length Inc", unit: "cm" },
          { key: "dec", label: "Length Dec", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "inv_l", label: "1/l", unit: "cm⁻¹" },
          { key: "nl", label: "n × l" }
        ],
        aiInputFields: [
          { key: "freq", label: "Frequency n", unit: "Hz" }
        ]
      },
      {
        id: "law-tension",
        label: "Table 2: Tension vs Length",
        defaultRows: 5,
        columns: [
          { key: "tension", label: "Tension T", unit: "N" },
          { key: "inc", label: "Length Inc", unit: "cm" },
          { key: "dec", label: "Length Dec", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "sqrt_t", label: "√T", unit: "√N" },
          { key: "l2", label: "l²", unit: "cm²" },
          { key: "Tl2", label: "T/l²" }
        ],
        aiInputFields: [
          { key: "tension", label: "Tension T", unit: "N" }
        ]
      }
    ],
    graphs: [
      {
        id: "n-vs-invl",
        title: "Graph: n vs 1/l",
        tableId: "law-length",
        xKey: "inv_l",
        yKey: "freq",
        xLabel: "1/l",
        yLabel: "Frequency (n)",
        xUnit: "cm⁻¹",
        yUnit: "Hz"
      },
      {
        id: "n-vs-sqrtt",
        title: "Graph: n vs √T",
        tableId: "law-tension",
        xKey: "sqrt_t",
        yKey: "freq",
        xLabel: "√T",
        yLabel: "Frequency (n)",
        xUnit: "√N",
        yUnit: "Hz"
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
    theory: "Wavelength λ = (D²m - D²n) / [4R(m - n)] where D is ring diameter and R is lens radius.",
    formula: "λ = (D²m - D²n) / [4R(m - n)]",
    standardValue: 5893,
    unit: "Å",
    tables: [
      {
        id: "rings",
        label: "Observation Table (Rings)",
        defaultRows: 10,
        columns: [
          { key: "ring_no", label: "Ring No" },
          { key: "initial", label: "Initial Reading", unit: "cm" },
          { key: "final", label: "Final Reading", unit: "cm" },
          { key: "diameter", label: "Diameter D", unit: "cm" },
          { key: "d2", label: "D²", unit: "cm²" }
        ],
        aiInputFields: [
          { key: "ring_no", label: "Ring No" }
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
        xLabel: "Ring Number (n)",
        yLabel: "D²",
        xUnit: "",
        yUnit: "cm²"
      }
    ],
    questions: [
      { q: "Why rings are circular?", a: "Because air film thickness is circular." },
      { q: "Why central spot dark?", a: "Due to phase change on reflection." }
    ]
  },
  {
    id: "laser-wavelength",
    title: "LASER Wavelength using Grating",
    category: "Optics",
    aim: "To determine the wavelength of a LASER beam using a diffraction grating.",
    apparatus: ["LASER source", "Diffraction grating", "Screen"],
    theory: "mλ = (a+b)sinθ where m is the order and θ is the diffraction angle.",
    formula: "λ = (a+b)sinθ / m",
    standardValue: 6328,
    unit: "Å",
    tables: [
      {
        id: "laser-obs",
        label: "Observation Table",
        defaultRows: 8,
        columns: [
          { key: "lines_cm", label: "Lines/cm" },
          { key: "element", label: "Grating Element" },
          { key: "order", label: "Order m" },
          { key: "y", label: "y", unit: "cm" },
          { key: "D", label: "D", unit: "cm" },
          { key: "sin_theta", label: "sinθ" },
          { key: "lambda", label: "λ", unit: "Å" }
        ],
        aiInputFields: [
          { key: "order", label: "Order m" }
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
      { q: "What is LASER?", a: "Light Amplification by Stimulated Emission of Radiation." },
      { q: "What is diffraction?", a: "Bending of light around edges." }
    ]
  },
  {
    id: "rc-circuit",
    title: "RC Circuit (Charging & Discharging)",
    category: "Electricity",
    aim: "Study the charging and discharging of a capacitor in an RC circuit.",
    apparatus: ["Resistor", "Capacitor", "Power supply", "Voltmeter", "Stopwatch"],
    theory: "V = V₀(1 - e^(-t/RC)) for charging and V = V₀e^(-t/RC) for discharging.",
    formula: "τ = RC",
    standardValue: 10,
    unit: "s",
    tables: [
      {
        id: "rc-data",
        label: "Observation Table",
        defaultRows: 20,
        columns: [
          { key: "time", label: "Time", unit: "s" },
          { key: "v_charge", label: "Charging Voltage", unit: "V" },
          { key: "v_discharge", label: "Discharging Voltage", unit: "V" }
        ],
        aiInputFields: [
          { key: "time", label: "Time t", unit: "s" }
        ]
      }
    ],
    graphs: [
      {
        id: "time-vs-v-charge",
        title: "Capacitor Charging Curve",
        tableId: "rc-data",
        xKey: "time",
        yKey: "v_charge",
        xLabel: "Time",
        yLabel: "Charging voltage",
        xUnit: "s",
        yUnit: "V",
        type: "monotone"
      },
      {
        id: "time-vs-v-discharge",
        title: "Capacitor Discharging Curve",
        tableId: "rc-data",
        xKey: "time",
        yKey: "v_discharge",
        xLabel: "Time",
        yLabel: "Discharging voltage",
        xUnit: "s",
        yUnit: "V",
        type: "monotone"
      }
    ],
    questions: [
      { q: "What is capacitor?", a: "Device that stores electric charge." },
      { q: "What is time constant?", a: "Time to reach 63% of final voltage." }
    ]
  },
  {
    id: "bjt-ce",
    title: "BJT Characteristics (Common Emitter)",
    category: "Electronics",
    aim: "Find input and output resistance of a BJT in CE configuration.",
    apparatus: ["BJT", "Variable DC supply", "Ammeters", "Voltmeters"],
    theory: "Input resistance Ri = ΔVBE / ΔIB and current gain Ic = βIb.",
    formula: "Ic = βIb",
    standardValue: 150,
    unit: "",
    tables: [
      {
        id: "input-char",
        label: "Table 1: Input Characteristics",
        defaultRows: 10,
        columns: [
          { key: "vbe", label: "VBE", unit: "V" },
          { key: "ib_1v", label: "IB at VCE=1V", unit: "µA" },
          { key: "ib_4v", label: "IB at VCE=4V", unit: "µA" },
          { key: "ib_8v", label: "IB at VCE=8V", unit: "µA" }
        ],
        aiInputFields: [
          { key: "vbe", label: "VBE", unit: "V" }
        ]
      },
      {
        id: "output-char",
        label: "Table 2: Output Characteristics",
        defaultRows: 10,
        columns: [
          { key: "vce", label: "VCE", unit: "V" },
          { key: "ic_125", label: "IC at IB=125µA", unit: "mA" },
          { key: "ic_150", label: "IC at IB=150µA", unit: "mA" },
          { key: "ic_175", label: "IC at IB=175µA", unit: "mA" }
        ],
        aiInputFields: [
          { key: "vce", label: "VCE", unit: "V" }
        ]
      }
    ],
    graphs: [
      {
        id: "input-graph",
        title: "Input Characteristics (VBE vs IB)",
        tableId: "input-char",
        xKey: "vbe",
        yKey: ["ib_1v", "ib_4v", "ib_8v"],
        xLabel: "VBE",
        yLabel: "IB",
        xUnit: "V",
        yUnit: "µA",
        type: "monotone",
        multiSeries: [
          { key: "ib_1v", label: "VCE=1V", color: "#3b82f6" },
          { key: "ib_4v", label: "VCE=4V", color: "#ef4444" },
          { key: "ib_8v", label: "VCE=8V", color: "#10b981" }
        ]
      },
      {
        id: "output-graph",
        title: "Output Characteristics (VCE vs IC)",
        tableId: "output-char",
        xKey: "vce",
        yKey: ["ic_125", "ic_150", "ic_175"],
        xLabel: "VCE",
        yLabel: "IC",
        xUnit: "V",
        yUnit: "mA",
        type: "monotone",
        multiSeries: [
          { key: "ic_125", label: "IB=125µA", color: "#3b82f6" },
          { key: "ic_150", label: "IB=150µA", color: "#ef4444" },
          { key: "ic_175", label: "IB=175µA", color: "#10b981" }
        ]
      }
    ],
    questions: [
      { q: "Why base is thin?", a: "To allow maximum carriers to pass." },
      { q: "Define current gain (β).", a: "β = Ic / Ib." }
    ]
  },
  {
    id: "metre-bridge",
    title: "Metre Bridge (Resistance)",
    category: "Electricity",
    aim: "Determine unknown resistance using a Metre Bridge.",
    apparatus: ["Metre bridge", "Galvanometer", "Resistance box", "Unknown resistance"],
    theory: "Based on Wheatstone bridge principle: P/Q = l1/l2.",
    formula: "P/Q = l1/l2",
    standardValue: 10,
    unit: "Ω",
    tables: [
      {
        id: "resistance",
        label: "Observation Table",
        defaultRows: 10,
        columns: [
          { key: "res_p", label: "Resistance P", unit: "Ω" },
          { key: "l1", label: "l1", unit: "cm" },
          { key: "l2", label: "l2", unit: "cm" },
          { key: "q", label: "Q", unit: "Ω" }
        ],
        aiInputFields: [
          { key: "res_p", label: "Resistance P", unit: "Ω" }
        ]
      }
    ],
    graphs: [
      {
        id: "l1-vs-l2",
        title: "Verification of Wheatstone Bridge",
        tableId: "resistance",
        xKey: "l1",
        yKey: "l2",
        xLabel: "l1",
        yLabel: "l2",
        xUnit: "cm",
        yUnit: "cm"
      }
    ],
    questions: [
      { q: "What principle used?", a: "Wheatstone bridge principle." },
      { q: "What is balancing length?", a: "Length at which galvanometer shows zero deflection." }
    ]
  },
  {
    id: "pn-junction",
    title: "PN Junction Diode",
    category: "Electronics",
    aim: "To study the V-I characteristics of a PN junction diode.",
    apparatus: ["PN diode", "Voltmeter", "Ammeter", "Power supply"],
    theory: "I = Is(e^(V/ηVt) - 1).",
    formula: "I = Is(e^(V/ηVt) - 1)",
    standardValue: 0.7,
    unit: "V",
    tables: [
      {
        id: "characteristics",
        label: "Observation Table",
        defaultRows: 10,
        columns: [
          { key: "f_v", label: "Forward Voltage", unit: "V" },
          { key: "f_i", label: "Forward Current", unit: "mA" },
          { key: "r_v", label: "Reverse Voltage", unit: "V" },
          { key: "r_i", label: "Reverse Current", unit: "µA" }
        ],
        aiInputFields: [
          { key: "f_v", label: "Forward Voltage", unit: "V" }
        ]
      }
    ],
    graphs: [
      {
        id: "forward-graph",
        title: "Forward Bias V-I Characteristics",
        tableId: "characteristics",
        xKey: "f_v",
        yKey: "f_i",
        xLabel: "Forward voltage",
        yLabel: "Forward current",
        xUnit: "V",
        yUnit: "mA",
        type: "monotone"
      },
      {
        id: "reverse-graph",
        title: "Reverse Bias V-I Characteristics",
        tableId: "characteristics",
        xKey: "r_v",
        yKey: "r_i",
        xLabel: "Reverse voltage",
        yLabel: "Reverse current",
        xUnit: "V",
        yUnit: "µA",
        type: "monotone"
      }
    ],
    questions: [
      { q: "What is knee voltage?", a: "Voltage where current increases rapidly." },
      { q: "What is breakdown voltage?", a: "Voltage at which reverse current increases suddenly." }
    ]
  }
];

export const standardValues = [
  { name: "Acceleration due to gravity (g)", value: "981 cm/s²" },
  { name: "Sodium light wavelength (λ)", value: "5893 Å" },
  { name: "Young's Modulus (Copper)", value: "12.4 x 10¹¹ dyne/cm²" },
  { name: "Rigidity Modulus (Steel)", value: "8.22 x 10¹¹ dyne/cm²" }
];
