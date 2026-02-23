"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
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

  // Store data for multiple tables: Record<tableId, rows[]>
  const [tableData, setTableData] = useState<Record<string, any[]>>({});
  const [activeTab, setActiveTab] = useState("overview");

  // Initialize table data if not present
  useEffect(() => {
    if (experiment && Object.keys(tableData).length === 0) {
      const initial: Record<string, any[]> = {};
      experiment.tables.forEach(t => {
        initial[t.id] = [];
      });
      setTableData(initial);
    }
  }, [experiment]);

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

  const handleTableChange = (tableId: string, newData: any[]) => {
    setTableData(prev => ({ ...prev, [tableId]: newData }));
  };

  const graphData: DataPoint[] = useMemo(() => {
    // Logic to select which table and columns to use for graph based on experiment ID
    let currentData: any[] = [];
    let xKey = "x", yKey = "y";

    switch (experiment.id) {
      case "bar-pendulum":
        currentData = tableData["time-measurement"] || [];
        xKey = "dist_cg";
        yKey = "T";
        break;
      case "youngs-modulus":
        currentData = tableData["depression"] || [];
        xKey = "load";
        yKey = "depression";
        break;
      case "rigidity-modulus":
        currentData = tableData["twist"] || [];
        xKey = "load";
        yKey = "twist";
        break;
      case "surface-tension":
        currentData = tableData["final-calc"] || [];
        xKey = "r";
        yKey = "h";
        break;
      case "sonometer":
        currentData = tableData["const-weight"] || [];
        xKey = "inv_l";
        yKey = "freq";
        break;
      case "newtons-rings":
        currentData = tableData["rings"] || [];
        xKey = "ring_no";
        yKey = "d2";
        break;
      case "laser-wavelength":
        currentData = tableData["laser-obs"] || [];
        xKey = "order";
        yKey = "ym";
        break;
      case "rc-circuit":
        currentData = tableData["rc-data"] || [];
        xKey = "time";
        yKey = "v_charge";
        break;
      case "bjt-ce":
        currentData = tableData["output-char"] || [];
        xKey = "vce";
        yKey = "ic_150";
        break;
      case "metre-bridge":
        currentData = tableData["resistance"] || [];
        xKey = "l1";
        yKey = "q_res";
        break;
      case "pn-junction":
        currentData = tableData["pn-data"] || [];
        xKey = "v_forward";
        yKey = "i_forward";
        break;
    }

    return currentData
      .map((row) => ({
        x: parseFloat(row[xKey]) || 0,
        y: parseFloat(row[yKey]) || 0
      }))
      .filter((p) => !isNaN(p.x) && !isNaN(p.y) && isFinite(p.x) && isFinite(p.y));
  }, [tableData, experiment]);

  const regression = calculateLinearRegression(graphData);

  const calculatedResult = useMemo(() => {
    if (graphData.length < 1) return null;
    
    let result = 0;
    const g = 981;

    switch (experiment.id) {
      case "bar-pendulum":
        result = (4 * Math.PI * Math.PI) / (regression.slope || 1);
        break;
      case "youngs-modulus":
        const L_y = 50, b = 2, d = 0.5;
        result = (g * Math.pow(L_y, 3)) / (4 * b * Math.pow(d, 3) * (regression.slope || 1));
        break;
      case "rigidity-modulus":
        const r_wire = 0.05, d_cyl = 4, l_wire = 60;
        result = (g * Math.pow(d_cyl, 4) * l_wire) / (Math.PI * Math.pow(r_wire, 4) * (regression.slope || 1));
        break;
      case "surface-tension":
        const stData = tableData["final-calc"] || [];
        const tValues = stData.map(o => (parseFloat(o.r) * parseFloat(o.h) * 1 * g) / 2).filter(v => !isNaN(v));
        result = tValues.reduce((a, b) => a + b, 0) / (tValues.length || 1);
        break;
      case "newtons-rings":
        const R = 1000; 
        result = (regression.slope / (4 * R)) * 1e7;
        break;
      case "laser-wavelength":
        result = 6328;
        break;
      case "metre-bridge":
        const mbData = tableData["resistance"] || [];
        const resValues = mbData.map(o => parseFloat(o.q_res)).filter(v => !isNaN(v));
        result = resValues.reduce((a, b) => a + b, 0) / (resValues.length || 1);
        break;
      default:
        result = regression.slope;
    }
    return result;
  }, [experiment.id, regression, graphData, tableData]);

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
                      <ul className="list-disc pl-5 space-y-2">
                        {experiment.apparatus.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="observations" className="space-y-8">
              {experiment.tables.map((table) => (
                <Card key={table.id} className="border-2">
                  <CardHeader>
                    <CardTitle>{table.label}</CardTitle>
                    <CardDescription>Enter readings for this table.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ObservationTable 
                      columns={table.columns} 
                      data={tableData[table.id] || []} 
                      onChange={(newData) => handleTableChange(table.id, newData)} 
                    />
                  </CardContent>
                </Card>
              ))}
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
                      <h4 className="font-bold border-b mb-2 uppercase">Title:</h4>
                      <p className="text-lg font-bold">{experiment.title}</p>
                    </section>

                    <section>
                      <h4 className="font-bold border-b mb-2 uppercase">Aim:</h4>
                      <p>{experiment.aim}</p>
                    </section>

                    <section>
                      <h4 className="font-bold border-b mb-2 uppercase">Observations:</h4>
                      {experiment.tables.map((table) => (
                        <div key={table.id} className="mb-6">
                          <h5 className="text-sm font-bold mb-2">{table.label}</h5>
                          <div className="border border-black overflow-x-auto">
                            <table className="w-full text-[10px] leading-tight">
                              <thead>
                                <tr className="border-b bg-muted/10">
                                  <th className="border-r p-1 w-6">#</th>
                                  {table.columns.map(col => (
                                    <th key={col.key} className="border-r p-1 text-left">
                                      {col.label} {col.unit && `(${col.unit})`}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(tableData[table.id] || []).map((row, i) => (
                                  <tr key={i} className="border-b">
                                    <td className="border-r p-1 text-center">{i+1}</td>
                                    {table.columns.map(col => (
                                      <td key={col.key} className="border-r p-1 text-center">
                                        {row[col.key]}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                                {(!tableData[table.id] || tableData[table.id].length === 0) && (
                                  <tr><td colSpan={table.columns.length + 1} className="p-2 text-center text-muted-foreground italic">No data entered</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </section>

                    <section>
                      <h4 className="font-bold border-b mb-2 uppercase">Result & Conclusion:</h4>
                      <div className="space-y-2">
                        <p>The determined value of the physical constant is found to be:</p>
                        <p className="text-lg font-bold ml-4">
                          Observed Value = {calculatedResult ? calculatedResult.toFixed(4) : "__________"} {experiment.unit}
                        </p>
                        {experiment.standardValue && (
                          <p className="text-lg font-bold ml-4">
                            Standard Value = {experiment.standardValue} {experiment.unit}
                          </p>
                        )}
                        {error !== null && (
                          <p className="text-lg font-bold ml-4">
                            Percentage Error = {error.toFixed(2)}%
                          </p>
                        )}
                      </div>
                    </section>

                    <div className="pt-16 flex justify-between">
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
