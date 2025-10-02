"use client";

import { useState, useMemo, useEffect } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { AutomationSidebar } from "./automation-sidebar";
import { AutomationFilters } from "./automation-filters";
import { AutomationList } from "./automation-list";
import { GlobalAutomationSearch } from "./global-automation-search";
import { useAutomationEntityCounts } from "@/hooks/use-automation-entity-counts";
import { useAutomationNavigationStore } from "@/stores/use-automation-navigation-store";
import { useFindAutomationPage } from "@/hooks/use-find-automation-page";
import { Skeleton } from "@/components/ui/skeleton";
import type { SearchResult } from "@/types/automations";

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

  // Hook to find automation page
  const { findPage } = useFindAutomationPage();

  // Query params para contexto e paginação
  const [{ context, page, perPage }, setQueryState] = useQueryStates({
    context: parseAsString.withDefault("all"),
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
  });

  // Sync URL with state changes
  useEffect(() => {
    if (selectedFilter === "generic") {
      if (context !== "generic") {
        setQueryState({ context: "generic" });
      }
    } else if (selectedEntityId === null) {
      if (context !== "all") {
        setQueryState({ context: "all" });
      }
    } else {
      const expectedContext = `entity-${selectedEntityId}`;
      if (context !== expectedContext) {
        setQueryState({ context: expectedContext });
      }
    }
  }, [selectedEntityId, selectedFilter, context, setQueryState]);

  // Handle entity selection
  const handleEntitySelect = (entityId: number | null) => {
    // Only clear target if there's an actual context change
    const isContextChange = entityId !== selectedEntityId;
    if (isContextChange) {
      clearTarget();
      // Reset página para 1 quando mudar de contexto
      setQueryState({ page: 1 });
    }

    setSelectedEntityId(entityId);
    if (entityId !== null) {
      // When selecting an entity, clear generic filter
      setSelectedFilter("all");
    }
  };

  // Handle filter selection
  const handleFilterSelect = (filter: "all" | "generic" | null) => {
    // Only clear target if there's an actual context change
    const isContextChange = filter !== selectedFilter;
    if (isContextChange) {
      clearTarget();
      // Reset página para 1 quando mudar de contexto
      setQueryState({ page: 1 });
    }

    setSelectedFilter(filter);
    if (filter === "generic") {
      // When selecting generic, clear entity selection
      setSelectedEntityId(null);
    }
  };

  // Handle automation selection from global search
  const handleAutomationSelect = async (automation: SearchResult) => {
    // Atualizar contexto primeiro
    if (automation.entityId === null) {
      // Automação genérica -> ir para aba "Genéricas"
      setSelectedEntityId(null);
      setSelectedFilter("generic");
    } else {
      // Automação específica -> ir para a entidade correspondente
      setSelectedEntityId(automation.entityId);
      setSelectedFilter("all");
    }

    // Sempre limpar filtros para garantir que a automação seja visível
    setFilters({});

    // Buscar em qual página a automação está (com filtros vazios)
    const result = await findPage({
      automationId: automation.id,
      visualEntityId: automation.entityId,
      perPage,
      // Usar filtros vazios para garantir que encontramos a automação
      status: undefined,
      search: undefined,
      createdBy: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      generic: automation.entityId === null ? true : undefined,
    });

    if (result) {
      // Navegar para a página correta e setar target para highlight
      setQueryState({ page: result.page });
      setTargetAutomation(automation.id, automation.entityId, false, false);
    }
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
