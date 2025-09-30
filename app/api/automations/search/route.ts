import { NextResponse } from "next/server";
import type {
  Automation,
  PloomesAutomationsResponse,
  PloomesAutomation,
  AutomationTriggerType,
  AutomationStatus,
  AutomationEntityType,
} from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";

// Search-specific types
export interface SearchResult extends Automation {
  matchedFields: string[];
  matchedContent: string;
}

export interface GlobalSearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

export interface PloomesUserResponse {
  "@odata.context": string;
  value: Array<{
    Id: number;
    Name: string;
    Email?: string;
  }>;
}

export interface PloomesPipelineResponse {
  "@odata.context": string;
  value: Array<{
    Id: number;
    Name: string;
  }>;
}

export interface PloomesStageResponse {
  "@odata.context": string;
  value: Array<{
    Id: number;
    Name: string;
    PipelineId: number;
  }>;
}

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

// Helper functions for data transformation
function mapTriggerType(triggerId: number): AutomationTriggerType {
  const triggerMap: Record<number, AutomationTriggerType> = {
    1: 'stage_entry',
    2: 'stage_exit',
    5: 'deal_created',
    6: 'deal_updated',
    8: 'deal_won',
    9: 'deal_lost',
    17: 'recurring'
  };
  return triggerMap[triggerId] || 'unknown';
}

function mapAutomationStatus(automation: PloomesAutomation): AutomationStatus {
  if (automation.DisabledDueToError) return 'error';
  if (!automation.Enabled) return 'inactive';
  return 'active';
}

function mapEntityType(entityId: number): AutomationEntityType {
  const entityMap: Record<number, AutomationEntityType> = {
    1: 'contacts',
    2: 'deals',
    3: 'tasks',
    4: 'orders'
  };
  return entityMap[entityId] || 'unknown';
}

function getEntityName(entityId: number): string {
  const entityNames: Record<number, string> = {
    1: 'Contatos',
    2: 'Negócios',
    3: 'Tarefas',
    4: 'Pedidos'
  };
  return entityNames[entityId] || `Entidade ${entityId}`;
}

function getTriggerName(triggerId: number): string {
  const triggerNames: Record<number, string> = {
    1: 'Ao entrar no estágio',
    2: 'Ao sair do estágio',
    5: 'Ao criar',
    6: 'Ao alterar',
    8: 'Ao ganhar',
    9: 'Ao perder',
    17: 'Recorrente'
  };
  return triggerNames[triggerId] || `Trigger ${triggerId}`;
}

function transformPloomesAutomation(
  ploomesAutomation: PloomesAutomation,
  pipelinesMap: Record<number, string> = {},
  stagesMap: Record<number, { name: string; pipelineId: number }> = {}
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
    actions: ploomesAutomation.Actions?.map(action => ({
      id: action.Id,
      name: action.Name,
      type: action.TypeId?.toString() || 'unknown',
      parameters: action.Parameters
    })),
    description: ploomesAutomation.TriggerDealStageId ?
      `Estágio específico: ${ploomesAutomation.TriggerDealStageId}` :
      undefined,
    // Pipeline/Stage information
    triggerDealStageId: ploomesAutomation.TriggerDealStageId,
    triggerDealPipelineId: ploomesAutomation.TriggerDealPipelineId,
    pipelineName,
    stageName
  };
}

