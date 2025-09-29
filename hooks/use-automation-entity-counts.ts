"use client";

import { useQuery } from "@tanstack/react-query";

export function useAutomationEntityCounts() {
  return useQuery({
    queryKey: ['automation-entity-counts'],
    queryFn: async () => {
      const response = await fetch('/api/automations/entity-counts', {
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entity counts');
      }

      return response.json();
    },
    staleTime: 2 * 60 * 1000, // Cache por 2 minutos
    gcTime: 5 * 60 * 1000
  });
}