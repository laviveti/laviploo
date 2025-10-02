"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { Automation } from "@/types/automations";
import { getEntityDisplay, getTriggerTypeDisplay } from "./automation-details-utils";

interface AutomationDetailsTriggerProps {
  automation: Automation;
}

export const AutomationDetailsTrigger = ({ automation }: AutomationDetailsTriggerProps) => {
  const olá = "oi";
  return (
    <Card className='border-zinc-200'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
          <Target className='h-4 w-4 text-blue-600' />
          Gatilho: {` ${getTriggerTypeDisplay(automation.triggerType)}`}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='space-y-2'>
          <div className='text-xs text-zinc-600'>
            <span className='font-medium'>Entidade:</span> {getEntityDisplay(automation.entityId)}
          </div>
          {automation.stageId && (
            <div className='text-xs text-zinc-600'>
              <span className='font-medium'>Estágio específico:</span> {automation.stageName || automation.stageId}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
