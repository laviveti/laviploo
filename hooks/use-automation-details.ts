import { useQuery } from "@tanstack/react-query";
import type { Automation } from "@/types/automations";
import type { InterpretedFilterCriteria } from "@/lib/ploomes-mappings";

// Extended automation type for details
export interface AutomationWithDetails extends Automation {
  triggerConditions?: string;
  filterConditions?: string[];
  filterName?: string;
  filterId?: number;
  filterExpression?: string;
  filterCriteria?: InterpretedFilterCriteria[];
  filterLogic?: {
    hasMultipleGroups: boolean;
    groupsWithMultipleCriteria: number[];
    logicDescription: string;
  };
  stageId?: number;
  stageName?: string;
  updater?: string;
  lastUpdateDate?: string;
  executionHistory?: {
    date: string;
    status: "success" | "error" | "skipped";
    message?: string;
  }[];
  dependencies?: {
    id: number;
    name: string;
    type: string;
  }[];
}

export function useAutomationDetails(automationId: number | null) {
  return useQuery<AutomationWithDetails>({
    queryKey: ["automation-details", automationId],
    queryFn: async () => {
      if (!automationId) {
        throw new Error("ID da automação é obrigatório");
      }

      const response = await fetch(`/api/automations/${automationId}`, {
        cache: "no-cache",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Automação não encontrada");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!automationId,
    retry: (failureCount, error) => {
      // Don't retry on 404 or other client errors
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
  });
}