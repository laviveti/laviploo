import { useCallback } from 'react';

interface FindPageParams {
  automationId: number;
  visualEntityId: number | null; // ID visual da UI, não EntityId do Ploomes
  perPage: number;
  // Filtros opcionais (devem corresponder aos filtros ativos na lista)
  status?: string;
  search?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  generic?: boolean;
}

interface FindPageResponse {
  page: number;
  index: number;
  total: number;
  perPage: number;
}

export function useFindAutomationPage() {
  const findPage = useCallback(async (params: FindPageParams): Promise<FindPageResponse | null> => {
    try {
      console.log('[FIND_PAGE_HOOK] Called with params', params);

      const searchParams = new URLSearchParams({
        automationId: params.automationId.toString(),
        perPage: params.perPage.toString(),
      });

      if (params.visualEntityId !== null) {
        searchParams.set('entityId', params.visualEntityId.toString());
      }

      // Adicionar todos os filtros opcionais
      if (params.status && params.status !== 'all') {
        searchParams.set('status', params.status);
      }

      if (params.search) {
        searchParams.set('search', params.search);
      }

      if (params.createdBy) {
        searchParams.set('createdBy', params.createdBy);
      }

      if (params.dateFrom) {
        searchParams.set('dateFrom', params.dateFrom);
      }

      if (params.dateTo) {
        searchParams.set('dateTo', params.dateTo);
      }

      if (params.generic) {
        searchParams.set('generic', 'true');
      }

      const url = `/api/automations/find-page?${searchParams.toString()}`;
      console.log('[FIND_PAGE_HOOK] Making request to:', url);

      const response = await fetch(url, {
        cache: 'no-cache',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[FIND_PAGE_HOOK] Failed to find automation page:', response.status, errorText);
        return null;
      }

      const result = await response.json();
      console.log('[FIND_PAGE_HOOK] Response:', result);
      return result;
    } catch (error) {
      console.error('[FIND_PAGE_HOOK] Error finding automation page:', error);
      return null;
    }
  }, []);

  return { findPage };
}