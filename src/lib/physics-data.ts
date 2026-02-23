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
  columns: { key: string; label: string; unit?: string }[];
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
    columns: [
      { key: "l", label: "Length (L)", unit: "cm" },
      { key: "t20", label: "Time for 20 oscillations", unit: "s" },
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
    standardValue: 2e11,
    unit: "N/m²",
    xLabel: "Mass",
    yLabel: "Depression",
    xUnit: "g",
    yUnit: "cm",
    columns: [
      { key: "m", label: "Mass (M)", unit: "g" },
      { key: "depression", label: "Depression (δ)", unit: "cm" },
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
    columns: [
      { key: "m", label: "Load (M)", unit: "g" },
      { key: "theta", label: "Twist Angle (θ)", unit: "deg" },
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
    columns: [
      { key: "r", label: "Radius (r)", unit: "cm" },
      { key: "h", label: "Height (h)", unit: "cm" },
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
    columns: [
      { key: "l", label: "Length (l)", unit: "cm" },
      { key: "n", label: "Frequency (n)", unit: "Hz" },
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
    columns: [
      { key: "n", label: "Ring No. (n)", unit: "" },
      { key: "diameter", label: "Diameter (Dn)", unit: "mm" },
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
    unit: "nm",
    xLabel: "Order",
    yLabel: "Deflection Ratio",
    xUnit: "m",
    yUnit: "ratio",
    columns: [
      { key: "m", label: "Order (m)", unit: "" },
      { key: "y", label: "Distance (y)", unit: "cm" },
      { key: "D", label: "Screen Dist (D)", unit: "cm" },
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
    columns: [
      { key: "t", label: "Time (t)", unit: "s" },
      { key: "v", label: "Voltage (V)", unit: "V" },
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
    columns: [
      { key: "v", label: "Voltage (V)", unit: "V" },
      { key: "i", label: "Current (I)", unit: "mA" },
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
    xLabel: "Ratio",
    yLabel: "Resistance",
    xUnit: "l1/l2",
    yUnit: "Ω",
    columns: [
      { key: "q", label: "Known Res (Q)", unit: "Ω" },
      { key: "l1", label: "Length (l1)", unit: "cm" },
      { key: "l2", label: "Length (l2)", unit: "cm" },
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
    columns: [
      { key: "v", label: "Voltage (V)", unit: "V" },
      { key: "i", label: "Current (I)", unit: "mA" },
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
