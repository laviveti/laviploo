import { NextResponse } from "next/server";
import type {
  PloomesAutomationsResponse,
  PloomesAutomation,
  Automation,
  AutomationTriggerType,
  AutomationStatus,
  FilterCondition,
  AutomationExecution,
} from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";
import {
  getEntityName,
  getTriggerName,
  interpretFilterField,
  groupFilterCriteria,
  analyzeFilterLogic,
  parseODataFilter,
  type InterpretedFilterCriteria,
} from "@/lib/ploomes-mappings";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  Accept: "application/json",
};

// Mapeamento de campos que são referências para seus endpoints
const REFERENCE_FIELD_ENDPOINTS: Record<string, { endpoint: string; nameField: string }> = {
  // Usuários
  creator: { endpoint: "Users", nameField: "Name" },
  creatorid: { endpoint: "Users", nameField: "Name" },
  updater: { endpoint: "Users", nameField: "Name" },
  updaterid: { endpoint: "Users", nameField: "Name" },
  owner: { endpoint: "Users", nameField: "Name" },
  ownerid: { endpoint: "Users", nameField: "Name" },
  user: { endpoint: "Users", nameField: "Name" },
  userid: { endpoint: "Users", nameField: "Name" },
  responsibleid: { endpoint: "Users", nameField: "Name" },

  // Pipelines/Funis
  pipeline: { endpoint: "Deals@Pipelines", nameField: "Name" },
  pipelineid: { endpoint: "Deals@Pipelines", nameField: "Name" },

  // Estágios
  stage: { endpoint: "Deals@Stages", nameField: "Name" },
  stageid: { endpoint: "Deals@Stages", nameField: "Name" },
  dealstage: { endpoint: "Deals@Stages", nameField: "Name" },
  dealstageid: { endpoint: "Deals@Stages", nameField: "Name" },

  // Status
  status: { endpoint: "Deals@Status", nameField: "Name" },
  statusid: { endpoint: "Deals@Status", nameField: "Name" },

  // Entidades
  contact: { endpoint: "Contacts", nameField: "Name" },
  contactid: { endpoint: "Contacts", nameField: "Name" },
  deal: { endpoint: "Deals", nameField: "Title" },
  dealid: { endpoint: "Deals", nameField: "Title" },
  task: { endpoint: "Tasks", nameField: "Title" },
  taskid: { endpoint: "Tasks", nameField: "Title" },
  product: { endpoint: "Products", nameField: "Name" },
  productid: { endpoint: "Products", nameField: "Name" },
};

