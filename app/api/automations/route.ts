import { NextResponse } from "next/server";
import type {
  AutomationsData,
  Automation,
  Integration,
  IntegrationBehavior,
  PloomesAutomationsResponse,
  PloomesAutomation,
  PloomesIntegrationResponse,
  PloomesBehaviorResponse,
  PloomesMailChimpResponse,
  PloomesDealsResponse,
  PloomesTasksResponse,
} from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";
import { normalizeText } from "@/lib/utils";
import { getEntityDisplayName } from "@/constants/automation-entities";
import { mapTriggerType, mapAutomationStatus, getTriggerName } from "@/lib/automations";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  Accept: "application/json",
};

// DEPRECATED: Use getEntityDisplayName from constants/automation-entities
function getEntityName(entityId: number): string {
  return getEntityDisplayName(entityId);
}

function transformPloomesAutomation(
  ploomesAutomation: PloomesAutomation,
  pipelinesMap?: Record<number, string>, // Funil
  stagesMap?: Record<number, { name: string; pipelineId: number }>
): Automation {
  // Get pipeline and stage information
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

  return {
    id: ploomesAutomation.Id,
    name: ploomesAutomation.Name,
    entityId: ploomesAutomation.EntityId,
    entityName: getEntityName(ploomesAutomation.EntityId),
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
    // Pipeline/Stage information
    triggerDealStageId: ploomesAutomation.TriggerDealStageId,
    triggerDealPipelineId: ploomesAutomation.TriggerDealPipelineId,
    pipelineName,
    stageName,
    // Alias stageId para compatibilidade com o componente de detalhes
    stageId: ploomesAutomation.TriggerDealStageId,
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const expand = url.searchParams.get("expand") === "true";
    const entityFilter = url.searchParams.get("entity");
    const statusFilter = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const createdBy = url.searchParams.get("createdBy");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const genericFilter = url.searchParams.get("generic") === "true";

    // Quando há filtros que precisam ser aplicados localmente (search, status),
    // precisamos buscar todas as automações e fazer a paginação no servidor
    const hasLocalFilters = Boolean(search || statusFilter);

    // Build automations query with OData parameters
    let automationsQuery = hasLocalFilters
      ? `Automations?$orderby=CreateDate desc`
      : `Automations?$top=${limit}&$skip=${skip}&$orderby=CreateDate desc`;

    if (expand) {
      automationsQuery += "&$expand=Entity,Trigger,Actions,Creator";
    }

    // Build OData $filter conditions
    const filterConditions: string[] = [];

    // Apply entity filters at OData level for better pagination
    if (entityFilter) {
      const entityId = parseInt(entityFilter);
      if (entityId === 2) {
        // Para Workflow (EntityId = 2), filtrar apenas automações COM TriggerDealStageId
        filterConditions.push(`EntityId eq ${entityId} and TriggerDealStageId ne null`);
      } else {
        // Para outras entidades, filtrar normalmente
        filterConditions.push(`EntityId eq ${entityId}`);
      }
    }

    // Generic filter at OData level
    if (genericFilter) {
      filterConditions.push(`(EntityId eq null or (EntityId eq 2 and TriggerDealStageId eq null))`);
    }

    // Não aplicar filtro de busca na query OData para permitir busca insensível a acentos
    // A busca será aplicada no lado do servidor após receber os dados

    if (dateFrom) {
      filterConditions.push(`CreateDate ge ${dateFrom}T00:00:00Z`);
    }

    if (dateTo) {
      filterConditions.push(`CreateDate le ${dateTo}T23:59:59Z`);
    }

    if (filterConditions.length > 0) {
      automationsQuery += `&$filter=${filterConditions.join(" and ")}`;
    }

    // Build count query (same filters but with $count=true and $top=0)
    // Não é necessário quando temos filtros locais, pois buscaremos todas as automações
    let countQuery = automationsQuery
      .replace(/\$top=\d+&\$skip=\d+&?/, "")
      .replace("&$expand=Entity,Trigger,Actions,Creator", ""); // Remove expand for count query

    if (!countQuery.includes("$count=true")) {
      countQuery = countQuery.includes("?")
        ? countQuery.replace("?", "?$count=true&$top=0&")
        : `${countQuery}?$count=true&$top=0`;
    }

    // Fetch all data in parallel
    const [
      automationsResponse,
      countResponse,
      integrationsResponse,
      rdStationBehaviorsResponse,
      reevBehaviorsResponse,
      mailChimpResponse,
      dealsResponse,
      tasksResponse,
      pipelinesResponse,
      stagesResponse,
    ] = await Promise.allSettled([
      // Real automations from Ploomes (paginated)
      fetch(`${PLOOMES_API_BASE}/${automationsQuery}`, {
        headers,
        cache: "no-cache",
      }),
      // Count total automations (with same filters)
      fetch(`${PLOOMES_API_BASE}/${countQuery}`, {
        headers,
        cache: "no-cache",
      }),
      // Integrations (existing)
      fetch(`${PLOOMES_API_BASE}/Account@Integrations?$expand=Integration($expand=Fields)`, {
        headers,
        cache: "no-cache",
      }),
      // Integration behaviors (existing)
      fetch(`${PLOOMES_API_BASE}/Account@RDStationIntegration@Behaviors`, {
        headers,
        cache: "no-cache",
      }),
      fetch(`${PLOOMES_API_BASE}/Account@ReevIntegration@Behaviors`, {
        headers,
        cache: "no-cache",
      }),
      fetch(`${PLOOMES_API_BASE}/Account@MailChimpIntegration`, {
        headers,
        cache: "no-cache",
      }),
      // Additional context data
      fetch(`${PLOOMES_API_BASE}/Deals?$top=5&$orderby=CreateDate desc`, {
        headers,
        cache: "no-cache",
      }),
      fetch(`${PLOOMES_API_BASE}/Tasks?$top=5&$orderby=CreateDate desc`, {
        headers,
        cache: "no-cache",
      }),
      // Pipeline and stage data for automation context
      fetch(`${PLOOMES_API_BASE}/Deals@Pipelines`, {
        headers,
        cache: "no-cache",
      }),
      fetch(`${PLOOMES_API_BASE}/Deals@Stages`, {
        headers,
        cache: "no-cache",
      }),
    ]);

    const automations: Automation[] = [];
    const integrations: Integration[] = [];
    const behaviors: IntegrationBehavior[] = [];
    let totalAutomationsCount = 0;

    // Process pipelines and stages data
    let pipelinesMap: Record<number, string> = {};
    let stagesMap: Record<number, { name: string; pipelineId: number }> = {};

    if (pipelinesResponse.status === "fulfilled" && pipelinesResponse.value.ok) {
      const pipelinesData = await pipelinesResponse.value.json();
      pipelinesData.value?.forEach((pipeline: any) => {
        pipelinesMap[pipeline.Id] = pipeline.Name;
      });
    }

    if (stagesResponse.status === "fulfilled" && stagesResponse.value.ok) {
      const stagesData = await stagesResponse.value.json();
      stagesData.value?.forEach((stage: any) => {
        stagesMap[stage.Id] = {
          name: stage.Name,
          pipelineId: stage.PipelineId,
        };
      });
    }

    // Process count response
    if (countResponse.status === "fulfilled" && countResponse.value.ok) {
      const countData = await countResponse.value.json();
      totalAutomationsCount = countData["@odata.count"] || 0;
    }

    // Process real automations
    if (automationsResponse.status === "fulfilled" && automationsResponse.value.ok) {
      const data: PloomesAutomationsResponse = await automationsResponse.value.json();

      let filteredAutomations = data.value || [];

      // Entity and generic filters are now handled at OData level for better pagination
      // Apply status and search filters locally

      if (statusFilter) {
        filteredAutomations = filteredAutomations.filter((a) => {
          const status = mapAutomationStatus(a);
          return status === statusFilter;
        });
      }

      // Apply search filter with accent-insensitive matching
      if (search) {
        const normalizedSearch = normalizeText(search);
        filteredAutomations = filteredAutomations.filter((a) => {
          const normalizedName = normalizeText(a.Name || "");
          const normalizedCreator = normalizeText(a.Creator?.Name || "");
          return normalizedName.includes(normalizedSearch) || normalizedCreator.includes(normalizedSearch);
        });
      }

      // Se temos filtros locais, precisamos fazer a paginação no servidor
      if (hasLocalFilters) {
        // Atualizar o total count com o número real de automações filtradas
        totalAutomationsCount = filteredAutomations.length;

        // Aplicar paginação no servidor
        const startIndex = skip;
        const endIndex = skip + limit;
        filteredAutomations = filteredAutomations.slice(startIndex, endIndex);
      }

      // Transform to UI format
      filteredAutomations.forEach((automation) => {
        automations.push(transformPloomesAutomation(automation, pipelinesMap, stagesMap));
      });
    }

    // Process integrations (existing logic)
    if (integrationsResponse.status === "fulfilled" && integrationsResponse.value.ok) {
      const data: PloomesIntegrationResponse = await integrationsResponse.value.json();

      data.value?.forEach((item) => {
        integrations.push({
          id: item.Integration.Id,
          name: item.Integration.Name,
          status: "Connected",
          fields: item.Integration.Fields?.map((field) => ({
            id: field.Id,
            name: field.Name,
            type: field.Type,
          })),
        });
      });
    }

    // Process behaviors (existing logic)
    if (rdStationBehaviorsResponse.status === "fulfilled" && rdStationBehaviorsResponse.value.ok) {
      const data: PloomesBehaviorResponse = await rdStationBehaviorsResponse.value.json();

      data.value?.forEach((behavior) => {
        behaviors.push({
          id: behavior.Id,
          name: behavior.Name,
          description: behavior.DealStageIdRequired ? "Requer estágio da oportunidade" : "Configuração padrão",
          isActive: true,
          integrationName: "RD Station",
        });
      });
    }

    if (reevBehaviorsResponse.status === "fulfilled" && reevBehaviorsResponse.value.ok) {
      const data: PloomesBehaviorResponse = await reevBehaviorsResponse.value.json();

      data.value?.forEach((behavior) => {
        behaviors.push({
          id: behavior.Id,
          name: behavior.Name,
          description: behavior.DealStageIdRequired ? "Requer estágio da oportunidade" : "Configuração padrão",
          isActive: true,
          integrationName: "Reev",
        });
      });
    }

    // Process MailChimp
    if (mailChimpResponse.status === "fulfilled" && mailChimpResponse.value.ok) {
      const data: PloomesMailChimpResponse = await mailChimpResponse.value.json();

      integrations.push({
        id: 999,
        name: "MailChimp",
        status: data.value && data.value.length > 0 ? "Connected" : "Disconnected",
      });
    }

    // Calculate comprehensive stats
    const automationsByEntity = automations.reduce(
      (acc, automation) => {
        const entityName = automation.entityName || "Desconhecido";
        acc[entityName] = (acc[entityName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const automationsByTrigger = automations.reduce(
      (acc, automation) => {
        const triggerName = automation.triggerName || "Desconhecido";
        acc[triggerName] = (acc[triggerName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Since we're now using OData filtering, use the count query result directly
    const actualTotalCount = totalAutomationsCount > 0 ? totalAutomationsCount : automations.length;

    const stats = {
      totalAutomations: actualTotalCount,
      activeAutomations: automations.filter((a) => a.status === "active").length,
      totalIntegrations: integrations.length,
      activeIntegrations: integrations.filter((i) => i.status === "Connected").length,
      totalBehaviors: behaviors.length,
      activeBehaviors: behaviors.filter((b) => b.isActive).length,
      automationsByEntity,
      automationsByTrigger,
    };

    const automationsData: AutomationsData = {
      automations,
      integrations,
      behaviors,
      stats,
    };

    return NextResponse.json(automationsData);
  } catch (error) {
    console.error("Erro ao buscar automações:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
