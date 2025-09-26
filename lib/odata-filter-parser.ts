/**
 * OData Filter Parser
 * Converte filtros OData complexos em objetos JavaScript legíveis
 */

export interface FilterCondition {
  field: string;
  fieldId?: string;
  operator: string;
  value: string | null;
  displayName?: string;
  entity?: string;
}

export interface ParsedFilter {
  conditions: FilterCondition[];
  logic: 'AND' | 'OR';
  nested?: ParsedFilter[];
  raw?: string;
  isComplex: boolean;
}

// Mapeamento de operadores OData para nomes amigáveis
const OPERATOR_MAP: Record<string, string> = {
  'eq': 'Igual a',
  'ne': 'Diferente de',
  'gt': 'Maior que',
  'ge': 'Maior ou igual a',
  'lt': 'Menor que',
  'le': 'Menor ou igual a',
  'contains': 'Contém',
  'startswith': 'Começa com',
  'endswith': 'Termina com',
  'substringof': 'Contém',
  'in': 'Está em',
  'notin': 'Não está em'
};

// Mapeamento de entidades para nomes amigáveis
const ENTITY_MAP: Record<string, string> = {
  'Deal': 'Negócio',
  'Contact': 'Contato',
  'Task': 'Tarefa',
  'Order': 'Pedido',
  'Quote': 'Cotação',
  'Lead': 'Lead',
  'Product': 'Produto',
  'User': 'Usuário'
};

// Mapeamento de campos comuns
const FIELD_MAP: Record<string, string> = {
  'Name': 'Nome',
  'Email': 'E-mail',
  'Phone': 'Telefone',
  'Amount': 'Valor',
  'Status': 'Status',
  'CreateDate': 'Data de Criação',
  'UpdateDate': 'Data de Atualização',
  'CloseDate': 'Data de Fechamento',
  'DueDate': 'Data de Vencimento',
  'Description': 'Descrição',
  'Title': 'Título',
  'Type': 'Tipo',
  'Priority': 'Prioridade',
  'Stage': 'Estágio',
  'Owner': 'Responsável',
  'Source': 'Origem'
};

/**
 * Decodifica uma string URL-encoded
 */
function urlDecode(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch {
    return str;
  }
}

/**
 * Extrai o ID do campo de uma expressão OtherProperties
 */
function extractFieldId(expression: string): string | null {
  const match = expression.match(/FieldId\s+eq\s+(\d+)/);
  return match ? match[1] : null;
}

/**
 * Extrai o valor de uma expressão de comparação
 */
function extractValue(expression: string): string | null {
  // Procura por valores entre aspas simples
  const stringMatch = expression.match(/'([^']*)'/);
  if (stringMatch) {
    return stringMatch[1] === '' ? '(vazio)' : stringMatch[1];
  }

  // Procura por valores numéricos
  const numberMatch = expression.match(/\b(\d+(?:\.\d+)?)\b/);
  if (numberMatch) {
    return numberMatch[1];
  }

  // Procura por null
  if (expression.includes('null')) {
    return '(nulo)';
  }

  // Procura por valores booleanos
  if (expression.includes('true')) return 'Verdadeiro';
  if (expression.includes('false')) return 'Falso';

  return '(valor não identificado)';
}

/**
 * Extrai o operador de uma expressão
 */
function extractOperator(expression: string): string {
  for (const [odata, friendly] of Object.entries(OPERATOR_MAP)) {
    if (expression.includes(` ${odata} `)) {
      return friendly;
    }
  }

  // Operadores especiais
  if (expression.includes(' ne null')) return 'Não é nulo';
  if (expression.includes(' eq null')) return 'É nulo';
  if (expression.includes(' eq \'\'')) return 'Está vazio';
  if (expression.includes(' ne \'\'')) return 'Não está vazio';

  return 'Operação desconhecida';
}

/**
 * Determina o nome amigável do campo baseado no ID
 */
function getFieldDisplayName(fieldId: string): string {
  // Em um cenário real, isso viria de uma API ou cache
  // Por enquanto, retornamos um nome genérico
  return `Campo Personalizado ${fieldId}`;
}

/**
 * Processa uma expressão OtherProperties
 */
function parseOtherPropertiesExpression(expression: string): FilterCondition | null {
  const fieldId = extractFieldId(expression);
  const operator = extractOperator(expression);
  const value = extractValue(expression);

  if (!fieldId) return null;

  return {
    field: `otherProperties_${fieldId}`,
    fieldId,
    operator,
    value,
    displayName: getFieldDisplayName(fieldId),
    entity: 'Campos Personalizados'
  };
}

/**
 * Processa uma expressão de campo padrão
 */
