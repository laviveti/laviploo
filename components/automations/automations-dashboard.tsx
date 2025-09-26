"use client";

import { useState, useMemo, useEffect } from "react";
import { AutomationEntitiesSidebar } from "./automation-entities-sidebar";
import { AutomationFilters } from "./automation-filters";
import { AutomationInfiniteList } from "./automation-infinite-list";
import { useAutomationEntityCounts } from "@/hooks/use-automations-infinite";
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
  10: "Sistema"
};

export const AutomationsDashboard = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [filters, setFilters] = useState<AutomationFilters>({});

  // Fetch entity counts
  const { data: entityCountsData, isLoading: isLoadingCounts } = useAutomationEntityCounts();

  const entityCounts = useMemo(() => {
    if (!entityCountsData?.pages?.[0]?.entityCounts) return {};
    return entityCountsData.pages[0].entityCounts;
  }, [entityCountsData]);

  const selectedEntityName = selectedEntityId ? ENTITY_NAMES[selectedEntityId] : undefined;

  if (isLoadingCounts) {
    return (
      <div className="h-full flex">
        <div className="w-64 bg-white border-r border-zinc-200 p-3">
          <Skeleton className="h-5 w-20 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="p-3 border-b">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="p-3 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-zinc-50">
      {/* Sidebar de Entidades */}
      <AutomationEntitiesSidebar
        selectedEntityId={selectedEntityId}
        onEntitySelect={setSelectedEntityId}
        entityCounts={entityCounts}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Filtros */}
        <AutomationFilters
          onFiltersChange={setFilters}
          selectedEntityName={selectedEntityName}
        />

        {/* Lista de Automações */}
        <div className="flex-1 overflow-auto bg-white">
          <AutomationInfiniteList
            entityId={selectedEntityId}
            status={filters.status}
            search={filters.search}
            createdBy={filters.createdBy}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
          />
        </div>
      </div>
    </div>
  );
};