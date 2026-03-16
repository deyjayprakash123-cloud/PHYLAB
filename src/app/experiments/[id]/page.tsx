"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { experiments } from "@/lib/physics-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ObservationTable } from "@/components/ObservationTable";
import { PhysicsGraph } from "@/components/PhysicsGraph";
import { calculatePercentageError, calculateLinearRegression, generateRowFromInput, type DataPoint } from "@/lib/utils/physics-calc";
import { ChevronLeft, FileDown, Info, Calculator, LineChart, FileText, HelpCircle, Zap, Settings, Beaker, ListChecks } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExperimentPage() {
  const { id } = useParams();
  const experiment = experiments.find((e) => e.id === id);

  const [tableData, setTableData] = useState<Record<string, any[]>>({});
  const [activeTab, setActiveTab] = useState("overview");
  const [standardValue, setStandardValue] = useState(experiment?.standardValue || 0);
  const [aiInputs, setAiInputs] = useState<Record<string, string>>({});

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
      
      const initialAi: Record<string, string> = {};
      experiment.aiInputFields.forEach(f => {
        initialAi[f.key] = "";
      });
      setAiInputs(initialAi);
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

  const generateAiRow = () => {
    const mainTableId = experiment.tables[0].id;
    const inputKey = experiment.aiInputFields[0].key;
    const inputValue = aiInputs[inputKey];

    if (!inputValue) {
      toast({ variant: "destructive", title: "Missing Input", description: "Please enter a value for the AI generator." });
      return;
    }

    const newRow = generateRowFromInput(experiment.id, mainTableId, inputKey, inputValue, standardValue, {});
    
    setTableData(prev => {
      const currentRows = [...(prev[mainTableId] || [])];
      // Find first empty row or append
      const emptyRowIndex = currentRows.findIndex(row => Object.values(row).every(v => v === ""));
      if (emptyRowIndex !== -1) {
        currentRows[emptyRowIndex] = newRow;
      } else {
        currentRows.push(newRow);
      }
      return { ...prev, [mainTableId]: currentRows };
    });

    toast({ title: "Row Generated", description: "A complete observation row has been added to your table." });
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
    if (calculatedResult === null || !standardValue) return null;
    return calculatePercentageError(calculatedResult, standardValue);
  }, [calculatedResult, standardValue]);

  const handleExport = () => {
    window.print();
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
        <div className="printable-area space-y-12">
          {/* Section 1: Aim & Apparatus */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold font-headline text-slate-900 dark:text-white uppercase tracking-tighter">{experiment.title}</h1>
                <p className="text-slate-500 font-bold text-sm tracking-widest mt-2 uppercase">Official OUTR Lab Manual Structure</p>
              </div>
              <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary/20 no-print min-w-[240px]">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="std-val" className="text-[10px] uppercase tracking-widest font-black text-primary">Standard Value</Label>
                  <Settings className="h-3 w-3 text-primary/50" />
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    id="std-val"
                    type="number" 
                    value={standardValue} 
                    onChange={(e) => setStandardValue(parseFloat(e.target.value) || 0)}
                    className="h-10 text-xl font-mono font-black border-none bg-transparent p-0 focus-visible:ring-0 w-full"
                  />
                  <span className="text-sm font-bold text-slate-500">{experiment.unit}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Beaker className="h-5 w-5" />
                  <h2 className="text-sm font-black uppercase tracking-widest">Aim</h2>
                </div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{experiment.aim}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <ListChecks className="h-5 w-5" />
                  <h2 className="text-sm font-black uppercase tracking-widest">Apparatus</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {experiment.apparatus.map((item, i) => (
                    <span key={i} className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Theory */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Info className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">Theory & Principle</h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">{experiment.theory}</p>
              <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-3xl my-6 border-2 flex flex-col items-center justify-center gap-4 group transition-all hover:border-primary/30">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-primary transition-colors">Governing Equation</span>
                <code className="text-3xl font-mono font-black text-slate-900 dark:text-white">{experiment.formula}</code>
              </div>
            </div>
          </section>

          {/* Section 3: Observations */}
          <section className="space-y-8">
            <div className="flex items-center justify-between no-print">
              <div className="flex items-center gap-2 text-primary">
                <Calculator className="h-5 w-5" />
                <h2 className="text-sm font-black uppercase tracking-widest">Laboratory Observations</h2>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-slate-200/50 dark:bg-slate-900 p-1 rounded-xl">
                <TabsList className="bg-transparent h-8 border-none">
                  <TabsTrigger value="manual" className="text-[10px] font-black uppercase tracking-widest h-7 px-4">Manual Entry</TabsTrigger>
                  <TabsTrigger value="ai" className="text-[10px] font-black uppercase tracking-widest h-7 px-4">AI Generator</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {activeTab === "ai" && (
              <Card className="no-print border-2 border-primary/20 bg-primary/5 shadow-lg animate-in fade-in slide-in-from-top-4">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-primary text-sm uppercase tracking-widest font-black">
                    <Zap className="h-5 w-5" /> AI Row Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {experiment.aiInputFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-slate-500">{field.label} {field.unit && `(${field.unit})`}</Label>
                        <Input 
                          type="number"
                          value={aiInputs[field.key] || ""}
                          onChange={(e) => setAiInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder="Enter value..."
                          className="font-mono text-sm border-2 focus-visible:ring-primary"
                        />
                      </div>
                    ))}
                    <div className="flex items-end">
                      <Button onClick={generateAiRow} className="w-full font-black uppercase tracking-widest gap-2 py-6">
                        <Zap className="h-4 w-4" /> Generate Row
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center italic">Generating readings with realistic ±1-3% experimental noise</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-12">
              {experiment.tables.map((table) => (
                <Card key={table.id} className="border-2 shadow-lg overflow-hidden printable-table">
                  <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 py-4">
                    <CardTitle className="text-xs uppercase tracking-[0.2em] font-black text-slate-600 dark:text-slate-400">{table.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ObservationTable 
                      experimentId={experiment.id}
                      tableId={table.id}
                      columns={table.columns} 
                      data={tableData[table.id] || []} 
                      standardValue={standardValue}
                      onChange={(newData) => handleTableChange(table.id, newData)} 
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 4: Graphs */}
          <section className="space-y-8 no-break">
            <div className="flex items-center gap-2 text-primary">
              <LineChart className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">Graphical Analysis</h2>
            </div>
            <div className="grid grid-cols-1 gap-12">
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
          </section>

          {/* Section 5: Calculation & Result */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 no-break">
            <Card className="border-4 border-primary/20 shadow-2xl overflow-hidden bg-white">
              <CardHeader className="bg-primary/5 border-b py-4">
                <CardTitle className="text-primary flex items-center gap-3 uppercase tracking-widest font-black text-sm">
                  <Calculator className="h-5 w-5" /> Result Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">Observed Result</p>
                  <p className="text-5xl font-mono font-black tracking-tighter text-slate-900">
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

            <Card className="border-2 shadow-xl bg-slate-900 text-white">
              <CardHeader className="border-b border-slate-800 py-4">
                <CardTitle className="flex items-center gap-3 uppercase tracking-widest font-black text-sm">
                  <HelpCircle className="h-5 w-5 text-primary" /> Viva-Voce Q&A
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {experiment.questions.slice(0, 4).map((q, i) => (
                    <AccordionItem key={i} value={`q-${i}`} className="border-b border-slate-800 px-6 last:border-0">
                      <AccordionTrigger className="text-left font-bold text-xs uppercase tracking-tight hover:no-underline py-4">
                        {q.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-400 text-sm leading-relaxed pb-6 pt-2">
                        {q.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="p-6 border-t border-slate-800 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("questions")} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white hover:bg-primary/20">
                    View All Questions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
