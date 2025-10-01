"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { InterpretedFilterCriteria } from "@/lib/ploomes-mappings";

interface FilterCardProps {
  criterion: InterpretedFilterCriteria;
  index: number;
  isFirstInGroup?: boolean;
  logicalOperator?: "AND" | "OR";
}

export const FilterCard = ({ 
  criterion, 
  index, 
  isFirstInGroup = false, 
  logicalOperator 
}: FilterCardProps) => {
  return (
    <div className="relative">
      {/* Filter Card */}
      <div className="p-3 bg-white rounded-md">
        <div className="flex items-start justify-between gap-3">
          {/* Main Content */}
          <div className="flex-1 space-y-2">
            {/* Entity and Field */}
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {criterion.entity}
              </Badge>
              <span className="font-medium text-zinc-800">{criterion.field}</span>
            </div>
            
            {/* Operation and Value */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-600">{criterion.operation}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {criterion.value}
              </Badge>
            </div>
          </div>
          
          {/* Criterion Number */}
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
              {index + 1}
            </div>
          </div>
        </div>
        

      </div>
    </div>
  );
};