export async function GET(request: Request): Promise<NextResponse<GlobalSearchResponse | { error: string }>> {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], total: 0, query: query || '' });
    }

    // Escape single quotes for OData
    const escapedQuery = query.replace(/'/g, "''");

    // Build comprehensive search query
    const searchConditions = [
      `contains(tolower(Name), tolower('${escapedQuery}'))`,
      `contains(tolower(Creator/Name), tolower('${escapedQuery}'))`,
    ];

    const automationsQuery = `Automations?$expand=Creator,Actions,Entity&$filter=${searchConditions.join(' or ')}&$top=50&$orderby=CreateDate desc`;

    // Fetch context data in parallel
    const [
      automationsResponse,
      pipelinesResponse,
      stagesResponse,
      usersResponse
    ] = await Promise.allSettled([
      fetch(`${PLOOMES_API_BASE}/${automationsQuery}`, {
        headers,
        cache: "no-cache",
      }),
      fetch(`${PLOOMES_API_BASE}/Deals@Pipelines`, {
        headers,
        cache: "no-cache",
      }),
      fetch(`${PLOOMES_API_BASE}/Deals@Stages`, {
        headers,
        cache: "no-cache",
      }),
      fetch(`${PLOOMES_API_BASE}/Users?$top=100`, {
        headers,
        cache: "no-cache",
      })
    ]);

    // Process context data
    let pipelinesMap: Record<number, string> = {};
    let stagesMap: Record<number, { name: string; pipelineId: number }> = {};
    let usersMap: Record<number, string> = {};

    if (pipelinesResponse.status === "fulfilled" && pipelinesResponse.value.ok) {
      const pipelinesData: PloomesPipelineResponse = await pipelinesResponse.value.json();
      pipelinesData.value?.forEach((pipeline) => {
        pipelinesMap[pipeline.Id] = pipeline.Name;
      });
    }

    if (stagesResponse.status === "fulfilled" && stagesResponse.value.ok) {
      const stagesData: PloomesStageResponse = await stagesResponse.value.json();
      stagesData.value?.forEach((stage) => {
        stagesMap[stage.Id] = {
          name: stage.Name,
          pipelineId: stage.PipelineId
        };
      });
    }

    if (usersResponse.status === "fulfilled" && usersResponse.value.ok) {
      const usersData: PloomesUserResponse = await usersResponse.value.json();
      usersData.value?.forEach((user) => {
        usersMap[user.Id] = user.Name;
      });
    }

    const results: SearchResult[] = [];

    if (automationsResponse.status === "fulfilled" && automationsResponse.value.ok) {
      const data: PloomesAutomationsResponse = await automationsResponse.value.json();

      data.value?.forEach(automation => {
        const transformedAutomation = transformPloomesAutomation(
          automation,
          pipelinesMap,
          stagesMap
        );

        // Determine which fields matched
        const matchedFields: string[] = [];
        let matchedContent = '';

        const lowerQuery = query.toLowerCase();

        if (automation.Name?.toLowerCase().includes(lowerQuery)) {
          matchedFields.push('nome');
          matchedContent = automation.Name;
        }

        if (automation.Creator?.Name?.toLowerCase().includes(lowerQuery)) {
          matchedFields.push('criador');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Criado por ${automation.Creator.Name}`;
        }

        // Check pipeline/stage matches
        if (transformedAutomation.pipelineName?.toLowerCase().includes(lowerQuery)) {
          matchedFields.push('pipeline');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Pipeline: ${transformedAutomation.pipelineName}`;
        }

        if (transformedAutomation.stageName?.toLowerCase().includes(lowerQuery)) {
          matchedFields.push('estágio');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Estágio: ${transformedAutomation.stageName}`;
        }

        // Check entity name matches
        if (transformedAutomation.entityName?.toLowerCase().includes(lowerQuery)) {
          matchedFields.push('entidade');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Entidade: ${transformedAutomation.entityName}`;
        }

        // Check trigger name matches
        if (transformedAutomation.triggerName?.toLowerCase().includes(lowerQuery)) {
          matchedFields.push('gatilho');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Gatilho: ${transformedAutomation.triggerName}`;
        }

        // Check actions matches
        automation.Actions?.forEach(action => {
          if (action.Name?.toLowerCase().includes(lowerQuery)) {
            matchedFields.push('ação');
            if (matchedContent) matchedContent += ` • `;
            matchedContent += `Ação: ${action.Name}`;
          }
        });

        if (!matchedContent) {
          matchedContent = transformedAutomation.name;
        }

        results.push({
          ...transformedAutomation,
          matchedFields,
          matchedContent
        });
      });
    }

    // Additional search in pipeline/stage names if no results found in automations
    if (results.length === 0) {
      // Search for automations that might be related to matching pipelines/stages
      const pipelineMatches = Object.entries(pipelinesMap).filter(([_, name]) =>
        name.toLowerCase().includes(query.toLowerCase())
      );

      const stageMatches = Object.entries(stagesMap).filter(([_, stage]) =>
        stage.name.toLowerCase().includes(query.toLowerCase())
      );

      if (pipelineMatches.length > 0 || stageMatches.length > 0) {
        // Build additional query for pipeline/stage related automations
        const pipelineIds = pipelineMatches.map(([id, _]) => `TriggerDealPipelineId eq ${id}`);
        const stageIds = stageMatches.map(([id, _]) => `TriggerDealStageId eq ${id}`);

        const additionalConditions = [...pipelineIds, ...stageIds];

        if (additionalConditions.length > 0) {
          const additionalQuery = `Automations?$expand=Creator,Actions,Entity&$filter=${additionalConditions.join(' or ')}&$top=20&$orderby=CreateDate desc`;

          try {
            const additionalResponse = await fetch(`${PLOOMES_API_BASE}/${additionalQuery}`, {
              headers,
              cache: "no-cache",
            });

            if (additionalResponse.ok) {
              const additionalData: PloomesAutomationsResponse = await additionalResponse.json();

              additionalData.value?.forEach(automation => {
                const transformedAutomation = transformPloomesAutomation(
                  automation,
                  pipelinesMap,
                  stagesMap
                );

                const matchedFields: string[] = [];
                let matchedContent = transformedAutomation.name;

                if (transformedAutomation.pipelineName?.toLowerCase().includes(query.toLowerCase())) {
                  matchedFields.push('pipeline');
                  matchedContent = `Pipeline: ${transformedAutomation.pipelineName}`;
                }

                if (transformedAutomation.stageName?.toLowerCase().includes(query.toLowerCase())) {
                  matchedFields.push('estágio');
                  matchedContent = `Estágio: ${transformedAutomation.stageName}`;
                }

                results.push({
                  ...transformedAutomation,
                  matchedFields,
                  matchedContent
                });
              });
            }
          } catch (error) {
            console.warn('Error in additional search:', error);
          }
        }
      }
    }

    // Remove duplicates and limit results
    const uniqueResults = results.filter((result, index, self) =>
      index === self.findIndex(r => r.id === result.id)
    ).slice(0, 20);

    return NextResponse.json({
      results: uniqueResults,
      total: uniqueResults.length,
      query
    });

  } catch (error) {
    console.error("Erro na busca global de automações:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}