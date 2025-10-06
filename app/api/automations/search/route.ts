import { NextResponse } from "next/server";
import type { Automation, PloomesAutomationsResponse } from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";
import { transformPloomesAutomation, calculateMatchScore } from "@/lib/automations";
import { normalizeText } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Constants
// ============================================================================

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  Accept: "application/json",
};

// ============================================================================
// Main Handler
// ============================================================================

export async function GET(request: Request): Promise<NextResponse<GlobalSearchResponse | { error: string }>> {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim();

    if (!query || query.length < 1) {
      return NextResponse.json({ results: [], total: 0, query: query || "" });
    }

    const searchTerms = query.split(/\s+/).filter((term) => term.length > 0);

    // Buscar todas as automações e dados de contexto
    const automationsQuery = `Automations?$expand=Creator,Actions,Entity&$top=500&$orderby=CreateDate desc`;

    const [automationsResponse, pipelinesResponse, stagesResponse, usersResponse] = await Promise.allSettled([
      fetch(`${PLOOMES_API_BASE}/${automationsQuery}`, { headers, cache: "no-cache" }),
      fetch(`${PLOOMES_API_BASE}/Deals@Pipelines`, { headers, cache: "no-cache" }),
      fetch(`${PLOOMES_API_BASE}/Deals@Stages`, { headers, cache: "no-cache" }),
      fetch(`${PLOOMES_API_BASE}/Users?$top=200`, { headers, cache: "no-cache" }),
    ]);

    // Processar dados de contexto
    const pipelinesMap: Record<number, string> = {};
    const stagesMap: Record<number, { name: string; pipelineId: number }> = {};
    const usersMap: Record<number, string> = {};

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
          pipelineId: stage.PipelineId,
        };
      });
    }

    if (usersResponse.status === "fulfilled" && usersResponse.value.ok) {
      const usersData: PloomesUserResponse = await usersResponse.value.json();
      usersData.value?.forEach((user) => {
        usersMap[user.Id] = user.Name;
      });
    }

    // Parsear automações
    let automationsData: PloomesAutomationsResponse | null = null;
    if (automationsResponse.status === "fulfilled" && automationsResponse.value.ok) {
      automationsData = await automationsResponse.value.json();
    }

    // Cache de filtros (buscar sob demanda)
    const filtersMap: Record<number, any> = {};
    const fetchedFilterIds = new Set<number>();

    async function fetchFilter(filterId: number) {
      if (fetchedFilterIds.has(filterId)) return;
      fetchedFilterIds.add(filterId);

      try {
        const response = await fetch(
          `${PLOOMES_API_BASE}/Filters?$filter=Id eq ${filterId}&$expand=Fields($expand=Values)&$top=1`,
          { headers, cache: "no-cache" }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.value && data.value.length > 0) {
            filtersMap[filterId] = data.value[0];
          }
        }
      } catch (error) {
        // Ignorar erros
      }
    }

    const results: SearchResult[] = [];

    if (automationsData) {
      // Primeira passagem: calcular scores básicos
      const automationsWithScores = automationsData.value?.map((automation) => {
        const transformedAutomation = transformPloomesAutomation(automation, pipelinesMap, stagesMap);

        return {
          automation,
          transformedAutomation,
          nameScore: calculateMatchScore(automation.Name || "", searchTerms, true),
          creatorScore: calculateMatchScore(automation.Creator?.Name || "", searchTerms),
          pipelineScore: calculateMatchScore(transformedAutomation.pipelineName || "", searchTerms),
          stageScore: calculateMatchScore(transformedAutomation.stageName || "", searchTerms),
          entityScore: calculateMatchScore(transformedAutomation.entityName || "", searchTerms),
          triggerScore: calculateMatchScore(transformedAutomation.triggerName || "", searchTerms),
        };
      });

      // Coletar filtros necessários
      const filterIdsToFetch = new Set<number>();
      automationsWithScores?.forEach((item) => {
        const hasBasicScore =
          item.nameScore > 0 ||
          item.creatorScore > 0 ||
          item.pipelineScore > 0 ||
          item.stageScore > 0 ||
          item.entityScore > 0;

        if (hasBasicScore && item.automation.TriggerFilterId) {
          filterIdsToFetch.add(item.automation.TriggerFilterId);
        }
      });

      // Buscar filtros em lotes de 5
      const filterIdsArray = Array.from(filterIdsToFetch);
      for (let i = 0; i < filterIdsArray.length; i += 5) {
        const batch = filterIdsArray.slice(i, i + 5);
        await Promise.all(batch.map((filterId) => fetchFilter(filterId)));
      }

      // Segunda passagem: processar com todos os dados
      for (const item of automationsWithScores || []) {
        const { automation, transformedAutomation, nameScore, creatorScore, pipelineScore, stageScore, entityScore, triggerScore } =
          item;

        // Buscar em filtros (gatilhos)
        let filterScore = 0;
        const filter = automation.TriggerFilterId ? filtersMap[automation.TriggerFilterId] : null;

        if (filter?.Fields) {
          filterScore += calculateMatchScore(filter.Name || "", searchTerms);

          filter.Fields.forEach((field: any) => {
            filterScore += calculateMatchScore(field.FieldName || "", searchTerms);

            field.Values?.forEach((value: any) => {
              if (value.StringValue) filterScore += calculateMatchScore(value.StringValue, searchTerms);
              if (value.BigStringValue) filterScore += calculateMatchScore(value.BigStringValue, searchTerms);

              if (value.IntegerValue) {
                const resolvedValue =
                  usersMap[value.IntegerValue] || pipelinesMap[value.IntegerValue] || stagesMap[value.IntegerValue]?.name;
                if (resolvedValue) filterScore += calculateMatchScore(resolvedValue, searchTerms);
              }
            });
          });
        }

        // Buscar em ações e seus parâmetros
        let actionsScore = 0;
        let actionParametersScore = 0;

        automation.Actions?.forEach((action) => {
          actionsScore += calculateMatchScore(action.Name || "", searchTerms);
          actionParametersScore += calculateMatchScore(action.ObjectValueName || "", searchTerms);
          actionParametersScore += calculateMatchScore(action.StringValue || "", searchTerms);
          actionParametersScore += calculateMatchScore(action.BigStringValue || "", searchTerms);

          if (action.RequestBody) {
            try {
              const requestBodyData = JSON.parse(action.RequestBody);
              actionParametersScore += calculateMatchScore(requestBodyData.Title || "", searchTerms);
              actionParametersScore += calculateMatchScore(requestBodyData.Description || "", searchTerms);

              requestBodyData.Users?.forEach((user: any) => {
                actionParametersScore += calculateMatchScore(user.Name || "", searchTerms);
              });

              requestBodyData.Contacts?.forEach((contact: any) => {
                actionParametersScore += calculateMatchScore(contact.Name || contact.display || "", searchTerms);
              });
            } catch (e) {
              // Ignorar erros de parsing
            }
          }
        });

        const totalScore =
          nameScore + creatorScore + pipelineScore + stageScore + entityScore + triggerScore + filterScore + actionsScore + actionParametersScore;

        if (totalScore === 0) continue;

        // Construir matched fields e content
        const matchedFields: string[] = [];
        let matchedContent = "";

        if (nameScore > 0) {
          matchedFields.push("nome");
          matchedContent = automation.Name || "";
        }

        if (creatorScore > 0) {
          matchedFields.push("criador");
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Criado por ${automation.Creator?.Name}`;
        }

        if (pipelineScore > 0) {
          matchedFields.push("pipeline");
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Pipeline: ${transformedAutomation.pipelineName}`;
        }

        if (stageScore > 0) {
          matchedFields.push("estágio");
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Estágio: ${transformedAutomation.stageName}`;
        }

        if (entityScore > 0) {
          matchedFields.push("entidade");
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Entidade: ${transformedAutomation.entityName}`;
        }

        if (triggerScore > 0) {
          matchedFields.push("gatilho");
          if (matchedContent) matchedContent += ` • `;
          matchedContent += `Gatilho: ${transformedAutomation.triggerName}`;
        }

        if (filterScore > 0 && filter) {
          const filterMatches: string[] = [];

          if (filter.Name && calculateMatchScore(filter.Name, searchTerms) > 0) {
            filterMatches.push(filter.Name);
          }

          filter.Fields?.forEach((field: any) => {
            const fieldMatches: string[] = [];

            if (field.FieldName && calculateMatchScore(field.FieldName, searchTerms) > 0) {
              fieldMatches.push(field.FieldName);
            }

            field.Values?.forEach((value: any) => {
              if (value.StringValue && calculateMatchScore(value.StringValue, searchTerms) > 0) {
                fieldMatches.push(value.StringValue);
              }
              if (value.BigStringValue && calculateMatchScore(value.BigStringValue, searchTerms) > 0) {
                fieldMatches.push(value.BigStringValue);
              }

              if (value.IntegerValue) {
                const resolvedValue =
                  usersMap[value.IntegerValue] || pipelinesMap[value.IntegerValue] || stagesMap[value.IntegerValue]?.name;
                if (resolvedValue && calculateMatchScore(resolvedValue, searchTerms) > 0) {
                  fieldMatches.push(resolvedValue);
                }
              }
            });

            if (fieldMatches.length > 0) {
              filterMatches.push(`${field.FieldName}: ${fieldMatches.join(", ")}`);
            }
          });

          if (filterMatches.length > 0) {
            matchedFields.push("filtro");
            if (matchedContent) matchedContent += ` • `;
            matchedContent += `Filtro: ${filterMatches.join("; ")}`;
          }
        }

        if (actionsScore > 0) {
          automation.Actions?.forEach((action) => {
            if (calculateMatchScore(action.Name || "", searchTerms) > 0) {
              matchedFields.push("ação");
              if (matchedContent) matchedContent += ` • `;
              matchedContent += `Ação: ${action.Name}`;
            }
          });
        }

        if (actionParametersScore > 0) {
          automation.Actions?.forEach((action) => {
            const parameterMatches: string[] = [];

            if (action.ObjectValueName && calculateMatchScore(action.ObjectValueName, searchTerms) > 0) {
              parameterMatches.push(action.ObjectValueName);
            }
            if (action.StringValue && calculateMatchScore(action.StringValue, searchTerms) > 0) {
              parameterMatches.push(action.StringValue);
            }
            if (action.BigStringValue && calculateMatchScore(action.BigStringValue, searchTerms) > 0) {
              parameterMatches.push(action.BigStringValue);
            }

            if (action.RequestBody) {
              try {
                const requestBodyData = JSON.parse(action.RequestBody);

                if (requestBodyData.Title && calculateMatchScore(requestBodyData.Title, searchTerms) > 0) {
                  parameterMatches.push(`Título: ${requestBodyData.Title}`);
                }
                if (requestBodyData.Description && calculateMatchScore(requestBodyData.Description, searchTerms) > 0) {
                  parameterMatches.push(`Descrição: ${requestBodyData.Description}`);
                }

                requestBodyData.Users?.forEach((user: any) => {
                  if (user.Name && calculateMatchScore(user.Name, searchTerms) > 0) {
                    parameterMatches.push(`Usuário: ${user.Name}`);
                  }
                });

                requestBodyData.Contacts?.forEach((contact: any) => {
                  const contactName = contact.Name || contact.display || "";
                  if (contactName && calculateMatchScore(contactName, searchTerms) > 0) {
                    parameterMatches.push(`Contato: ${contactName}`);
                  }
                });
              } catch (e) {
                // Ignorar erros de parsing
              }
            }

            if (parameterMatches.length > 0) {
              matchedFields.push("disparo");
              if (matchedContent) matchedContent += ` • `;
              matchedContent += `Disparo: ${parameterMatches.join(", ")}`;
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
          score: totalScore,
        } as SearchResult & { score: number });
      }

      results.sort((a: any, b: any) => b.score - a.score);
    }

    // Busca adicional por pipeline/stage se não houver resultados
    if (results.length === 0) {
      const normalizedQuery = normalizeText(query);
      const pipelineMatches = Object.entries(pipelinesMap).filter(([_, name]) => normalizeText(name).includes(normalizedQuery));
      const stageMatches = Object.entries(stagesMap).filter(([_, stage]) => normalizeText(stage.name).includes(normalizedQuery));

      if (pipelineMatches.length > 0 || stageMatches.length > 0) {
        const pipelineIds = pipelineMatches.map(([id, _]) => `TriggerDealPipelineId eq ${id}`);
        const stageIds = stageMatches.map(([id, _]) => `TriggerDealStageId eq ${id}`);
        const additionalConditions = [...pipelineIds, ...stageIds];

        if (additionalConditions.length > 0) {
          const additionalQuery = `Automations?$expand=Creator,Actions,Entity&$filter=${additionalConditions.join(" or ")}&$top=20&$orderby=CreateDate desc`;

          try {
            const additionalResponse = await fetch(`${PLOOMES_API_BASE}/${additionalQuery}`, { headers, cache: "no-cache" });

            if (additionalResponse.ok) {
              const additionalData: PloomesAutomationsResponse = await additionalResponse.json();

              additionalData.value?.forEach((automation) => {
                const transformedAutomation = transformPloomesAutomation(automation, pipelinesMap, stagesMap);
                const matchedFields: string[] = [];
                let matchedContent = transformedAutomation.name;

                if (transformedAutomation.pipelineName && normalizeText(transformedAutomation.pipelineName).includes(normalizedQuery)) {
                  matchedFields.push("pipeline");
                  matchedContent = `Pipeline: ${transformedAutomation.pipelineName}`;
                }

                if (transformedAutomation.stageName && normalizeText(transformedAutomation.stageName).includes(normalizedQuery)) {
                  matchedFields.push("estágio");
                  matchedContent = `Estágio: ${transformedAutomation.stageName}`;
                }

                results.push({
                  ...transformedAutomation,
                  matchedFields,
                  matchedContent,
                  score: 1,
                } as SearchResult & { score: number });
              });
            }
          } catch (error) {
            console.warn("Error in additional search:", error);
          }
        }
      }
    }

    // Remover duplicados e limitar resultados
    const uniqueResults = results
      .filter((result, index, self) => index === self.findIndex((r) => r.id === result.id))
      .sort((a, b) => ((b as any).score || 0) - ((a as any).score || 0))
      .slice(0, 20)
      .map(({ score, ...result }: any) => result as SearchResult);

    return NextResponse.json({
      results: uniqueResults,
      total: uniqueResults.length,
      query,
    });
  } catch (error) {
    console.error("Erro na busca global de automações:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