function parseStandardFieldExpression(expression: string, entity?: string): FilterCondition | null {
  const operator = extractOperator(expression);
  const value = extractValue(expression);

  // Tentar extrair o nome do campo
  let field = 'Campo desconhecido';
  let displayName = field;

  // Procurar padrões comuns de campo
  for (const [fieldName, friendlyName] of Object.entries(FIELD_MAP)) {
    if (expression.includes(fieldName)) {
      field = fieldName;
      displayName = friendlyName;
      break;
    }
  }

  return {
    field,
    operator,
    value,
    displayName,
    entity: entity || 'Entidade'
  };
}

/**
 * Identifica a lógica principal (AND/OR) em uma expressão
 */
function identifyLogic(expression: string): 'AND' | 'OR' {
  // Remove parênteses e conta operadores
  const cleaned = expression.replace(/\([^)]*\)/g, '');
  const andCount = (cleaned.match(/\band\b/g) || []).length;
  const orCount = (cleaned.match(/\bor\b/g) || []).length;

  return orCount > andCount ? 'OR' : 'AND';
}

/**
 * Quebra uma expressão complexa em partes menores
 */
function splitComplexExpression(expression: string): string[] {
  const parts: string[] = [];
  let currentPart = '';
  let parenLevel = 0;
  let inQuotes = false;

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    const nextChars = expression.slice(i, i + 4);

    if (char === '\'' && expression[i - 1] !== '\\') {
      inQuotes = !inQuotes;
    }

    if (!inQuotes) {
      if (char === '(') parenLevel++;
      if (char === ')') parenLevel--;

      // Procurar por 'and' ou 'or' no nível raiz
      if (parenLevel === 0 && (nextChars === ' and' || nextChars === ' or ')) {
        if (currentPart.trim()) {
          parts.push(currentPart.trim());
          currentPart = '';
        }
        // Pular o operador
        i += nextChars.length - 1;
        continue;
      }
    }

    currentPart += char;
  }

  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }

  return parts.filter(part => part.length > 0);
}

/**
 * Função principal para parser de filtros OData
 */
export function parseODataFilter(filterExpression: string): ParsedFilter {
  if (!filterExpression) {
    return {
      conditions: [],
      logic: 'AND',
      isComplex: false,
      raw: filterExpression
    };
  }

  // Decodificar URL se necessário
  const decoded = urlDecode(filterExpression);

  // Remover $filter= se presente
  const cleaned = decoded.replace(/^\$filter=/, '').trim();

  // Verificar se é um filtro complexo
  const isComplex = cleaned.includes('OtherProperties') ||
                   cleaned.includes('any(') ||
                   cleaned.includes('all(') ||
                   (cleaned.match(/\(/g) || []).length > 2;

  const conditions: FilterCondition[] = [];
  let logic: 'AND' | 'OR' = 'AND';

  try {
    if (isComplex) {
      logic = identifyLogic(cleaned);

      // Procurar expressões OtherProperties específicas
      const otherPropsRegex = /OtherProperties\/any\([^)]+\)/g;
      const otherPropsMatches = cleaned.match(otherPropsRegex) || [];

      for (const match of otherPropsMatches) {
        const condition = parseOtherPropertiesExpression(match);
        if (condition) {
          conditions.push(condition);
        }
      }

      // Se não encontrou OtherProperties, tentar parse genérico
      if (conditions.length === 0) {
        const parts = splitComplexExpression(cleaned);
        for (const part of parts) {
          const condition = parseStandardFieldExpression(part);
          if (condition) {
            conditions.push(condition);
          }
        }
      }
    } else {
      // Filtro simples
      const condition = parseStandardFieldExpression(cleaned);
      if (condition) {
        conditions.push(condition);
      }
    }
  } catch (error) {
    console.warn('Erro ao fazer parse do filtro OData:', error);

    // Fallback: criar uma condição genérica
    conditions.push({
      field: 'filter_expression',
      operator: 'Filtro personalizado',
      value: cleaned.length > 100 ? cleaned.substring(0, 100) + '...' : cleaned,
      displayName: 'Condição personalizada',
      entity: 'Sistema'
    });
  }

  return {
    conditions,
    logic,
    isComplex,
    raw: filterExpression
  };
}

/**
 * Converte um filtro parseado em texto legível
 */
export function filterToReadableText(parsedFilter: ParsedFilter): string {
  if (parsedFilter.conditions.length === 0) {
    return 'Nenhuma condição específica';
  }

  const conditionTexts = parsedFilter.conditions.map(condition => {
    const entity = condition.entity ? `${condition.entity} → ` : '';
    const field = condition.displayName || condition.field;
    return `${entity}${field} ${condition.operator} ${condition.value}`;
  });

  const connector = parsedFilter.logic === 'OR' ? ' OU ' : ' E ';
  return conditionTexts.join(connector);
}

/**
 * Função de conveniência para parsing rápido
 */
export function quickParseFilter(filterExpression: string): string {
  const parsed = parseODataFilter(filterExpression);
  return filterToReadableText(parsed);
}