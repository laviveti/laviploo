"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import type { Automation } from "@/types/automations";
import { getActionTypeName } from "@/lib/ploomes-actions-translator";
import { Hint } from "@/components/system/hint";

interface AutomationDetailsActionsProps {
  automation: Automation;
}

const getCardName = (actionsLength: number) => {
  return actionsLength <= 1 ? `Disparo` : `Disparos (${actionsLength})`;
};

export const AutomationDetailsActions = ({ automation }: AutomationDetailsActionsProps) => {
  const hasActions = automation.actions && automation.actions.length > 0;

  if (!hasActions) {
    return (
      <Card className='border-zinc-200'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
            <Zap className='h-4 w-4 text-orange-600' />
            Disparos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-zinc-500 italic'>Nenhuma ação configurada</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='border-zinc-200'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
          <Zap className='h-4 w-4 text-orange-600' />
          {getCardName(automation.actions?.length || 0)}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {automation.actions?.map((action, actionIndex) => {
          const hasParameters = action.parameters && action.parameters.length > 0;
          const actionTypeName = getActionTypeName(parseInt(action.type));

          return (
            <div key={action.id} className='space-y-2'>
              {/* Action Header */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='text-xs text-blue-600 border-blue-200 bg-blue-50'>
                    {actionIndex + 1}
                  </Badge>
                  <span className='text-sm font-medium text-zinc-800'>{actionTypeName}</span>
                </div>
              </div>

              {/* Parameters Table */}
              {hasParameters ? (
                <div className='border border-zinc-200 rounded-md overflow-hidden'>
                  <table className='w-full text-sm'>
                    <thead className='bg-zinc-50 border-b border-zinc-200'>
                      <tr>
                        <th className='text-left px-3 py-2 font-medium text-zinc-700 text-xs'>Campo</th>
                        <th className='text-left px-3 py-2 font-medium text-zinc-700 text-xs'>Tipo de preenchimento</th>
                        <th className='text-left px-3 py-2 font-medium text-zinc-700 text-xs'>Valor</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-zinc-100'>
                      {action.parameters?.map((param) => (
                        <tr key={param.id} className='hover:bg-zinc-50 transition-colors'>
                          <td className='px-3 py-2 text-zinc-700 font-medium'>
                            <div className='truncate max-w-[200px]'>{param.fieldName}</div>
                          </td>
                          <td className='px-3 py-2 text-zinc-600'>
                            <div className='truncate max-w-[150px]'>{param.fillType || "Valor fixo"}</div>
                          </td>
                          <td className='px-3 py-2'>
                            <Hint
                              contentClassName='z-50 -m-0.5 text-xs rounded-xs px-1.5 max-w-90'
                              align='start'
                              side='bottom'
                              content={param.value || "-"}>
                              <code className='text-xs bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-700 inline-block max-w-[350px] truncate align-middle'>
                                {param.value || "-"}
                              </code>
                            </Hint>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='text-xs text-zinc-500 italic px-2'>Sem parâmetros configurados</div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
