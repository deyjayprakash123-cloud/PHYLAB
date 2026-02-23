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
    theory: "A bar pendulum is a physical pendulum. The time period T of a physical pendulum for small oscillations is given by T = 2π√(I/mgL), where I is the moment of inertia about the point of suspension and L is the distance between the center of gravity and the point of suspension.",
    formula: "g = 4π²L/T²",
    standardValue: 981,
    unit: "cm/s²",
    xLabel: "Length",
    yLabel: "Time Period Squared",
    xUnit: "cm",
    yUnit: "s²",
    columns: [
      { key: "l", label: "Length (L)", unit: "cm" },
      { key: "t10", label: "Time for 10 oscillations", unit: "s" },
    ],
  },
  {
    id: "youngs-modulus",
    title: "Young’s Modulus (Bending of Beam)",
    category: "Properties of Matter",
    aim: "To find the Young’s modulus of the material of a rectangular beam by the method of bending.",
    apparatus: ["Rectangular beam", "Knife edges", "Spherometer or Traveling microscope", "Weight hanger and slotted weights"],
    theory: "Young's modulus Y is defined as the ratio of longitudinal stress to longitudinal strain. For a rectangular beam of length L, breadth b, and thickness d, supported on two knife edges and loaded at the center, the depression δ is given by Y = MgL³ / 4bd³δ.",
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
    id: "newtons-rings",
    title: "Newton’s Rings",
    category: "Optics",
    aim: "To determine the wavelength of sodium light using Newton’s Rings.",
    apparatus: ["Plano-convex lens", "Glass plate", "Sodium lamp", "Traveling microscope"],
    theory: "Newton's rings are formed due to interference between light waves reflected from the upper and lower surfaces of the air film between the lens and glass plate. The diameter D of the nth dark ring is given by D²n = 4nRλ.",
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
    id: "pn-junction",
    title: "PN Junction Diode",
    category: "Electronics",
    aim: "To study the V-I characteristics of a PN junction diode in forward and reverse bias.",
    apparatus: ["PN junction diode", "Voltmeter", "Ammeter", "Variable DC power supply"],
    theory: "A PN junction diode conducts in forward bias and acts as an insulator in reverse bias until breakdown. The current follows an exponential relationship with voltage in forward bias.",
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
  { name: "Acceleration due to gravity (g)", value: "981 cm/s² or 9.81 m/s²" },
  { name: "Wavelength of Sodium light (λ)", value: "5890 Å or 589.0 nm" },
  { name: "Young's Modulus of Steel", value: "2.0 x 10¹¹ N/m²" },
  { name: "Density of Water", value: "1.0 g/cm³" },
  { name: "Surface Tension of Water", value: "72.75 dyne/cm" },
  { name: "Plank's Constant (h)", value: "6.626 x 10⁻³⁴ J·s" },
  { name: "Speed of Light (c)", value: "3 x 10⁸ m/s" }
];
