import { config } from "dotenv";
import type { PloomesAutomationsResponse, PloomesAutomation } from "../types/automations";

// Carregar variáveis de ambiente
config();

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
    "User-Key": process.env.PLOOMES_API_KEY!,
    "Accept": "application/json",
};

async function testEntityMapping() {
    try {
        console.log("🔍 Mapeando Entidades Reais da API...\n");

        // Buscar todas as automações com entidades expandidas
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

        // Mapear todas as entidades únicas
        const entityMap = new Map<number, { name: string; total: number; active: number }>();
        let genericCount = { total: 0, active: 0 };

        automations.forEach((automation: PloomesAutomation) => {
            const isGeneric = !automation.TriggerDealStageId;
            const isActive = automation.Enabled && !automation.DisabledDueToError;

            if (isGeneric) {
                genericCount.total++;
                if (isActive) {
                    genericCount.active++;
                }
            } else {
                // Incluir TODAS as automações não-genéricas, mesmo sem EntityId
                const entityId = automation.EntityId || 0; // 0 para automações sem EntityId
                const entityName = automation.Entity?.Name ||
                    (entityId === 0 ? "Sem Entidade" : `Entidade ${entityId}`);

                if (!entityMap.has(entityId)) {
                    entityMap.set(entityId, { name: entityName, total: 0, active: 0 });
                }

                const entity = entityMap.get(entityId)!;
                entity.total++;
                if (isActive) {
                    entity.active++;
                }
            }
        });

        console.log("🏢 Entidades encontradas na API:");
        console.log("=====================================");

        // Ordenar por EntityId
        const sortedEntities = Array.from(entityMap.entries()).sort(([a], [b]) => a - b);

        sortedEntities.forEach(([entityId, data]) => {
            console.log(`ID: ${entityId.toString().padStart(2)} | Nome: ${data.name.padEnd(20)} | Ativas/Total: ${data.active}/${data.total}`);
        });

        console.log("\n🔧 Automações Genéricas:");
        console.log(`Ativas/Total: ${genericCount.active}/${genericCount.total}`);

        console.log("\n🔍 Análise detalhada de algumas automações:");
        console.log("===========================================");

        // Mostrar algumas automações para entender a estrutura
        const sampleAutomations = automations.slice(0, 5);
        sampleAutomations.forEach((auto, index) => {
            console.log(`\nAutomação ${index + 1}:`);
            console.log(`  ID: ${auto.Id}`);
            console.log(`  Nome: ${auto.Name}`);
            console.log(`  EntityId: ${auto.EntityId || 'null'}`);
            console.log(`  Entity.Name: ${auto.Entity?.Name || 'null'}`);
            console.log(`  TriggerDealStageId: ${auto.TriggerDealStageId || 'null'}`);
            console.log(`  Enabled: ${auto.Enabled}`);
            console.log(`  DisabledDueToError: ${auto.DisabledDueToError}`);
            console.log(`  Trigger.Name: ${auto.Trigger?.Name || 'null'}`);
        });

        console.log("\n🎯 Procurando automações com 'venda' no nome:");
        const vendasByName = automations.filter(auto =>
            auto.Name?.toLowerCase().includes('venda') ||
            auto.Name?.toLowerCase().includes('sales') ||
            auto.Entity?.Name?.toLowerCase().includes('venda')
        );

        console.log(`Encontradas ${vendasByName.length} automações com 'venda' no nome:`);
        vendasByName.slice(0, 3).forEach(auto => {
            console.log(`  - ${auto.Name} (EntityId: ${auto.EntityId}, Entity: ${auto.Entity?.Name})`);
        });

    } catch (error) {
        console.error("❌ Erro no teste:", error);
    }
}

// Executar o teste
testEntityMapping();