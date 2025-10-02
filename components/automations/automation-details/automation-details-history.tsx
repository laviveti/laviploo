"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Automation, AutomationExecution } from "@/types/automations";
import { formatDate } from "./automation-details-utils";

interface AutomationDetailsHistoryProps {
  automation: Automation;
}

export const AutomationDetailsHistory = ({ automation }: AutomationDetailsHistoryProps) => {
  const getExecutionIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className='h-3 w-3 text-green-600' />;
      case "error":
        return <XCircle className='h-3 w-3 text-red-600' />;
      default:
        return <Clock className='h-3 w-3 text-yellow-600' />;
    }
  };

  const getExecutionColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <Card className='border-zinc-200'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
          <History className='h-4 w-4 text-purple-600' />
          Histórico de Execuções
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {automation.executionHistory && automation.executionHistory.length > 0 ? (
          <div className='space-y-2 max-h-48 overflow-y-auto'>
            {automation.executionHistory.map((execution: AutomationExecution, index: number) => (
              <div key={index} className='flex items-center justify-between p-2 bg-zinc-50 rounded-md'>
                <div className='flex items-center gap-2 flex-1'>
                  {getExecutionIcon(execution.status)}
                  <div className='flex-1'>
                    <div className='text-xs text-zinc-600'>{formatDate(execution.date)}</div>
                    {execution.message && <div className='text-xs text-zinc-500 mt-1 truncate'>{execution.message}</div>}
                  </div>
                </div>
                <Badge className={`text-xs px-2 py-1 ${getExecutionColor(execution.status)}`}>{execution.status}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-sm text-zinc-500 italic'>Nenhuma execução registrada</div>
        )}
      </CardContent>
    </Card>
  );
};
