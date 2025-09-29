"use client";

import { useRef, useCallback, useState } from "react";
import { useAutomationsInfinite } from "@/hooks/use-automations-infinite";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AutomationDetailsPanel } from "./automation-details/automation-details-panel";
import { MapPin, Settings, CheckCircle2, XCircle, AlertCircle, Calendar, User, Clock, Loader2, Bot, RefreshCcw } from "lucide-react";
import type { Automation } from "@/types/automations";
import { cn } from "@/lib/utils";

interface AutomationInfiniteListProps {
  entityId?: number | null;
  status?: string;
  search?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  generic?: boolean;
}

interface AutomationItemProps {
  automation: Automation;
  onOpenDetails: (automationId: number) => void;
}

const AutomationItem = ({ automation, onOpenDetails }: AutomationItemProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className='h-3 w-3 text-green-600' />;
      case "inactive":
        return <XCircle className='h-3 w-3 text-zinc-500' />;
      case "error":
        return <AlertCircle className='h-3 w-3 text-red-600' />;
      default:
        return <Bot className='h-3 w-3 text-zinc-500' />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativa";
      case "inactive":
        return "Inativa";
      case "error":
        return "Erro";
      default:
        return "Desconhecido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "inactive":
        return "text-zinc-600 bg-zinc-50 border-zinc-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-zinc-600 bg-zinc-50 border-zinc-200";
    }
  };

  return (
    <Card 
      className='hover:drop-shadow p-0 hover:cursor-pointer transition-shadow border-zinc-200 rounded-sm'
      onClick={() => onOpenDetails(automation.id)}
    >
      <CardContent className='p-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-start gap-2 min-w-0 flex-1'>
            <MapPin className='h-3 w-3 text-rose-500 mt-0.5 shrink-0' />
            <div className='min-w-0 flex-1'>
              <h3 className='text-sm font-medium text-zinc-800 mb-1 line-clamp-2'>{automation.name}</h3>
              {automation.description && <p className='text-xs text-zinc-500 line-clamp-1 mb-2'>{automation.description}</p>}
              <div className='flex flex-wrap items-center gap-1 text-xs text-zinc-500'>
                <Badge variant='outline' className='text-xs px-1 py-0 rounded-sm'>
                  {automation.triggerName}
                </Badge>
                {automation.creator && (
                  <span className='flex items-center gap-1'>
                    <User className='h-3 w-3' />
                    {automation.creator}
                  </span>
                )}
                <span className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  {new Date(automation.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2 shrink-0'>
            <Badge variant='outline' className={cn("text-xs px-2 py-1 rounded-sm", getStatusColor(automation.status))}>
              {getStatusIcon(automation.status)}
              <span className='ml-1'>{getStatusText(automation.status)}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AutomationInfiniteList = ({ entityId, status, search, createdBy, dateFrom, dateTo, generic }: AutomationInfiniteListProps) => {
  const observerRef = useRef<IntersectionObserver>(null);
  const lastAutomationElementRef = useRef<HTMLDivElement>(null);
  
  // State for details panel
  const [selectedAutomationId, setSelectedAutomationId] = useState<number | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);

  const handleOpenDetails = useCallback((automationId: number) => {
    setSelectedAutomationId(automationId);
    setDetailsPanelOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsPanelOpen(false);
    setSelectedAutomationId(null);
  }, []);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: queryStatus,
    refetch,
  } = useAutomationsInfinite({
    entityId,
    status,
    search,
    createdBy,
    dateFrom,
    dateTo,
    generic,
  });

  const lastAutomationElementCallback = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // Loading state
  if (queryStatus === "pending") {
    return (
      <div className='space-y-2 p-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className='rounded-sm'>
            <CardContent className='p-3'>
              <div className='flex items-start gap-3'>
                <Skeleton className='h-3 w-3 mt-0.5' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-1/2' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                </div>
                <Skeleton className='h-6 w-12' />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='p-6 text-center'>
        <AlertCircle className='h-8 w-8 text-red-500 mx-auto mb-2' />
        <h3 className='text-sm font-medium text-zinc-800 mb-2'>Erro ao carregar automações</h3>
        <p className='text-xs text-zinc-600 mb-4'>{error instanceof Error ? error.message : "Erro desconhecido"}</p>
        <Button variant='outline' size='sm' onClick={() => refetch()} className='h-8 px-3 text-xs rounded-sm'>
          <RefreshCcw className='h-3 w-3 mr-1' />
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Get all automations from all pages
  const allAutomations = data?.pages?.flatMap((page) => page.automations) || [];

  // Empty state
  if (allAutomations.length === 0) {
    return (
      <div className='p-6 text-center'>
        <Bot className='h-8 w-8 text-zinc-400 mx-auto mb-2' />
        <h3 className='text-sm font-medium text-zinc-800 mb-2'>Nenhuma automação encontrada</h3>
        <p className='text-xs text-zinc-600'>
          {search || status !== "all" || entityId || createdBy || dateFrom || dateTo || generic
            ? "Tente ajustar os filtros para encontrar automações"
            : "Não há automações configuradas"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='space-y-2 p-3'>
        {allAutomations.map((automation, index) => {
          // Last element gets the ref for infinite scrolling
          const isLast = index === allAutomations.length - 1;

          return (
            <div key={`${automation.id}-${index}`} ref={isLast ? lastAutomationElementCallback : undefined}>
              <AutomationItem 
                automation={automation} 
                onOpenDetails={handleOpenDetails}
              />
            </div>
          );
        })}

        {/* Loading indicator */}
        {(isFetchingNextPage || isFetching) && (
          <div className='flex justify-center py-4'>
            <div className='flex items-center gap-2 text-xs text-zinc-500'>
              <Loader2 className='h-3 w-3 animate-spin' />
              Carregando mais automações...
            </div>
          </div>
        )}

        {/* No more pages indicator */}
        {!hasNextPage && allAutomations.length > 0 && (
          <div className='text-center py-4 text-xs text-zinc-500'>Todas as automações foram carregadas ({allAutomations.length} total)</div>
        )}
      </div>

      {/* Details Panel */}
      <AutomationDetailsPanel
        automationId={selectedAutomationId}
        open={detailsPanelOpen}
        onOpenChange={handleCloseDetails}
      />
    </>
  );
};
