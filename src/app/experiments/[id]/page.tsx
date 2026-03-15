"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { experiments } from "@/lib/physics-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ObservationTable } from "@/components/ObservationTable";
import { PhysicsGraph } from "@/components/PhysicsGraph";
import { calculatePercentageError, calculateLinearRegression, generateSimulatedData, type DataPoint } from "@/lib/utils/physics-calc";
import { ChevronLeft, FileDown, Info, Calculator, LineChart, FileText, HelpCircle, MessageSquareQuote, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExperimentPage() {
  const { id } = useParams();
  const experiment = experiments.find((e) => e.id === id);

  const [tableData, setTableData] = useState<Record<string, any[]>>({});
  const [activeTab, setActiveTab] = useState("overview");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simTarget, setSimTarget] = useState("");

  useEffect(() => {
    if (experiment && Object.keys(tableData).length === 0) {
      const initial: Record<string, any[]> = {};
      experiment.tables.forEach(t => {
        const rows = [];
        const numRows = t.defaultRows || 5;
        for (let i = 0; i < numRows; i++) {
          rows.push(t.columns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {}));
        }
        initial[t.id] = rows;
      });
      setTableData(initial);
    }
  }, [experiment]);

  if (!experiment) {
    return (
      <div className="container mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Experiment Not Found</h1>
        <Link href="/dashboard">
          <Button variant="link">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleTableChange = (tableId: string, newData: any[]) => {
    setTableData(prev => ({ ...prev, [tableId]: newData }));
  };

  const handleSimulate = () => {
    const target = parseFloat(simTarget);
    if (isNaN(target)) {
      toast({ variant: "destructive", title: "Invalid Input", description: "Please enter a valid numeric target value." });
      return;
    }
    const simulated = generateSimulatedData(experiment.id, target);
    setTableData(simulated);
    setIsSimulating(false);
    toast({ title: "Data Generated", description: `Simulated observations for target value: ${target}` });
  };

  const getGraphData = (graphDef: any): DataPoint[] => {
    const currentData = tableData[graphDef.tableId] || [];
    return currentData
      .map((row) => {
        const point: DataPoint = {
          x: parseFloat(row[graphDef.xKey]) || 0,
          y: Array.isArray(graphDef.yKey) ? 0 : (parseFloat(row[graphDef.yKey]) || 0)
        };
        if (Array.isArray(graphDef.yKey)) {
          graphDef.yKey.forEach((key: string) => {
            point[key] = parseFloat(row[key]) || 0;
          });
        }
        return point;
      })
      .filter((p) => !isNaN(Number(p.x)));
  };

  const calculatedResult = useMemo(() => {
    const mainGraph = experiment.graphs[0];
    if (!mainGraph) return null;
    const data = getGraphData(mainGraph);
    if (data.length < 2) return null;
    const regression = calculateLinearRegression(data);
    let result = 0;
    const g_const = 981;

    switch (experiment.id) {
      case "bar-pendulum":
        result = (4 * Math.PI * Math.PI) * (regression.slope || 0);
        break;
      case "youngs-modulus":
        const l_y = 60, b_y = 2, d_y = 0.5;
        result = (regression.slope * g_const * Math.pow(l_y, 3)) / (4 * b_y * Math.pow(d_y, 3));
        break;
      case "rigidity-modulus":
        const d_cyl = 4, l_wire = 60, r_wire = 0.05;
        result = (g_const * Math.pow(d_cyl, 4) * l_wire * regression.slope) / (Math.PI * Math.pow(r_wire, 4));
        break;
      case "newtons-rings":
        const R_opt = 100;
        result = (regression.slope / (4 * R_opt)) * 1e8; 
        break;
      case "laser-wavelength":
        const grating_element = 1/600; 
        result = regression.slope * grating_element * 1e8; 
        break;
      default:
        result = regression.slope;
    }
    return result;
  }, [experiment.id, tableData, experiment.graphs]);

  const error = useMemo(() => {
    if (calculatedResult === null || !experiment.standardValue) return null;
    return calculatePercentageError(calculatedResult, experiment.standardValue);
  }, [calculatedResult, experiment.standardValue]);

  const handleExport = () => {
    window.print();
    toast({ title: "Generating Report", description: "Preparing your experiment report for print/PDF." });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="border-b bg-white dark:bg-slate-900 sticky top-0 z-50 no-print shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> DASHBOARD
          </Link>
          <div className="font-extrabold text-slate-900 dark:text-white uppercase tracking-tight hidden md:block">
            {experiment.title}
          </div>
          <Button onClick={handleExport} variant="default" size="sm" className="gap-2 font-bold">
            <FileDown className="h-4 w-4" /> EXPORT REPORT
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="printable-area space-y-8">
          <header className="space-y-2 bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold font-headline text-slate-900 dark:text-white uppercase tracking-tighter">{experiment.title}</h1>
                <p className="text-slate-500 font-bold text-sm tracking-widest mt-2 uppercase">OUTR B.Tech Physics Laboratory Manual</p>
              </div>
              {experiment.standardValue && (
                <div className="bg-primary/5 p-5 rounded-2xl border-2 border-primary/20 no-print">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-primary mb-1">Standard Value</p>
                  <p className="text-2xl font-mono font-black text-slate-900 dark:text-white">{experiment.standardValue} <span className="text-sm font-bold text-slate-500">{experiment.unit}</span></p>
                </div>
              )}
            </div>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl no-print bg-slate-200/50 dark:bg-slate-900 p-1 rounded-xl">
              <TabsTrigger value="overview" className="gap-2 font-bold uppercase text-[10px] tracking-wider"><Info className="h-4 w-4" /> Overview</TabsTrigger>
              <TabsTrigger value="observations" className="gap-2 font-bold uppercase text-[10px] tracking-wider"><Calculator className="h-4 w-4" /> Observations</TabsTrigger>
              <TabsTrigger value="analysis" className="gap-2 font-bold uppercase text-[10px] tracking-wider"><LineChart className="h-4 w-4" /> Graphs</TabsTrigger>
              <TabsTrigger value="questions" className="gap-2 font-bold uppercase text-[10px] tracking-wider"><HelpCircle className="h-4 w-4" /> Viva Q&A</TabsTrigger>
              <TabsTrigger value="report" className="gap-2 font-bold uppercase text-[10px] tracking-wider"><FileText className="h-4 w-4" /> Final Report</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-2 shadow-sm">
                    <CardHeader><CardTitle className="text-sm uppercase tracking-widest font-black text-slate-400">Aim</CardTitle></CardHeader>
                    <CardContent><p className="text-lg font-medium">{experiment.aim}</p></CardContent>
                  </Card>
                  <Card className="border-2 shadow-sm">
                    <CardHeader><CardTitle className="text-sm uppercase tracking-widest font-black text-slate-400">Theory & Principle</CardTitle></CardHeader>
                    <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="leading-relaxed">{experiment.theory}</p>
                      <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl my-6 border-2 flex items-center justify-center">
                        <code className="text-2xl font-mono font-black text-primary">{experiment.formula}</code>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card className="border-2 shadow-sm">
                    <CardHeader><CardTitle className="text-sm uppercase tracking-widest font-black text-slate-400">Apparatus</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {experiment.apparatus.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 font-bold">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="observations" className="space-y-8 animate-in fade-in">
              <div className="flex justify-end no-print">
                <Dialog open={isSimulating} onOpenChange={setIsSimulating}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 font-bold border-2 border-primary/30 hover:bg-primary/10">
                      <Zap className="h-4 w-4 text-primary" /> SIMULATE SAMPLE DATA
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Simulate Observations</DialogTitle>
                      <DialogDescription>
                        Enter your desired principal result (e.g., target {experiment.unit}) to generate realistic laboratory readings.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="target" className="text-right">Principal Value</Label>
                        <Input
                          id="target"
                          placeholder={experiment.standardValue?.toString() || "Target value"}
                          className="col-span-3"
                          value={simTarget}
                          onChange={(e) => setSimTarget(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSimulate} className="w-full">Generate Data</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {experiment.tables.map((table) => (
                <Card key={table.id} className="border-2 shadow-lg">
                  <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                    <CardTitle className="text-sm uppercase tracking-widest font-black">{table.label}</CardTitle>
                    <CardDescription className="font-medium">Enter your laboratory readings below.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ObservationTable 
                      columns={table.columns} 
                      data={tableData[table.id] || []} 
                      onChange={(newData) => handleTableChange(table.id, newData)} 
                    />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 gap-8">
                {experiment.graphs.map((graphDef) => (
                  <PhysicsGraph 
                    key={graphDef.id}
                    data={getGraphData(graphDef)} 
                    title={graphDef.title}
                    xLabel={graphDef.xLabel}
                    yLabel={graphDef.yLabel}
                    xUnit={graphDef.xUnit}
                    yUnit={graphDef.yUnit}
                    type={graphDef.type}
                    multiSeries={graphDef.multiSeries}
                    equationFormat={graphDef.equationFormat}
                  />
                ))}
              </div>
              <Card className="border-4 border-primary/20 shadow-2xl mt-8">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-primary flex items-center gap-3 uppercase tracking-tighter font-black">
                    <Calculator className="h-6 w-6" /> Result Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12 p-10">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">Determined Result</p>
                    <p className="text-5xl font-mono font-black tracking-tighter">
                      {calculatedResult ? calculatedResult.toFixed(4) : "---"}
                      <span className="text-lg ml-2 font-bold text-slate-500">{experiment.unit}</span>
                    </p>
                  </div>
                  {error !== null && (
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">Percentage Error</p>
                      <p className={`text-5xl font-mono font-black tracking-tighter ${error < 5 ? "text-emerald-500" : "text-orange-500"}`}>
                        {error.toFixed(2)}%
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-6 animate-in fade-in">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <MessageSquareQuote className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-black uppercase tracking-tight">Viva-Voce Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {experiment.questions.map((q, i) => (
                    <AccordionItem key={i} value={`q-${i}`} className="border-2 rounded-2xl px-6 bg-white dark:bg-slate-900">
                      <AccordionTrigger className="text-left font-bold text-lg hover:no-underline">
                        {i + 1}. {q.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 dark:text-slate-400 text-base leading-relaxed pt-2 pb-6 border-t-2 border-slate-50 dark:border-slate-800 mt-2">
                        {q.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="report" className="space-y-8 animate-in fade-in">
              <Card className="border-2 max-w-5xl mx-auto shadow-2xl overflow-hidden bg-white">
                <CardContent className="p-16 report-container font-serif">
                  <div className="text-center space-y-3 mb-12 border-b-4 border-slate-900 pb-10">
                    <h2 className="text-3xl font-black uppercase tracking-tight">Odisha University of Technology and Research</h2>
                    <h3 className="text-xl font-bold text-slate-600">Department of Physics</h3>
                    <div className="pt-6">
                      <p className="text-2xl font-black bg-slate-900 text-white inline-block px-8 py-2">LABORATORY REPORT</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 mb-16 text-lg font-bold">
                    <div className="space-y-4">
                      <p className="border-b-2 border-slate-200 pb-1">NAME: <span className="text-slate-400">________________________</span></p>
                      <p className="border-b-2 border-slate-200 pb-1">ROLL NO: <span className="text-slate-400">________________________</span></p>
                      <p className="border-b-2 border-slate-200 pb-1">SECTION: <span className="text-slate-400">________________________</span></p>
                    </div>
                    <div className="space-y-4 text-right">
                      <p className="border-b-2 border-slate-200 pb-1">EXP NO: <span className="text-slate-400">____</span></p>
                      <p className="border-b-2 border-slate-200 pb-1">DATE: <span className="text-primary">{new Date().toLocaleDateString()}</span></p>
                    </div>
                  </div>
                  <div className="space-y-12 text-slate-900">
                    <section>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">TITLE OF EXPERIMENT</h4>
                      <p className="text-3xl font-black uppercase leading-none">{experiment.title}</p>
                    </section>
                    <section>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">OBJECTIVE / AIM</h4>
                      <p className="text-xl font-medium leading-relaxed">{experiment.aim}</p>
                    </section>
                    <section>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">OBSERVATIONS & DATA</h4>
                      {experiment.tables.map((table) => (
                        <div key={table.id} className="mb-10">
                          <h5 className="text-xs font-black mb-3 bg-slate-100 p-2 inline-block border-l-4 border-primary">{table.label}</h5>
                          <div className="border-2 border-slate-900 overflow-x-auto">
                            <table className="w-full text-xs font-bold">
                              <thead className="bg-slate-900 text-white">
                                <tr>
                                  <th className="border-r border-slate-700 p-3 w-10 text-center">#</th>
                                  {table.columns.map(col => (
                                    <th key={col.key} className="border-r border-slate-700 p-3 text-left uppercase tracking-tighter">
                                      {col.label} <br/> {col.unit && <span className="text-[10px] text-slate-400">({col.unit})</span>}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(tableData[table.id] || []).map((row, i) => (
                                  <tr key={i} className="border-b border-slate-200">
                                    <td className="border-r border-slate-200 p-3 text-center text-slate-400">{i+1}</td>
                                    {table.columns.map(col => (
                                      <td key={col.key} className="border-r border-slate-200 p-3 text-center font-mono">
                                        {row[col.key] || "-"}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                                {(!tableData[table.id] || tableData[table.id].length === 0) && (
                                  <tr><td colSpan={table.columns.length + 1} className="p-8 text-center text-slate-400 italic">DATA REQUIRED FOR GENERATION</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </section>
                    <section className="bg-slate-50 p-10 rounded-3xl border-2 border-slate-200">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">FINAL DETERMINATION</h4>
                      <div className="space-y-6">
                        <p className="text-lg">Based on experimental observations and analysis, the physical constant is determined as:</p>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-black text-slate-400">Observed Value</p>
                            <p className="text-4xl font-black">
                              {calculatedResult ? calculatedResult.toFixed(4) : "__________"} {experiment.unit}
                            </p>
                          </div>
                          {experiment.standardValue && (
                            <div className="space-y-2">
                              <p className="text-[10px] uppercase font-black text-slate-400">Standard Value</p>
                              <p className="text-4xl font-black text-slate-500">
                                {experiment.standardValue} {experiment.unit}
                              </p>
                            </div>
                          )}
                        </div>
                        {error !== null && (
                          <div className="pt-6 border-t-2 border-slate-200">
                            <p className="text-xl font-bold text-primary">
                              Percentage Error: {error.toFixed(2)}%
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                    <div className="pt-24 flex justify-between font-black uppercase tracking-tighter">
                      <div className="text-center">
                        <p className="border-t-4 border-slate-900 pt-3 px-12">Signature of Student</p>
                      </div>
                      <div className="text-center">
                        <p className="border-t-4 border-slate-900 pt-3 px-12">Faculty In-charge</p>
                      </div>
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
