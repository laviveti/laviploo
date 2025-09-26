// Script para testar a API de filtros
const testFilterId = 123; // Substitua por um ID real de filtro

async function testFilterAPI() {
  try {
    console.log('=== TESTE DA API DE FILTROS ===');
    console.log(`Testando filtro ID: ${testFilterId}`);
    
    const response = await fetch(`http://localhost:3000/api/filters/${testFilterId}/criteria`);
    
    if (!response.ok) {
      console.error('Erro na API:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Detalhes do erro:', errorData);
      return;
    }
    
    const data = await response.json();
    
    console.log('\n=== RESPOSTA DA API ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.criteria && data.criteria.length > 0) {
      console.log('\n=== CRITÉRIOS FORMATADOS ===');
      data.criteria.forEach((criterion, index) => {
        console.log(`${index + 1}. ${criterion.entity} → ${criterion.field} → ${criterion.operation} → ${criterion.value}`);
      });
    } else {
      console.log('\n❌ Nenhum critério encontrado');
    }
    
  } catch (error) {
    console.error('Erro ao testar API:', error);
  }
}

// Executar apenas se o servidor estiver rodando
console.log('Para testar a API, certifique-se de que o servidor Next.js está rodando em localhost:3000');
console.log('Depois execute: node scripts/test-filter-api.js');

// testFilterAPI();