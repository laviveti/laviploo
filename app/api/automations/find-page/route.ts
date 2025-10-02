import { NextResponse } from "next/server";
import type { PloomesAutomationsResponse } from "@/types/automations";
import { getPloomesFilter } from "@/constants/automation-entities";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  Accept: "application/json",
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const automationId = url.searchParams.get("automationId");
    const visualEntityId = url.searchParams.get("entityId"); // IMPORTANTE: Agora é ID visual, não EntityId do Ploomes
    const perPage = parseInt(url.searchParams.get("perPage") || "10");

    // Capturar TODOS os filtros adicionais
    const statusFilter = url.searchParams.get("status");
    const searchFilter = url.searchParams.get("search");
    const createdByFilter = url.searchParams.get("createdBy");
    const dateFromFilter = url.searchParams.get("dateFrom");
    const dateToFilter = url.searchParams.get("dateTo");
    const genericFilter = url.searchParams.get("generic") === "true";

    if (!automationId) {
      return NextResponse.json({ error: "automationId is required" }, { status: 400 });
    }

    // Converter ID visual para filtro do Ploomes usando mapeamento centralizado
    const entityIdNum = visualEntityId ? parseInt(visualEntityId) : null;
    const entityFilter = getPloomesFilter(entityIdNum);

    // Build OData $filter conditions (mesma lógica do /api/automations)
    const filterConditions: string[] = [];

    // Aplicar filtro de entidade
    if (entityFilter) {
      filterConditions.push(entityFilter);
    }

    // Aplicar filtro genérico
    if (genericFilter) {
      filterConditions.push(`(EntityId eq null or (EntityId eq 2 and TriggerDealStageId eq null))`);
    }

    // Aplicar filtro de busca
    if (searchFilter) {
      filterConditions.push(`contains(tolower(Name), tolower('${searchFilter.replace(/'/g, "''")}'))`);
    }

    // Aplicar filtro de data
    if (dateFromFilter) {
      filterConditions.push(`CreateDate ge ${dateFromFilter}T00:00:00Z`);
    }

    if (dateToFilter) {
      filterConditions.push(`CreateDate le ${dateToFilter}T23:59:59Z`);
    }

    // Construir query OData
    const filterQuery = filterConditions.length > 0 ? `$filter=${filterConditions.join(" and ")}&` : "";

    // Fetch all automation IDs with the same filters
    // IMPORTANTE: Usar mesma ordenação que /api/automations ($orderby=CreateDate desc)
    const query = `Automations?${filterQuery}$select=Id,TriggerDealStageId,CreateDate,Enabled,DisabledDueToError&$orderby=CreateDate desc&$top=1000`;

    const response = await fetch(`${PLOOMES_API_BASE}/${query}`, {
      headers,
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Ploomes API error: ${response.status}`);
    }

    const data: PloomesAutomationsResponse = await response.json();

    // Aplicar filtros locais (que não podem ser aplicados no OData)
    let automations = data.value || [];

    // Filtro de status (aplicado localmente)
    if (statusFilter) {
      automations = automations.filter((a) => {
        let status: string;
        if (a.DisabledDueToError) {
          status = "error";
        } else if (!a.Enabled) {
          status = "inactive";
        } else {
          status = "active";
        }
        return status === statusFilter;
      });
    }

    // Filtro de criador (aplicado localmente, se fornecido)
    if (createdByFilter) {
      automations = automations.filter((a) => a.Creator?.Id?.toString() === createdByFilter);
    }

    const automationIds = automations.map((a) => a.Id);

    // Find index of target automation
    const index = automationIds.findIndex((id) => id === parseInt(automationId));

    if (index === -1) {
      return NextResponse.json({ error: "Automation not found in current context" }, { status: 404 });
    }

    // Calculate page (1-indexed)
    const page = Math.floor(index / perPage) + 1;

    return NextResponse.json({
      page,
      index,
      total: automationIds.length,
      perPage,
    });
  } catch (error) {
    console.error("Error finding automation page:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
