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

  const handlePointClick = (data: any) => {
    if (data && data.payload) {
      const point = data.payload as DataPoint;
      setClickedPoint(point);
      toast({
        title: "Data Point Coordinates",
        description: `(${xLabel}: ${point.x.toFixed(4)}${xUnit}, ${yLabel}: ${point.y.toFixed(4)}${yUnit})`,
      });
    }
  };

  return (
    <Card className="border-2 overflow-hidden">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg font-semibold flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
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
      <CardContent className="p-0 sm:p-6">
        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={validPoints} 
              margin={{ top: 30, right: 30, bottom: 60, left: 60 }}
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  handlePointClick(e.activePayload[0]);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
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
                label={{ value: `${yLabel}${yUnit ? ` (${yUnit})` : ""}`, angle: -90, position: 'insideLeft', offset: -20 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Line
                name="Experimental Data"
                type="monotone"
                dataKey="y"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                activeDot={{ r: 6, onClick: (e, payload) => handlePointClick(payload) }}
                label={{ 
                  position: 'top', 
                  fontSize: 10, 
                  fill: "hsl(var(--muted-foreground))",
                  formatter: (val: any, entry: any) => `(${entry.payload.x.toFixed(2)}, ${val.toFixed(2)})`
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {clickedPoint && (
          <div className="px-6 pb-6 text-center">
            <p className="text-xs text-muted-foreground font-mono">
              Last selected: <span className="text-primary font-bold">X={clickedPoint.x.toFixed(4)}</span>, <span className="text-primary font-bold">Y={clickedPoint.y.toFixed(4)}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
