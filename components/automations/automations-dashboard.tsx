"use client";

import { useState, useMemo, useEffect } from "react";
import { useQueryStates, parseAsString } from "nuqs";
import { AutomationSidebar } from "./automation-sidebar";
import { AutomationFilters } from "./automation-filters";
import { AutomationList } from "./automation-list";
import { GlobalAutomationSearch } from "./global-automation-search";
import { useAutomationEntityCounts } from "@/hooks/use-automation-entity-counts";
import { useAutomationNavigationStore } from "@/stores/use-automation-navigation-store";
import { Skeleton } from "@/components/ui/skeleton";
import type { SearchResult } from "@/app/api/automations/search/route";

interface AutomationFilters {
  search?: string;
  status?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

const ENTITY_NAMES: Record<number, string> = {
  1: "Contatos",
  2: "Negócios",
  3: "Tarefas",
  4: "Pedidos",
  5: "Cotações",
  6: "Leads",
  7: "Produtos",
  8: "Usuários",
  9: "Workflow",
  10: "Sistema",
};

export const AutomationsDashboard = () => {
  // Estado local original (funcionava)
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "generic" | null>("all");
  const [filters, setFilters] = useState<AutomationFilters>({});

  // Zustand store for navigation
  const setTargetAutomation = useAutomationNavigationStore((state) => state.setTargetAutomation);
  const clearTarget = useAutomationNavigationStore((state) => state.clearTarget);

  // Query param para contexto (espelho do estado)
  const [{ context }, setContextState] = useQueryStates({
    context: parseAsString.withDefault("all"),
  });

  // Sync URL with state changes
  useEffect(() => {
    console.log("[DASHBOARD] URL sync useEffect triggered", {
      selectedFilter,
      selectedEntityId,
      currentContext: context,
    });

    if (selectedFilter === "generic") {
      if (context !== "generic") {
        console.log("[DASHBOARD] Setting context to generic");
        setContextState({ context: "generic" });
      }
    } else if (selectedEntityId === null) {
      if (context !== "all") {
        console.log("[DASHBOARD] Setting context to all");
        setContextState({ context: "all" });
      }
    } else {
      const expectedContext = `entity-${selectedEntityId}`;
      if (context !== expectedContext) {
        console.log("[DASHBOARD] Setting context to", expectedContext);
        setContextState({ context: expectedContext });
      }
    }
  }, [selectedEntityId, selectedFilter, context, setContextState]);

  // Handle entity selection
  const handleEntitySelect = (entityId: number | null) => {
    console.log("[DASHBOARD] handleEntitySelect called", { entityId });

    // Clear any active navigation target to ensure proper page reset
    clearTarget();

    // Use setTimeout to ensure clearTarget is processed before state changes
    setTimeout(() => {
      setSelectedEntityId(entityId);
      if (entityId !== null) {
        // When selecting an entity, clear generic filter
        setSelectedFilter("all");
      }
    }, 10);
  };

  // Handle filter selection
  const handleFilterSelect = (filter: "all" | "generic" | null) => {
    console.log("[DASHBOARD] handleFilterSelect called", { filter });

    // Clear any active navigation target to ensure proper page reset
    clearTarget();

    // Use setTimeout to ensure clearTarget is processed before state changes
    setTimeout(() => {
      setSelectedFilter(filter);
      if (filter === "generic") {
        // When selecting generic, clear entity selection
        setSelectedEntityId(null);
      }
    }, 10);
  };

  // Handle automation selection from global search
  const handleAutomationSelect = (automation: SearchResult) => {
    console.log("[DASHBOARD] handleAutomationSelect called", {
      automationId: automation.id,
      entityId: automation.entityId,
      automationName: automation.name,
      currentSelectedEntityId: selectedEntityId,
      currentSelectedFilter: selectedFilter,
    });

    // Determinar o contexto correto baseado no entityId da automação
    if (automation.entityId === null) {
      // Automação genérica -> ir para aba "Genéricas"
      setSelectedEntityId(null);
      setSelectedFilter("generic");
      console.log("[DASHBOARD] Navigating to generic context");
    } else {
      // Automação específica -> ir para a entidade correspondente
      setSelectedEntityId(automation.entityId);
      setSelectedFilter("all");
      console.log("[DASHBOARD] Navigating to entity context", automation.entityId);
    }

    setFilters({}); // Clear all filters to ensure the automation is visible

    console.log("[DASHBOARD] State updated, calling setTargetAutomation", {
      newSelectedEntityId: automation.entityId === null ? null : automation.entityId,
      newSelectedFilter: automation.entityId === null ? "generic" : "all",
    });

    // Use setTimeout to ensure state updates are applied before navigation
    setTimeout(() => {
      // Set target automation in Zustand store WITH clearFilters flag
      // Isso sinaliza para o AutomationPaginationList que deve usar filtros vazios no findPage
      setTargetAutomation(automation.id, automation.entityId, false, true); // Não abrir detalhes automaticamente, apenas navegar
    }, 50);
  };

  // Fetch entity counts
  const { data: entityCountsData, isLoading: isLoadingCounts } = useAutomationEntityCounts();

  const entityCounts = useMemo(() => {
    if (!entityCountsData?.entityCounts) return {};
    return entityCountsData.entityCounts;
  }, [entityCountsData]);

  const genericCount = useMemo(() => {
    if (!entityCountsData?.genericCount) return { total: 0, active: 0 };
    return entityCountsData.genericCount;
  }, [entityCountsData]);

  const totalCount = useMemo(() => {
    if (!entityCountsData?.totalCount) return 0;
    return entityCountsData.totalCount;
  }, [entityCountsData]);

  const selectedEntityName = selectedEntityId ? ENTITY_NAMES[selectedEntityId] : undefined;

  if (isLoadingCounts) {
    return (
      <div className='h-full flex'>
        <div className='w-64 bg-white border-r border-zinc-200 p-3'>
          <Skeleton className='h-5 w-20 mb-3' />
          <div className='space-y-2'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='h-8 w-full' />
            ))}
          </div>
        </div>
        <div className='flex-1'>
          <div className='p-3 border-b'>
            <Skeleton className='h-6 w-32 mb-2' />
            <Skeleton className='h-8 w-full' />
          </div>
          <div className='p-3 space-y-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-20 w-full' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full flex border bg-zinc-50'>
      {/* Sidebar de Entidades */}
      <AutomationSidebar
        selectedEntityId={selectedEntityId}
        onEntitySelect={handleEntitySelect}
        entityCounts={entityCounts}
        genericCount={genericCount}
        totalCount={totalCount}
        selectedFilter={selectedFilter}
        onFilterSelect={handleFilterSelect}
      />

      {/* Conteúdo Principal */}
      <div className='flex-1 flex flex-col min-h-0'>
        {/* Global Search */}
        <div className='bg-white border-b border-zinc-200 p-3'>
          <div className='flex items-center justify-between mb-3'>
            <h1 className='text-xl font-semibold text-zinc-900'>Automações</h1>
          </div>
          <GlobalAutomationSearch
            onAutomationSelect={handleAutomationSelect}
            placeholder='Busque automações em qualquer lugar...'
            className='max-w-md'
          />
        </div>

        {/* Filtros Contextuais */}
        <AutomationFilters onFiltersChange={setFilters} selectedEntityName={selectedEntityName} filters={filters} />

        {/* Lista de Automações */}
        <div className='flex-1 overflow-hidden bg-white'>
          <AutomationList
            entityId={selectedFilter === "generic" ? null : selectedEntityId}
            status={filters.status}
            search={filters.search}
            createdBy={filters.createdBy}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            generic={selectedFilter === "generic"}
          />
        </div>
      </div>
    </div>
  );
};
