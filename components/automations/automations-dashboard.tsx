"use client";

import { useState, useMemo, useEffect } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { AutomationEntitiesSidebar } from "./automation-entities-sidebar";
import { AutomationFilters } from "./automation-filters";
import { AutomationPaginationList } from "./automation-pagination-list";
import { useAutomationEntityCounts } from "@/hooks/use-automation-entity-counts";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Bot } from "lucide-react";

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
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'generic' | null>('all');
  const [filters, setFilters] = useState<AutomationFilters>({});

  // Query param para contexto (espelho do estado)
  const [{ context }, setContextState] = useQueryStates({
    context: parseAsString.withDefault('all')
  });



  // Sync URL with state changes
  useEffect(() => {
    if (selectedFilter === 'generic') {
      if (context !== 'generic') {
        setContextState({ context: 'generic' });
      }
    } else if (selectedEntityId === null) {
      if (context !== 'all') {
        setContextState({ context: 'all' });
      }
    } else {
      const expectedContext = `entity-${selectedEntityId}`;
      if (context !== expectedContext) {
        setContextState({ context: expectedContext });
      }
    }
  }, [selectedEntityId, selectedFilter, context, setContextState]);


  // Handle entity selection
  const handleEntitySelect = (entityId: number | null) => {
    setSelectedEntityId(entityId);
    if (entityId !== null) {
      // When selecting an entity, clear generic filter
      setSelectedFilter('all');
    }
  };

  // Handle filter selection
  const handleFilterSelect = (filter: 'all' | 'generic' | null) => {
    setSelectedFilter(filter);
    if (filter === 'generic') {
      // When selecting generic, clear entity selection
      setSelectedEntityId(null);
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
      <AutomationEntitiesSidebar 
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
        {/* Filtros */}
        <AutomationFilters onFiltersChange={setFilters} selectedEntityName={selectedEntityName} />

        {/* Lista de Automações */}
        <div className='flex-1 overflow-hidden bg-white'>
          <AutomationPaginationList
            entityId={selectedFilter === 'generic' ? null : selectedEntityId}
            status={filters.status}
            search={filters.search}
            createdBy={filters.createdBy}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            generic={selectedFilter === 'generic'}
          />
        </div>
      </div>
    </div>
  );
};
