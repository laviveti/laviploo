import { config } from 'dotenv';

// Load environment variables
config();

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

async function testPipelinesAPI() {
  console.log('🔍 Testando API de Pipelines do Ploomes...\n');

  try {
    // Test different pipeline endpoints
    const pipelineEndpoints = [
      'Pipelines',
      'DealPipelines', 
      'Deal@Pipelines',
      'Deals@Pipelines',
      'DealStages',
      'Deal@Stages',
      'Deals@Stages'
    ];

    console.log('🔍 Testando diferentes endpoints de Pipeline/Stage...\n');
    
    for (const endpoint of pipelineEndpoints) {
      console.log(`📋 Testando: ${endpoint}`);
      try {
        const response = await fetch(`${PLOOMES_API_BASE}/${endpoint}`, {
          headers,
          cache: "no-cache",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${endpoint}: ${data.value?.length || 0} itens encontrados`);
          
          if (data.value && data.value.length > 0) {
            const firstItem = data.value[0];
            console.log(`   Exemplo: ID: ${firstItem.Id}, Nome: ${firstItem.Name || firstItem.Title || 'N/A'}`);
            if (firstItem.PipelineId) console.log(`   Pipeline ID: ${firstItem.PipelineId}`);
          }
        } else {
          console.log(`❌ ${endpoint}: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: Erro na requisição`);
      }
      console.log('');
    }

    // Test 3: Get detailed pipeline and stage data
    console.log('📊 Buscando dados detalhados de Pipelines...');
    const pipelinesResponse = await fetch(`${PLOOMES_API_BASE}/Deals@Pipelines`, {
      headers,
      cache: "no-cache",
    });

    let pipelinesMap: Record<number, string> = {};
    if (pipelinesResponse.ok) {
      const pipelinesData = await pipelinesResponse.json();
      console.log(`✅ Pipelines encontrados: ${pipelinesData.value?.length || 0}`);
      
      // Create pipeline mapping
      pipelinesData.value?.forEach((pipeline: any) => {
        pipelinesMap[pipeline.Id] = pipeline.Name;
      });
      
      console.log('\n📋 Primeiros 5 pipelines:');
      pipelinesData.value?.slice(0, 5).forEach((pipeline: any, index: number) => {
        console.log(`  ${index + 1}. ID: ${pipeline.Id}, Nome: ${pipeline.Name}`);
      });
    }

    console.log('\n🎯 Buscando dados detalhados de Estágios...');
    const stagesResponse = await fetch(`${PLOOMES_API_BASE}/Deals@Stages`, {
      headers,
      cache: "no-cache",
    });

    let stagesMap: Record<number, {name: string, pipelineId: number}> = {};
    if (stagesResponse.ok) {
      const stagesData = await stagesResponse.json();
      console.log(`✅ Estágios encontrados: ${stagesData.value?.length || 0}`);
      
      // Create stages mapping
      stagesData.value?.forEach((stage: any) => {
        stagesMap[stage.Id] = {
          name: stage.Name,
          pipelineId: stage.PipelineId
        };
      });
      
      console.log('\n🎯 Primeiros 5 estágios:');
      stagesData.value?.slice(0, 5).forEach((stage: any, index: number) => {
        const pipelineName = pipelinesMap[stage.PipelineId] || `Pipeline ${stage.PipelineId}`;
        console.log(`  ${index + 1}. ID: ${stage.Id}, Nome: ${stage.Name}, Pipeline: ${pipelineName}`);
      });
    }

    // Test 4: Get Automations with Pipeline info
    console.log('\n🤖 Buscando Automações com informações de Pipeline...');
    const automationsResponse = await fetch(`${PLOOMES_API_BASE}/Automations?$top=50&$expand=Entity,Trigger`, {
      headers,
      cache: "no-cache",
    });

    if (automationsResponse.ok) {
      const automationsData = await automationsResponse.json();
      console.log(`✅ Automações encontradas: ${automationsData.value?.length || 0}`);
      
      if (automationsData.value && automationsData.value.length > 0) {
        console.log('\n🔧 Análise de Campos de Pipeline nas Automações:');
        let withPipelineCount = 0;
        let withStageCount = 0;
        let genericCount = 0;
        
        automationsData.value.forEach((automation: any) => {
          if (automation.TriggerDealStageId) {
            withStageCount++;
          }
          if (automation.TriggerDealPipelineId) {
            withPipelineCount++;
          }
          
          // Check if it's generic (no stage and no pipeline)
          const isGeneric = !automation.TriggerDealStageId && !automation.TriggerDealPipelineId;
          if (isGeneric) {
            genericCount++;
          }
        });
        
        console.log(`  Com TriggerDealStageId: ${withStageCount}`);
        console.log(`  Com TriggerDealPipelineId: ${withPipelineCount}`);
        console.log(`  Genéricas (sem stage nem pipeline): ${genericCount}`);
        
        // Show examples with stage info and their pipelines
        const automationsWithStage = automationsData.value.filter((a: any) => a.TriggerDealStageId);
        if (automationsWithStage.length > 0) {
          console.log('\n📋 Exemplos de automações com Stage (e seus Pipelines):');
          automationsWithStage.slice(0, 5).forEach((automation: any, index: number) => {
            const stageInfo = stagesMap[automation.TriggerDealStageId];
            const pipelineName = stageInfo ? pipelinesMap[stageInfo.pipelineId] : 'Pipeline não encontrado';
            const stageName = stageInfo ? stageInfo.name : 'Stage não encontrado';
            
            console.log(`  ${index + 1}. ${automation.Name}`);
            console.log(`     Stage: ${stageName} (ID: ${automation.TriggerDealStageId})`);
            console.log(`     Pipeline: ${pipelineName}`);
            console.log(`     Pipeline ID: ${automation.TriggerDealPipelineId || stageInfo?.pipelineId || 'N/A'}`);
          });
        }
      }
    } else {
      console.log(`❌ Erro ao buscar automações: ${automationsResponse.status} - ${automationsResponse.statusText}`);
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Run the test
testPipelinesAPI().then(() => {
  console.log('\n✅ Teste concluído!');
}).catch(console.error);