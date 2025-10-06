"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { Automation } from "@/types/automations";
import { getEntityDisplay, getTriggerTypeDisplay } from "./automation-details-utils";

interface AutomationDetailsTriggerProps {
  automation: Automation;
}

export const AutomationDetailsTrigger = ({ automation }: AutomationDetailsTriggerProps) => {
  return (
    <Card className='border-zinc-200 py-4'>
      <CardHeader className='pb-0'>
        <p className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
          <Target className='h-4 w-4 text-blue-600' />
          Gatilho: {` ${getTriggerTypeDisplay(automation.triggerType)}`}
        </p>
      </CardHeader>
    </Card>
  );
};
