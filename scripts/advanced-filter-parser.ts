#!/usr/bin/env tsx

/**
 * Parser avançado para filtros OData do Ploomes
 */

interface AdvancedFilterCriterion {
  fieldId: string;
  valueType?: string;
  operation: string;
  value: string;
  fieldName?: string;
  entity?: string;
}

interface AdvancedFilterPattern {
  regex: RegExp;
  type: 'complete' | 'direct' | 'anyall';
}

const advancedFilterString = "$filter=((((OtherProperties/any(o:+o/FieldId+eq+30024523+and+(o/IntegerValue+ne+null))))+and+(((Deal/OtherProperties/all(o:+o/FieldId+ne+30003710))+or+Deal/OtherProperties/any(o:+o/FieldId+eq+30003710+and+((o/StringValue+eq+null+or+o/StringValue+eq+%27%27))))))";

// Mapeamento de operações
const advancedOperationMap: Record<string, string> = {
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
const advancedValueTypeMap: Record<string, string> = {
  'StringValue': 'Texto',
  'IntegerValue': 'Número',
  'DecimalValue': 'Decimal',
  'DateTimeValue': 'Data',
  'BooleanValue': 'Sim/Não'
};

function decodeAdvancedFilter(filter: string): string {
  return decodeURIComponent(filter.replace(/\+/g, ' '));
}

function parseAdvancedODataFilter(filterString: string): AdvancedFilterCriterion[] {
  const criteria: AdvancedFilterCriterion[] = [];
  
  // Remover $filter= do início
  let filter = filterString.replace(/^\$filter=/, '');
  
  // Decodificar URL
  filter = decodeAdvancedFilter(filter);
  
  console.log('Filter decodificado:', filter);
  console.log('='.repeat(80));
  
  // Padrões mais específicos para extrair critérios
  const patterns: AdvancedFilterPattern[] = [
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
    // Padrão: any/all com FieldId
    {
      regex: /(any|all)\(o:\s*o\/FieldId\s+(\w+)\s+(\d+)/g,
      type: 'anyall'
    }
  ];
  
  patterns.forEach((pattern, index) => {
    console.log(`\n--- Testando padrão ${index + 1} (${pattern.type}) ---`);
    let match: RegExpExecArray | null;
    while ((match = pattern.regex.exec(filter)) !== null) {
      console.log('Match:', match);
      
      let criterion: AdvancedFilterCriterion;
      
      if (pattern.type === 'complete') {
        criterion = {
          fieldId: match[1],
          valueType: advancedValueTypeMap[match[2]] || match[2],
          operation: advancedOperationMap[match[3]] || match[3],
          value: match[4].replace(/'/g, '').replace(/null/, 'vazio').trim()
        };
      } else if (pattern.type === 'direct') {
        criterion = {
          fieldId: match[2],
          operation: advancedOperationMap[match[1]] || match[1],
          value: 'definido'
        };
      } else if (pattern.type === 'anyall') {
        criterion = {
          fieldId: match[3],
          operation: advancedOperationMap[match[2]] || match[2],
          value: match[1] === 'any' ? 'tem valor' : 'não tem valor'
        };
      } else {
        continue;
      }
      
      // Evitar duplicatas
      const exists = criteria.some(c => 
        c.fieldId === criterion.fieldId && 
        c.operation === criterion.operation
      );
      
      if (!exists && criterion.fieldId) {
        criteria.push(criterion);
      }
    }
  });
  
  return criteria;
}

// Função para simular busca de nomes de campos (seria uma API call real)
async function enrichAdvancedCriteriaWithFieldNames(criteria: AdvancedFilterCriterion[]): Promise<AdvancedFilterCriterion[]> {
  // Simulação de mapeamento de IDs para nomes de campos
  const fieldNameMap: Record<string, string> = {
    '30024523': 'Status do Cliente',
    '30003710': 'Origem do Lead'
  };
  
  return criteria.map(criterion => ({
    ...criterion,
    fieldName: fieldNameMap[criterion.fieldId] || `Campo ${criterion.fieldId}`,
    entity: 'Negócio' // Poderia ser extraído do contexto
  }));
}

// Testar o parser
async function testAdvancedParser(): Promise<void> {
  console.log('=== TESTE DO PARSER AVANÇADO ===');
  
  const rawCriteria = parseAdvancedODataFilter(advancedFilterString);
  console.log('\n=== CRITÉRIOS BRUTOS ===');
  console.log(JSON.stringify(rawCriteria, null, 2));
  
  const enrichedCriteria = await enrichAdvancedCriteriaWithFieldNames(rawCriteria);
  console.log('\n=== CRITÉRIOS ENRIQUECIDOS ===');
  console.log(JSON.stringify(enrichedCriteria, null, 2));
  
  console.log('\n=== FORMATO FINAL PARA UI ===');
  enrichedCriteria.forEach((criterion, index) => {
    console.log(`${index + 1}. ${criterion.entity} → ${criterion.fieldName} → ${criterion.operation} → ${criterion.value}`);
  });
}

if (require.main === module) {
  testAdvancedParser();
}