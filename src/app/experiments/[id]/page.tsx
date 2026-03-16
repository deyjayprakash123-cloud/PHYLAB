"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { experiments, type TableDefinition } from "@/lib/physics-data";
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
  const [standardValue, setStandardValue] = useState(experiment?.standardValue || 0);
  const [aiInputs, setAiInputs] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    if (experiment && Object.keys(tableData).length === 0) {
      const initialData: Record<string, any[]> = {};
      const initialAiInputs: Record<string, Record<string, string>> = {};

      experiment.tables.forEach(t => {
        const rows = [];
        const numRows = t.defaultRows || 5;
        for (let i = 0; i < numRows; i++) {
          rows.push(t.columns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {}));
        }
        initialData[t.id] = rows;
        
        if (t.aiInputFields) {
          initialAiInputs[t.id] = t.aiInputFields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});
        }
      });

      setTableData(initialData);
      setAiInputs(initialAiInputs);
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
    setTableData(prev => {
      const updated = { ...prev, [tableId]: newData };
      
      // Auto-calculations for specific experiments
      if (experiment.id === 'bar-pendulum' && tableId === 'time-measurement') {
        updated[tableId] = newData.map(row => {
          const t1 = parseFloat(row.t1);
          const t2 = parseFloat(row.t2);
          const t3 = parseFloat(row.t3);
          if (!isNaN(t1) && !isNaN(t2) && !isNaN(t3)) {
            const mean = (t1 + t2 + t3) / 3;
            const T = mean / 20;
            return { ...row, mean_t: mean.toFixed(2), T: T.toFixed(3) };
          }
          return row;
        });
      }

      if (experiment.id === 'newtons-rings' && tableId === 'rings') {
        updated[tableId] = newData.map(row => {
          const init = parseFloat(row.initial);
          const fin = parseFloat(row.final);
          if (!isNaN(init) && !isNaN(fin)) {
            const D = Math.abs(fin - init);
            return { ...row, diameter: D.toFixed(4), d2: (D * D).toFixed(5) };
          }
          return row;
        });
      }

      return updated;
    });
  };

  const handleAiInputChange = (tableId: string, fieldKey: string, value: string) => {
    setAiInputs(prev => ({
      ...prev,
      [tableId]: {
        ...(prev[tableId] || {}),
        [fieldKey]: value
      }
    }));
  };

  const generateAiRow = (table: TableDefinition) => {
    const inputs = aiInputs[table.id] || {};
    const inputFields = table.aiInputFields || [];
    
    // Check if all inputs are filled (using the first one as primary for generator)
    const primaryField = inputFields[0];
    const primaryValue = inputs[primaryField.key];

    if (!primaryValue) {
      toast({ variant: "destructive", title: "Missing Input", description: `Please enter a value for ${primaryField.label}.` });
      return;
    }

    const newRow = generateRowFromInput(experiment.id, table.id, primaryField.key, primaryValue, standardValue, {});
    
    setTableData(prev => {
      const currentRows = [...(prev[table.id] || [])];
      // Find first empty row or append
      const emptyRowIndex = currentRows.findIndex(row => Object.values(row).every(v => v === ""));
      if (emptyRowIndex !== -1) {
        currentRows[emptyRowIndex] = newRow;
      } else {
        currentRows.push(newRow);
      }
      return { ...prev, [table.id]: currentRows };
    });

    toast({ title: "Row Generated", description: `A complete observation row has been added to ${table.label}.` });
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
          <Button onClick={() => window.print()} variant="default" size="sm" className="gap-2 font-bold">
            <FileDown className="h-4 w-4" /> EXPORT REPORT
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="printable-area space-y-12">
          {/* Aim, Apparatus, Theory */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <h1 className="text-4xl font-extrabold font-headline uppercase tracking-tighter">{experiment.title}</h1>
              <div className="bg-primary/5 p-4 rounded-xl border-2 border-primary/20 no-print min-w-[200px]">
                <Label className="text-[10px] uppercase font-black text-primary block mb-1">Standard Value</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={standardValue} 
                    onChange={(e) => setStandardValue(parseFloat(e.target.value) || 0)}
                    className="h-8 font-mono font-black border-none bg-transparent p-0 focus-visible:ring-0"
                  />
                  <span className="text-xs font-bold text-slate-500">{experiment.unit}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t">
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Beaker className="h-4 w-4" /> Aim
                </h2>
                <p className="font-medium text-slate-700 dark:text-slate-300">{experiment.aim}</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <ListChecks className="h-4 w-4" /> Apparatus
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">{experiment.apparatus.join(", ")}</p>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h2 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4" /> Theory
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-4">{experiment.theory}</p>
              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border flex flex-col items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Governing Formula</span>
                <code className="text-2xl font-mono font-black text-primary">{experiment.formula}</code>
              </div>
            </div>
          </section>

          {/* Observations with Integrated AI Generators */}
          <section className="space-y-12">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 no-print">
              <Calculator className="h-4 w-4" /> Laboratory Observations
            </h2>
            <div className="space-y-16">
              {experiment.tables.map(table => (
                <div key={table.id} className="space-y-6">
                  <Card className="border-2 shadow-lg overflow-hidden">
                    <CardHeader className="bg-slate-50 py-3 border-b">
                      <CardTitle className="text-xs uppercase tracking-widest font-black text-slate-600">{table.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ObservationTable 
                        experimentId={experiment.id}
                        tableId={table.id}
                        columns={table.columns}
                        data={tableData[table.id] || []}
                        onChange={(newData) => handleTableChange(table.id, newData)}
                        standardValue={standardValue}
                      />
                    </CardContent>
                  </Card>

                  {/* Per-table AI Observation Generator */}
                  {table.aiInputFields && (
                    <Card className="border-2 border-dashed border-primary/30 bg-primary/5 no-print shadow-md">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-primary text-[10px] uppercase tracking-widest font-black">
                          <Zap className="h-4 w-4" /> AI Row Generator for {table.id}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-end gap-4">
                          {table.aiInputFields.map(field => (
                            <div key={field.key} className="flex-1 min-w-[150px] space-y-1.5">
                              <Label className="text-[9px] font-black uppercase text-slate-500">
                                {field.label} {field.unit && `(${field.unit})`}
                              </Label>
                              <Input 
                                type="number"
                                placeholder="Enter value..."
                                value={aiInputs[table.id]?.[field.key] || ""}
                                onChange={(e) => handleAiInputChange(table.id, field.key, e.target.value)}
                                className="h-9 border-2 font-mono text-xs bg-white"
                              />
                            </div>
                          ))}
                          <Button 
                            onClick={() => generateAiRow(table)} 
                            className="font-black uppercase tracking-widest text-[10px] h-9 px-6 bg-primary hover:bg-primary/90"
                          >
                            Generate Row
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Graphs */}
          <section className="space-y-6 no-break">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 no-print">
              <LineChart className="h-4 w-4" /> Graph Section
            </h2>
            <div className="grid grid-cols-1 gap-12">
              {experiment.graphs.map(graphDef => (
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

          {/* Calculation & Result */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 no-break">
            <Card className="border-4 border-primary/30 shadow-2xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b py-4">
                <CardTitle className="text-primary text-sm uppercase tracking-widest font-black flex items-center gap-2">
                  <Calculator className="h-5 w-5" /> Final Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 text-center space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Observed Result</p>
                <p className="text-6xl font-mono font-black text-slate-900">
                  {calculatedResult ? calculatedResult.toFixed(4) : "---"}
                </p>
                <p className="text-lg font-bold text-slate-500">{experiment.unit}</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-slate-200 shadow-2xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b py-4">
                <CardTitle className="text-slate-600 text-sm uppercase tracking-widest font-black flex items-center gap-2">
                  <Info className="h-5 w-5" /> Percentage Error
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 text-center space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Accuracy Assessment</p>
                <p className={`text-6xl font-mono font-black ${error !== null && error < 5 ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {error !== null ? `${error.toFixed(2)}%` : "---"}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Error Margin</p>
              </CardContent>
            </Card>
          </section>

          {/* Viva Questions */}
          <section className="no-print no-break">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
              <HelpCircle className="h-4 w-4" /> Viva-Voce Q&A
            </h2>
            <Card className="border-2 shadow-xl">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {experiment.questions.map((q, i) => (
                    <AccordionItem key={i} value={`q-${i}`} className="border-b px-6 last:border-0">
                      <AccordionTrigger className="text-left font-bold text-sm uppercase hover:no-underline py-4">
                        {q.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-500 leading-relaxed pb-6 pt-2">
                        {q.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
