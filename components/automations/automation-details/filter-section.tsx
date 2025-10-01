"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, ChevronDown, ChevronRight, Info } from "lucide-react";
import { FilterCard } from "./filter-card";
import type { AutomationWithDetails } from "@/hooks/use-automation-details";
import type { InterpretedFilterCriteria } from "@/lib/ploomes-mappings";

interface FilterSectionProps {
  automation: AutomationWithDetails;
}

export const FilterSection = ({ automation }: FilterSectionProps) => {
  const [showFullDetails, setShowFullDetails] = useState(false);

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
            Filtros
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
            Filtros
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
              onClick={() => setShowFullDetails(!showFullDetails)}
              className='h-6 w-6 p-0 hover:bg-zinc-100 rounded-md'>
              {showFullDetails ? <ChevronDown className='h-3 w-3' /> : <ChevronRight className='h-3 w-3' />}
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Filter Criteria Cards - Always visible first */}
        {hasFilterCriteria && (
          <div className='space-y-3'>
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
            <div className='space-y-4'>
              {groupKeys.map((groupKey, groupIndex) => {
                const groupCriteria = groupedCriteria[groupKey];
                const isFirstGroup = groupIndex === 0;

                return (
                  <div key={groupKey} className='space-y-3'>
                    {/* Group separator for multiple groups */}
                    {!isFirstGroup && hasMultipleGroups && (
                      <div className='flex justify-center py-2'>
                        <Badge variant='outline' className='bg-orange-50 text-orange-700 border-orange-200 text-sm px-3 py-1'>
                          OU
                        </Badge>
                      </div>
                    )}

                    {/* Group container with background */}
                    <div className='bg-zinc-50 rounded-md p-3 border border-zinc-200'>
                      {/* Group header with AND indicator */}
                      {groupCriteria.length > 1 && (
                        <div className='flex items-center gap-2 mb-3'>
                          <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1'>
                            E (AND)
                          </Badge>
                          <span className='text-xs text-zinc-500'>
                            Todas as condições abaixo devem ser atendidas
                          </span>
                        </div>
                      )}

                      {/* Group criteria in vertical layout */}
                      <div className='space-y-0'>
                        {groupCriteria.map((criterion, criterionIndex) => (
                          <div key={criterion.originalIndex}>
                            <FilterCard
                              criterion={criterion}
                              index={criterion.originalIndex}
                              isFirstInGroup={criterionIndex === 0}
                              logicalOperator={undefined}
                            />
                            {criterionIndex < groupCriteria.length - 1 && (
                              <Separator className="my-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Simple Filter Conditions - Second position */}
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

        {/* Filter Expression - Only show when expanded, last position */}
        {showFullDetails && hasFilterExpression && (
          <div className='p-3 bg-zinc-50 border border-zinc-200 rounded-md'>
            <div className='text-xs font-medium text-zinc-600 mb-2'>Expressão OData:</div>
            <code className='text-xs text-zinc-700 break-all block p-2 bg-white rounded border'>{automation.filterExpression}</code>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
