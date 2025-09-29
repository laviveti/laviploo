import { NextResponse } from "next/server";
import type {
  AutomationsData,
  Automation,
  Integration,
  IntegrationBehavior,
  PloomesAutomationsResponse,
  PloomesAutomation,
  AutomationTriggerType,
  AutomationStatus,
  AutomationEntityType,
  PloomesIntegrationResponse,
  PloomesBehaviorResponse,
  PloomesMailChimpResponse,
  PloomesDealsResponse,
  PloomesTasksResponse
} from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";

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

function transformPloomesAutomation(ploomesAutomation: PloomesAutomation): Automation {
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
      undefined
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const expand = url.searchParams.get('expand') === 'true';
    const entityFilter = url.searchParams.get('entity');
    const statusFilter = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const createdBy = url.searchParams.get('createdBy');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const genericFilter = url.searchParams.get('generic') === 'true';

    // Build automations query with OData parameters
    let automationsQuery = `Automations?$top=${limit}&$skip=${skip}&$orderby=CreateDate desc`;

    if (expand) {
      automationsQuery += '&$expand=Entity,Trigger,Actions,Creator';
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

    if (search) {
      filterConditions.push(`contains(tolower(Name), tolower('${search.replace(/'/g, "''")}')}`);
    }

    if (dateFrom) {
      filterConditions.push(`CreateDate ge ${dateFrom}T00:00:00Z`);
    }

    if (dateTo) {
      filterConditions.push(`CreateDate le ${dateTo}T23:59:59Z`);
    }

    if (filterConditions.length > 0) {
      automationsQuery += `&$filter=${filterConditions.join(' and ')}`;
    }

    // Build count query (same filters but with $count=true and $top=0)
    let countQuery = automationsQuery
      .replace(`$top=${limit}&$skip=${skip}`, '$count=true&$top=0')
      .replace('&$expand=Entity,Trigger,Actions,Creator', ''); // Remove expand for count query

    // Fetch all data in parallel
    const [
      automationsResponse,
      countResponse,
      integrationsResponse,
      rdStationBehaviorsResponse,
      reevBehaviorsResponse,
      mailChimpResponse,
      dealsResponse,
      tasksResponse
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
      })
    ]);

    const automations: Automation[] = [];
    const integrations: Integration[] = [];
    const behaviors: IntegrationBehavior[] = [];
    let totalAutomationsCount = 0;

    // Process count response
    if (countResponse.status === "fulfilled" && countResponse.value.ok) {
      const countData = await countResponse.value.json();
      totalAutomationsCount = countData['@odata.count'] || 0;
    }

    // Process real automations
    if (automationsResponse.status === "fulfilled" && automationsResponse.value.ok) {
      const data: PloomesAutomationsResponse = await automationsResponse.value.json();

      let filteredAutomations = data.value || [];

      // Entity and generic filters are now handled at OData level for better pagination
      // Only apply status filter locally since it's not handled in OData

      if (statusFilter) {
        filteredAutomations = filteredAutomations.filter(a => {
          const status = mapAutomationStatus(a);
          return status === statusFilter;
        });
      }

      // Transform to UI format
      filteredAutomations.forEach(automation => {
        automations.push(transformPloomesAutomation(automation));
      });
    }

    // Process integrations (existing logic)
    if (integrationsResponse.status === "fulfilled" && integrationsResponse.value.ok) {
      const data: PloomesIntegrationResponse = await integrationsResponse.value.json();

      data.value?.forEach(item => {
        integrations.push({
          id: item.Integration.Id,
          name: item.Integration.Name,
          status: 'Connected',
          fields: item.Integration.Fields?.map(field => ({
            id: field.Id,
            name: field.Name,
            type: field.Type
          }))
        });
      });
    }

    // Process behaviors (existing logic)
    if (rdStationBehaviorsResponse.status === "fulfilled" && rdStationBehaviorsResponse.value.ok) {
      const data: PloomesBehaviorResponse = await rdStationBehaviorsResponse.value.json();

      data.value?.forEach(behavior => {
        behaviors.push({
          id: behavior.Id,
          name: behavior.Name,
          description: behavior.DealStageIdRequired ? 'Requer estágio da oportunidade' : 'Configuração padrão',
          isActive: true,
          integrationName: 'RD Station'
        });
      });
    }

    if (reevBehaviorsResponse.status === "fulfilled" && reevBehaviorsResponse.value.ok) {
      const data: PloomesBehaviorResponse = await reevBehaviorsResponse.value.json();

      data.value?.forEach(behavior => {
        behaviors.push({
          id: behavior.Id,
          name: behavior.Name,
          description: behavior.DealStageIdRequired ? 'Requer estágio da oportunidade' : 'Configuração padrão',
          isActive: true,
          integrationName: 'Reev'
        });
      });
    }

    // Process MailChimp
    if (mailChimpResponse.status === "fulfilled" && mailChimpResponse.value.ok) {
      const data: PloomesMailChimpResponse = await mailChimpResponse.value.json();

      integrations.push({
        id: 999,
        name: 'MailChimp',
        status: (data.value && data.value.length > 0) ? 'Connected' : 'Disconnected'
      });
    }

    // Calculate comprehensive stats
    const automationsByEntity = automations.reduce((acc, automation) => {
      const entityName = automation.entityName || 'Desconhecido';
      acc[entityName] = (acc[entityName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const automationsByTrigger = automations.reduce((acc, automation) => {
      const triggerName = automation.triggerName || 'Desconhecido';
      acc[triggerName] = (acc[triggerName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Since we're now using OData filtering, use the count query result directly
    const actualTotalCount = totalAutomationsCount > 0 ? totalAutomationsCount : automations.length;

    const stats = {
      totalAutomations: actualTotalCount,
      activeAutomations: automations.filter(a => a.status === 'active').length,
      totalIntegrations: integrations.length,
      activeIntegrations: integrations.filter(i => i.status === 'Connected').length,
      totalBehaviors: behaviors.length,
      activeBehaviors: behaviors.filter(b => b.isActive).length,
      automationsByEntity,
      automationsByTrigger
    };

    const automationsData: AutomationsData = {
      automations,
      integrations,
      behaviors,
      stats
    };

    return NextResponse.json(automationsData);
  } catch (error) {
    console.error("Erro ao buscar automações:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}