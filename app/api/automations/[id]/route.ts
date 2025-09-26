import { NextResponse } from "next/server";
import type {
  PloomesAutomationsResponse,
  PloomesAutomation,
  Automation,
  AutomationTriggerType,
  AutomationStatus,
} from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";
import {
  getEntityName,
  getTriggerName,
  interpretFilterField,
  groupFilterCriteria,
  parseODataFilter,
  type InterpretedFilterCriteria
} from "@/lib/ploomes-mappings";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

// Helper functions (duplicated from main route for now)
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

/**
 * Busca detalhes de campos relacionados aos filtros
 */
async function fetchFieldDetails(fieldKeys: string[]): Promise<Map<string, any>> {
  const fieldDetailsMap = new Map<string, any>();

  if (fieldKeys.length === 0) return fieldDetailsMap;

  try {
    // Criar filtro para buscar todos os campos de uma vez
    const fieldFilter = fieldKeys.map(key => `Key eq '${key}'`).join(' or ');
    const fieldsResponse = await fetch(
      `${PLOOMES_API_BASE}/Fields?$filter=${encodeURIComponent(fieldFilter)}&$expand=Type,Entity`,
      {
        headers,
        cache: "no-cache",
      }
    );

    if (fieldsResponse.ok) {
      const fieldsData = await fieldsResponse.json();
      if (fieldsData.value) {
        fieldsData.value.forEach((field: any) => {
          fieldDetailsMap.set(field.Key, field);
        });
      }
    }
  } catch (error) {
    console.warn('Erro ao buscar detalhes dos campos:', error);
  }

  return fieldDetailsMap;
}

/**
 * Interpreta filtros complexos usando os novos utilitários
 */
function interpretComplexFilter(filterDetails: any, fieldDetailsMap: Map<string, any>): {
  filterConditions: string[];
  filterCriteria: InterpretedFilterCriteria[];
  filterExpression?: string;
} {
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
  if (filterDetails.Fields && Array.isArray(filterDetails.Fields)) {
    filterDetails.Fields.forEach((filterField: any) => {
      const fieldKey = filterField.FieldKey || filterField.Key;
      const fieldDetails = fieldKey ? fieldDetailsMap.get(fieldKey) : null;

      // Determinar nome da entidade
      let entityName = '';
      if (fieldDetails?.Entity?.Name) {
        entityName = fieldDetails.Entity.Name;
      } else if (fieldDetails?.EntityId) {
        entityName = getEntityName(fieldDetails.EntityId);
      } else if (filterField.EntityId) {
        entityName = getEntityName(filterField.EntityId);
      }

      const interpretedCriteria = interpretFilterField(
        filterField,
        fieldDetails,
        entityName
      );

      criteria.push(interpretedCriteria);
    });
  }

  // Se não conseguimos interpretar pelos campos, tentar pela expressão
  let filterConditions: string[] = [];
  if (criteria.length > 0) {
    filterConditions = groupFilterCriteria(criteria);
  } else if (filterExpression) {
    filterConditions = parseODataFilter(filterExpression);
  } else {
    filterConditions = [filterDetails.Name || 'Filtro personalizado'];
  }

  return {
    filterConditions,
    filterCriteria: criteria,
    filterExpression
  };
}

