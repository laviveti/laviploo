"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { AutomationsData, Automation } from "@/types/automations";

interface AutomationsFilters {
  entityId?: number | null;
  status?: string;
  search?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  generic?: boolean;
}

interface AutomationPage {
  automations: Automation[];
  totalCount: number;
  hasNextPage: boolean;
  nextCursor?: number;
}

const AUTOMATIONS_PAGE_SIZE = 50;

async function fetchAutomationsPage({
  pageParam = 0,
  filters = {}
}: {
  pageParam?: number;
  filters?: AutomationsFilters;
}): Promise<AutomationPage> {
  const searchParams = new URLSearchParams();

  // Paginação
  searchParams.set('limit', AUTOMATIONS_PAGE_SIZE.toString());
  searchParams.set('skip', (pageParam * AUTOMATIONS_PAGE_SIZE).toString());

  // Filtros
  if (filters.entityId) {
    searchParams.set('entity', filters.entityId.toString());
  }

  if (filters.status && filters.status !== 'all') {
    searchParams.set('status', filters.status);
  }

  if (filters.search) {
    searchParams.set('search', filters.search);
  }

  if (filters.createdBy) {
    searchParams.set('createdBy', filters.createdBy);
  }

  if (filters.dateFrom) {
    searchParams.set('dateFrom', filters.dateFrom);
  }

  if (filters.dateTo) {
    searchParams.set('dateTo', filters.dateTo);
  }

  if (filters.generic) {
    searchParams.set('generic', 'true');
  }

  // Sempre expandir para ter dados completos
  searchParams.set('expand', 'true');

  const response = await fetch(`/api/automations?${searchParams.toString()}`, {
    cache: 'no-cache'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch automations: ${response.statusText}`);
  }

  const data: AutomationsData = await response.json();

  return {
    automations: data.automations || [],
    totalCount: data.stats?.totalAutomations || 0,
    hasNextPage: data.automations?.length === AUTOMATIONS_PAGE_SIZE || false,
    nextCursor: pageParam + 1
  };
}

export function useAutomationsInfinite(filters: AutomationsFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['automations-infinite', filters],
    queryFn: ({ pageParam }) => fetchAutomationsPage({ pageParam, filters }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Se não há mais páginas, retorna undefined
      if (!lastPage.hasNextPage) {
        return undefined;
      }

      // Retorna o próximo cursor
      return lastPage.nextCursor;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      // Para suporte a paginação reversa (opcional)
      return allPages.length > 1 ? allPages.length - 2 : undefined;
    },
    // Limita o número de páginas em memória para melhor performance
    maxPages: 10,
    // Mantém dados anteriores durante revalidação
    placeholderData: (previousData) => previousData,
    // Revalida automaticamente quando a janela ganha foco
    refetchOnWindowFocus: true,
    // Cache por 5 minutos
    staleTime: 5 * 60 * 1000,
    // Garbage collection após 10 minutos
    gcTime: 10 * 60 * 1000
  });
}

// Hook auxiliar para obter contagem por entidade
export function useAutomationEntityCounts() {
  return useInfiniteQuery({
    queryKey: ['automation-entity-counts'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/automations/entity-counts?page=${pageParam}`, {
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entity counts');
      }

      return response.json();
    },
    initialPageParam: 0,
    getNextPageParam: () => undefined, // Sempre uma única página para contagens
    staleTime: 2 * 60 * 1000, // Cache por 2 minutos
    gcTime: 5 * 60 * 1000
  });
}