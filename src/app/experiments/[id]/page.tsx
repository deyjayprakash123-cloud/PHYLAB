"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { experiments } from "@/lib/physics-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ObservationTable } from "@/components/ObservationTable";
import { PhysicsGraph } from "@/components/PhysicsGraph";
import { calculatePercentageError, calculateLinearRegression, type DataPoint } from "@/lib/utils/physics-calc";
import { ChevronLeft, FileDown, Info, Calculator, LineChart, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function ExperimentPage() {
  const { id } = useParams();
  const experiment = experiments.find((e) => e.id === id);

  const [observations, setObservations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  if (!experiment) {
    return (
      <div className="container mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold">Experiment Not Found</h1>
        <Link href="/">
          <Button variant="link">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const graphData: DataPoint[] = useMemo(() => {
    return observations
      .map((row) => {
        let x = 0, y = 0;
        const val = (k: string) => parseFloat(row[k]) || 0;

        switch (experiment.id) {
          case "bar-pendulum":
            x = val("l");
            y = Math.pow(val("t20") / 20, 2);
            break;
          case "youngs-modulus":
            x = val("m");
            y = val("depression");
            break;
          case "rigidity-modulus":
            x = val("m");
            y = val("theta");
            break;
          case "surface-tension":
            x = val("r");
            y = val("h");
            break;
          case "sonometer":
            x = val("l");
            y = val("n");
            break;
          case "newtons-rings":
            x = val("n");
            y = Math.pow(val("diameter"), 2);
            break;
          case "laser-wavelength":
            x = val("m");
            const D = val("D");
            const Y = val("y");
            y = Y / Math.sqrt(Y * Y + D * D);
            break;
          case "rc-circuit":
            x = val("t");
            y = val("v");
            break;
          case "bjt-ce":
          case "pn-junction":
            x = val("v");
            y = val("i");
            break;
          case "metre-bridge":
            x = val("l1") / val("l2");
            y = val("q");
            break;
          default:
            x = val("v");
            y = val("i");
        }
        return { x, y };
      })
      .filter((p) => !isNaN(p.x) && !isNaN(p.y) && isFinite(p.x) && isFinite(p.y));
  }, [observations, experiment]);

  const regression = calculateLinearRegression(graphData);

  const calculatedResult = useMemo(() => {
    if (graphData.length < 1 && experiment.id !== "metre-bridge") return null;
    if (experiment.id === "metre-bridge" && observations.length > 0) {
      const results = observations.map(o => (parseFloat(o.q) || 0) * (parseFloat(o.l1) || 0) / (parseFloat(o.l2) || 1));
      return results.reduce((a, b) => a + b, 0) / results.length;
    }
    
    if (graphData.length < 2) return null;

    let result = 0;
    const g = 981;

    switch (experiment.id) {
      case "bar-pendulum":
        result = (4 * Math.PI * Math.PI) / regression.slope;
        break;
      case "youngs-modulus":
        const L_y = 50, b = 2, d = 0.5;
        result = (g * Math.pow(L_y, 3)) / (4 * b * Math.pow(d, 3) * regression.slope);
        break;
      case "rigidity-modulus":
        const r_wire = 0.05, d_cyl = 4, l_wire = 60;
        result = (g * Math.pow(d_cyl, 4) * l_wire) / (Math.PI * Math.pow(r_wire, 4) * (regression.slope * 180 / Math.PI));
        break;
      case "surface-tension":
        // T = r h ρ g / 2. If slope = h/r, T = r^2 * slope * ρ * g / 2 (Not linear in r)
        // Usually we fix r and change h, or vice versa. Assume mean of (r*h*g)/2
        const values = observations.map(o => (parseFloat(o.r) * parseFloat(o.h) * 1 * g) / 2);
        result = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case "newtons-rings":
        const R = 1000; 
        result = (regression.slope / (4 * R)) * 1e7;
        break;
      case "laser-wavelength":
        const grating_const = 1 / 6000; // 600 lines/mm
        result = grating_const * regression.slope * 1e6; // to nm
        break;
      case "rc-circuit":
        // Find t where V = 0.63 * Vmax
        const Vmax = Math.max(...observations.map(o => parseFloat(o.v) || 0));
        const target = 0.63 * Vmax;
        const closest = observations.reduce((prev, curr) => 
          Math.abs(parseFloat(curr.v) - target) < Math.abs(parseFloat(prev.v) - target) ? curr : prev
        );
        result = parseFloat(closest.t);
        break;
      case "bjt-ce":
        result = 1 / regression.slope; // Resistance
        break;
    }
    return result;
  }, [experiment.id, regression, graphData, observations]);

  const error = useMemo(() => {
    if (calculatedResult === null || !experiment.standardValue) return null;
    return calculatePercentageError(calculatedResult, experiment.standardValue);
  }, [calculatedResult, experiment.standardValue]);

  const handleExport = () => {
    window.print();
    toast({
      title: "Generating Report",
      description: "Preparing your experiment report for print/PDF.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> Dashboard
          </Link>
          <div className="font-bold hidden md:block">
            {experiment.title}
          </div>
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
            <FileDown className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="printable-area space-y-8">
          <header className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold font-headline">{experiment.title}</h1>
                <p className="text-muted-foreground">OUTR B.Tech Physics Laboratory Manual</p>
              </div>
              {experiment.standardValue && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 no-print">
                  <p className="text-xs uppercase tracking-wider font-bold text-primary mb-1">Standard Value</p>
                  <p className="text-xl font-mono font-bold">{experiment.standardValue} <span className="text-sm font-normal">{experiment.unit}</span></p>
                </div>
              )}
            </div>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl no-print">
              <TabsTrigger value="overview" className="gap-2"><Info className="h-4 w-4" /> Overview</TabsTrigger>
              <TabsTrigger value="observations" className="gap-2"><Calculator className="h-4 w-4" /> Data Entry</TabsTrigger>
              <TabsTrigger value="analysis" className="gap-2"><LineChart className="h-4 w-4" /> Analysis</TabsTrigger>
              <TabsTrigger value="report" className="gap-2"><FileText className="h-4 w-4" /> Report</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-2">
                    <CardHeader><CardTitle>Aim</CardTitle></CardHeader>
                    <CardContent><p>{experiment.aim}</p></CardContent>
                  </Card>
                  
                  <Card className="border-2">
                    <CardHeader><CardTitle>Theory</CardTitle></CardHeader>
                    <CardContent className="prose prose-sm dark:prose-invert">
                      <p>{experiment.theory}</p>
                      <div className="bg-muted p-4 rounded-lg my-4 text-center">
                        <code className="text-lg font-bold">{experiment.formula}</code>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="border-2">
                    <CardHeader><CardTitle>Apparatus</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {experiment.apparatus.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 overflow-hidden">
                    <CardHeader className="pb-2"><CardTitle>Setup Diagram</CardTitle></CardHeader>
                    <CardContent className="p-0">
                      <img 
                        src={`https://picsum.photos/seed/${experiment.id}/600/400`} 
                        alt="Experiment Setup" 
                        className="w-full aspect-video object-cover"
                        data-ai-hint="physics setup"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="observations" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Observation Table</CardTitle>
                  <CardDescription>Enter your readings obtained during the lab session.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ObservationTable 
                    columns={experiment.columns} 
                    data={observations} 
                    onChange={setObservations} 
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PhysicsGraph 
                    data={graphData} 
                    title={`${experiment.yLabel} vs ${experiment.xLabel}`}
                    xLabel={experiment.xLabel}
                    yLabel={experiment.yLabel}
                    xUnit={experiment.xUnit}
                    yUnit={experiment.yUnit}
                  />
                </div>
                <div className="space-y-6">
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-primary flex items-center gap-2">
                        <Calculator className="h-5 w-5" /> Calculations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Determined Slope</p>
                        <p className="text-2xl font-mono font-bold">{regression.slope.toFixed(6)}</p>
                      </div>
                      <hr />
                      <div>
                        <p className="text-sm text-muted-foreground">Final Calculated Result</p>
                        <p className="text-3xl font-mono font-bold text-primary">
                          {calculatedResult ? calculatedResult.toFixed(4) : "---"}
                          <span className="text-sm ml-1">{experiment.unit}</span>
                        </p>
                      </div>
                      {error !== null && (
                        <>
                          <hr />
                          <div>
                            <p className="text-sm text-muted-foreground">Percentage Error</p>
                            <p className={`text-2xl font-mono font-bold ${error < 5 ? "text-green-500" : "text-amber-500"}`}>
                              {error.toFixed(2)}%
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="report" className="space-y-8">
              <Card className="border-2 max-w-4xl mx-auto shadow-xl">
                <CardContent className="p-12 report-container">
                  <div className="text-center space-y-2 mb-12 border-b-2 pb-8">
                    <h2 className="text-2xl font-bold uppercase">Odisha University of Technology and Research</h2>
                    <h3 className="text-xl">Department of Physics</h3>
                    <div className="pt-4">
                      <p className="text-lg font-bold">LABORATORY REPORT</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-12">
                    <div className="space-y-2">
                      <p><strong>Name:</strong> ________________________</p>
                      <p><strong>Roll No:</strong> ________________________</p>
                      <p><strong>Section:</strong> ________________________</p>
                    </div>
                    <div className="space-y-2 text-right">
                      <p><strong>Experiment No:</strong> ____</p>
                      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <section>
                      <h4 className="font-bold border-b mb-2">TITLE:</h4>
                      <p className="text-lg">{experiment.title}</p>
                    </section>

                    <section>
                      <h4 className="font-bold border-b mb-2">AIM:</h4>
                      <p>{experiment.aim}</p>
                    </section>

                    <section>
                      <h4 className="font-bold border-b mb-2">APPARATUS:</h4>
                      <p>{experiment.apparatus.join(", ")}</p>
                    </section>

                    <section>
                      <h4 className="font-bold border-b mb-2">OBSERVATIONS:</h4>
                      <div className="border border-black">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/20">
                              <th className="border-r p-2">#</th>
                              {experiment.columns.map(col => (
                                <th key={col.key} className="border-r p-2">{col.label} ({col.unit})</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {observations.map((row, i) => (
                              <tr key={i} className="border-b">
                                <td className="border-r p-2 text-center">{i+1}</td>
                                {experiment.columns.map(col => (
                                  <td key={col.key} className="border-r p-2 text-center">{row[col.key]}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section>
                      <h4 className="font-bold border-b mb-2">RESULT & CONCLUSION:</h4>
                      <div className="space-y-4">
                        <p>The determined value of the physical constant is found to be:</p>
                        <p className="text-xl font-bold ml-4">
                          Observed Value = {calculatedResult ? calculatedResult.toFixed(4) : "__________"} {experiment.unit}
                        </p>
                        {experiment.standardValue && (
                          <p className="text-xl font-bold ml-4">
                            Standard Value = {experiment.standardValue} {experiment.unit}
                          </p>
                        )}
                        {error !== null && (
                          <p className="text-xl font-bold ml-4">
                            Percentage Error = {error.toFixed(2)}%
                          </p>
                        )}
                      </div>
                    </section>

                    <div className="pt-20 flex justify-between">
                      <p className="border-t border-black pt-2 px-8">Signature of Student</p>
                      <p className="border-t border-black pt-2 px-8">Signature of Faculty</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
