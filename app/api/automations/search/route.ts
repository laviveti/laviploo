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
import { normalizeText } from "@/lib/utils";
import { getVisualEntityId, getEntityDisplayName } from "@/constants/automation-entities";

// Export types for use in other files
export type SearchResult = Automation & {
  matchedFields: string[];
  matchedContent: string;
};

export type GlobalSearchResponse = {
  results: SearchResult[];
  total: number;
  query: string;
};

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

// REMOVIDA: função local getEntityName() - agora usa getEntityDisplayName() do constants

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

  // Calcular ID visual correto baseado no EntityId do Ploomes + contexto
  const visualEntityId = getVisualEntityId(
    ploomesAutomation.EntityId,
    !!ploomesAutomation.TriggerDealStageId
  );

  return {
    id: ploomesAutomation.Id,
    name: ploomesAutomation.Name,
    entityId: visualEntityId, // IMPORTANTE: Retorna ID visual, não EntityId do Ploomes
    entityName: getEntityDisplayName(visualEntityId), // Usa função do constants para mapeamento correto
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

    if (!query || query.length < 1) {
      return NextResponse.json({ results: [], total: 0, query: query || '' });
    }

    // Split query into individual terms for multi-term search
    const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
    
    // Debug log para verificar os termos de busca
    console.log(`SEARCH DEBUG: Query="${query}", Terms=[${searchTerms.join(', ')}]`);

    // Escape single quotes for OData
    const escapedQuery = query.replace(/'/g, "''");

    // Otimização: Para queries longas (>80 chars) ou muitos termos (>5), buscar apenas pela query completa
    // Para evitar queries OData muito longas que podem falhar
    const useFullQueryOnly = query.length > 80 || searchTerms.length > 5;

    // Buscar todas as automações para aplicar filtro insensível a acentos no lado do servidor
    // Aumentado limite para 500 para incluir automações mais antigas
    const automationsQuery = `Automations?$expand=Creator,Actions,Entity&$top=500&$orderby=CreateDate desc`;

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

    // Helper function to calculate match score with accent-insensitive matching
    const calculateMatchScore = (text: string, terms: string[], isTitle: boolean = false): number => {
      if (!text) return 0;
      const normalizedText = normalizeText(text);
      let score = 0;

      // Count how many terms are found in the text
      terms.forEach(term => {
        const normalizedTerm = normalizeText(term);
        if (normalizedText.includes(normalizedTerm)) {
          // Título tem peso 3x maior para priorizar matches no nome
          const weight = isTitle ? 3 : 1;
          score += weight;
          // Debug log para verificar matches
          console.log(`MATCH FOUND: "${normalizedTerm}" in "${normalizedText}" (original: "${text}") - Weight: ${weight}`);
        }
      });

      return score;
    };

    const results: SearchResult[] = [];

    if (automationsResponse.status === "fulfilled" && automationsResponse.value.ok) {
      const data: PloomesAutomationsResponse = await automationsResponse.value.json();
      
      console.log(`SEARCH DEBUG: Processing ${data.value?.length || 0} automations`);
      console.log(`SEARCH DEBUG: First few automation names:`, data.value?.slice(0, 5).map(a => a.Name));
      
      // Verificar se a automação específica está na lista
      const targetAutomation = data.value?.find(a => a.Name?.includes('Operação - Pedidos de venda'));
      console.log(`SEARCH DEBUG: Target automation found:`, targetAutomation ? targetAutomation.Name : 'NOT FOUND');

      data.value?.forEach(automation => {
        const transformedAutomation = transformPloomesAutomation(
          automation,
          pipelinesMap,
          stagesMap
        );

        // Calculate match score for each field - título tem prioridade
        const nameScore = calculateMatchScore(automation.Name || '', searchTerms, true); // Título tem prioridade
        const creatorScore = calculateMatchScore(automation.Creator?.Name || '', searchTerms);
        const pipelineScore = calculateMatchScore(transformedAutomation.pipelineName || '', searchTerms);
        const stageScore = calculateMatchScore(transformedAutomation.stageName || '', searchTerms);
        const entityScore = calculateMatchScore(transformedAutomation.entityName || '', searchTerms); // Agora usa nome correto do constants
        const triggerScore = calculateMatchScore(transformedAutomation.triggerName || '', searchTerms);

        let actionsScore = 0;
        automation.Actions?.forEach(action => {
          actionsScore += calculateMatchScore(action.Name || '', searchTerms);
        });

        const totalScore = nameScore + creatorScore + pipelineScore + stageScore + entityScore + triggerScore + actionsScore;

        // Only include results that match at least one term
        if (totalScore === 0) return;

        // Determine which fields matched
        const matchedFields: string[] = [];
        let matchedContent = '';

        const lowerQuery = query.toLowerCase();

        // Check for matches (keeping original logic for display)
        if (nameScore > 0) {
          matchedFields.push('nome');
          matchedContent = automation.Name || '';
        }

        if (creatorScore > 0) {
          matchedFields.push('criador');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Criado por ${automation.Creator?.Name}`;
        }

        if (pipelineScore > 0) {
          matchedFields.push('pipeline');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Pipeline: ${transformedAutomation.pipelineName}`;
        }

        if (stageScore > 0) {
          matchedFields.push('estágio');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Estágio: ${transformedAutomation.stageName}`;
        }

        if (entityScore > 0) {
          matchedFields.push('entidade');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Entidade: ${transformedAutomation.entityName}`;
        }

        if (triggerScore > 0) {
          matchedFields.push('gatilho');
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Gatilho: ${transformedAutomation.triggerName}`;
        }

        if (actionsScore > 0) {
          automation.Actions?.forEach(action => {
            if (calculateMatchScore(action.Name || '', searchTerms) > 0) {
              matchedFields.push('ação');
              if (matchedContent) matchedContent += ` • `;
              matchedContent += `Ação: ${action.Name}`;
            }
          });
        }

        if (!matchedContent) {
          matchedContent = transformedAutomation.name;
        }

        results.push({
          ...transformedAutomation,
          matchedFields,
          matchedContent,
          score: totalScore
        } as SearchResult & { score: number });
      });

      // Sort by score (higher score = more terms matched)
      results.sort((a: any, b: any) => b.score - a.score);
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
                  matchedContent,
                  score: 1 // Score mínimo para resultados de busca adicional
                } as SearchResult & { score: number });
              });
            }
          } catch (error) {
            console.warn('Error in additional search:', error);
          }
        }
      }
    }

    // Remove duplicates, sort by score, and limit results
    const uniqueResults = results
      .filter((result, index, self) =>
        index === self.findIndex(r => r.id === result.id)
      )
      .sort((a, b) => ((b as any).score || 0) - ((a as any).score || 0))
      .slice(0, 20)
      .map(({ score, ...result }: any) => result as SearchResult); // Remove score property from final results

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