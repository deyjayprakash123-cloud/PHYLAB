"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Beaker, Instagram, Mail, Maximize2, Monitor, Rocket, Smartphone } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  const [isWide, setIsWide] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-slate-940 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 ${isWide ? 'px-0' : 'px-4 sm:px-8'}`}>
      
      {/* Floating Physics Elements Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[15%] animate-bounce duration-[4000ms] opacity-20 dark:opacity-40">
          <div className="w-16 h-16 border-4 border-primary rounded-full flex items-center justify-center font-mono font-black text-primary text-xl">g</div>
        </div>
        <div className="absolute top-[60%] right-[10%] animate-pulse duration-[3000ms] opacity-20 dark:opacity-40">
          <div className="w-20 h-20 bg-accent/20 border-2 border-accent rounded-xl rotate-12 flex items-center justify-center font-mono font-black text-accent text-2xl">Y</div>
        </div>
        <div className="absolute top-[20%] right-[25%] animate-bounce duration-[5000ms] opacity-20 dark:opacity-40 delay-700">
          <div className="w-12 h-12 border-4 border-emerald-500 rounded-full flex items-center justify-center font-mono font-black text-emerald-500 text-lg">λ</div>
        </div>
        <div className="absolute bottom-[20%] left-[20%] animate-pulse duration-[4500ms] opacity-20 dark:opacity-40">
          <div className="w-14 h-14 bg-primary/20 border-2 border-primary rotate-45 flex items-center justify-center font-mono font-black text-primary text-xl">η</div>
        </div>
        
        {/* Particle/Atom lines mock */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full animate-spin duration-[20s] linear" />
      </div>

      {/* Screen Adjust Button - Top Right */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
        <ThemeToggle />
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/10 backdrop-blur-md border-slate-200 dark:border-slate-800"
          onClick={() => setIsWide(!isWide)}
          title="Toggle Screen View"
        >
          {isWide ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Content Card */}
      <div className={`z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center transition-all duration-700 ${isWide ? 'max-w-4xl' : 'max-w-xl'}`}>
        <div className="bg-primary p-4 rounded-3xl mb-8 shadow-lg animate-pulse">
          <Beaker className="h-10 w-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black font-headline mb-4 tracking-tighter uppercase leading-none">
          OUTR Physics <br/> <span className="text-primary">Lab Assistant</span>
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mb-10 max-w-md">
          The ultimate digital companion for your B.Tech physics laboratory experiments.
        </p>

        <Link href="/dashboard" className="w-full">
          <Button size="lg" className="w-full py-8 text-xl font-black uppercase tracking-tighter rounded-2xl group shadow-xl hover:shadow-primary/20 transition-all duration-300">
            Get Started <Rocket className="ml-2 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </Link>

        {/* Development Status */}
        <div className="mt-12 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl">
          <p className="text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Status: In Developing Phase</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-3 w-3" /> 
            <a href="mailto:deyjayprakash123@gmail.com" className="hover:underline">deyjayprakash123@gmail.com</a>
          </div>
        </div>
      </div>

      {/* Credit Section - Side Sidebar styled */}
      <div className="absolute bottom-6 left-6 z-50 flex flex-col gap-1 items-start">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg">
          <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Developed By</p>
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2">Jayaprakash Dey</h3>
          <a 
            href="https://instagram.com/jayyyyyy_hx" 
            target="_blank" 
            className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <Instagram className="h-3.5 w-3.5" /> @jayyyyyy_hx
          </a>
        </div>
      </div>
    </div>
  );
}
