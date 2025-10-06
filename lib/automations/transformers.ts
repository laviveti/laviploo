import type { Automation, PloomesAutomation } from "@/types/automations";
import { getVisualEntityId, getEntityDisplayName } from "@/constants/automation-entities";
import { mapTriggerType, mapAutomationStatus, getTriggerName } from "./mappers";

/**
 * Transforma uma automação do formato Ploomes para o formato da aplicação
 */
export function transformPloomesAutomation(
  ploomesAutomation: PloomesAutomation,
  pipelinesMap: Record<number, string> = {},
  stagesMap: Record<number, { name: string; pipelineId: number }> = {}
): Automation {
  let pipelineName: string | undefined;
  let stageName: string | undefined;

  if (ploomesAutomation.TriggerDealStageId && stagesMap) {
    const stageInfo = stagesMap[ploomesAutomation.TriggerDealStageId];
    if (stageInfo) {
      stageName = stageInfo.name;
      if (pipelinesMap) {
        pipelineName = pipelinesMap[stageInfo.pipelineId];
      }
    }
  } else if (ploomesAutomation.TriggerDealPipelineId && pipelinesMap) {
    pipelineName = pipelinesMap[ploomesAutomation.TriggerDealPipelineId];
  }

  const visualEntityId = getVisualEntityId(ploomesAutomation.EntityId, !!ploomesAutomation.TriggerDealStageId);

  return {
    id: ploomesAutomation.Id,
    name: ploomesAutomation.Name,
    entityId: visualEntityId,
    entityName: getEntityDisplayName(visualEntityId),
    triggerId: ploomesAutomation.TriggerId,
    triggerName: getTriggerName(ploomesAutomation.TriggerId),
    triggerType: mapTriggerType(ploomesAutomation.TriggerId),
    status: mapAutomationStatus(ploomesAutomation),
    enabled: ploomesAutomation.Enabled,
    hasError: ploomesAutomation.DisabledDueToError,
    createdAt: ploomesAutomation.CreateDate,
    lastRun: ploomesAutomation.LastRunTime || undefined,
    creator: ploomesAutomation.Creator?.Name,
    actions: ploomesAutomation.Actions?.map((action) => ({
      id: action.Id,
      name: action.Name,
      type: action.TypeId?.toString() || "unknown",
    })),
    description: ploomesAutomation.TriggerDealStageId ? `Estágio específico: ${ploomesAutomation.TriggerDealStageId}` : undefined,
    triggerDealStageId: ploomesAutomation.TriggerDealStageId,
    triggerDealPipelineId: ploomesAutomation.TriggerDealPipelineId,
    pipelineName,
    stageName,
  };
}
