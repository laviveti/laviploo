// Script para testar o parser de filtros OData
const filterString = "$filter=((((OtherProperties/any(o:+o/FieldId+eq+30024523+and+(o/IntegerValue+ne+null))))+and+(((Deal/OtherProperties/all(o:+o/FieldId+ne+30003710))+or+Deal/OtherProperties/any(o:+o/FieldId+eq+30003710+and+((o/StringValue+eq+null+or+o/StringValue+eq+%27%27))))))";

// Função para decodificar URL
function decodeFilter(filter) {
  return decodeURIComponent(filter.replace(/\+/g, ' '));
}

// Função para extrair critérios do filtro OData
function parseODataFilter(filterString) {
  const criteria = [];
  
  // Remover $filter= do início
  let filter = filterString.replace(/^\$filter=/, '');
  
  // Decodificar URL
  filter = decodeFilter(filter);
  
  console.log('Filter decodificado:', filter);
  
  // Regex para encontrar padrões de campo
  const fieldPatterns = [
    // Padrão: o/FieldId eq NUMERO and (o/TipoValue operacao valor)
    /o\/FieldId\s+eq\s+(\d+)\s+and\s+\(o\/(\w+Value)\s+(\w+)\s+([^)]+)\)/g,
    // Padrão: o/FieldId eq NUMERO
    /o\/FieldId\s+eq\s+(\d+)/g,
    // Padrão: o/FieldId ne NUMERO  
    /o\/FieldId\s+ne\s+(\d+)/g
  ];
  
  // Extrair todos os matches
  fieldPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(filter)) !== null) {
      console.log('Match encontrado:', match);
      
      if (match.length >= 4) {
        // Match completo com valor
        criteria.push({
          fieldId: match[1],
          valueType: match[2],
          operation: match[3],
          value: match[4].replace(/'/g, '').trim()
        });
      } else {
        // Match apenas com fieldId
        criteria.push({
          fieldId: match[1],
          operation: match[3] || 'eq',
          value: 'definido'
        });
      }
    }
  });
  
  return criteria;
}

// Testar o parser
console.log('=== TESTE DO PARSER DE FILTROS ===');
const result = parseODataFilter(filterString);
console.log('Critérios extraídos:', JSON.stringify(result, null, 2));