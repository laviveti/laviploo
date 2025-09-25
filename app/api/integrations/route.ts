import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/handle-error";
import type {
  PloomesIntegrationResponse,
  PloomesAccountIntegration,
  Integration,
  IntegrationField,
  IntegrationsData
} from "@/types/integrations";

/**
 * Mapeia o status da integração do Ploomes para o status da UI
 */
function mapIntegrationStatus(accountIntegration: PloomesAccountIntegration): Integration['status'] {
  const { Enabled, Authorized, StatusId } = accountIntegration;

  if (Enabled && Authorized && StatusId === 1) {
    return 'Connected';
  }

  if (!Enabled) {
    return 'Disconnected';
  }

  // Outros casos (não autorizado, status diferente, etc.)
  return 'Error';
}

/**
 * Transforma dados brutos da API Ploomes para o formato da UI
 */
function transformPloomesIntegration(accountIntegration: PloomesAccountIntegration): Integration {
  const { Integration: integrationDetails, Id, Enabled, Authorized } = accountIntegration;

  const fields: IntegrationField[] = integrationDetails.Fields?.map(field => ({
    id: field.Id,
    name: field.Name,
    key: field.Key,
    required: field.Required,
    type: field.TypeId.toString(), // Mapear TypeId para tipo string
    typeId: field.TypeId
  })) || [];

  return {
    id: Id.toString(),
    name: integrationDetails.Name,
    status: mapIntegrationStatus(accountIntegration),
    description: integrationDetails.Description,
    imageUrl: integrationDetails.ImageUrl,
    enabled: Enabled,
    authorized: Authorized,
    fields
  };
}

/**
 * Faz chamada para a API do Ploomes
 */
async function fetchPloomesIntegrations(): Promise<PloomesIntegrationResponse> {
  const apiKey = process.env.PLOOMES_API_KEY;
  const apiUrl = process.env.PLOOMES_API_URL || 'https://api2.ploomes.com';

  if (!apiKey) {
    throw new Error('PLOOMES_API_KEY não configurada');
  }

  const endpoint = `${apiUrl}/Account@Integrations?$expand=Integration($expand=Fields)`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'User-Key': apiKey,
      'Accept': 'application/json',
    },
    cache: 'no-cache'
  });

  if (!response.ok) {
    throw new Error(`Erro na API Ploomes: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function GET() {
  try {
    // Buscar dados reais da API Ploomes
    const ploomesResponse = await fetchPloomesIntegrations();

    // Transformar dados da API Ploomes para formato da UI
    const integrations = ploomesResponse.value.map(transformPloomesIntegration);

    // Calcular estatísticas
    const totalIntegrations = integrations.length;
    const connectedIntegrations = integrations.filter(int => int.status === 'Connected').length;
    const activeAutomations = 0; // TODO: Implementar quando tivermos endpoint de automações
    const totalBehaviors = 0; // TODO: Implementar quando tivermos endpoint de behaviors

    // Mock behaviors por enquanto (TODO: implementar endpoint real)
    const behaviors = [
      {
        id: "beh-001",
        name: "Novo Lead → Notificação WhatsApp",
        description: "Envia notificação por WhatsApp quando um novo lead é criado",
        trigger: "Novo Lead Criado",
        actions: ["Enviar WhatsApp", "Marcar como Notificado"],
        isActive: true,
        lastExecution: "2024-01-15T10:30:00Z",
        integrationId: "whatsapp",
        integrationName: "WhatsApp",
      },
    ];

    const data: IntegrationsData = {
      integrations,
      behaviors,
      stats: {
        totalIntegrations,
        connectedIntegrations,
        activeAutomations,
        totalBehaviors: behaviors.length,
      },
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar integrações:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}