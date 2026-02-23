"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { experiments, Experiment } from "@/lib/physics-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ObservationTable } from "@/components/ObservationTable";
import { PhysicsGraph } from "@/components/PhysicsGraph";
import { calculateMean, calculatePercentageError, calculateLinearRegression, type DataPoint } from "@/lib/utils/physics-calc";
import { ChevronLeft, FileDown, Info, Calculator, LineChart, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function ExperimentPage() {
  const { id } = useParams();
  const router = useRouter();
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

  // Derived data for the graph
  const graphData: DataPoint[] = useMemo(() => {
    return observations
      .map((row) => {
        let x = 0, y = 0;
        if (experiment.id === "bar-pendulum") {
          x = parseFloat(row.l);
          y = Math.pow(parseFloat(row.t10) / 10, 2);
        } else if (experiment.id === "youngs-modulus") {
          x = parseFloat(row.m);
          y = parseFloat(row.depression);
        } else if (experiment.id === "newtons-rings") {
          x = parseFloat(row.n);
          y = Math.pow(parseFloat(row.diameter), 2);
        } else {
          x = parseFloat(row.v);
          y = parseFloat(row.i);
        }
        return { x, y };
      })
      .filter((p) => !isNaN(p.x) && !isNaN(p.y));
  }, [observations, experiment]);

  const regression = calculateLinearRegression(graphData);

  const calculatedResult = useMemo(() => {
    if (graphData.length < 2) return null;
    
    let result = 0;
    if (experiment.id === "bar-pendulum") {
      // g = 4π²L/T² -> T²/L = 1/g * 4π² -> slope = 4π²/g -> g = 4π²/slope
      result = (4 * Math.PI * Math.PI) / regression.slope;
    } else if (experiment.id === "newtons-rings") {
      // D² = 4nRλ -> slope = 4Rλ -> λ = slope / 4R
      // Assume R = 100cm (1000mm) for demonstration if not provided
      const R = 1000; 
      result = (regression.slope / (4 * R)) * 1e7; // Convert to Å
    } else if (experiment.id === "youngs-modulus") {
      // Y = MgL³ / 4bd³δ -> δ/M = slope -> Y = gL³ / (4bd³ * slope)
      // Standard values for demonstration
      const g = 981, L = 50, b = 2, d = 0.5;
      result = (g * Math.pow(L, 3)) / (4 * b * Math.pow(d, 3) * regression.slope);
    }
    return result;
  }, [experiment.id, regression, graphData]);

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
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 no-print">
                <p className="text-xs uppercase tracking-wider font-bold text-primary mb-1">Standard Value</p>
                <p className="text-xl font-mono font-bold">{experiment.standardValue} <span className="text-sm font-normal">{experiment.unit}</span></p>
              </div>
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
                    <CardHeader>
                      <CardTitle>Aim</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{experiment.aim}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle>Theory</CardTitle>
                    </CardHeader>
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
                    <CardHeader>
                      <CardTitle>Apparatus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {experiment.apparatus.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle>Setup Diagram</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <img 
                        src={`https://picsum.photos/seed/${experiment.id}/600/400`} 
                        alt="Experiment Setup" 
                        className="w-full aspect-video object-cover"
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
                          {calculatedResult ? calculatedResult.toFixed(2) : "---"}
                          <span className="text-sm ml-1">{experiment.unit}</span>
                        </p>
                      </div>
                      <hr />
                      <div>
                        <p className="text-sm text-muted-foreground">Percentage Error</p>
                        <p className={`text-2xl font-mono font-bold ${error && error < 5 ? "text-green-500" : "text-amber-500"}`}>
                          {error ? `${error.toFixed(2)}%` : "---"}
                        </p>
                      </div>
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
                        <p className="text-xl font-bold ml-4">
                          Standard Value = {experiment.standardValue} {experiment.unit}
                        </p>
                        <p className="text-xl font-bold ml-4">
                          Percentage Error = {error ? error.toFixed(2) : "__________"}%
                        </p>
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
