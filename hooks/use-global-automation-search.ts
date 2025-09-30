import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { SearchResult, GlobalSearchResponse } from "@/app/api/automations/search/route";

interface UseGlobalAutomationSearchOptions {
  enabled?: boolean;
  debounceMs?: number;
  minQueryLength?: number;
}

interface UseGlobalAutomationSearchResult {
  results: SearchResult[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  total: number;
  query: string;
  setQuery: (query: string) => void;
  clearSearch: () => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

async function fetchGlobalSearch(query: string): Promise<GlobalSearchResponse> {
  const url = new URL('/api/automations/search', window.location.origin);
  url.searchParams.set('q', query);

  const response = await fetch(url.toString(), {
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw new Error(`Erro na busca: ${response.status}`);
  }

  return response.json();
}

export function useGlobalAutomationSearch(
  options: UseGlobalAutomationSearchOptions = {}
): UseGlobalAutomationSearchResult {
  const {
    enabled = true,
    debounceMs = 300,
    minQueryLength = 2,
  } = options;

  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query.trim(), debounceMs);

  const shouldFetch = enabled &&
    debouncedQuery.length >= minQueryLength;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['global-automation-search', debouncedQuery],
    queryFn: () => fetchGlobalSearch(debouncedQuery),
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return {
    results: data?.results || [],
    isLoading: isLoading && shouldFetch,
    isError,
    error,
    total: data?.total || 0,
    query,
    setQuery,
    clearSearch,
  };
}