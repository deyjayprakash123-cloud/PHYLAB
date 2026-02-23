"use client";

import { useState, useEffect } from "react";
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
  columns: Column[];
  data: any[];
  onChange: (newData: any[]) => void;
}

export function ObservationTable({ columns, data, onChange }: ObservationTableProps) {
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
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              {columns.map((col) => (
                <TableHead key={col.key}>
                  {col.label} {col.unit && <span className="text-xs text-muted-foreground">({col.unit})</span>}
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className="text-center text-muted-foreground font-mono">{rowIndex + 1}</TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Input
                      type="number"
                      step="any"
                      value={row[col.key]}
                      onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                      placeholder="0.00"
                      className="h-8 border-none focus-visible:ring-1 focus-visible:ring-primary shadow-none bg-transparent"
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
                <TableCell colSpan={columns.length + 2} className="text-center py-8 text-muted-foreground">
                  No data points added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Button onClick={addRow} variant="outline" className="w-full border-dashed border-2">
        <Plus className="mr-2 h-4 w-4" /> Add Row
      </Button>
    </div>
  );
}