// Helper functions (duplicated from main route for now)
function mapTriggerType(triggerId: number): AutomationTriggerType {
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

function mapAutomationStatus(automation: PloomesAutomation): AutomationStatus {
  if (automation.DisabledDueToError) return "error";
  if (!automation.Enabled) return "inactive";
  return "active";
}

/**
 * Busca o nome real de uma referência (User, Pipeline, etc) pelo ID
 */
async function fetchReferenceValue(fieldKey: string, valueId: number): Promise<string | null> {
  if (!valueId || !fieldKey) return null;

  // Normalizar o fieldKey para encontrar no mapeamento
  const normalizedKey = fieldKey.toLowerCase().replace(/^.*_/, ""); // Remove prefixo (ex: deal_creator -> creator)
  const referenceConfig = REFERENCE_FIELD_ENDPOINTS[normalizedKey] || REFERENCE_FIELD_ENDPOINTS[fieldKey.toLowerCase()];

  if (!referenceConfig) {
    return null; // Não é um campo de referência conhecido
  }

  try {
    const response = await fetch(`${PLOOMES_API_BASE}/${referenceConfig.endpoint}?$filter=Id eq ${valueId}&$select=${referenceConfig.nameField}`, {
      headers,
      cache: "no-cache",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.value && data.value.length > 0) {
        return data.value[0][referenceConfig.nameField] || null;
      }
    }
  } catch (error) {
    console.warn(`Erro ao buscar referência ${fieldKey} com ID ${valueId}:`, error);
  }

  return null;
}

/**
 * Busca detalhes de campos relacionados aos filtros
 */
async function fetchFieldDetails(fieldKeys: string[]): Promise<Map<string, any>> {
  const fieldDetailsMap = new Map<string, any>();

  if (fieldKeys.length === 0) return fieldDetailsMap;

  try {
    // Criar filtro para buscar todos os campos de uma vez
    const fieldFilter = fieldKeys.map((key) => `Key eq '${key}'`).join(" or ");
    const fieldsResponse = await fetch(`${PLOOMES_API_BASE}/Fields?$filter=${encodeURIComponent(fieldFilter)}&$expand=Type,Entity`, {
      headers,
      cache: "no-cache",
    });

    if (fieldsResponse.ok) {
      const fieldsData = await fieldsResponse.json();
      if (fieldsData.value) {
        fieldsData.value.forEach((field: any) => {
          fieldDetailsMap.set(field.Key, field);
        });
      }
    }
  } catch (error) {
    console.warn("Erro ao buscar detalhes dos campos:", error);
  }

  return fieldDetailsMap;
}

/**
 * Interpreta filtros complexos usando os novos utilitários
 */
async function interpretComplexFilter(
  filterDetails: any,
  fieldDetailsMap: Map<string, any>
): Promise<{
  filterConditions: string[];
  filterCriteria: InterpretedFilterCriteria[];
  filterExpression?: string;
  filterLogic?: {
    hasMultipleGroups: boolean;
    groupsWithMultipleCriteria: number[];
    logicDescription: string;
  };
}> {
  const criteria: InterpretedFilterCriteria[] = [];
  let filterExpression: string | undefined;

  // Tentar extrair de FilterUrl primeiro
  if (filterDetails.FilterUrl || filterDetails.Url) {
    const url = filterDetails.FilterUrl || filterDetails.Url;
    const urlMatch = url.match(/\$filter=([^&]+)/);
    if (urlMatch) {
      filterExpression = decodeURIComponent(urlMatch[1]);
    }
  }

  // Se não tem FilterUrl, tentar usar Criteria diretamente
  if (!filterExpression && filterDetails.Criteria) {
    filterExpression = filterDetails.Criteria;
  }

  // Processar campos do filtro se disponíveis
  console.log('[interpretComplexFilter] filterDetails.Fields:', filterDetails.Fields?.length || 0);

  if (filterDetails.Fields && Array.isArray(filterDetails.Fields)) {
    for (const filterField of filterDetails.Fields) {
      const fieldKey = filterField.FieldKey || filterField.Key;
      const fieldDetails = fieldKey ? fieldDetailsMap.get(fieldKey) : null;

      console.log('[interpretComplexFilter] Processing field:', {
        fieldKey,
        hasValues: !!filterField.Values,
        valuesLength: filterField.Values?.length || 0
      });

      // Determinar nome da entidade
      let entityName = "";
      if (fieldDetails?.Entity?.Name) {
        entityName = fieldDetails.Entity.Name;
      } else if (fieldDetails?.EntityId) {
        entityName = getEntityName(fieldDetails.EntityId);
      } else if (filterField.EntityId) {
        entityName = getEntityName(filterField.EntityId);
      }

      const interpretedCriteria = interpretFilterField(filterField, fieldDetails, entityName);

      // Se o valor parece ser um ID numérico e o campo é uma referência, buscar o nome real
      if (filterField.Values && Array.isArray(filterField.Values) && filterField.Values.length > 0) {
        const firstValue = filterField.Values[0];
        const intValue = firstValue.IntegerValue;

        // Debug: ver o que está vindo nos Values
        console.log('[interpretComplexFilter] DEBUG filterField:', {
          fieldKey,
          Values: filterField.Values,
          intValue,
          interpretedValue: interpretedCriteria.value
        });

        if (intValue && fieldKey) {
          const realName = await fetchReferenceValue(fieldKey, intValue);
          if (realName) {
            console.log('[interpretComplexFilter] Resolved ID:', { fieldKey, intValue, realName });
            interpretedCriteria.value = realName;
          } else {
            console.log('[interpretComplexFilter] Could not resolve ID:', { fieldKey, intValue });
          }
        }
      } else {
        console.log('[interpretComplexFilter] No Values found for field:', fieldKey);
      }

      criteria.push(interpretedCriteria);
    }
  }

  // Processar condições de filtro
  let filterConditions: string[] = [];
  let filterLogic;

  if (criteria.length > 0) {
    // Já temos critérios interpretados dos Fields - usar eles
    const groupResult = groupFilterCriteria(criteria);
    filterConditions = groupResult.conditions;
    filterLogic = analyzeFilterLogic(criteria);

    // TAMBÉM processar a expressão OData se disponível para pegar IDs extras
    if (filterExpression) {
      const parsedOData = parseODataFilter(filterExpression);

      // Resolver IDs da expressão OData
      const resolvedFromExpression = await Promise.all(
        parsedOData.map(async (criterion) => {
          let displayValue = criterion.value;

          if (criterion.isNumericId) {
            const realName = await fetchReferenceValue(criterion.field, parseInt(criterion.value));
            if (realName) {
              displayValue = realName;
            }
          }

          return `${criterion.field} → ${criterion.operation} → ${displayValue}`;
        })
      );

      // Adicionar condições da expressão OData que não estão nos Fields
      filterConditions = [...filterConditions, ...resolvedFromExpression];
    }
  } else if (filterExpression) {
    // Usar o novo parser que retorna array de objetos
    const parsedOData = parseODataFilter(filterExpression);

    // Resolver IDs numéricos para nomes reais
    const resolvedConditions = await Promise.all(
      parsedOData.map(async (criterion) => {
        let displayValue = criterion.value;

        // Se é um ID numérico, tentar buscar o nome real
        if (criterion.isNumericId) {
          const realName = await fetchReferenceValue(criterion.field, parseInt(criterion.value));
          if (realName) {
            displayValue = realName;
          }
        }

        return `${criterion.field} → ${criterion.operation} → ${displayValue}`;
      })
    );

    filterConditions = resolvedConditions;
  } else {
    filterConditions = [filterDetails.Name || "Filtro personalizado"];
  }

  return {
    filterConditions,
    filterCriteria: criteria,
    filterExpression,
    filterLogic,
  };
}

async function transformPloomesAutomation(
  ploomesAutomation: PloomesAutomation,
  filterDetails?: any,
  stageDetails?: any,
  fieldDetailsMap?: Map<string, any>
): Promise<
  Automation & {
    // Extended fields for details panel
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
    executionHistory?: AutomationExecution[];
    dependencies?: {
      id: number;
      name: string;
      type: string;
    }[];
  }
> {
  // Usar a nova interpretação inteligente de filtros
  let filterName: string | undefined = undefined;
  let filterExpression: string | undefined = undefined;
  let filterCriteria: InterpretedFilterCriteria[] | undefined = undefined;
  let filterConditions: string[] | undefined = undefined;
  let filterLogic: { hasMultipleGroups: boolean; groupsWithMultipleCriteria: number[]; logicDescription: string } | undefined = undefined;

  // Verificar se temos detalhes do filtro
  if (ploomesAutomation.TriggerFilterId && filterDetails) {
    filterName = filterDetails.Name || "Filtro Personalizado";

    // Usar a nova função de interpretação (agora é async)
    const interpretation = await interpretComplexFilter(filterDetails, fieldDetailsMap || new Map());
    filterCriteria = interpretation.filterCriteria;
    filterExpression = interpretation.filterExpression;
    filterConditions = interpretation.filterConditions;
    filterLogic = interpretation.filterLogic;
  } else if (ploomesAutomation.TriggerFilterId) {
    // Se não conseguimos buscar detalhes, mas temos o ID
    filterName = "Filtro Personalizado";
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
    updater: ploomesAutomation.Updater?.Name,
    lastUpdateDate: ploomesAutomation.LastUpdateDate || undefined,
    actions: ploomesAutomation.Actions?.map((action) => ({
      id: action.Id,
      name: action.Name,
      type: action.TypeId?.toString() || "unknown",
      parameters: action.Parameters,
    })),
    description: ploomesAutomation.TriggerDealStageId ? `Estágio específico: ${ploomesAutomation.TriggerDealStageId}` : undefined,
    // Extended fields
    triggerConditions: `Entidade: ${getEntityName(ploomesAutomation.EntityId)}, Trigger: ${getTriggerName(ploomesAutomation.TriggerId)}`,
    filterName,
    filterId: ploomesAutomation.TriggerFilterId,
    filterConditions,
    filterExpression,
    filterCriteria,
    filterLogic,
    stageId: ploomesAutomation.TriggerDealStageId,
    stageName: stageDetails?.Name,
    executionHistory: ploomesAutomation.LastRunTime
      ? [
          {
            date: ploomesAutomation.LastRunTime,
            status: ploomesAutomation.DisabledDueToError ? "error" : "success",
            message: ploomesAutomation.DisabledDueToError ? "Automação desabilitada devido a erro" : "Execução realizada com sucesso",
          },
        ]
      : undefined,
    dependencies: ploomesAutomation.Actions?.map((action) => ({
      id: action.Id,
      name: action.Name,
      type: `Ação ${action.TypeId || "Desconhecida"}`,
    })),
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const automationId = parseInt(id);

    if (isNaN(automationId)) {
      return NextResponse.json({ error: "ID da automação inválido" }, { status: 400 });
    }

    // A API Ploomes retorna uma collection OData mesmo para uma única automação
    // Então vamos fazer uma query filtrada ao invés de buscar por ID diretamente
    const response = await fetch(
      `${PLOOMES_API_BASE}/Automations?$filter=Id eq ${automationId}&$expand=Entity,Trigger,Actions,Creator,TriggerFilter,Updater`,
      {
        headers,
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Automação não encontrada" }, { status: 404 });
      }

      throw new Error(`API Ploomes returned ${response.status}: ${response.statusText}`);
    }

    const responseData: PloomesAutomationsResponse = await response.json();

    // Verificar se encontrou a automação
    if (!responseData.value || responseData.value.length === 0) {
      return NextResponse.json({ error: "Automação não encontrada" }, { status: 404 });
    }

    const ploomesAutomation = responseData.value[0];

    // Buscar detalhes do filtro se existir
    let filterDetails = null;
    let stageDetails = null;
    let fieldDetailsMap: Map<string, any> = new Map();

    if (ploomesAutomation.TriggerFilterId) {
      try {
        // Primeiro tentar buscar o filtro específico com campos expandidos
        const filterResponse = await fetch(
          `${PLOOMES_API_BASE}/Filters?$filter=Id eq ${ploomesAutomation.TriggerFilterId}&$expand=Fields($expand=FieldPath,Values)`,
          {
            headers,
            cache: "no-cache",
          }
        );

        if (filterResponse.ok) {
          const filterData = await filterResponse.json();
          if (filterData.value && filterData.value.length > 0) {
            filterDetails = filterData.value[0];

            // Extrair chaves de campos para buscar detalhes
            const fieldKeys: string[] = [];
            if (filterDetails.Fields && Array.isArray(filterDetails.Fields)) {
              filterDetails.Fields.forEach((field: any) => {
                const fieldKey = field.FieldKey || field.Key;
                if (fieldKey && !fieldKeys.includes(fieldKey)) {
                  fieldKeys.push(fieldKey);
                }
              });
            }

            // Buscar detalhes dos campos relacionados
            if (fieldKeys.length > 0) {
              fieldDetailsMap = await fetchFieldDetails(fieldKeys);
            }
          }
        }
      } catch (filterError) {
        console.warn(`Erro ao buscar filtro ${ploomesAutomation.TriggerFilterId}:`, filterError);
      }
    }

    // Buscar detalhes do estágio se existir
    if (ploomesAutomation.TriggerDealStageId) {
      try {
        const stageResponse = await fetch(`${PLOOMES_API_BASE}/DealStages?$filter=Id eq ${ploomesAutomation.TriggerDealStageId}`, {
          headers,
          cache: "no-cache",
        });

        if (stageResponse.ok) {
          const stageData = await stageResponse.json();
          if (stageData.value && stageData.value.length > 0) {
            stageDetails = stageData.value[0];
          }
        }
      } catch (stageError) {
        console.warn(`Erro ao buscar estágio ${ploomesAutomation.TriggerDealStageId}:`, stageError);
      }
    }

    // Transformar automação incluindo detalhes do filtro, estágio e campos
    const transformedAutomation = await transformPloomesAutomation(ploomesAutomation, filterDetails, stageDetails, fieldDetailsMap);

    return NextResponse.json(transformedAutomation);
  } catch (error) {
    const { id } = await params;
    console.error(`Erro ao buscar automação ${id}:`, error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
