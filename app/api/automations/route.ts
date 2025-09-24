import { NextResponse } from "next/server";
import type {
  AutomationsData,
  Integration,
  IntegrationBehavior,
  PloomesIntegrationResponse,
  PloomesBehaviorResponse,
  PloomesMailChimpResponse
} from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";

const PLOOMES_API_BASE = "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Content-Type": "application/json",
};

export async function GET() {
  try {
    const [
      integrationsResponse,
      rdStationBehaviorsResponse,
      reevBehaviorsResponse,
      mailChimpResponse
    ] = await Promise.allSettled([
      fetch(`${PLOOMES_API_BASE}/Account@Integrations?$expand=Integration($expand=Fields)`, {
        headers,
        cache: "no-cache",
      }),
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
      })
    ]);

    const integrations: Integration[] = [];
    const behaviors: IntegrationBehavior[] = [];

    // Process integrations
    if (integrationsResponse.status === "fulfilled" && integrationsResponse.value.ok) {
      const data: PloomesIntegrationResponse = await integrationsResponse.value.json();

      data.value?.forEach(item => {
        integrations.push({
          id: item.Integration.Id,
          name: item.Integration.Name,
          status: 'Connected', // Se está na lista, está conectado
          fields: item.Integration.Fields?.map(field => ({
            id: field.Id,
            name: field.Name,
            type: field.Type
          }))
        });
      });
    }

    // Process RDStation behaviors
    if (rdStationBehaviorsResponse.status === "fulfilled" && rdStationBehaviorsResponse.value.ok) {
      const data: PloomesBehaviorResponse = await rdStationBehaviorsResponse.value.json();

      data.value?.forEach(behavior => {
        behaviors.push({
          id: behavior.Id,
          name: behavior.Name,
          description: behavior.DealStageIdRequired ? 'Requer estágio da oportunidade' : 'Configuração padrão',
          isActive: true, // Se está na lista, está ativo
          integrationName: 'RD Station'
        });
      });
    }

    // Process Reev behaviors
    if (reevBehaviorsResponse.status === "fulfilled" && reevBehaviorsResponse.value.ok) {
      const data: PloomesBehaviorResponse = await reevBehaviorsResponse.value.json();

      data.value?.forEach(behavior => {
        behaviors.push({
          id: behavior.Id,
          name: behavior.Name,
          description: behavior.DealStageIdRequired ? 'Requer estágio da oportunidade' : 'Configuração padrão',
          isActive: true, // Se está na lista, está ativo
          integrationName: 'Reev'
        });
      });
    }

    // Process MailChimp integration
    if (mailChimpResponse.status === "fulfilled" && mailChimpResponse.value.ok) {
      const data: PloomesMailChimpResponse = await mailChimpResponse.value.json();

      // MailChimp - se tem dados no array, está conectado
      if (data.value && data.value.length > 0) {
        integrations.push({
          id: 999, // Fake ID for MailChimp
          name: 'MailChimp',
          status: 'Connected'
        });
      } else {
        // Se array vazio, MailChimp não está configurado
        integrations.push({
          id: 999,
          name: 'MailChimp',
          status: 'Disconnected'
        });
      }
    }

    // Calculate stats
    const stats = {
      totalIntegrations: integrations.length,
      activeIntegrations: integrations.filter(i => i.status === 'Connected').length,
      totalBehaviors: behaviors.length,
      activeBehaviors: behaviors.filter(b => b.isActive).length
    };

    const automationsData: AutomationsData = {
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