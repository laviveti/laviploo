"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import type { AutomationWithDetails } from "@/hooks/use-automation-details";
import { translateFilterValue } from "@/lib/ploomes-filter-translator";

interface FilterSectionProps {
  automation: AutomationWithDetails;
}

export const FilterSection = ({ automation }: FilterSectionProps) => {
  // Check if we have filter data
  const hasFilterCriteria = automation.filterCriteria && automation.filterCriteria.length > 0;
  // "true" is a special case: it means no actual filter criteria (always true)
  const hasFilterExpression = automation.filterExpression && automation.filterExpression.toLowerCase().trim() !== 'true';

  if (!hasFilterCriteria && !hasFilterExpression) {
    return (
      <Card className='border-zinc-200'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
            <Filter className='h-4 w-4 text-orange-600' />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-zinc-500 italic'>Automação sem filtros personalizados</div>
        </CardContent>
      </Card>
    );
  }

  // Check if has multiple groups (OR logic)
  const hasMultipleGroups = hasFilterCriteria && new Set(automation.filterCriteria?.map((c) => c.logicalGroup || 1)).size > 1;

  return (
    <Card className='border-zinc-200'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
          <Filter className='h-4 w-4 text-orange-600' />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
          {/* Filter Table */}
          {hasFilterCriteria && (
            <div className='space-y-3'>
              {/* Logic indicator */}
              {hasMultipleGroups ? (
                <Badge variant='outline' className='bg-orange-50 text-orange-700 border-orange-200 text-xs'>
                  Grupos com lógica OU
                </Badge>
              ) : (
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1'>
                    E (AND)
                  </Badge>
                  <span className='text-xs text-zinc-500'>Todas as condições abaixo devem ser atendidas</span>
                </div>
              )}

              {/* Table */}
              <div className='border border-zinc-200 rounded-md overflow-hidden'>
                <table className='w-full text-sm'>
                  <thead className='bg-zinc-50 border-b border-zinc-200'>
                    <tr>
                      <th className='text-left px-3 py-2 font-medium text-zinc-700 text-xs'>Entidade</th>
                      <th className='text-left px-3 py-2 font-medium text-zinc-700 text-xs'>Campo</th>
                      <th className='text-left px-3 py-2 font-medium text-zinc-700 text-xs'>Operação</th>
                      <th className='text-left px-3 py-2 font-medium text-zinc-700 text-xs'>Valor</th>
                      <th className='text-center px-3 py-2 font-medium text-zinc-700 text-xs w-12'></th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-zinc-100'>
                    {automation.filterCriteria?.map((criterion, index) => (
                      <tr key={index} className='hover:bg-zinc-50 transition-colors'>
                        <td className='px-3 py-2 text-zinc-700'>
                          <div className='truncate max-w-[120px]'>{criterion.entity || "Workflow"}</div>
                        </td>
                        <td className='px-3 py-2 text-zinc-700 font-medium'>
                          <div className='truncate max-w-[180px]'>{criterion.field}</div>
                        </td>
                        <td className='px-3 py-2 text-zinc-600'>
                          <div className='truncate max-w-[120px]'>{criterion.operation}</div>
                        </td>
                        <td className='px-3 py-2'>
                          <code className='text-xs bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-700 inline-block max-w-[300px] truncate align-middle'>
                            {translateFilterValue(criterion.value)}
                          </code>
                        </td>
                        <td className='text-center px-3 py-2'>
                          <Badge variant='outline' className='text-xs text-blue-600 border-blue-200 bg-blue-50'>
                            {index + 1}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Filter Expression - Always visible at bottom */}
          {hasFilterExpression && (
            <div className='p-3 bg-zinc-50 border border-zinc-200 rounded-md'>
              <div className='text-xs font-medium text-zinc-600 mb-2'>Expressão OData:</div>
              <code className='text-xs text-zinc-700 break-all block p-2 bg-white rounded border'>{automation.filterExpression}</code>
            </div>
          )}
      </CardContent>
    </Card>
  );
};
