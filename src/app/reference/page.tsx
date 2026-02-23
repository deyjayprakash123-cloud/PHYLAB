"use client";

import { standardValues } from "@/lib/physics-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info, Book } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ReferencePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <span className="font-bold">Standard Values Reference</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold font-headline mb-2">Physics Constants</h1>
          <p className="text-muted-foreground">Standard values based on the OUTR Physics Lab Manual.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standardValues.map((item, index) => (
            <Card key={index} className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-mono font-bold text-primary">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" /> Lab Manual Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>1. Always take at least 5 sets of observations for statistical accuracy.</p>
            <p>2. Ensure all instruments are leveled before starting the experiment.</p>
            <p>3. Calculate percentage error using the formula: % Error = |(Observed - Standard) / Standard| × 100.</p>
            <p>4. Graphs should be plotted with independent variables on the X-axis and dependent variables on the Y-axis.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
