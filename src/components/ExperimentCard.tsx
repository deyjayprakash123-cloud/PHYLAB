import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Beaker } from "lucide-react";
import type { Experiment } from "@/lib/physics-data";

export function ExperimentCard({ experiment }: { experiment: Experiment }) {
  return (
    <Link href={`/experiments/${experiment.id}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full border-2 hover:border-primary/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border-primary/20">
              {experiment.category}
            </Badge>
            <Beaker className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl font-headline leading-tight">{experiment.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-2">{experiment.aim}</CardDescription>
        </CardHeader>
        <CardFooter className="pt-4 flex justify-between items-center text-sm font-medium text-primary">
          <span>Start Experiment</span>
          <ArrowRight className="h-4 w-4" />
        </CardFooter>
      </Card>
    </Link>
  );
}
