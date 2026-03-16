"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface Column {
  key: string;
  label: string;
  unit?: string;
}

interface ObservationTableProps {
  experimentId: string;
  tableId: string;
  columns: Column[];
  data: any[];
  standardValue: number;
  onChange: (newData: any[]) => void;
}

export function ObservationTable({ 
  columns, 
  data, 
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
    const newData = [...data];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-0">
      <div className="rounded-none border-0 overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="bg-slate-900 hover:bg-slate-900 border-0">
              <TableHead className="w-12 text-center font-black text-white text-[10px] border-r border-slate-700">#</TableHead>
              {columns.map((col) => (
                <TableHead key={col.key} className="font-black text-[10px] uppercase tracking-tighter text-white border-r border-slate-700 h-14">
                  <div className="space-y-0.5">
                    <div>{col.label}</div>
                    {col.unit && <div className="text-[9px] text-slate-400 font-bold lowercase">({col.unit})</div>}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12 no-print"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-slate-50 transition-colors group">
                <TableCell className="text-center text-slate-400 font-mono text-[10px] font-black border-r border-slate-100">{rowIndex + 1}</TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key} className="p-0 border-r border-slate-100">
                    <Input
                      type="text"
                      value={row[col.key] || ""}
                      onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                      placeholder="---"
                      className="h-10 border-none focus-visible:ring-1 focus-visible:ring-primary/30 shadow-none bg-transparent font-mono text-[11px] font-bold text-center"
                    />
                  </TableCell>
                ))}
                <TableCell className="p-0 text-center no-print">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(rowIndex)}
                    className="h-8 w-8 text-slate-300 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center py-16 text-slate-400 italic font-medium">
                  No observation data recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="no-print p-4 border-t border-dashed bg-slate-50/50">
        <Button onClick={addRow} variant="outline" size="sm" className="w-full border-dashed border-2 font-black uppercase text-[10px] tracking-widest py-5 h-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Observation Row
        </Button>
      </div>
    </div>
  );
}
