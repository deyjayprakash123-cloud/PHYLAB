"use client";

import { useState } from "react";
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

interface PhysicsGraphProps {
  data: DataPoint[];
  title: string;
  xLabel: string;
  yLabel: string;
  xUnit?: string;
  yUnit?: string;
}

export function PhysicsGraph({ data, title, xLabel, yLabel, xUnit, yUnit }: PhysicsGraphProps) {
  const [clickedPoint, setClickedPoint] = useState<DataPoint | null>(null);

  const validPoints = data
    .filter(p => !isNaN(p.x) && !isNaN(p.y))
    .sort((a, b) => a.x - b.x);

  const regression = calculateLinearRegression(validPoints);

  const handlePointClick = (pointData: any) => {
    if (pointData && pointData.activePayload && pointData.activePayload[0]) {
      const point = pointData.activePayload[0].payload as DataPoint;
      setClickedPoint(point);
      toast({
        title: "Point Coordinates",
        description: `${xLabel}: ${point.x.toFixed(4)}${xUnit}, ${yLabel}: ${point.y.toFixed(4)}${yUnit}`,
      });
    }
  };

  return (
    <Card className="border-2 overflow-hidden shadow-lg">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg font-bold flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span>{title}</span>
          {validPoints.length > 1 && (
            <div className="flex gap-2">
              <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                Slope: {regression.slope.toFixed(4)}
              </span>
              <span className="text-[10px] font-mono bg-accent/10 text-accent-foreground px-2 py-1 rounded border border-accent/20">
                R²: {regression.r2.toFixed(4)}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={validPoints} 
              margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
              onClick={handlePointClick}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={xLabel} 
                domain={['auto', 'auto']}
                unit={xUnit ? ` ${xUnit}` : ""} 
                label={{ value: `${xLabel}${xUnit ? ` (${xUnit})` : ""}`, position: 'bottom', offset: 20 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={yLabel} 
                domain={['auto', 'auto']}
                unit={yUnit ? ` ${yUnit}` : ""}
                label={{ value: `${yLabel}${yUnit ? ` (${yUnit})` : ""}`, angle: -90, position: 'insideLeft', offset: -10 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => value.toFixed(4)}
              />
              <Legend verticalAlign="top" height={36}/>
              <Line
                name="Experimental Curve"
                type="linear"
                dataKey="y"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                activeDot={{ r: 7, onClick: (e, payload) => handlePointClick({ activePayload: [payload] }) }}
                dot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 1.5, stroke: "hsl(var(--background))" }}
                animationDuration={1000}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {clickedPoint && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10 text-center animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xs font-mono font-semibold text-primary">
              Selected: ({xLabel}: <span className="text-foreground">{clickedPoint.x.toFixed(4)}</span>, {yLabel}: <span className="text-foreground">{clickedPoint.y.toFixed(4)}</span>)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
