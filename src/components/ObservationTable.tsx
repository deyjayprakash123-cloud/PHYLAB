"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Zap } from "lucide-react";
import { generateRowFromPrincipal } from "@/lib/utils/physics-calc";

interface Column {
  key: string;
  label: string;
  unit?: string;
}

interface ObservationTableProps {
  experimentId: string;
  tableId: string;
  principalConfig?: { key: string; label: string; unit?: string };
  columns: Column[];
  data: any[];
  onChange: (newData: any[]) => void;
}

export function ObservationTable({ experimentId, tableId, principalConfig, columns, data, onChange }: ObservationTableProps) {
  const addRow = () => {
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {});
    if (principalConfig) {
      newRow[principalConfig.key] = "";
    }
    onChange([...data, newRow]);
  };

  const removeRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const handleCellChange = (index: number, key: string, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  const handlePrincipalChange = (index: number, value: string) => {
    const numVal = parseFloat(value);
    const newData = [...data];
    if (isNaN(numVal)) {
      newData[index][principalConfig!.key] = value;
    } else {
      const generatedRow = generateRowFromPrincipal(experimentId, tableId, numVal, index, data[index]);
      newData[index] = generatedRow;
    }
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900">
              <TableHead className="w-12 text-center font-black">#</TableHead>
              {principalConfig && (
                <TableHead className="bg-primary/5 border-x-2 border-primary/20 w-40">
                  <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                    <Zap className="h-3 w-3" /> {principalConfig.label}
                  </div>
                  {principalConfig.unit && <span className="text-[9px] text-muted-foreground">({principalConfig.unit})</span>}
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key} className="font-bold text-[10px] uppercase tracking-tighter">
                  {col.label} <br/> {col.unit && <span className="text-[9px] text-muted-foreground font-normal">({col.unit})</span>}
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <TableCell className="text-center text-muted-foreground font-mono text-xs">{rowIndex + 1}</TableCell>
                {principalConfig && (
                  <TableCell className="bg-primary/5 border-x-2 border-primary/10">
                    <Input
                      type="number"
                      step="any"
                      value={row[principalConfig.key] || ""}
                      onChange={(e) => handlePrincipalChange(rowIndex, e.target.value)}
                      placeholder="Input Result"
                      className="h-8 border-primary/30 focus-visible:ring-primary font-bold text-primary"
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Input
                      type="number"
                      step="any"
                      value={row[col.key] || ""}
                      onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                      placeholder="0.00"
                      className="h-8 border-slate-200 dark:border-slate-800 focus-visible:ring-primary shadow-none bg-transparent font-mono text-xs"
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
                <TableCell colSpan={(principalConfig ? 1 : 0) + columns.length + 2} className="text-center py-12 text-muted-foreground italic">
                  No data points added yet. Use the principal input to auto-generate readings.
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
