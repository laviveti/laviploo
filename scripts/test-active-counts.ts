import { config } from "dotenv";
import type { PloomesAutomationsResponse, PloomesAutomation } from "../types/automations";

// Carregar variáveis de ambiente
config();

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
    "User-Key": process.env.PLOOMES_API_KEY!,
    "Accept": "application/json",
};

async function testActiveCounts() {
    try {
        console.log("🔍 Testando Contagem de Ativas vs Totais...\n");

        // Buscar todas as automações
        const response = await fetch(`${PLOOMES_API_BASE}/Automations?$expand=Entity,Trigger`, {
            headers,
            cache: "no-cache",
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data: PloomesAutomationsResponse = await response.json();
        const automations = data.value || [];

        console.log(`📊 Total de automações: ${automations.length}\n`);

        // Aplicar a nova lógica de contagem
        const entityCounts: Record<number, { total: number; active: number }> = {};
        let genericCount = { total: 0, active: 0 };
        let totalCount = 0;

        automations.forEach((automation: PloomesAutomation) => {
            totalCount++;

            const isGeneric = !automation.TriggerDealStageId;
            const isActive = automation.Enabled && !automation.DisabledDueToError;

            if (isGeneric) {
                genericCount.total++;
                if (isActive) {
                    genericCount.active++;
                }
            } else {
                if (automation.EntityId) {
                    if (!entityCounts[automation.EntityId]) {
                        entityCounts[automation.EntityId] = { total: 0, active: 0 };
                    }
                    entityCounts[automation.EntityId].total++;
                    if (isActive) {
                        entityCounts[automation.EntityId].active++;
                    }
                }
            }
        });

        console.log("🖥️ O que deveria aparecer na interface:\n");
        console.log(`📋 "Todas as Entidades": ${totalCount}`);
        console.log(`🔧 "Genéricas": ${genericCount.active}/${genericCount.total}`);

        console.log("\n📈 Por Entidade:");
        Object.entries(entityCounts).forEach(([entityId, counts]) => {
            const entityName = getEntityName(parseInt(entityId));
            console.log(`  ${entityName} (${entityId}): ${counts.active}/${counts.total}`);
        });

        // Análise específica da EntityId 2 (Workflow)
        console.log(`\n🎯 Análise Detalhada - EntityId 2 (Workflow):`);
        const workflowAutomations = automations.filter(a => a.EntityId === 2 && a.TriggerDealStageId);
        const workflowActive = workflowAutomations.filter(a => a.Enabled && !a.DisabledDueToError);

        console.log(`  Total não-genéricas: ${workflowAutomations.length}`);
        console.log(`  Ativas não-genéricas: ${workflowActive.length}`);
        console.log(`  Calculado: ${entityCounts[2]?.active || 0}/${entityCounts[2]?.total || 0}`);

        console.log("\n✅ Teste concluído!");

    } catch (error) {
        console.error("❌ Erro no teste:", error);
    }
}

function getEntityName(entityId: number): string {
    const entityNames: Record<number, string> = {
        1: 'Contatos',
        2: 'Workflow',
        3: 'Tarefas',
        4: 'Pedidos',
        5: 'Cotações',
        6: 'Leads',
        7: 'Proposta',
        8: 'Usuários',
        9: 'Workflow',
        10: 'Sistema',
        12: 'Entidade 12'
    };
    return entityNames[entityId] || `Entidade ${entityId}`;
}

// Executar o teste
testActiveCounts();