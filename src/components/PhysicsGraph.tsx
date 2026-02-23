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
import { Download, Info, Settings2, RotateCcw } from "lucide-react";
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
    if (!showBestFit || validPoints.length < 2 || multiSeries) return null;
    return calculateLinearRegression(validPoints);
  }, [validPoints, showBestFit, multiSeries]);

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
        description: `${xLabel}: ${xVal.toFixed(4)}${xUnit}, ${yLabel}: ${yVal.toFixed(4)}${yUnit} (${seriesLabel})`,
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "Generating PNG image... Please use the Print feature in the main dashboard for a full laboratory report.",
    });
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
      <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <CardTitle className="text-lg font-extrabold font-headline text-slate-900 dark:text-white uppercase tracking-tight">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2 no-print">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Settings2 className="h-3.5 w-3.5" /> Scale
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm uppercase tracking-wider">Axis Scaling</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setUseCustomScale(false);
                        setXScale({ min: "", max: "" });
                        setYScale({ min: "", max: "" });
                      }}
                      className="h-8 px-2 text-xs"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" /> Reset
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-slate-500">X-Min</Label>
                      <Input 
                        type="number" 
                        value={xScale.min} 
                        onChange={(e) => { setXScale(prev => ({ ...prev, min: e.target.value })); setUseCustomScale(true); }}
                        placeholder="Auto"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-slate-500">X-Max</Label>
                      <Input 
                        type="number" 
                        value={xScale.max} 
                        onChange={(e) => { setXScale(prev => ({ ...prev, max: e.target.value })); setUseCustomScale(true); }}
                        placeholder="Auto"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-slate-500">Y-Min</Label>
                      <Input 
                        type="number" 
                        value={yScale.min} 
                        onChange={(e) => { setYScale(prev => ({ ...prev, min: e.target.value })); setUseCustomScale(true); }}
                        placeholder="Auto"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-slate-500">Y-Max</Label>
                      <Input 
                        type="number" 
                        value={yScale.max} 
                        onChange={(e) => { setYScale(prev => ({ ...prev, max: e.target.value })); setUseCustomScale(true); }}
                        placeholder="Auto"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground italic">Setting any value will enable custom scaling.</p>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" onClick={handleExport} className="h-8 gap-2 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
              <Download className="h-3.5 w-3.5" /> Export PNG
            </Button>
          </div>
        </div>
        
        {regression && !multiSeries && (
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-[11px] font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
              SLOPE: {regression.slope.toFixed(4)}
            </span>
            <span className="text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              EQN: {formattedEquation}
            </span>
            <span className="text-[11px] font-mono font-bold bg-accent/10 text-accent px-2.5 py-1 rounded-full border border-accent/20">
              R²: {regression.r2.toFixed(4)}
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 sm:p-8">
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={mergedData} 
              margin={{ top: 20, right: 40, bottom: 60, left: 60 }}
              onClick={handlePointClick}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={xLabel} 
                domain={xDomain as any}
                allowDataOverflow={useCustomScale}
                stroke="#334155"
                tick={{fontSize: 12, fontWeight: 500}}
                label={{ 
                  value: `${xLabel}${xUnit ? ` (${xUnit})` : ""}`, 
                  position: 'bottom', 
                  offset: 40, 
                  style: { fontWeight: 700, fontSize: 13, fill: '#475569', textTransform: 'uppercase' } 
                }}
              />
              <YAxis 
                type="number" 
                stroke="#334155"
                domain={yDomain as any}
                allowDataOverflow={useCustomScale}
                tick={{fontSize: 12, fontWeight: 500}}
                label={{ 
                  value: `${yLabel}${yUnit ? ` (${yUnit})` : ""}`, 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: -40,
                  style: { fontWeight: 700, fontSize: 13, fill: '#475569', textTransform: 'uppercase' }
                }}
              />
              <Tooltip 
                cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#1e293b' }}
              />
              <Legend 
                verticalAlign="top" 
                height={40} 
                iconType="circle"
                wrapperStyle={{ paddingTop: '0px', paddingBottom: '20px', fontSize: '12px', fontWeight: 600 }}
              />

              {multiSeries ? (
                multiSeries.map((series) => (
                  <Line
                    key={series.key}
                    name={series.label}
                    type={type === "monotone" ? "monotone" : "linear"}
                    dataKey={series.key}
                    stroke={series.color}
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: series.color, stroke: "white", strokeWidth: 2 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    animationDuration={1500}
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
                    strokeWidth={2.5}
                    dot={{ r: 6, fill: "hsl(var(--primary))", stroke: "white", strokeWidth: 2 }}
                    activeDot={{ r: 9, strokeWidth: 0 }}
                    animationDuration={1500}
                    isAnimationActive={true}
                  />
                  {showBestFit && regression && (
                    <Line
                      name="Best-Fit Line"
                      type="linear"
                      dataKey="bestFit"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="8 5"
                      dot={false}
                      activeDot={false}
                      animationDuration={1000}
                    />
                  )}
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {clickedPoint && (
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Coordinates Details</p>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                  {clickedPoint.label && <span className="text-primary mr-2">[{clickedPoint.label}]</span>}
                  {xLabel}: <span className="text-accent">{clickedPoint.x.toFixed(4)}</span>, 
                  {yLabel}: <span className="text-accent">{clickedPoint.y.toFixed(4)}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}