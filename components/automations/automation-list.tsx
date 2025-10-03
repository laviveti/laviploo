"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useAutomationsPagination } from "@/hooks/use-automations-pagination";
import { useAutomationNavigationStore } from "@/stores/use-automation-navigation-store";
import { useAutomationDetailsPanel } from "@/hooks/use-automation-details-panel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AutomationDetailsPanel } from "./automation-details/automation-details-panel";
import {
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Bot,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GitBranch,
} from "lucide-react";
import type { Automation } from "@/types/automations";
import { cn } from "@/lib/utils";

interface AutomationPaginationListProps {
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
  isHighlighted?: boolean;
  onRef?: (id: number, element: HTMLDivElement | null) => void;
}

const AutomationItem = ({ automation, onOpenDetails, isHighlighted, onRef }: AutomationItemProps) => {
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
      ref={(el) => onRef?.(automation.id, el)}
      className={cn(
        "hover:drop-shadow p-0 hover:cursor-pointer transition-all border-zinc-200 rounded-sm",
        isHighlighted && "ring-2 ring-rose-300 border-rose-200 bg-rose-50/50"
      )}
      onClick={() => onOpenDetails(automation.id)}>
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
                {automation.pipelineName && (
                  <span className='flex items-center gap-1'>
                    <GitBranch className='h-3 w-3' />
                    {automation.pipelineName}
                  </span>
                )}
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

const PaginationControls = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
  perPage,
  perPageOptions,
  setPerPage,
  totalCount,
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  perPage: number;
  perPageOptions: readonly number[];
  setPerPage: (value: number) => void;
  totalCount: number;
}) => {
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalCount);

  return (
    <div className='flex items-center justify-between p-3 border-t border-zinc-200 bg-zinc-50'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-zinc-600'>Itens por página:</span>
          <Select value={perPage.toString()} onValueChange={(value) => setPerPage(Number(value))}>
            <SelectTrigger className='h-7 w-16 text-xs'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='text-xs text-zinc-600'>
          {startItem}-{endItem} de {totalCount} itens
        </div>
      </div>

      <div className='flex items-center gap-1'>
        <Button variant='outline' size='sm' onClick={goToFirstPage} disabled={!hasPreviousPage} className='h-7 w-7 p-0'>
          <ChevronsLeft className='h-3 w-3' />
        </Button>
        <Button variant='outline' size='sm' onClick={goToPreviousPage} disabled={!hasPreviousPage} className='h-7 w-7 p-0'>
          <ChevronLeft className='h-3 w-3' />
        </Button>
        <div className='flex items-center gap-1 px-2'>
          <span className='text-xs text-zinc-600'>
            Página {currentPage} de {totalPages}
          </span>
        </div>
        <Button variant='outline' size='sm' onClick={goToNextPage} disabled={!hasNextPage} className='h-7 w-7 p-0'>
          <ChevronRight className='h-3 w-3' />
        </Button>
        <Button variant='outline' size='sm' onClick={goToLastPage} disabled={!hasNextPage} className='h-7 w-7 p-0'>
          <ChevronsRight className='h-3 w-3' />
        </Button>
      </div>
    </div>
  );
};

export const AutomationList = ({ entityId, status, search, createdBy, dateFrom, dateTo, generic }: AutomationPaginationListProps) => {
  // Details panel state from URL
  const { selectedAutomationId, isOpen: detailsPanelOpen, openDetails, closeDetails } = useAutomationDetailsPanel();
  const [highlightedAutomationId, setHighlightedAutomationId] = useState<number | null>(null);

  // Zustand store for navigation
  const { targetAutomationId, shouldOpenDetails, clearTarget } = useAutomationNavigationStore();

  // Refs for scroll
  const automationRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const handleOpenDetails = useCallback(
    (automationId: number) => {
      openDetails(automationId);
    },
    [openDetails]
  );

  const handleCloseDetails = useCallback(() => {
    closeDetails();
  }, [closeDetails]);

  const {
    data,
    error,
    isLoading,
    refetch,
    page,
    perPage,
    setPage,
    setPerPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    perPageOptions,
  } = useAutomationsPagination({
    entityId,
    status,
    search,
    createdBy,
    dateFrom,
    dateTo,
    generic,
  });

  // Handle navigation to specific automation when target changes
  useEffect(() => {
    if (!targetAutomationId || !data?.automations) return;

    // Find automation in current page
    const automationIndex = data.automations.findIndex((a) => a.id === targetAutomationId);

    if (automationIndex !== -1) {
      // Automation is on current page - highlight and scroll
      setHighlightedAutomationId(targetAutomationId);

      // Scroll to automation after render
      setTimeout(() => {
        const element = automationRefs.current.get(targetAutomationId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // Open details if requested
        if (shouldOpenDetails) {
          handleOpenDetails(targetAutomationId);
        }

        // Clear target after highlight
        clearTarget();
      }, 100);
    }
  }, [targetAutomationId, data, shouldOpenDetails, handleOpenDetails, clearTarget]);

  // Clear highlighted automation after exactly 10 seconds
  useEffect(() => {
    if (highlightedAutomationId) {
      const timer = setTimeout(() => {
        setHighlightedAutomationId(null);
      }, 10000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [highlightedAutomationId]);

  // Loading state
  if (isLoading) {
    return (
      <div className='space-y-2 p-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className='rounded-sm p-0 h-20'>
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

  const automations = data?.automations || [];

  // Empty state
  if (automations.length === 0) {
    return (
      <div className='p-6 text-center'>
        <Bot className='h-8 w-8 text-zinc-400 mx-auto mb-2' />
        <h3 className='text-sm font-medium text-zinc-800 mb-2'>Nenhuma automação encontrada</h3>
        <p className='text-xs text-zinc-600 mb-4'>
          {search || status !== "all" || entityId || createdBy || dateFrom || dateTo || generic
            ? "Tente ajustar os filtros para encontrar automações"
            : "Não há automações configuradas"}
        </p>
        <Button variant='outline' size='sm' onClick={() => refetch()} className='h-8 px-3 text-xs rounded-sm'>
          <RefreshCcw className='h-3 w-3 mr-1' />
          Recarregar
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col h-full'>
        {/* Lista de automações */}
        <div className='flex-1 overflow-auto'>
          <div className='space-y-2 p-3'>
            {automations.map((automation: Automation) => (
              <AutomationItem
                key={automation.id}
                automation={automation}
                onOpenDetails={handleOpenDetails}
                isHighlighted={highlightedAutomationId === automation.id}
                onRef={(id, element) => {
                  if (element) {
                    automationRefs.current.set(id, element);
                  } else {
                    automationRefs.current.delete(id);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Controles de paginação */}
        {data && (
          <PaginationControls
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
            goToFirstPage={goToFirstPage}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            goToLastPage={goToLastPage}
            perPage={perPage}
            perPageOptions={perPageOptions}
            setPerPage={setPerPage}
            totalCount={data.totalCount}
          />
        )}
      </div>

      {/* Details Panel */}
      <AutomationDetailsPanel automationId={selectedAutomationId} open={detailsPanelOpen} onOpenChange={handleCloseDetails} />
    </>
  );
};
