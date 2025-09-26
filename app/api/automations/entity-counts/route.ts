import { NextResponse } from "next/server";
import type { PloomesAutomationsResponse } from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

interface EntityCount {
  entityId: number;
  entityName: string;
  count: number;
}

export async function GET(request: Request) {
  try {
    // Buscar todas as automações para contar por entidade
    const automationsQuery = `Automations?$select=EntityId,Entity&$expand=Entity&$top=2000`;

    const response = await fetch(`${PLOOMES_API_BASE}/${automationsQuery}`, {
      headers,
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Ploomes API error: ${response.status} ${response.statusText}`);
    }

    const data: PloomesAutomationsResponse = await response.json();

    if (!data.value) {
      return NextResponse.json({ entityCounts: {} });
    }

    // Contar automações por entidade
    const entityCounts: Record<number, EntityCount> = {};

    data.value.forEach((automation) => {
      const entityId = automation.EntityId;
      const entityName = automation.Entity?.Name || 'Desconhecido';

      if (!entityCounts[entityId]) {
        entityCounts[entityId] = {
          entityId,
          entityName,
          count: 0
        };
      }

      entityCounts[entityId].count++;
    });

    // Converter para formato simples
    const counts: Record<number, number> = {};
    Object.values(entityCounts).forEach(({ entityId, count }) => {
      counts[entityId] = count;
    });

    return NextResponse.json({
      entityCounts: counts,
      totalAutomations: data.value.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error fetching automation entity counts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch automation entity counts",
        message: getErrorMessage(error),
        entityCounts: {}
      },
      { status: 500 }
    );
  }
}