function transformPloomesAutomation(
  ploomesAutomation: PloomesAutomation,
  filterDetails?: any,
  stageDetails?: any,
  fieldDetailsMap?: Map<string, any>
): Automation & {
  // Extended fields for details panel
  triggerConditions?: string;
  filterConditions?: string[];
  filterName?: string;
  filterId?: number;
  filterExpression?: string;
  filterCriteria?: InterpretedFilterCriteria[];
  stageId?: number;
  stageName?: string;
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
} {
  // Usar a nova interpretação inteligente de filtros
  let filterConditions: string[] | undefined = undefined;
  let filterName: string | undefined = undefined;
  let filterExpression: string | undefined = undefined;
  let filterCriteria: InterpretedFilterCriteria[] | undefined = undefined;

  // Verificar se temos detalhes do filtro
  if (ploomesAutomation.TriggerFilterId && filterDetails) {
    filterName = filterDetails.Name || "Filtro Personalizado";

    // Usar a nova função de interpretação
    const interpretation = interpretComplexFilter(filterDetails, fieldDetailsMap || new Map());
    filterConditions = interpretation.filterConditions;
    filterCriteria = interpretation.filterCriteria;
    filterExpression = interpretation.filterExpression;

  } else if (ploomesAutomation.TriggerFilterId) {
    // Se não conseguimos buscar detalhes, mas temos o ID
    filterConditions = ["Filtro Personalizado"];
    filterName = "Filtro Personalizado";
  }

  // Adicionar condições de estágio se existir
  if (ploomesAutomation.TriggerDealStageId) {
    const stageCondition = `Estágio específico: ${ploomesAutomation.TriggerDealStageId}`;
    if (filterConditions) {
      filterConditions.push(stageCondition);
    } else {
      filterConditions = [stageCondition];
    }
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
    actions: ploomesAutomation.Actions?.map(action => ({
      id: action.Id,
      name: action.Name,
      type: action.TypeId?.toString() || 'unknown',
      parameters: action.Parameters
    })),
    description: ploomesAutomation.TriggerDealStageId ?
      `Estágio específico: ${ploomesAutomation.TriggerDealStageId}` :
      undefined,
    // Extended fields
    triggerConditions: `Entidade: ${getEntityName(ploomesAutomation.EntityId)}, Trigger: ${getTriggerName(ploomesAutomation.TriggerId)}`,
    filterConditions,
    filterName,
    filterId: ploomesAutomation.TriggerFilterId,
    filterExpression,
    filterCriteria,
    stageId: ploomesAutomation.TriggerDealStageId,
    stageName: stageDetails?.Name,
    executionHistory: ploomesAutomation.LastRunTime ? [{
      date: ploomesAutomation.LastRunTime,
      status: ploomesAutomation.DisabledDueToError ? "error" : "success",
      message: ploomesAutomation.DisabledDueToError ? "Automação desabilitada devido a erro" : "Execução realizada com sucesso"
    }] : undefined,
    dependencies: ploomesAutomation.Actions?.map(action => ({
      id: action.Id,
      name: action.Name,
      type: `Ação ${action.TypeId || 'Desconhecida'}`
    }))
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const automationId = parseInt(id);
    
    if (isNaN(automationId)) {
      return NextResponse.json(
        { error: "ID da automação inválido" },
        { status: 400 }
      );
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
        return NextResponse.json(
          { error: "Automação não encontrada" },
          { status: 404 }
        );
      }
      
      throw new Error(`API Ploomes returned ${response.status}: ${response.statusText}`);
    }

    const responseData: PloomesAutomationsResponse = await response.json();
    
    // Verificar se encontrou a automação
    if (!responseData.value || responseData.value.length === 0) {
      return NextResponse.json(
        { error: "Automação não encontrada" },
        { status: 404 }
      );
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
          `${PLOOMES_API_BASE}/Filters?$filter=Id eq ${ploomesAutomation.TriggerFilterId}&$expand=Fields($expand=FieldPath)`,
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
        const stageResponse = await fetch(
          `${PLOOMES_API_BASE}/DealStages?$filter=Id eq ${ploomesAutomation.TriggerDealStageId}`,
          {
            headers,
            cache: "no-cache",
          }
        );
        
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
    const transformedAutomation = transformPloomesAutomation(ploomesAutomation, filterDetails, stageDetails, fieldDetailsMap);

    return NextResponse.json(transformedAutomation);
  } catch (error) {
    const { id } = await params;
    console.error(`Erro ao buscar automação ${id}:`, error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}