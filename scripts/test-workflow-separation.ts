import { config } from "dotenv";
import type { PloomesAutomationsResponse, PloomesAutomation } from "../types/automations";

// Carregar variáveis de ambiente
config();

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
    "User-Key": process.env.PLOOMES_API_KEY!,
    "Accept": "application/json",
};

async function testWorkflowSeparation() {
    try {
        console.log("🔍 Investigando Separação de Automações de Workflow...\n");

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

        // Separar automações de Workflow (EntityId = 2)
        const workflowAutomations = automations.filter(a => a.EntityId === 2);

        // Separar por TriggerDealStageId
        const workflowWithTrigger = workflowAutomations.filter(a => a.TriggerDealStageId);
        const workflowWithoutTrigger = workflowAutomations.filter(a => !a.TriggerDealStageId);

        // Contar ativas
        const workflowWithTriggerActive = workflowWithTrigger.filter(a => a.Enabled && !a.DisabledDueToError);
        const workflowWithoutTriggerActive = workflowWithoutTrigger.filter(a => a.Enabled && !a.DisabledDueToError);

        console.log("🎯 ANÁLISE DE AUTOMAÇÕES DE WORKFLOW (EntityId = 2):");
        console.log("==================================================");
        console.log(`📋 Total Workflow: ${workflowAutomations.length}`);
        console.log(`🔗 COM TriggerDealStageId: ${workflowWithTriggerActive.length}/${workflowWithTrigger.length}`);
        console.log(`🚫 SEM TriggerDealStageId: ${workflowWithoutTriggerActive.length}/${workflowWithoutTrigger.length}`);

        console.log("\n🔍 Comparação com Ploomes Oficial:");
        console.log("==================================");
        console.log("Ploomes oficial mostra:");
        console.log("  - Workflow: 223/250 (mostrando 1-10 de 259)");
        console.log("  - Isso sugere que apenas automações COM TriggerDealStageId são contadas");
        console.log("");
        console.log("Nossa análise:");
        console.log(`  - COM TriggerDealStageId: ${workflowWithTriggerActive.length}/${workflowWithTrigger.length}`);
        console.log(`  - SEM TriggerDealStageId: ${workflowWithoutTriggerActive.length}/${workflowWithoutTrigger.length}`);

        console.log("\n📝 Hipótese:");
        console.log("============");
        console.log("As automações SEM TriggerDealStageId (genéricas) não devem ser");
        console.log("contadas na entidade Workflow, mas sim como 'Genéricas'");

        console.log("\n🔍 Exemplos de automações SEM TriggerDealStageId:");
        console.log("===============================================");
        workflowWithoutTrigger.slice(0, 3).forEach((auto, index) => {
            console.log(`${index + 1}. ${auto.Name}`);
            console.log(`   - Enabled: ${auto.Enabled}`);
            console.log(`   - DisabledDueToError: ${auto.DisabledDueToError}`);
            console.log(`   - TriggerDealStageId: ${auto.TriggerDealStageId || 'null'}`);
            console.log("");
        });

        console.log("🔍 Exemplos de automações COM TriggerDealStageId:");
        console.log("===============================================");
        workflowWithTrigger.slice(0, 3).forEach((auto, index) => {
            console.log(`${index + 1}. ${auto.Name}`);
            console.log(`   - Enabled: ${auto.Enabled}`);
            console.log(`   - DisabledDueToError: ${auto.DisabledDueToError}`);
            console.log(`   - TriggerDealStageId: ${auto.TriggerDealStageId}`);
            console.log("");
        });

    } catch (error) {
        console.error("❌ Erro no teste:", error);
    }
}

// Executar o teste
testWorkflowSeparation();