"use client";

import { useQuery } from "@tanstack/react-query";
import type { AutomationsData, Integration } from "@/types/automations";

const fetchAutomations: () => Promise<AutomationsData> = async () => {
  const response = await fetch("/api/automations", {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar automações");
  }

  return response.json();
};

const fetchIntegrations = async (): Promise<Integration[]> => {
  const response = await fetch("/api/automations/integrations", {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar integrações");
  }

  return response.json();
};

export const useAutomations = () => {
  return useQuery({
    queryKey: ["automations"],
    queryFn: fetchAutomations,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useIntegrations = () => {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: fetchIntegrations,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
