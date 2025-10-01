"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, ChevronDown, ChevronRight, Info } from "lucide-react";
import { FilterCard } from "./filter-card";
import type { AutomationWithDetails } from "@/hooks/use-automation-details";
import type { InterpretedFilterCriteria } from "@/lib/ploomes-mappings";

interface FilterSectionProps {
  automation: AutomationWithDetails;
}

export const FilterSection = ({ automation }: FilterSectionProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // Check if we have filter data
  const hasFilterConditions = automation.filterConditions && automation.filterConditions.length > 0;
  const hasFilterCriteria = automation.filterCriteria && automation.filterCriteria.length > 0;
  const hasFilterExpression = automation.filterExpression;

  if (!hasFilterConditions && !hasFilterCriteria && !hasFilterExpression) {
    return (
      <Card className='border-zinc-200'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
            <Filter className='h-4 w-4 text-orange-600' />
            Condições de Execução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-zinc-500 italic'>Nenhuma condição de filtro configurada</div>
        </CardContent>
      </Card>
    );
  }

  // Group criteria by logical group for better organization
  const groupedCriteria =
    automation.filterCriteria?.reduce((groups, criterion, index) => {
      const groupKey = criterion.logicalGroup || 1;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push({ ...criterion, originalIndex: index });
      return groups;
    }, {} as Record<number, Array<InterpretedFilterCriteria & { originalIndex: number }>>) || {};

  const groupKeys = Object.keys(groupedCriteria).map(Number).sort();
  const hasMultipleGroups = groupKeys.length > 1;

  return (
    <Card className='border-zinc-200'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center justify-between text-sm font-medium text-zinc-800'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-orange-600' />
            Condições de Execução
            {hasFilterCriteria && automation.filterCriteria && (
              <Badge variant='outline' className='text-xs px-2 py-0'>
                {automation.filterCriteria.length} critério{automation.filterCriteria.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          {(hasFilterCriteria || hasFilterExpression) && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowDetails(!showDetails)}
              className='h-6 w-6 p-0 hover:bg-zinc-100 rounded-md'>
              {showDetails ? <ChevronDown className='h-3 w-3' /> : <ChevronRight className='h-3 w-3' />}
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Simple Filter Conditions (if available) */}
        {hasFilterConditions && automation.filterConditions && (
          <div className='space-y-2'>
            {automation.filterConditions.map((condition, index) => (
              <div key={index} className='p-3 bg-zinc-50 border border-zinc-200 rounded-md'>
                <div className='flex items-center gap-2 text-sm font-medium text-zinc-800 mb-1'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <span>Filtro {index + 1}</span>
                </div>
                <div className='text-sm text-zinc-700 font-mono bg-white p-2 rounded border'>{condition}</div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Filter Criteria (expandable) */}
        {showDetails && hasFilterCriteria && (
          <div className='space-y-4'>
            {/* Logic Summary */}
            {automation.filterLogic && (
              <div className='p-3 bg-blue-50 border border-blue-200 rounded-md'>
                <div className='flex items-center gap-2 text-sm font-medium text-blue-800 mb-2'>
                  <Info className='h-4 w-4' />
                  Lógica dos Filtros
                </div>
                <div className='text-sm text-blue-700'>{automation.filterLogic.logicDescription}</div>
              </div>
            )}

            {/* Filter Criteria Cards */}
            <div className='space-y-3'>
              {groupKeys.map((groupKey, groupIndex) => {
                const groupCriteria = groupedCriteria[groupKey];
                const isFirstGroup = groupIndex === 0;

                return (
                  <div key={groupKey} className='space-y-3'>
                    {/* Group separator for multiple groups */}
                    {!isFirstGroup && hasMultipleGroups && (
                      <div className='flex justify-center'>
                        <Badge variant='outline' className='bg-orange-50 text-orange-700 border-orange-200'>
                          OU
                        </Badge>
                      </div>
                    )}

                    {/* Group criteria */}
                    {groupCriteria.map((criterion, criterionIndex) => (
                      <FilterCard
                        key={criterion.originalIndex}
                        criterion={criterion}
                        index={criterion.originalIndex}
                        isFirstInGroup={criterionIndex === 0}
                        logicalOperator={criterionIndex === 0 ? undefined : "AND"}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Expression (if available and details are shown) */}
        {showDetails && hasFilterExpression && (
          <div className='p-3 bg-zinc-50 border border-zinc-200 rounded-md'>
            <div className='text-xs font-medium text-zinc-600 mb-2'>Expressão OData:</div>
            <code className='text-xs text-zinc-700 break-all block p-2 bg-white rounded border'>{automation.filterExpression}</code>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
