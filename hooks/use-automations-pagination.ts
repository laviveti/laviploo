"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import type { AutomationsData, Automation } from "@/types/automations";

const PER_PAGE_OPTIONS = [10, 20, 30, 40] as const;

interface AutomationsFilters {
  entityId?: number | null;
  status?: string;
  search?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  generic?: boolean;
}

interface AutomationPaginationData {
  automations: Automation[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

async function fetchAutomationsPage({
  page,
  perPage,
  filters = {}
}: {
  page: number;
  perPage: number;
  filters?: AutomationsFilters;
}): Promise<AutomationPaginationData> {
  const searchParams = new URLSearchParams();

  // Paginação
  searchParams.set('limit', perPage.toString());
  searchParams.set('skip', ((page - 1) * perPage).toString());

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

  const apiUrl = `/api/automations?${searchParams.toString()}`;

  const response = await fetch(apiUrl, {
    cache: 'no-cache'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch automations: ${response.statusText}`);
  }

  const data: AutomationsData = await response.json();

  const totalCount = data.stats?.totalAutomations || 0;
  const totalPages = Math.ceil(totalCount / perPage);

  return {
    automations: data.automations || [],
    totalCount,
    totalPages,
    currentPage: page,
    perPage,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

export function useAutomationsPagination(filters: AutomationsFilters = {}) {

  // Gerencia apenas page e perPage via URL usando nuqs
  const [{ page, perPage }, setPaginationState] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10)
  });

  // Valida e ajusta perPage se necessário
  const validPerPage = PER_PAGE_OPTIONS.includes(perPage as any) ? perPage : 10;

  // Criar uma queryKey estável serializando o objeto filters
  // Isso previne invalidação de cache desnecessária quando o objeto é recriado
  const filtersKey = JSON.stringify({
    entityId: filters.entityId,
    status: filters.status,
    search: filters.search,
    createdBy: filters.createdBy,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    generic: filters.generic,
  });

  const queryResult = useQuery<AutomationPaginationData>({
    queryKey: ['automations-pagination', page, validPerPage, filtersKey],
    queryFn: () => fetchAutomationsPage({ page, perPage: validPerPage, filters }),
    // Cache por 2 minutos
    staleTime: 2 * 60 * 1000,
    // Garbage collection após 5 minutos
    gcTime: 5 * 60 * 1000,
    // Revalida automaticamente quando a janela ganha foco
    refetchOnWindowFocus: true,
  });

  const setPage = (newPage: number) => {
    setPaginationState({ page: newPage, perPage: validPerPage });
  };

  const setPerPage = (newPerPage: number) => {
    setPaginationState({ page: 1, perPage: newPerPage });
  };

  const goToNextPage = () => {
    if (queryResult.data?.hasNextPage) {
      setPaginationState({ page: page + 1, perPage: validPerPage });
    }
  };

  const goToPreviousPage = () => {
    if (queryResult.data?.hasPreviousPage) {
      setPaginationState({ page: page - 1, perPage: validPerPage });
    }
  };

  const goToFirstPage = () => {
    setPaginationState({ page: 1, perPage: validPerPage });
  };

  const goToLastPage = () => {
    if (queryResult.data?.totalPages) {
      setPaginationState({ page: queryResult.data.totalPages, perPage: validPerPage });
    }
  };

  return {
    ...queryResult,
    // Paginação state
    page,
    perPage: validPerPage,
    // Ações de paginação
    setPage,
    setPerPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    // Constantes
    perPageOptions: PER_PAGE_OPTIONS,
  };
}