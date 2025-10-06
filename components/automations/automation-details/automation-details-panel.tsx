"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertCircle } from "lucide-react";
import { useAutomationDetails } from "@/hooks/use-automation-details";
import { AutomationDetailsHeader } from "./automation-details-header";
import { AutomationDetailsTrigger } from "./automation-details-trigger";
import { AutomationDetailsActions } from "./automation-details-actions";
import { AutomationDetailsHistory } from "./automation-details-history";
import { AutomationDetailsMetadata } from "./automation-details-metadata";
import { AutomationDetailsFilterSection } from "./automation-details-filter-section";

interface AutomationDetailsPanelProps {
  automationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AutomationDetailsPanel = ({ automationId, open, onOpenChange }: AutomationDetailsPanelProps) => {
  const { data: automation, isLoading, error, refetch } = useAutomationDetails(automationId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full gap-2 px-4 py-8 sm:max-w-4xl overflow-y-auto'>
        {/* Loading state */}
        {isLoading && (
          <>
            <SheetTitle className='sr-only'>Carregando detalhes da automação</SheetTitle>
            <div className='space-y-6 py-6'>
              <div className='border-b pb-4'>
                <Skeleton className='h-6 w-3/4 mb-2' />
                <Skeleton className='h-4 w-1/2' />
              </div>
              <div className='space-y-4'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className='border rounded-md p-4'>
                    <Skeleton className='h-4 w-1/3 mb-3' />
                    <Skeleton className='h-3 w-full mb-2' />
                    <Skeleton className='h-3 w-2/3' />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Error state */}
        {error && (
          <>
            <SheetTitle className='sr-only'>Erro ao carregar automação</SheetTitle>
            <div className='flex flex-col items-center justify-center py-12 px-6 text-center'>
              <AlertCircle className='h-8 w-8 text-red-500 mb-3' />
              <h3 className='text-sm font-medium text-zinc-800 mb-2'>Erro ao carregar detalhes</h3>
              <p className='text-xs text-zinc-600 mb-4'>{error instanceof Error ? error.message : "Erro desconhecido"}</p>
              <Button variant='outline' size='sm' onClick={() => refetch()} className='h-8 px-3 text-xs'>
                <RefreshCcw className='h-3 w-3 mr-1' />
                Tentar novamente
              </Button>
            </div>
          </>
        )}

        {/* Success state */}
        {automation && !isLoading && !error && (
          <>
            <SheetTitle className='text-xl py-0 font-semibold text-zinc-900 leading-tight'>{automation.name}</SheetTitle>
            <SheetHeader className='border-b p-0 pb-4'>
              <AutomationDetailsHeader automation={automation} />
            </SheetHeader>

            <div className='space-y-6 py-6'>
              <AutomationDetailsTrigger automation={automation} />

              <AutomationDetailsFilterSection automation={automation} />

              <AutomationDetailsActions automation={automation} />

              <AutomationDetailsHistory automation={automation} />

              <AutomationDetailsMetadata automation={automation} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
