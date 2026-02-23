"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Legend,
  ReferenceLine
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateLinearRegression, type DataPoint } from "@/lib/utils/physics-calc";

interface PhysicsGraphProps {
  data: DataPoint[];
  title: string;
  xLabel: string;
  yLabel: string;
  xUnit?: string;
  yUnit?: string;
}

export function PhysicsGraph({ data, title, xLabel, yLabel, xUnit, yUnit }: PhysicsGraphProps) {
  const validPoints = data.filter(p => !isNaN(p.x) && !isNaN(p.y));
  const regression = calculateLinearRegression(validPoints);

  // Generate regression line points
  const minX = Math.min(...validPoints.map(p => p.x));
  const maxX = Math.max(...validPoints.map(p => p.x));
  
  const trendLine = validPoints.length > 1 ? [
    { x: minX, y_trend: regression.slope * minX + regression.intercept },
    { x: maxX, y_trend: regression.slope * maxX + regression.intercept }
  ] : [];

  return (
    <Card className="border-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          {title}
          {validPoints.length > 1 && (
            <span className="text-xs font-mono bg-accent/10 text-accent-foreground px-2 py-1 rounded">
              Slope: {regression.slope.toFixed(4)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={xLabel} 
                unit={xUnit ? ` ${xUnit}` : ""} 
                label={{ value: `${xLabel} (${xUnit})`, position: 'bottom', offset: 20 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={yLabel} 
                unit={yUnit ? ` ${yUnit}` : ""}
                label={{ value: `${yLabel} (${yUnit})`, angle: -90, position: 'insideLeft', offset: -20 }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend verticalAlign="top" height={36}/>
              <Scatter name="Observations" data={validPoints} fill="hsl(var(--primary))" />
              {validPoints.length > 1 && (
                <Line
                  name="Best Fit Line"
                  data={trendLine}
                  dataKey="y_trend"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
