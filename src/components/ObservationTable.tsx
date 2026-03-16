"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Zap } from "lucide-react";
import { generateRowFromInput } from "@/lib/utils/physics-calc";

interface Column {
  key: string;
  label: string;
  unit?: string;
}

interface ObservationTableProps {
  experimentId: string;
  tableId: string;
  aiInputKey?: string;
  columns: Column[];
  data: any[];
  standardValue: number;
  onChange: (newData: any[]) => void;
}

export function ObservationTable({ 
  experimentId, 
  tableId, 
  aiInputKey, 
  columns, 
  data, 
  standardValue,
  onChange 
}: ObservationTableProps) {
  const addRow = () => {
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {});
    onChange([...data, newRow]);
  };

  const removeRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const handleCellChange = (index: number, key: string, value: string) => {
    let newData = [...data];
    if (key === aiInputKey) {
      const generatedRow = generateRowFromInput(experimentId, tableId, key, value, standardValue, data[index]);
      newData[index] = generatedRow;
    } else {
      newData[index] = { ...newData[index], [key]: value };
    }
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900">
              <TableHead className="w-12 text-center font-black">#</TableHead>
              {columns.map((col) => (
                <TableHead key={col.key} className={`font-bold text-[10px] uppercase tracking-tighter ${col.key === aiInputKey ? 'bg-primary/10 border-x border-primary/20' : ''}`}>
                  <div className="flex items-center gap-1">
                    {col.key === aiInputKey && <Zap className="h-3 w-3 text-primary" />}
                    {col.label}
                  </div>
                  {col.unit && <span className="text-[9px] text-muted-foreground font-normal">({col.unit})</span>}
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <TableCell className="text-center text-muted-foreground font-mono text-xs">{rowIndex + 1}</TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.key === aiInputKey ? 'bg-primary/5' : ''}>
                    <Input
                      type="text"
                      value={row[col.key] || ""}
                      onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                      placeholder={col.key === aiInputKey ? "AI Input" : "0.00"}
                      className={`h-8 border-slate-200 dark:border-slate-800 focus-visible:ring-primary shadow-none bg-transparent font-mono text-xs ${col.key === aiInputKey ? 'font-bold text-primary border-primary/30' : ''}`}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(rowIndex)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center py-12 text-muted-foreground italic">
                  No data points added yet. Use the highlighted column for AI generation.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Button onClick={addRow} variant="outline" className="w-full border-dashed border-2 font-bold uppercase text-[10px] tracking-widest py-6">
        <Plus className="mr-2 h-4 w-4" /> Add Observation Row
      </Button>
    </div>
  );
}
