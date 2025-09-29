import { NextResponse } from "next/server";
import type { PloomesAutomationsResponse, PloomesAutomation } from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

export async function GET() {
  try {
    // Fetch all automations to count by entity
    const response = await fetch(`${PLOOMES_API_BASE}/Automations?$expand=Entity,Trigger`, {
      headers,
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch automations: ${response.statusText}`);
    }

    const data: PloomesAutomationsResponse = await response.json();
    const automations = data.value || [];

    // Count automations by entity
    const entityCounts: Record<number, { total: number; active: number }> = {};
    let genericCount = { total: 0, active: 0 };
    let totalCount = 0;

    automations.forEach((automation: PloomesAutomation) => {
      totalCount++;
      
      const isActive = automation.Enabled && !automation.DisabledDueToError;
      
      if (automation.EntityId) {
        // Automação pertence a uma entidade específica
        if (!entityCounts[automation.EntityId]) {
          entityCounts[automation.EntityId] = { total: 0, active: 0 };
        }
        entityCounts[automation.EntityId].total++;
        if (isActive) {
          entityCounts[automation.EntityId].active++;
        }
      } else {
        // Automação sem EntityId é considerada genérica
        genericCount.total++;
        if (isActive) {
          genericCount.active++;
        }
      }
    });

    return NextResponse.json({
      entityCounts,
      genericCount,
      totalCount,
      nonGenericCount: totalCount - genericCount
    });
  } catch (error) {
    console.error("Erro ao buscar contagens de entidades:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}