import type { AutomationTriggerType, AutomationStatus, PloomesAutomation } from "@/types/automations";

/**
 * Mapeia o ID do trigger do Ploomes para o tipo de trigger da aplicação
 */
export function mapTriggerType(triggerId: number): AutomationTriggerType {
  const triggerMap: Record<number, AutomationTriggerType> = {
    1: "stage_entry",
    2: "stage_exit",
    5: "deal_created",
    6: "deal_updated",
    8: "deal_won",
    9: "deal_lost",
    17: "recurring",
  };
  return triggerMap[triggerId] || "unknown";
}

/**
 * Determina o status da automação baseado em suas propriedades
 */
export function mapAutomationStatus(automation: PloomesAutomation): AutomationStatus {
  if (automation.DisabledDueToError) return "error";
  if (!automation.Enabled) return "inactive";
  return "active";
}

/**
 * Retorna o nome legível do trigger em português
 */
export function getTriggerName(triggerId: number): string {
  const triggerNames: Record<number, string> = {
    1: "Ao entrar no estágio",
    2: "Ao sair do estágio",
    5: "Ao criar",
    6: "Ao alterar",
    8: "Ao ganhar",
    9: "Ao perder",
    17: "Recorrente",
  };
  return triggerNames[triggerId] || `Trigger ${triggerId}`;
}
