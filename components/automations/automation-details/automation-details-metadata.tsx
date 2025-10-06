"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import type { Automation } from "@/types/automations";
import { formatDate } from "./automation-details-utils";

interface AutomationDetailsMetadataProps {
  automation: Automation;
}

export const AutomationDetailsMetadata = ({ automation }: AutomationDetailsMetadataProps) => {
  return (
    <Card className='border-zinc-200'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
          <Info className='h-4 w-4 text-zinc-600' />
          Informações da Automação
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='grid grid-cols-1 gap-3 text-xs'>
          <div className='flex justify-between'>
            <span className='text-zinc-600'>ID:</span>
            <span className='font-mono text-zinc-800'>{automation.id}</span>
          </div>

          {automation.description && (
            <div className='space-y-1'>
              <span className='text-zinc-600'>Descrição:</span>
              <p className='text-zinc-800 text-xs leading-relaxed'>{automation.description}</p>
            </div>
          )}

          <div className='flex justify-between'>
            <span className='text-zinc-600'>Autor:</span>
            <span className='text-zinc-800'>{automation.creator}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-zinc-600'>Data de criação:</span>
            <span className='text-zinc-800'>{formatDate(automation.createdAt)}</span>
          </div>

          {automation.updatedAt && (
            <div className='flex justify-between'>
              <span className='text-zinc-600'>Atualizado em:</span>
              <span className='text-zinc-800'>{formatDate(automation.updatedAt)}</span>
            </div>
          )}

          {automation.lastExecutedAt && (
            <div className='flex justify-between'>
              <span className='text-zinc-600'>Última execução:</span>
              <span className='text-zinc-800'>{formatDate(automation.lastExecutedAt)}</span>
            </div>
          )}

          {automation.executionCount !== undefined && (
            <div className='flex justify-between'>
              <span className='text-zinc-600'>Total de execuções:</span>
              <span className='text-zinc-800 font-medium'>{automation.executionCount}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
