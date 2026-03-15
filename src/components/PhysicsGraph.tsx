"use client";

import { useState, useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
  Legend,
  Dot
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateLinearRegression, type DataPoint } from "@/lib/utils/physics-calc";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Info, Settings2, RotateCcw, FileType } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PhysicsGraphProps {
  data: DataPoint[];
  title: string;
  xLabel: string;
  yLabel: string;
  xUnit?: string;
  yUnit?: string;
  showBestFit?: boolean;
  type?: "linear" | "monotone";
  multiSeries?: { key: string; label: string; color: string }[];
  equationFormat?: string;
}

export function PhysicsGraph({ 
  data, 
  title, 
  xLabel, 
  yLabel, 
  xUnit, 
  yUnit, 
  showBestFit = true,
  type = "linear",
  multiSeries,
  equationFormat
}: PhysicsGraphProps) {
  const [clickedPoint, setClickedPoint] = useState<{ x: number; y: number; label?: string } | null>(null);
  
  // Custom Scale State
  const [useCustomScale, setUseCustomScale] = useState(false);
  const [xScale, setXScale] = useState({ min: "", max: "" });
  const [yScale, setYScale] = useState({ min: "", max: "" });

  const validPoints = useMemo(() => {
    return data
      .filter(p => !isNaN(p.x) && (typeof p.y === 'number' && !isNaN(p.y)))
      .sort((a, b) => a.x - b.x);
  }, [data]);

  const regression = useMemo(() => {
    if (type !== "linear" || validPoints.length < 2 || multiSeries) return null;
    return calculateLinearRegression(validPoints);
  }, [validPoints, type, multiSeries]);

  const bestFitData = useMemo(() => {
    if (!regression || validPoints.length < 2) return [];
    const minX = Math.min(...validPoints.map(p => p.x));
    const maxX = Math.max(...validPoints.map(p => p.x));
    return [
      { x: minX, bestFit: regression.slope * minX + regression.intercept },
      { x: maxX, bestFit: regression.slope * maxX + regression.intercept }
    ];
  }, [regression, validPoints]);

  const mergedData = useMemo(() => {
    if (!regression) return validPoints;
    return [...validPoints, ...bestFitData].sort((a, b) => (a.x ?? 0) - (b.x ?? 0));
  }, [validPoints, bestFitData, regression]);

  const handlePointClick = (pointData: any) => {
    if (pointData && pointData.activePayload && pointData.activePayload[0]) {
      const payload = pointData.activePayload[0].payload;
      const xVal = payload.x;
      const yVal = pointData.activePayload[0].value;
      const seriesLabel = pointData.activePayload[0].name;
      
      setClickedPoint({ x: xVal, y: yVal, label: seriesLabel });
      toast({
        title: "Coordinate Selected",
        description: `${xLabel}: ${xVal.toFixed(4)}${xUnit ? ` ${xUnit}` : ""}, ${yLabel}: ${yVal.toFixed(4)}${yUnit ? ` ${yUnit}` : ""}`,
      });
    }
  };

  const handleExport = (format: 'PNG' | 'PDF') => {
    if (format === 'PDF') {
      window.print();
    } else {
      toast({
        title: "Exporting Graph",
        description: `Generating high-resolution ${format} of your experimental data...`,
      });
    }
  };

  const formattedEquation = useMemo(() => {
    if (!regression) return null;
    if (equationFormat) {
      return equationFormat
        .replace("m", regression.slope.toFixed(4))
        .replace("c", Math.abs(regression.intercept).toFixed(4))
        .replace("+ -", "- ")
        .replace("- -", "+ ");
    }
    return regression.equation;
  }, [regression, equationFormat]);

  const xDomain = useCustomScale ? [parseFloat(xScale.min) || 0, parseFloat(xScale.max) || "auto"] : ["auto", "auto"];
  const yDomain = useCustomScale ? [parseFloat(yScale.min) || 0, parseFloat(yScale.max) || "auto"] : ["auto", "auto"];

  return (
    <Card className="border-2 overflow-hidden shadow-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-extrabold font-headline text-slate-900 dark:text-white uppercase tracking-tight">
              {title}
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">Lab Station: Scientific Plotting Engine</p>
          </div>
          <div className="flex items-center gap-2 no-print">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2 font-bold uppercase text-[10px] tracking-widest">
                  <Settings2 className="h-3.5 w-3.5" /> Set Scale
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-5 shadow-2xl" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase tracking-widest">Manual Axis Control</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setUseCustomScale(false);
                        setXScale({ min: "", max: "" });
                        setYScale({ min: "", max: "" });
                      }}
                      className="h-8 px-2 text-[10px] font-bold"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" /> RESET
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-slate-500">X-Min</Label>
                      <Input 
                        type="number" 
                        value={xScale.min} 
                        onChange={(e) => { setXScale(prev => ({ ...prev, min: e.target.value })); setUseCustomScale(true); }}
                        placeholder="Auto"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-slate-500">X-Max</Label>
                      <Input 
                        type="number" 
                        value={xScale.max} 
                        onChange={(e) => { setXScale(prev => ({ ...prev, max: e.target.value })); setUseCustomScale(true); }}
                        placeholder="Auto"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-slate-500">Y-Min</Label>
                      <Input 
                        type="number" 
                        value={yScale.min} 
                        onChange={(e) => { setYScale(prev => ({ ...prev, min: e.target.value })); setUseCustomScale(true); }}
                        placeholder="Auto"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-slate-500">Y-Max</Label>
                      <Input 
                        type="number" 
                        value={yScale.max} 
                        onChange={(e) => { setYScale(prev => ({ ...prev, max: e.target.value })); setUseCustomScale(true); }}
                        placeholder="Auto"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" onClick={() => handleExport('PNG')} className="h-9 gap-2 font-bold uppercase text-[10px] tracking-widest">
              <Download className="h-3.5 w-3.5" /> PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} className="h-9 gap-2 font-bold uppercase text-[10px] tracking-widest">
              <FileType className="h-3.5 w-3.5" /> PDF
            </Button>
          </div>
        </div>
        
        {regression && (
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Regression Statistics</span>
              <div className="flex gap-2">
                <span className="text-[11px] font-mono font-black bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20">
                  SLOPE: {regression.slope.toFixed(4)}
                </span>
                <span className="text-[11px] font-mono font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  EQN: {formattedEquation}
                </span>
                <span className="text-[11px] font-mono font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-200">
                  R²: {regression.r2.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 sm:p-10 bg-white dark:bg-slate-950">
        <div className="h-[500px] w-full border border-slate-200 dark:border-slate-800 rounded-xl bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={mergedData} 
              margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
              onClick={handlePointClick}
            >
              <CartesianGrid strokeDasharray="1 1" vertical={true} horizontal={true} stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={xLabel} 
                domain={xDomain as any}
                allowDataOverflow={useCustomScale}
                stroke="#000000"
                tick={{fontSize: 11, fontWeight: 700, fill: '#000'}}
                tickLine={{stroke: '#000'}}
                label={{ 
                  value: `${xLabel}${xUnit ? ` (${xUnit})` : ""}`, 
                  position: 'bottom', 
                  offset: 40, 
                  style: { fontWeight: 900, fontSize: 12, fill: '#000', textTransform: 'uppercase', letterSpacing: '0.05em' } 
                }}
              />
              <YAxis 
                type="number" 
                stroke="#000000"
                domain={yDomain as any}
                allowDataOverflow={useCustomScale}
                tick={{fontSize: 11, fontWeight: 700, fill: '#000'}}
                tickLine={{stroke: '#000'}}
                label={{ 
                  value: `${yLabel}${yUnit ? ` (${yUnit})` : ""}`, 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: -45,
                  style: { fontWeight: 900, fontSize: 12, fill: '#000', textTransform: 'uppercase', letterSpacing: '0.05em' }
                }}
              />
              <Tooltip 
                cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '2 2' }}
                contentStyle={{ 
                  borderRadius: '0px', 
                  border: '2px solid #000', 
                  boxShadow: '8px 8px 0px rgba(0,0,0,0.1)',
                  padding: '12px',
                  backgroundColor: '#fff'
                }}
                labelStyle={{ fontWeight: '900', color: '#000', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '8px' }}
                itemStyle={{ fontWeight: '700', fontSize: '11px' }}
              />
              <Legend 
                verticalAlign="top" 
                height={40} 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
              />

              {multiSeries ? (
                multiSeries.map((series) => (
                  <Line
                    key={series.key}
                    name={series.label}
                    type={type === "monotone" ? "monotone" : "linear"}
                    dataKey={series.key}
                    stroke={series.color}
                    strokeWidth={2}
                    dot={{ r: 4, fill: series.color, stroke: "white", strokeWidth: 1.5 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1000}
                    connectNulls
                  />
                ))
              ) : (
                <>
                  <Line
                    name="Experimental Data"
                    type={type === "monotone" ? "monotone" : "linear"}
                    dataKey="y"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 5, fill: "hsl(var(--primary))", stroke: "#000", strokeWidth: 1 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    animationDuration={1200}
                  />
                  {type === "linear" && regression && (
                    <Line
                      name="Best-Fit Line"
                      type="linear"
                      dataKey="bestFit"
                      stroke="#ef4444"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={false}
                      animationDuration={800}
                    />
                  )}
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {clickedPoint && (
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-none border-l-4 border-primary animate-in fade-in slide-in-from-left-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-white p-2 rounded-none">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Point Coordinates</p>
                  <p className="text-lg font-mono font-black text-slate-900 dark:text-white">
                    {clickedPoint.label && <span className="text-primary mr-2">[{clickedPoint.label}]</span>}
                    {xLabel.split(' ')[0]}: <span className="text-primary">{clickedPoint.x.toFixed(4)}</span>
                    <span className="mx-4 text-slate-300">|</span>
                    {yLabel.split(' ')[0]}: <span className="text-primary">{clickedPoint.y.toFixed(4)}</span>
                  </p>
                </div>
              </div>
              <Button variant="link" onClick={() => setClickedPoint(null)} className="text-[10px] font-black uppercase text-slate-400">Clear Marker</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}