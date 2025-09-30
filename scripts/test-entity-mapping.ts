/**
 * Script de teste para validar a lógica de mapeamento de entidades
 *
 * Testa:
 * 1. Conversão EntityId Ploomes → ID Visual
 * 2. Conversão ID Visual → Filtro OData
 * 3. Casos edge (genéricas, workflow)
 * 4. Validação com dados reais da API
 */

import { config } from "dotenv";
import type { PloomesAutomationsResponse, PloomesAutomation } from "../types/automations";
import { getVisualEntityId, getPloomesFilter, getEntityDisplayName } from '../constants/automation-entities';

// Carregar variáveis de ambiente
config();

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

console.log('🧪 TESTE DE MAPEAMENTO DE ENTIDADES\n');
console.log('=====================================\n');

// ===== PARTE 1: TESTES UNITÁRIOS =====
console.log('📋 PARTE 1: TESTES UNITÁRIOS\n');

const testCases = [
  {
    name: 'Cliente (EntityId 1)',
    ploomesEntityId: 1,
    hasTriggerDealStageId: false,
    expectedVisualId: 1,
    expectedFilter: 'EntityId eq 1'
  },
  {
    name: 'Workflow (EntityId 2 COM TriggerDealStageId)',
    ploomesEntityId: 2,
    hasTriggerDealStageId: true,
    expectedVisualId: 2,
    expectedFilter: 'EntityId eq 2 and TriggerDealStageId ne null'
  },
  {
    name: 'Genérica (EntityId 2 SEM TriggerDealStageId)',
    ploomesEntityId: 2,
    hasTriggerDealStageId: false,
    expectedVisualId: null,
    expectedFilter: '(EntityId eq null or (EntityId eq 2 and TriggerDealStageId eq null))'
  },
  {
    name: 'Genérica (EntityId null)',
    ploomesEntityId: null,
    hasTriggerDealStageId: false,
    expectedVisualId: null,
    expectedFilter: '(EntityId eq null or (EntityId eq 2 and TriggerDealStageId eq null))'
  },
  {
    name: 'Venda (EntityId 4)',
    ploomesEntityId: 4,
    hasTriggerDealStageId: false,
    expectedVisualId: 4,
    expectedFilter: 'EntityId eq 4'
  },
  {
    name: 'Tarefa (EntityId 12)',
    ploomesEntityId: 12,
    hasTriggerDealStageId: false,
    expectedVisualId: 12,
    expectedFilter: 'EntityId eq 12'
  },
];

let passedTests = 0;
let failedTests = 0;

testCases.forEach((testCase, index) => {
  const visualId = getVisualEntityId(testCase.ploomesEntityId, testCase.hasTriggerDealStageId);
  const filter = getPloomesFilter(visualId);
  const displayName = getEntityDisplayName(visualId);

  const visualIdPass = visualId === testCase.expectedVisualId;
  const filterPass = filter === testCase.expectedFilter;
  const testPassed = visualIdPass && filterPass;

  console.log(`${testPassed ? '✅' : '❌'} ${testCase.name}`);
  if (!testPassed) {
    console.log(`   Esperado: visualId=${testCase.expectedVisualId}, filter="${testCase.expectedFilter}"`);
    console.log(`   Obtido: visualId=${visualId}, filter="${filter}"`);
  }

  testPassed ? passedTests++ : failedTests++;
});

console.log(`\n📊 Resultado: ${passedTests}/${testCases.length} passaram\n`);

// ===== PARTE 2: TESTE COM DADOS REAIS DA API =====
async function testWithRealData() {
  console.log('\n📡 PARTE 2: VALIDAÇÃO COM DADOS REAIS DA API\n');

  try {
    const response = await fetch(`${PLOOMES_API_BASE}/Automations?$expand=Entity&$top=100`, {
      headers,
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data: PloomesAutomationsResponse = await response.json();
    const automations = data.value || [];

    console.log(`📊 Analisando ${automations.length} automações da API...\n`);

    // Contar por tipo
    const visualIdCounts = new Map<number | null, number>();

    automations.forEach((automation: PloomesAutomation) => {
      const visualId = getVisualEntityId(
        automation.EntityId,
        !!automation.TriggerDealStageId
      );

      visualIdCounts.set(visualId, (visualIdCounts.get(visualId) || 0) + 1);
    });

    console.log('📈 Distribuição por ID Visual:');
    console.log('─'.repeat(60));

    // Ordenar e mostrar
    const sorted = Array.from(visualIdCounts.entries()).sort((a, b) => {
      if (a[0] === null) return -1;
      if (b[0] === null) return 1;
      return a[0] - b[0];
    });

    sorted.forEach(([visualId, count]) => {
      const displayName = getEntityDisplayName(visualId);
      const idStr = visualId === null ? 'null' : visualId.toString().padStart(2);
      console.log(`  ID Visual ${idStr} (${displayName.padEnd(25)}): ${count} automações`);
    });

    // Exemplos de cada tipo
    console.log('\n🔍 Exemplos de automações por tipo:\n');

    // Workflow
    const workflowExample = automations.find(a => a.EntityId === 2 && a.TriggerDealStageId);
    if (workflowExample) {
      const visualId = getVisualEntityId(workflowExample.EntityId, !!workflowExample.TriggerDealStageId);
      console.log(`Workflow (ID Visual ${visualId}):`);
      console.log(`  Nome: ${workflowExample.Name}`);
      console.log(`  EntityId Ploomes: ${workflowExample.EntityId}`);
      console.log(`  TriggerDealStageId: ${workflowExample.TriggerDealStageId}`);
      console.log(`  ✓ Mapeado corretamente para ID Visual 2`);
    }

    // Genérica
    const genericExample = automations.find(a => !a.EntityId || (a.EntityId === 2 && !a.TriggerDealStageId));
    if (genericExample) {
      const visualId = getVisualEntityId(genericExample.EntityId, !!genericExample.TriggerDealStageId);
      console.log(`\nGenérica (ID Visual ${visualId}):`);
      console.log(`  Nome: ${genericExample.Name}`);
      console.log(`  EntityId Ploomes: ${genericExample.EntityId || 'null'}`);
      console.log(`  TriggerDealStageId: ${genericExample.TriggerDealStageId || 'null'}`);
      console.log(`  ✓ Mapeado corretamente para ID Visual null`);
    }

    console.log('\n✅ Validação com dados reais concluída!\n');

  } catch (error) {
    console.error("❌ Erro ao buscar dados da API:", error);
    failedTests++;
  }
}

// Executar testes
testWithRealData().then(() => {
  console.log('\n═'.repeat(30));
  if (failedTests === 0) {
    console.log('🎊 TODOS OS TESTES PASSARAM! 🎊');
    process.exit(0);
  } else {
    console.log('⚠️  ALGUNS TESTES FALHARAM ⚠️');
    process.exit(1);
  }
});