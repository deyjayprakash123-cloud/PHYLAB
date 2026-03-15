export type TableHeader = { key: string; label: string; unit?: string };
export type TableDefinition = {
  id: string;
  label: string;
  columns: TableHeader[];
  defaultRows?: number;
  principal?: {
    key: string;
    label: string;
    unit?: string;
  };
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
  standardValue?: number;
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
    apparatus: ["Bar pendulum", "Stopwatch", "Meter scale", "Knife edge support", "Telescope"],
    theory: "g = 4π²L/T² where L is the equivalent length and T is the time period.",
    formula: "g = 4π² * (L/T²)",
    standardValue: 981,
    unit: "cm/s²",
    tables: [
      {
        id: "time-measurement",
        label: "Table 1: Time Measurement (20 Oscillations)",
        defaultRows: 19,
        principal: { key: "g_target", label: "Target g", unit: "cm/s²" },
        columns: [
          { key: "hole_no", label: "Hole No" },
          { key: "dist_cg", label: "Dist from CG", unit: "cm" },
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
        defaultRows: 3,
        columns: [
          { key: "set_no", label: "Set No" },
          { key: "L1", label: "L1", unit: "cm" },
          { key: "L2", label: "L2", unit: "cm" },
          { key: "mean_L", label: "Mean L", unit: "cm" },
          { key: "T", label: "T", unit: "s" },
          { key: "T2", label: "T²", unit: "s²" },
          { key: "L_T2", label: "L/T²" },
        ]
      }
    ],
    graphs: [
      {
        id: "l-vs-t2",
        title: "L vs T² Graph",
        tableId: "eq-len-calc",
        xKey: "T2",
        yKey: "mean_L",
        xLabel: "Time period squared (T²)",
        yLabel: "Equivalent length (L)",
        xUnit: "s²",
        yUnit: "cm",
        equationFormat: "L = mT² + c"
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
    title: "Young’s Modulus (Bending of Beam)",
    category: "Properties of Matter",
    aim: "To determine Young’s Modulus of the material of a rectangular beam by the method of bending.",
    apparatus: ["Rectangular beam", "Knife edges", "Screw gauge", "Vernier caliper", "Weights"],
    theory: "Young's modulus Y = MgL³ / 4bd³δ.",
    formula: "Y = (M/δ) * (gL³/4bd³)",
    standardValue: 1.24e12,
    unit: "dyne/cm²",
    tables: [
      {
        id: "thickness",
        label: "Table 1: Thickness (Screw Gauge)",
        defaultRows: 5,
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
          { key: "mean_d", label: "Mean Thickness d", unit: "cm" },
        ]
      },
      {
        id: "breadth",
        label: "Table 2: Breadth (Vernier Caliper)",
        defaultRows: 5,
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "msr", label: "Main Scale Reading (MSR)", unit: "cm" },
          { key: "vc", label: "Vernier Coincidence (VC)" },
          { key: "vsr", label: "VSR = VC×LC", unit: "cm" },
          { key: "total", label: "Total Reading", unit: "cm" },
          { key: "mean_b", label: "Mean Breadth b", unit: "cm" },
        ]
      },
      {
        id: "depression",
        label: "Table 3: Load vs Depression",
        defaultRows: 6,
        principal: { key: "Y_target", label: "Target Y", unit: "dyne/cm²" },
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
        yUnit: "gm",
        equationFormat: "M = mδ + c"
      }
    ],
    questions: [
      { q: "What is Young’s modulus?", a: "Ratio of stress to strain within elastic limit." },
      { q: "What is stress?", a: "Force per unit area." },
      { q: "What is strain?", a: "Change in dimension / original dimension." },
      { q: "State Hooke’s Law.", a: "Stress is directly proportional to strain within elastic limit." },
      { q: "Unit of Young’s modulus?", a: "N/m² or dyne/cm²." },
      { q: "Why load applied at center?", a: "To get uniform bending." },
      { q: "What happens beyond elastic limit?", a: "Material deforms permanently." },
      { q: "What is bending moment?", a: "Turning effect produced by applied load." }
    ]
  },
  {
    id: "rigidity-modulus",
    title: "Rigidity Modulus (Barton's Apparatus)",
    category: "Properties of Matter",
    aim: "To determine the rigidity modulus (η) of the material of a wire.",
    apparatus: ["Barton's apparatus", "Weights", "Vernier caliper", "Screw gauge"],
    theory: "η = (gd⁴l) / (πr⁴θ).",
    formula: "η = (g * d^4 * l) / (π * r^4 * θ)",
    standardValue: 8.22e11,
    unit: "dyne/cm²",
    tables: [
      {
        id: "radius",
        label: "Table 1: Radius of Rod",
        defaultRows: 5,
        columns: [
          { key: "obs", label: "Obs" },
          { key: "pitch", label: "Pitch", unit: "cm" },
          { key: "lc", label: "LC", unit: "cm" },
          { key: "icsr", label: "ICSR" },
          { key: "n", label: "No Rotations" },
          { key: "psr", label: "PSR", unit: "cm" },
          { key: "diff", label: "Difference" },
          { key: "csr", label: "CSR", unit: "cm" },
          { key: "total", label: "Total", unit: "cm" },
          { key: "mean_r", label: "Mean Radius", unit: "cm" },
        ]
      },
      {
        id: "diameter",
        label: "Table 2: Cylinder Diameter",
        defaultRows: 5,
        columns: [
          { key: "obs", label: "Obs" },
          { key: "msr", label: "MSR", unit: "cm" },
          { key: "vc", label: "VC" },
          { key: "vsr", label: "VSR", unit: "cm" },
          { key: "total", label: "Total", unit: "cm" },
          { key: "mean_d", label: "Mean Diameter", unit: "cm" },
        ]
      },
      {
        id: "twist",
        label: "Table 3: Load vs Twist",
        defaultRows: 6,
        principal: { key: "eta_target", label: "Target η", unit: "dyne/cm²" },
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
      { q: "What is rigidity modulus?", a: "Ratio of shear stress to shear strain." },
      { q: "What is torsion?", a: "Twisting of a wire due to applied torque." },
      { q: "Define torque.", a: "Product of force and perpendicular distance." },
      { q: "Unit of rigidity modulus?", a: "N/m²." },
      { q: "Why three scales used?", a: "To improve accuracy." },
      { q: "Why small twist preferred?", a: "To satisfy Hooke’s law." },
      { q: "Difference between Young’s and rigidity modulus?", a: "Young’s deals with longitudinal stress, rigidity with shear stress." }
    ]
  },
  {
    id: "surface-tension",
    title: "Surface Tension (Capillary Rise)",
    category: "Fluid Mechanics",
    aim: "Determine the surface tension of a liquid using the capillary rise method.",
    apparatus: ["Capillary tube", "Traveling microscope", "Beaker", "Liquid"],
    theory: "T = (r * h * ρ * g) / 2.",
    formula: "T = (r * h * ρ * g) / 2",
    standardValue: 72,
    unit: "dyne/cm",
    tables: [
      {
        id: "height",
        label: "Table 1: Height Measurement",
        defaultRows: 3,
        columns: [
          { key: "tube", label: "Tube" },
          { key: "meniscus", label: "Meniscus Reading", unit: "cm" },
          { key: "needle", label: "Needle Reading", unit: "cm" },
          { key: "h", label: "Height h", unit: "cm" },
        ]
      },
      {
        id: "diameter",
        label: "Table 2: Diameter Measurement",
        defaultRows: 3,
        columns: [
          { key: "tube", label: "Tube" },
          { key: "lhs", label: "LHS Reading", unit: "cm" },
          { key: "rhs", label: "RHS Reading", unit: "cm" },
          { key: "d1", label: "D1", unit: "cm" },
        ]
      },
      {
        id: "final-calc",
        label: "Table 3: Final Calculation",
        defaultRows: 3,
        principal: { key: "T_target", label: "Target T", unit: "dyne/cm" },
        columns: [
          { key: "tube", label: "Tube" },
          { key: "h", label: "Height h", unit: "cm" },
          { key: "r", label: "Radius r", unit: "cm" },
          { key: "inv_r", label: "1/r", unit: "cm⁻¹" },
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
      { q: "What is surface tension?", a: "Force per unit length acting along surface of liquid." },
      { q: "What is capillary rise?", a: "Rise of liquid in narrow tube." },
      { q: "Why water rises in glass?", a: "Adhesion force > cohesion force." },
      { q: "Unit of surface tension?", a: "N/m or dyne/cm." },
      { q: "Why cosθ ≈ 1?", a: "Because angle of contact for water is nearly zero." },
      { q: "Why mercury shows depression?", a: "Cohesion > adhesion." },
      { q: "Effect of temperature?", a: "Surface tension decreases with increase in temperature." }
    ]
  },
  {
    id: "sonometer",
    title: "Sonometer (Laws of Vibration)",
    category: "Acoustics",
    aim: "To verify the laws of transverse vibration of strings using a sonometer.",
    apparatus: ["Sonometer", "Tuning forks", "Weights"],
    theory: "Frequency n = (1/2l)√(T/m).",
    formula: "n ∝ 1/l and n ∝ √T",
    standardValue: 256,
    unit: "Hz",
    tables: [
      {
        id: "law-length",
        label: "Table 1: Frequency vs Length (Constant Weight)",
        defaultRows: 5,
        principal: { key: "n_target", label: "Target n", unit: "Hz" },
        columns: [
          { key: "obs_no", label: "Obs" },
          { key: "freq", label: "Frequency n", unit: "Hz" },
          { key: "inc", label: "Length Increasing", unit: "cm" },
          { key: "dec", label: "Length Decreasing", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "inv_l", label: "1/l", unit: "cm⁻¹" },
          { key: "nl", label: "n×l" },
        ]
      },
      {
        id: "law-tension",
        label: "Table 2: Tension vs Length (Constant Frequency)",
        defaultRows: 5,
        principal: { key: "n_target", label: "Target n", unit: "Hz" },
        columns: [
          { key: "obs_no", label: "Obs" },
          { key: "tension", label: "Tension T", unit: "N" },
          { key: "inc", label: "Length Increasing", unit: "cm" },
          { key: "dec", label: "Length Decreasing", unit: "cm" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "l2", label: "l²", unit: "cm²" },
          { key: "T_l2", label: "T/l²" },
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
        yKey: "freq",
        xLabel: "√T",
        yLabel: "Frequency (n)",
        xUnit: "√N",
        yUnit: "Hz"
      }
    ],
    questions: [
      { q: "What is transverse wave?", a: "Wave in which particles vibrate perpendicular to direction of motion." },
      { q: "Define node.", a: "Point of zero displacement." },
      { q: "Define antinode.", a: "Point of maximum displacement." },
      { q: "Law of length?", a: "n ∝ 1/l." },
      { q: "Law of tension?", a: "n ∝ √T." },
      { q: "What is resonance?", a: "When frequency of source equals natural frequency." },
      { q: "What is fundamental frequency?", a: "Lowest frequency of vibration." }
    ]
  },
  {
    id: "newtons-rings",
    title: "Newton’s Rings",
    category: "Optics",
    aim: "To determine the wavelength of sodium light using Newton’s Rings.",
    apparatus: ["Sodium lamp", "Traveling microscope", "Plano-convex lens", "Glass plate"],
    theory: "λ = (D²m - D²n) / [4R(m - n)].",
    formula: "λ = slope / 4R",
    standardValue: 5893,
    unit: "Å",
    tables: [
      {
        id: "rings",
        label: "Observation Table (10 Rings)",
        defaultRows: 10,
        principal: { key: "lambda_target", label: "Target λ", unit: "Å" },
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
        yUnit: "cm²",
        equationFormat: "D² = mn + c"
      }
    ],
    questions: [
      { q: "What is interference?", a: "Superposition of two light waves." },
      { q: "Why rings are circular?", a: "Because air film thickness is circular." },
      { q: "Why central spot dark?", a: "Due to phase change on reflection." },
      { q: "Why sodium light used?", a: "It is monochromatic." },
      { q: "Formula for wavelength?", a: "λ = (D²m - D²n) / [4R(m - n)]" },
      { q: "What is coherence?", a: "Constant phase difference between waves." },
      { q: "What happens with white light?", a: "Colored rings are formed." }
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
        principal: { key: "lambda_target", label: "Target λ", unit: "Å" },
        columns: [
          { key: "obs", label: "Obs" },
          { key: "lines", label: "Lines/cm" },
          { key: "grating", label: "Grating Element" },
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
        xLabel: "Order of spectrum (m)",
        yLabel: "sinθ",
        xUnit: "",
        yUnit: ""
      }
    ],
    questions: [
      { q: "What is LASER?", a: "Light Amplification by Stimulated Emission of Radiation." },
      { q: "What is diffraction?", a: "Bending of light around edges." },
      { q: "Grating equation?", a: "mλ = d sinθ" },
      { q: "What is order of spectrum?", a: "Position number of bright fringe." },
      { q: "Why LASER preferred?", a: "Highly monochromatic and coherent." },
      { q: "What is zero order?", a: "Central bright spot." }
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
    unit: "s",
    tables: [
      {
        id: "rc-data",
        label: "Time-Voltage Table",
        defaultRows: 20,
        principal: { key: "tau_target", label: "Target τ", unit: "s" },
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
        title: "Capacitor Charging Curve",
        tableId: "rc-data",
        xKey: "time",
        yKey: "v_charge",
        xLabel: "Time",
        yLabel: "Charging Voltage",
        xUnit: "s",
        yUnit: "V",
        type: "monotone"
      },
      {
        id: "time-vs-vd",
        title: "Capacitor Discharging Curve",
        tableId: "rc-data",
        xKey: "time",
        yKey: "v_discharge",
        xLabel: "Time",
        yLabel: "Discharging Voltage",
        xUnit: "s",
        yUnit: "V",
        type: "monotone"
      }
    ],
    questions: [
      { q: "What is capacitor?", a: "Device that stores electric charge." },
      { q: "What is time constant?", a: "Time to reach 63% of final voltage." },
      { q: "Formula of time constant?", a: "τ = RC" },
      { q: "Why exponential curve formed?", a: "Because charging follows exponential law." },
      { q: "What happens if R increases?", a: "Time constant increases." },
      { q: "What is dielectric?", a: "Insulating material between plates." }
    ]
  },
  {
    id: "bjt-ce",
    title: "BJT Characteristics (Common Emitter)",
    category: "Electronics",
    aim: "Find input and output resistance of a BJT in CE configuration.",
    apparatus: ["BJT", "Variable DC supply", "Ammeters", "Voltmeters"],
    theory: "Ri = ΔVBE / ΔIB, Ro = ΔVCE / ΔIC.",
    formula: "R = ΔV / ΔI",
    unit: "Ω",
    tables: [
      {
        id: "input-char",
        label: "Table 1: Input Characteristics",
        defaultRows: 10,
        principal: { key: "Ri_target", label: "Target Ri", unit: "Ω" },
        columns: [
          { key: "vbe", label: "VBE", unit: "V" },
          { key: "ib_1v", label: "IB at VCE=1V", unit: "µA" },
          { key: "ib_4v", label: "IB at VCE=4V", unit: "µA" },
          { key: "ib_8v", label: "IB at VCE=8V", unit: "µA" },
        ]
      },
      {
        id: "output-char",
        label: "Table 2: Output Characteristics",
        defaultRows: 10,
        principal: { key: "Ro_target", label: "Target Ro", unit: "Ω" },
        columns: [
          { key: "vce", label: "VCE", unit: "V" },
          { key: "ic_125", label: "IC at IB=125µA", unit: "mA" },
          { key: "ic_150", label: "IC at IB=150µA", unit: "mA" },
          { key: "ic_175", label: "IC at IB=175µA", unit: "mA" },
        ]
      }
    ],
    graphs: [
      {
        id: "input-graph",
        title: "Input Characteristics of BJT",
        tableId: "input-char",
        xKey: "vbe",
        yKey: ["ib_1v", "ib_4v", "ib_8v"],
        xLabel: "Base-Emitter Voltage (VBE)",
        yLabel: "Base Current (IB)",
        xUnit: "V",
        yUnit: "µA",
        type: "monotone",
        multiSeries: [
          { key: "ib_1v", label: "VCE = 1V", color: "#3b82f6" },
          { key: "ib_4v", label: "VCE = 4V", color: "#ef4444" },
          { key: "ib_8v", label: "VCE = 8V", color: "#10b981" }
        ]
      },
      {
        id: "output-graph",
        title: "Output Characteristics of BJT",
        tableId: "output-char",
        xKey: "vce",
        yKey: ["ic_125", "ic_150", "ic_175"],
        xLabel: "Collector-Emitter Voltage (VCE)",
        yLabel: "Collector Current (IC)",
        xUnit: "V",
        yUnit: "mA",
        type: "monotone",
        multiSeries: [
          { key: "ic_125", label: "IB = 125µA", color: "#3b82f6" },
          { key: "ic_150", label: "IB = 150µA", color: "#ef4444" },
          { key: "ic_175", label: "IB = 175µA", color: "#10b981" }
        ]
      }
    ],
    questions: [
      { q: "What is transistor?", a: "Semiconductor device used for amplification." },
      { q: "What are three regions?", a: "Emitter, Base, Collector." },
      { q: "Why base is thin?", a: "To allow maximum carriers to pass." },
      { q: "Define current gain (β).", a: "β = Ic / Ib." },
      { q: "What is active region?", a: "Region where transistor amplifies." },
      { q: "Why CE configuration popular?", a: "High gain and moderate input resistance." }
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
        label: "Observation Table (10 Observations)",
        defaultRows: 10,
        principal: { key: "Q_target", label: "Target Q", unit: "Ω" },
        columns: [
          { key: "obs", label: "Obs" },
          { key: "res_p", label: "Resistance P", unit: "Ω" },
          { key: "l1", label: "l1", unit: "cm" },
          { key: "l2", label: "l2 = 100 - l1", unit: "cm" },
          { key: "q", label: "Q", unit: "Ω" },
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
      { q: "What is balancing length?", a: "Length at which galvanometer shows zero deflection." },
      { q: "Formula?", a: "P/Q = l1/l2" },
      { q: "Why wire must be uniform?", a: "For uniform resistance per unit length." },
      { q: "What is null point?", a: "Point of zero current in galvanometer." }
    ]
  },
  {
    id: "pn-junction",
    title: "PN Junction Diode",
    category: "Electronics",
    aim: "To study the V-I characteristics of a PN junction diode.",
    apparatus: ["PN diode", "Voltmeter", "Ammeter", "Power supply"],
    theory: "Current follows exponential relationship in forward bias.",
    formula: "I = Is * (e^(V/ηVt) - 1)",
    standardValue: 0.7,
    unit: "V",
    tables: [
      {
        id: "characteristics",
        label: "V-I Characteristics (10 Readings)",
        defaultRows: 10,
        principal: { key: "knee_target", label: "Target Knee V", unit: "V" },
        columns: [
          { key: "v_f", label: "Forward Voltage", unit: "V" },
          { key: "i_f", label: "Forward Current", unit: "mA" },
          { key: "v_r", label: "Reverse Voltage", unit: "V" },
          { key: "i_r", label: "Reverse Current", unit: "µA" },
        ]
      }
    ],
    graphs: [
      {
        id: "forward-graph",
        title: "Forward Bias V-I Characteristics",
        tableId: "characteristics",
        xKey: "v_f",
        yKey: "i_f",
        xLabel: "Voltage",
        yLabel: "Current",
        xUnit: "V",
        yUnit: "mA",
        type: "monotone"
      },
      {
        id: "reverse-graph",
        title: "Reverse Bias V-I Characteristics",
        tableId: "characteristics",
        xKey: "v_r",
        yKey: "i_r",
        xLabel: "Voltage",
        yLabel: "Current",
        xUnit: "V",
        yUnit: "µA",
        type: "monotone"
      }
    ],
    questions: [
      { q: "What is P-type semiconductor?", a: "Semiconductor with excess holes." },
      { q: "What is N-type semiconductor?", a: "Semiconductor with excess electrons." },
      { q: "What is depletion region?", a: "Region with no free charge carriers." },
      { q: "What is knee voltage?", a: "Voltage where current increases rapidly." },
      { q: "What is breakdown voltage?", a: "Voltage at which reverse current increases suddenly." },
      { q: "What is rectifier?", a: "Device converting AC to DC." }
    ]
  }
];

export const standardValues = [
  { name: "Acceleration due to gravity (g)", value: "981 cm/s²" },
  { name: "Density of water", value: "1 g/cm³" },
  { name: "Sodium light wavelength (λ)", value: "5890–5896 Å" },
  { name: "Surface tension of water", value: "69–72 dyne/cm" },
  { name: "Young's Modulus (Copper)", value: "12.4 x 10¹¹ dyne/cm²" },
  { name: "Rigidity Modulus (Steel)", value: "8.22 x 10¹¹ dyne/cm²" },
  { name: "Plank's Constant (h)", value: "6.626 x 10⁻³⁴ J·s" },
  { name: "Speed of Light (c)", value: "3 x 10⁸ m/s" }
];
