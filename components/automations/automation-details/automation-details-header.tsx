"use client";

import { Badge } from "@/components/ui/badge";
import type { Automation } from "@/types/automations";
import {
  getStatusIcon,
  getStatusColor,
  getStatusText,
  getEntityIcon,
  getEntityDisplay,
  getTriggerTypeDisplay,
} from "./automation-details-utils";

interface AutomationDetailsHeaderProps {
  automation: Automation;
}

export const AutomationDetailsHeader = ({ automation }: AutomationDetailsHeaderProps) => {
  return (
    <>
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mt-2'>
            <Badge className={`gap-1 text-xs px-2 py-1 rounded-md ${getStatusColor(automation.status)}`}>
              {getStatusIcon(automation.status)}
              {getStatusText(automation.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Subtitle with entity and trigger */}
      <div className='flex items-center gap-2 text-sm text-zinc-600 mt-2'>
        {getEntityIcon(automation.entityId)}
        <span className='font-medium'>{getEntityDisplay(automation.entityId)}</span>
        <span>{getTriggerTypeDisplay(automation.triggerType)}</span>
      </div>
    </>
  );
};