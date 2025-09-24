import { NextResponse } from "next/server";
import type { Integration, PloomesIntegrationResponse, PloomesMailChimpResponse } from "@/types/automations";
import { getErrorMessage } from "@/lib/handle-error";

const PLOOMES_API_BASE = "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Content-Type": "application/json",
};

export async function GET() {
  try {
    const [integrationsResponse, mailChimpResponse] = await Promise.allSettled([
      fetch(`${PLOOMES_API_BASE}/Account@Integrations?$expand=Integration($expand=Fields)`, {
        headers,
        cache: "no-cache",
      }),
      fetch(`${PLOOMES_API_BASE}/Account@MailChimpIntegration`, {
        headers,
        cache: "no-cache",
      })
    ]);

    const integrations: Integration[] = [];

    // Process general integrations
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

    // Process MailChimp integration
    if (mailChimpResponse.status === "fulfilled" && mailChimpResponse.value.ok) {
      const data: PloomesMailChimpResponse = await mailChimpResponse.value.json();

      integrations.push({
        id: 999,
        name: 'MailChimp',
        status: data.value && data.value.length > 0 ? 'Connected' : 'Disconnected'
      });
    }

    return NextResponse.json(integrations);
  } catch (error) {
    console.error("Erro ao buscar integrações:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}