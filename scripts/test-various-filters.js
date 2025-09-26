// Teste com vários tipos de filtros OData
const testFilters = [
  {
    name: "Filtro Complexo Original",
    filter: "$filter=((((OtherProperties/any(o:+o/FieldId+eq+30024523+and+(o/IntegerValue+ne+null))))+and+(((Deal/OtherProperties/all(o:+o/FieldId+ne+30003710))+or+Deal/OtherProperties/any(o:+o/FieldId+eq+30003710+and+((o/StringValue+eq+null+or+o/StringValue+eq+%27%27)))))))"
  },
  {
    name: "Filtro Simples",
    filter: "$filter=OtherProperties/any(o: o/FieldId eq 12345 and (o/StringValue eq 'Ativo'))"
  },
  {
    name: "Filtro com Data",
    filter: "$filter=OtherProperties/any(o: o/FieldId eq 67890 and (o/DateTimeValue gt 2024-01-01T00:00:00Z))"
  },
  {
    name: "Filtro com Múltiplos Campos",
    filter: "$filter=OtherProperties/any(o: o/FieldId eq 11111 and (o/StringValue contains 'Cliente')) and OtherProperties/any(o: o/FieldId eq 22222 and (o/IntegerValue gt 1000))"
  }
];

// Mapeamento de operações
const operationMap = {
  'eq': 'Igual a',
  'ne': 'Diferente de',
  'gt': 'Maior que',
  'ge': 'Maior ou igual a',
  'lt': 'Menor que',
  'le': 'Menor ou igual a',
  'contains': 'Contém',
  'startswith': 'Começa com',
  'endswith': 'Termina com'
};

// Mapeamento de tipos de valor
const valueTypeMap = {
  'StringValue': 'Texto',
  'IntegerValue': 'Número',
  'DecimalValue': 'Decimal',
  'DateTimeValue': 'Data',
  'BooleanValue': 'Sim/Não'
};

function decodeFilter(filter) {
  return decodeURIComponent(filter.replace(/\+/g, ' '));
}

function parseODataFilter(filterString) {
  const criteria = [];
  
  if (!filterString) return criteria;
  
  // Remover $filter= do início se existir
  let filter = filterString.replace(/^\$filter=/, '');
  
  // Decodificar URL
  filter = decodeFilter(filter);
  
  console.log('Filter decodificado:', filter);
  
  // Padrões para extrair critérios
  const patterns = [
    // Padrão completo: FieldId + ValueType + Operation + Value
    {
      regex: /o\/FieldId\s+eq\s+(\d+)\s+and\s+\(o\/(\w+Value)\s+(\w+)\s+([^)]+)\)/g,
      type: 'complete'
    },
    // Padrão: FieldId com operação direta
    {
      regex: /o\/FieldId\s+(\w+)\s+(\d+)/g,
      type: 'direct'
    },
    // Padrão para valores entre aspas
    {
      regex: /o\/FieldId\s+eq\s+(\d+)\s+and\s+\(o\/(\w+Value)\s+(\w+)\s+'([^']+)'\)/g,
      type: 'quoted'
    }
  ];
  
  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.regex.exec(filter)) !== null) {
      let criterion = {};
      
      if (pattern.type === 'complete') {
        criterion = {
          fieldId: match[1],
          valueType: valueTypeMap[match[2]] || match[2],
          operation: operationMap[match[3]] || match[3],
          value: match[4].replace(/'/g, '').replace(/null/, 'vazio').trim()
        };
      } else if (pattern.type === 'direct') {
        criterion = {
          fieldId: match[2],
          operation: operationMap[match[1]] || match[1],
          value: 'definido'
        };
      } else if (pattern.type === 'quoted') {
        criterion = {
          fieldId: match[1],
          valueType: valueTypeMap[match[2]] || match[2],
          operation: operationMap[match[3]] || match[3],
          value: match[4]
        };
      }
      
      // Evitar duplicatas
      const exists = criteria.some(c => 
        c.fieldId === criterion.fieldId && 
        c.operation === criterion.operation &&
        c.value === criterion.value
      );
      
      if (!exists && criterion.fieldId) {
        criteria.push(criterion);
      }
    }
  });
  
  return criteria;
}

// Testar todos os filtros
function testAllFilters() {
  console.log('=== TESTE DE VÁRIOS TIPOS DE FILTROS ===\n');
  
  testFilters.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}`);
    console.log('='.repeat(50));
    
    const criteria = parseODataFilter(test.filter);
    
    if (criteria.length > 0) {
      console.log('✅ Critérios extraídos:');
      criteria.forEach((criterion, i) => {
        console.log(`   ${i + 1}. Campo ${criterion.fieldId} → ${criterion.operation} → ${criterion.value}`);
        if (criterion.valueType) {
          console.log(`      Tipo: ${criterion.valueType}`);
        }
      });
    } else {
      console.log('❌ Nenhum critério extraído');
    }
    
    console.log('\n');
  });
}

testAllFilters();