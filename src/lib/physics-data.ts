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
  yKey: string | string[];
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  type?: "linear" | "monotone";
  equationFormat?: string;
  multiSeries?: { key: string; label: string; color: string }[];
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
    theory: "g = 4π²L/T² where L is the equivalent length and T is the time period.",
    formula: "g = 4π² * (L/T²)",
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
          { key: "T_period_sq", label: "T²", unit: "s²" },
        ]
      }
    ],
    graphs: [
      {
        id: "l-vs-t2",
        title: "Graph of L vs T²",
        tableId: "eq-len-calc",
        xKey: "T_period_sq",
        yKey: "eq_len",
        xLabel: "Time period squared (T²)",
        yLabel: "Equivalent length (L)",
        xUnit: "s²",
        yUnit: "cm",
        equationFormat: "L = mT² + c"
      }
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
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "icsr", label: "ICSR" },
          { key: "n_rot", label: "N (Rotations)" },
          { key: "psr", label: "PSR", unit: "cm" },
          { key: "diff", label: "Diff (I-F)" },
          { key: "csr", label: "CSR", unit: "cm" },
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
          { key: "vsr", label: "VSR", unit: "cm" },
          { key: "total", label: "Total", unit: "cm" },
        ]
      },
      {
        id: "depression",
        label: "Table 3: Depression Measurement",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "load", label: "Load", unit: "gm" },
          { key: "mean_total", label: "Mean (a+b)/2", unit: "cm" },
          { key: "depression", label: "Depression δ", unit: "cm" },
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
        yUnit: "gm",
        equationFormat: "M = mδ + c"
      }
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
        label: "Table 1: Radius of Wire (Screw Gauge)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "total", label: "Total", unit: "cm" },
        ]
      },
      {
        id: "diameter",
        label: "Table 2: Diameter of Cylinder (Vernier)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "total", label: "Total", unit: "cm" },
        ]
      },
      {
        id: "twist",
        label: "Table 3: Twist Angle Measurement",
        columns: [
          { key: "load", label: "Load", unit: "kg" },
          { key: "twist", label: "Twist θ", unit: "deg" },
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
        yLabel: "Load applied",
        xUnit: "deg",
        yUnit: "kg"
      }
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
        id: "final-calc",
        label: "Final Calculation Table",
        columns: [
          { key: "tube_no", label: "Tube No" },
          { key: "h", label: "h", unit: "cm" },
          { key: "inv_r", label: "1/r", unit: "cm⁻¹" },
          { key: "T", label: "T", unit: "dyne/cm" },
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
        label: "Table 1: Law of Length (Constant Tension)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "freq", label: "Frequency n", unit: "Hz" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
          { key: "inv_l", label: "1/l", unit: "cm⁻¹" },
        ]
      },
      {
        id: "law-tension",
        label: "Table 2: Law of Tension (Constant Frequency)",
        columns: [
          { key: "obs_no", label: "Obs No" },
          { key: "tension", label: "Tension T", unit: "N" },
          { key: "tension_sqrt", label: "√T", unit: "√N" },
          { key: "mean_l", label: "Mean l", unit: "cm" },
        ]
      }
    ],
    graphs: [
      {
        id: "law-len-graph",
        title: "Verification of Law of Length (n vs 1/l)",
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
        title: "Verification of Law of Tension (n vs √T)",
        tableId: "law-tension",
        xKey: "tension_sqrt",
        yKey: "freq",
        xLabel: "√T",
        yLabel: "Frequency (n)",
        xUnit: "√N",
        yUnit: "Hz"
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
    formula: "λ = slope / 4R",
    standardValue: 5893,
    unit: "Å",
    tables: [
      {
        id: "rings",
        label: "Observation Table: Ring Diameters",
        columns: [
          { key: "ring_no", label: "n (Ring No)" },
          { key: "total_d", label: "Diameter D", unit: "cm" },
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
        columns: [
          { key: "sl_no", label: "Sl No" },
          { key: "order", label: "Order m" },
          { key: "ym", label: "Distance y", unit: "cm" },
          { key: "D_screen", label: "Screen Dist D", unit: "cm" },
          { key: "sin_theta", label: "sinθ" },
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
        label: "Charging & Discharging Data",
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
        label: "Input Characteristics",
        columns: [
          { key: "vbe", label: "VBE", unit: "V" },
          { key: "ib_1v", label: "IB at VCE=1V", unit: "µA" },
          { key: "ib_4v", label: "IB at 4V", unit: "µA" },
          { key: "ib_8v", label: "IB at 8V", unit: "µA" },
        ]
      },
      {
        id: "output-char",
        label: "Output Characteristics",
        columns: [
          { key: "vce", label: "VCE", unit: "V" },
          { key: "ic_125", label: "IC at IB=125µA", unit: "mA" },
          { key: "ic_150", label: "IC at 150µA", unit: "mA" },
          { key: "ic_175", label: "IC at 175µA", unit: "mA" },
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
        columns: [
          { key: "res_box", label: "Resistance Q", unit: "Ω" },
          { key: "l1", label: "l1", unit: "cm" },
          { key: "l2", label: "l2 = 100-l1", unit: "cm" },
          { key: "calc_p", label: "Q * (l1/l2)", unit: "Ω" },
        ]
      }
    ],
    graphs: [
      {
        id: "l1-vs-l2",
        title: "Verification of Wheatstone Bridge (l1 vs l2)",
        tableId: "resistance",
        xKey: "l1",
        yKey: "l2",
        xLabel: "l1",
        yLabel: "l2",
        xUnit: "cm",
        yUnit: "cm"
      }
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
    unit: "V (Knee)",
    tables: [
      {
        id: "forward-bias",
        label: "Forward Bias Table",
        columns: [
          { key: "v", label: "Forward Voltage", unit: "V" },
          { key: "i", label: "Forward Current", unit: "mA" },
        ]
      },
      {
        id: "reverse-bias",
        label: "Reverse Bias Table",
        columns: [
          { key: "v", label: "Reverse Voltage", unit: "V" },
          { key: "i", label: "Reverse Current", unit: "µA" },
        ]
      }
    ],
    graphs: [
      {
        id: "forward-graph",
        title: "Forward Bias V-I Characteristics",
        tableId: "forward-bias",
        xKey: "v",
        yKey: "i",
        xLabel: "Forward Voltage (V)",
        yLabel: "Forward Current (mA)",
        xUnit: "V",
        yUnit: "mA",
        type: "monotone"
      },
      {
        id: "reverse-graph",
        title: "Reverse Bias V-I Characteristics",
        tableId: "reverse-bias",
        xKey: "v",
        yKey: "i",
        xLabel: "Reverse Voltage (V)",
        yLabel: "Reverse Current (µA)",
        xUnit: "V",
        yUnit: "µA",
        type: "monotone"
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
  { name: "Rigidity Modulus (Steel)", value: "8.22 x 10¹¹ dyne/cm²" },
  { name: "Plank's Constant (h)", value: "6.626 x 10⁻³⁴ J·s" },
  { name: "Speed of Light (c)", value: "3 x 10⁸ m/s" }
];
