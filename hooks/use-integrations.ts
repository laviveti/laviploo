"use client";

import { useQuery } from "@tanstack/react-query";
import type { IntegrationsData, Integration } from "@/types/integrations";

const fetchIntegrationsData: () => Promise<IntegrationsData> = async () => {
  const response = await fetch("/api/integrations", {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar integrações");
  }

  return response.json();
};

const fetchIntegrations = async (): Promise<Integration[]> => {
  const response = await fetch("/api/integrations/list", {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar lista de integrações");
  }

  return response.json();
};

export const useIntegrations = () => {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: fetchIntegrationsData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useIntegrationsList = () => {
  return useQuery({
    queryKey: ["integrations", "list"],
    queryFn: fetchIntegrations,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};