"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import type { Automation } from "@/types/automations";
import { getActionTypeDisplay } from "./automation-details-utils";

interface AutomationDetailsActionsProps {
  automation: Automation;
}

export const AutomationDetailsActions = ({ automation }: AutomationDetailsActionsProps) => {
  return (
    <Card className='border-zinc-200'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
          <Zap className='h-4 w-4 text-orange-600' />
          Ações ({automation.actions?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {automation.actions && automation.actions.length > 0 ? (
          <div className='space-y-2'>
            {automation.actions.map((action, index) => (
              <div key={index} className='flex items-center justify-between p-2 bg-zinc-50 rounded-md'>
                <div className='flex-1'>
                  <div className='text-sm font-medium text-zinc-800'>{getActionTypeDisplay(action.type)}</div>
                  {action.description && <div className='text-xs text-zinc-600 mt-1'>{action.description}</div>}
                </div>
                <Badge variant='outline' className='text-xs'>
                  {action.type}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-sm text-zinc-500 italic'>Nenhuma ação configurada</div>
        )}
      </CardContent>
    </Card>
  );
};
