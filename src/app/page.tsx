"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ExperimentCard } from "@/components/ExperimentCard";
import { experiments } from "@/lib/physics-data";
import { Search, Beaker, GraduationCap, Info } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredExperiments = experiments.filter((exp) =>
    exp.title.toLowerCase().includes(search.toLowerCase()) ||
    exp.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Beaker className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">OUTR Physics Lab</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Assistant – B.Tech</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/reference">
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                <Info className="h-4 w-4" /> Standard Values
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <Badge className="mb-4 py-1 px-4 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Odisha University of Technology and Research</Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-headline mb-4">Digitize Your Lab Experiments</h2>
          <p className="text-lg text-muted-foreground">The official laboratory assistant for first-year B.Tech students. Enter data, generate graphs, and export reports instantly.</p>
        </div>

        <div className="max-w-2xl mx-auto mb-10 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search experiments by name or category..."
            className="pl-10 py-6 text-lg rounded-xl shadow-sm focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiments.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} />
          ))}
          {filteredExperiments.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl">
              <p className="text-lg">No experiments found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">OUTR Physics Lab</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Odisha University of Technology and Research. Developed for Physics Laboratory Course.</p>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
