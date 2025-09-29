import { config } from "dotenv";
import type { PloomesAutomationsResponse, PloomesAutomation } from "../types/automations";

// Carregar variáveis de ambiente
config();

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

async function testAutomationsAPI() {
  try {
    console.log("🔍 Testando API de Automações do Ploomes...\n");

    // Buscar todas as automações com expansão
    const response = await fetch(`${PLOOMES_API_BASE}/Automations?$expand=Entity,Trigger`, {
      headers,
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data: PloomesAutomationsResponse = await response.json();
    const automations = data.value || [];

    console.log(`📊 Total de automações encontradas: ${automations.length}\n`);

    // Analisar estrutura das automações
    console.log("🔬 Analisando estrutura das automações...\n");

    const entityCounts: Record<number, number> = {};
    const triggerCounts: Record<number, number> = {};
    let genericCount = 0;
    let withStageCount = 0;
    let withPipelineCount = 0;

    // Amostras para análise
    const samples: PloomesAutomation[] = [];

    automations.forEach((automation, index) => {
      // Contar por entidade
      if (automation.EntityId) {
        entityCounts[automation.EntityId] = (entityCounts[automation.EntityId] || 0) + 1;
      }

      // Contar por trigger
      if (automation.TriggerId) {
        triggerCounts[automation.TriggerId] = (triggerCounts[automation.TriggerId] || 0) + 1;
      }

      // Analisar campos relacionados a funil/pipeline
      if (automation.TriggerDealStageId) {
        withStageCount++;
      }

      if (automation.TriggerDealPipelineId) {
        withPipelineCount++;
      }

      // Identificar automações genéricas
      const isGeneric = !automation.TriggerDealStageId && !automation.TriggerDealPipelineId;
      if (isGeneric) {
        genericCount++;
      }

      // Coletar amostras para análise detalhada
      if (index < 10) {
        samples.push(automation);
      }
    });

    console.log("📈 Contagem por Entidade:");
    Object.entries(entityCounts).forEach(([entityId, count]) => {
      console.log(`  Entidade ${entityId}: ${count} automações`);
    });

    console.log("\n🎯 Contagem por Trigger:");
    Object.entries(triggerCounts).forEach(([triggerId, count]) => {
      console.log(`  Trigger ${triggerId}: ${count} automações`);
    });

    console.log(`\n🔧 Análise de Campos de Funil/Pipeline:`);
    console.log(`  Com TriggerDealStageId: ${withStageCount}`);
    console.log(`  Com TriggerDealPipelineId: ${withPipelineCount}`);
    console.log(`  Genéricas (sem stage nem pipeline): ${genericCount}`);
    console.log(`  Não-genéricas: ${automations.length - genericCount}`);

    console.log(`\n📋 Amostras de Automações (primeiras 10):`);
    samples.forEach((automation, index) => {
      console.log(`\n  ${index + 1}. ${automation.Name}`);
      console.log(`     ID: ${automation.Id}`);
      console.log(`     EntityId: ${automation.EntityId}`);
      console.log(`     TriggerId: ${automation.TriggerId}`);
      console.log(`     TriggerDealStageId: ${automation.TriggerDealStageId || 'null'}`);
      console.log(`     TriggerDealPipelineId: ${automation.TriggerDealPipelineId || 'null'}`);
      console.log(`     Enabled: ${automation.Enabled}`);
      console.log(`     DisabledDueToError: ${automation.DisabledDueToError}`);
      
      const isGeneric = !automation.TriggerDealStageId && !automation.TriggerDealPipelineId;
      console.log(`     É Genérica: ${isGeneric ? 'SIM' : 'NÃO'}`);
    });

    // Testar filtros específicos
    console.log(`\n🧪 Testando Filtros Específicos...\n`);

    // Teste 1: Filtro por entidade específica (EntityId = 2, que é "Negócios/Workflow")
    console.log("1️⃣ Testando filtro por EntityId = 2 (Workflow):");
    const workflowResponse = await fetch(`${PLOOMES_API_BASE}/Automations?$filter=EntityId eq 2`, {
      headers,
      cache: "no-cache",
    });

    if (workflowResponse.ok) {
      const workflowData: PloomesAutomationsResponse = await workflowResponse.json();
      const workflowAutomations = workflowData.value || [];
      
      console.log(`   Total EntityId=2: ${workflowAutomations.length}`);
      
      const workflowGeneric = workflowAutomations.filter(a => !a.TriggerDealStageId).length;
      const workflowNonGeneric = workflowAutomations.length - workflowGeneric;
      
      console.log(`   Genéricas EntityId=2: ${workflowGeneric}`);
      console.log(`   Não-genéricas EntityId=2: ${workflowNonGeneric}`);
    }

    // Teste 2: Filtro por automações genéricas
    console.log("\n2️⃣ Testando filtro por automações genéricas:");
    const genericResponse = await fetch(`${PLOOMES_API_BASE}/Automations?$filter=TriggerDealStageId eq null`, {
      headers,
      cache: "no-cache",
    });

    if (genericResponse.ok) {
      const genericData: PloomesAutomationsResponse = await genericResponse.json();
      const genericAutomations = genericData.value || [];
      
      console.log(`   Total genéricas (via API): ${genericAutomations.length}`);
      console.log(`   Total genéricas (contagem local): ${genericCount}`);
      
      // Analisar distribuição por entidade das genéricas
      const genericByEntity: Record<number, number> = {};
      genericAutomations.forEach(automation => {
        if (automation.EntityId) {
          genericByEntity[automation.EntityId] = (genericByEntity[automation.EntityId] || 0) + 1;
        }
      });
      
      console.log("   Distribuição de genéricas por entidade:");
      Object.entries(genericByEntity).forEach(([entityId, count]) => {
        console.log(`     Entidade ${entityId}: ${count} genéricas`);
      });
    }

    console.log("\n✅ Teste concluído!");

  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

// Executar o teste
testAutomationsAPI();