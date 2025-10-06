import { NextResponse } from "next/server";
import type {
  PloomesAutomationsResponse,
  PloomesAutomation,
  Automation,
  FilterCondition,
  AutomationExecution,
} from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";
import { mapTriggerType, mapAutomationStatus, getTriggerName } from "@/lib/automations";
import {
  getEntityName,
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
    // Criar filtro para buscar todos os campos de uma vez, incluindo as opções
    const fieldFilter = fieldKeys.map((key) => `Key eq '${key}'`).join(" or ");
    const fieldsResponse = await fetch(`${PLOOMES_API_BASE}/Fields?$filter=${encodeURIComponent(fieldFilter)}&$expand=Type,Entity,OptionsTable($expand=Options)`, {
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
 * Busca o valor legível de uma opção de campo customizado
 */
function getFieldOptionValue(fieldDetails: any, optionId: number): string | null {
  if (!fieldDetails?.OptionsTable?.Options || !Array.isArray(fieldDetails.OptionsTable.Options)) {
    return null;
  }

  const option = fieldDetails.OptionsTable.Options.find((opt: any) => opt.Id === optionId);
  return option?.Name || null;
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

      // Se o valor parece ser um ID numérico, tentar resolver
      if (filterField.Values && Array.isArray(filterField.Values) && filterField.Values.length > 0) {
        const firstValue = filterField.Values[0];
        const intValue = firstValue.IntegerValue;

        if (intValue && fieldKey) {
          // Primeiro tentar resolver como opção de campo customizado
          let resolved = false;

          if (fieldDetails) {
            const optionValue = getFieldOptionValue(fieldDetails, intValue);
            if (optionValue) {
              interpretedCriteria.value = optionValue;
              resolved = true;
            }
          }

          // Se não achou nas opções, tentar como referência direta
          if (!resolved) {
            const realName = await fetchReferenceValue(fieldKey, intValue);
            if (realName) {
              interpretedCriteria.value = realName;
            }
          }
        }
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

/**
 * Interpreta parâmetros de uma Action
 * Na API Ploomes, os parâmetros podem vir:
 * 1. Como propriedades diretas (FieldKey, StringValue, IntegerValue, etc)
 * 2. Dentro de RequestBody (JSON string) para ações como Criar Tarefa, Criar Negócio, etc
 */
async function interpretActionParameters(
  action: any,
  fieldDetailsMap: Map<string, any>
): Promise<any[]> {
  const interpretedParams = [];

  // Se tem RequestBody, parsear os parâmetros de lá
  if (action.RequestBody) {
    try {
      const requestBody = JSON.parse(action.RequestBody);

      // Extrair campos relevantes baseado no tipo de ação
      // ActionId 5 = Criar tarefa
      if (action.ActionId === 5) {
        if (requestBody.Users && Array.isArray(requestBody.Users) && requestBody.Users.length > 0) {
          interpretedParams.push({
            id: `${action.Id}-users`,
            actionId: action.ActionId,
            fieldKey: 'users',
            fieldName: 'Usuários',
            value: requestBody.Users.map((u: any) => u.Name).join(', '),
            valueType: 'reference',
            fillType: 'Valor estático',
          });
        }

        if (requestBody.Type) {
          interpretedParams.push({
            id: `${action.Id}-type`,
            actionId: action.ActionId,
            fieldKey: 'type',
            fieldName: 'Tipo',
            value: requestBody.Type.Name || requestBody.Type.display,
            valueType: 'reference',
            fillType: 'Valor estático',
          });
        }

        if (requestBody.Title) {
          interpretedParams.push({
            id: `${action.Id}-title`,
            actionId: action.ActionId,
            fieldKey: 'title',
            fieldName: 'Título',
            value: requestBody.Title,
            valueType: 'string',
            fillType: 'Valor estático',
          });
        }

        if (requestBody.Description) {
          interpretedParams.push({
            id: `${action.Id}-description`,
            actionId: action.ActionId,
            fieldKey: 'description',
            fieldName: 'Descrição',
            value: requestBody.Description,
            valueType: 'string',
            fillType: 'Valor estático',
          });
        }

        if (requestBody.DateTime) {
          interpretedParams.push({
            id: `${action.Id}-datetime`,
            actionId: action.ActionId,
            fieldKey: 'datetime',
            fieldName: 'Data',
            value: requestBody.DateTime,
            valueType: 'datetime',
            fillType: 'Valor estático',
          });
        }
      }

      // Adicionar suporte para outros tipos de ações aqui (ActionId 8 = Criar negócio, etc)

      return interpretedParams;
    } catch (error) {
      console.warn(`Erro ao parsear RequestBody da action ${action.Id}:`, error);
    }
  }

  // Se não tem RequestBody, usar propriedades diretas (ActionId 1 = Editar dados, etc)
  let fieldName = action.FieldKey || "Campo";
  let value = "";
  let valueType: 'string' | 'integer' | 'decimal' | 'boolean' | 'datetime' | 'reference' = 'string';
  let fillType = "Valor estático";

  // Buscar detalhes do campo se disponível
  const fieldDetails = action.FieldKey ? fieldDetailsMap.get(action.FieldKey) : null;
  if (fieldDetails?.Name) {
    fieldName = fieldDetails.Name;
  }

  // Se tem ObjectValueName, usar ele diretamente (é o nome já resolvido)
  if (action.ObjectValueName) {
    value = action.ObjectValueName;
    valueType = 'reference';
    fillType = "Valor estático";
  }
  // Determinar valor e tipo dos campos de valor
  else if (action.StringValue !== undefined && action.StringValue !== null) {
    value = action.StringValue;
    valueType = 'string';
  } else if (action.BigStringValue !== undefined && action.BigStringValue !== null) {
    value = action.BigStringValue;
    valueType = 'string';
  } else if (action.IntegerValue !== undefined && action.IntegerValue !== null) {
    value = String(action.IntegerValue);
    valueType = 'integer';
  } else if (action.DecimalValue !== undefined && action.DecimalValue !== null) {
    value = String(action.DecimalValue);
    valueType = 'decimal';
  } else if (action.BoolValue !== undefined && action.BoolValue !== null) {
    value = action.BoolValue ? "Sim" : "Não";
    valueType = 'boolean';
  } else if (action.DateTimeValue !== undefined && action.DateTimeValue !== null) {
    value = action.DateTimeValue;
    valueType = 'datetime';
  }
  // Se tem FieldPathId mas não tem valor, está puxando de outro campo
  else if (action.FieldPathId) {
    value = `[Campo de origem]`;
    valueType = 'reference';
    fillType = "Puxar valor de um campo";
  }
  // Se não tem nenhum valor mas tem FieldKey, significa que está limpando o campo
  else if (action.FieldKey && action.ShouldClearFieldValues !== false) {
    value = "(Limpar valor)";
    valueType = 'string';
    fillType = "Limpar campo";
  }

  // Resolver referências específicas
  if (action.DealStageId) {
    const stageName = await fetchReferenceValue('stageid', action.DealStageId);
    value = stageName || `Estágio ${action.DealStageId}`;
    valueType = 'reference';
    fillType = "Referência (Estágio)";
    fieldName = "Estágio do negócio";
  } else if (action.UserId) {
    const userName = await fetchReferenceValue('userid', action.UserId);
    value = userName || `Usuário ${action.UserId}`;
    valueType = 'reference';
    fillType = "Referência (Usuário)";
    fieldName = "Usuário";
  } else if (action.EmailTemplateId) {
    value = `Template ${action.EmailTemplateId}`;
    valueType = 'reference';
    fillType = "Referência (Template de Email)";
    fieldName = "Template de email";
  } else if (action.TaskTypeId) {
    value = `Tipo de Tarefa ${action.TaskTypeId}`;
    valueType = 'reference';
    fillType = "Referência (Tipo de Tarefa)";
    fieldName = "Tipo de tarefa";
  } else if (action.InteractionRecordTypeId) {
    value = `Tipo de Interação ${action.InteractionRecordTypeId}`;
    valueType = 'reference';
    fillType = "Referência (Tipo de Interação)";
    fieldName = "Tipo de interação";
  }

  // Se é um campo customizado com valor inteiro, tentar resolver como opção
  if (valueType === 'integer' && action.FieldKey && fieldDetails) {
    const optionValue = getFieldOptionValue(fieldDetails, parseInt(value));
    if (optionValue) {
      value = optionValue;
      fillType = "Opção de campo";
    }
  }

  // Se tem algum valor, adicionar aos parâmetros
  if (value) {
    interpretedParams.push({
      id: action.Id,
      actionId: action.ActionId,
      fieldKey: action.FieldKey,
      fieldName,
      value,
      valueType,
      fillType,
    });
  }

  return interpretedParams;
}

async function transformPloomesAutomation(
  ploomesAutomation: PloomesAutomation,
  filterDetails?: any,
  stageName?: string,
  pipelineName?: string,
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
    actions: ploomesAutomation.Actions ? await Promise.all(
      ploomesAutomation.Actions.map(async (action) => ({
        id: action.Id,
        name: action.Name,
        type: action.ActionId?.toString() || "unknown",
        parameters: await interpretActionParameters(action, fieldDetailsMap || new Map()),
      }))
    ) : undefined,
    // Extended fields
    triggerConditions: `Entidade: ${getEntityName(ploomesAutomation.EntityId)}, Trigger: ${getTriggerName(ploomesAutomation.TriggerId)}`,
    filterName,
    filterId: ploomesAutomation.TriggerFilterId,
    filterConditions,
    filterExpression,
    filterCriteria,
    filterLogic,
    stageId: ploomesAutomation.TriggerDealStageId,
    stageName,
    triggerDealPipelineId: ploomesAutomation.TriggerDealPipelineId,
    pipelineName,
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

    // Coletar todos os fieldKeys usados (filtros + actions)
    const allFieldKeys: string[] = [];

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

            // Extrair chaves de campos do filtro
            if (filterDetails.Fields && Array.isArray(filterDetails.Fields)) {
              filterDetails.Fields.forEach((field: any) => {
                const fieldKey = field.FieldKey || field.Key;
                if (fieldKey && !allFieldKeys.includes(fieldKey)) {
                  allFieldKeys.push(fieldKey);
                }
              });
            }
          }
        }
      } catch (filterError) {
        console.warn(`Erro ao buscar filtro ${ploomesAutomation.TriggerFilterId}:`, filterError);
      }
    }

    // Extrair chaves de campos das Actions
    // Os parâmetros vêm diretamente no objeto Action, não em um array separado
    if (ploomesAutomation.Actions && Array.isArray(ploomesAutomation.Actions)) {
      ploomesAutomation.Actions.forEach((action: any) => {
        if (action.FieldKey && !allFieldKeys.includes(action.FieldKey)) {
          allFieldKeys.push(action.FieldKey);
        }
      });
    }

    // Buscar detalhes de todos os campos usados (filtros + actions)
    if (allFieldKeys.length > 0) {
      fieldDetailsMap = await fetchFieldDetails(allFieldKeys);
    }

    // Buscar apenas os dados de stage/pipeline necessários de forma otimizada
    let stageName: string | undefined;
    let pipelineName: string | undefined;

    if (ploomesAutomation.TriggerDealStageId) {
      // Buscar o stage específico
      try {
        const stageResponse = await fetch(
          `${PLOOMES_API_BASE}/Deals@Stages?$filter=Id eq ${ploomesAutomation.TriggerDealStageId}`,
          {
            headers,
            cache: "no-cache",
          }
        );

        if (stageResponse.ok) {
          const stageData = await stageResponse.json();
          if (stageData.value && stageData.value.length > 0) {
            const stage = stageData.value[0];
            stageName = stage.Name;

            // Buscar o pipeline associado ao stage
            if (stage.PipelineId) {
              try {
                const pipelineResponse = await fetch(
                  `${PLOOMES_API_BASE}/Deals@Pipelines?$filter=Id eq ${stage.PipelineId}`,
                  {
                    headers,
                    cache: "no-cache",
                  }
                );

                if (pipelineResponse.ok) {
                  const pipelineData = await pipelineResponse.json();
                  if (pipelineData.value && pipelineData.value.length > 0) {
                    pipelineName = pipelineData.value[0].Name;
                  }
                }
              } catch (pipelineError) {
                console.warn(`Erro ao buscar pipeline ${stage.PipelineId}:`, pipelineError);
              }
            }
          }
        }
      } catch (stageError) {
        console.warn(`Erro ao buscar stage ${ploomesAutomation.TriggerDealStageId}:`, stageError);
      }
    } else if (ploomesAutomation.TriggerDealPipelineId) {
      // Buscar apenas o pipeline específico
      try {
        const pipelineResponse = await fetch(
          `${PLOOMES_API_BASE}/Deals@Pipelines?$filter=Id eq ${ploomesAutomation.TriggerDealPipelineId}`,
          {
            headers,
            cache: "no-cache",
          }
        );

        if (pipelineResponse.ok) {
          const pipelineData = await pipelineResponse.json();
          if (pipelineData.value && pipelineData.value.length > 0) {
            pipelineName = pipelineData.value[0].Name;
          }
        }
      } catch (pipelineError) {
        console.warn(`Erro ao buscar pipeline ${ploomesAutomation.TriggerDealPipelineId}:`, pipelineError);
      }
    }

    // Transformar automação incluindo detalhes do filtro, stage/pipeline names e campos
    const transformedAutomation = await transformPloomesAutomation(ploomesAutomation, filterDetails, stageName, pipelineName, fieldDetailsMap);

    return NextResponse.json(transformedAutomation);
  } catch (error) {
    const { id } = await params;
    console.error(`Erro ao buscar automação ${id}:`, error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
