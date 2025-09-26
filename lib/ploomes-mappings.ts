/**
 * Utilitários para mapeamento de dados da API Ploomes
 * Converte IDs e códigos em texto legível em português
 */

// Mapeamento de operações de filtro para português
export const FILTER_OPERATIONS: Record<string, string> = {
  // Operações básicas
  'eq': 'Igual a',
  'ne': 'Diferente de',
  'gt': 'Maior que',
  'ge': 'Maior ou igual a',
  'lt': 'Menor que',
  'le': 'Menor ou igual a',

  // Operações de texto
  'contains': 'Contém',
  'startswith': 'Começa com',
  'endswith': 'Termina com',
  'substringof': 'Contém',

  // Operações de conjunto
  'in': 'Está em',
  'notin': 'Não está em',

  // Operações especiais
  'null': 'É vazio',
  'notnull': 'Não é vazio',
  'empty': 'É vazio',
  'notempty': 'Não é vazio',

  // Operações lógicas
  'and': 'E',
  'or': 'OU',
  'not': 'NÃO'
};

// Mapeamento de IDs de operação para texto
export const OPERATION_IDS: Record<number, string> = {
  1: 'Igual a',
  2: 'Diferente de',
  3: 'Maior que',
  4: 'Maior ou igual a',
  5: 'Menor que',
  6: 'Menor ou igual a',
  7: 'Contém',
  8: 'Não contém',
  9: 'Começa com',
  10: 'Termina com',
  11: 'É vazio',
  12: 'Não é vazio',
  13: 'Está em',
  14: 'Não está em'
};

// Mapeamento de entidades do Ploomes por ID
export const ENTITY_MAPPINGS: Record<number, string> = {
  1: 'Contatos',
  2: 'Negócios',
  3: 'Tarefas',
  4: 'Pedidos',
  5: 'Produtos',
  6: 'Empresas',
  7: 'Oportunidades',
  8: 'Campanhas',
  9: 'Usuários',
  10: 'Times',
  11: 'Pipelines',
  12: 'Estágios',
  13: 'Workflows',
  14: 'Workflow de Venda',
  15: 'Automações',
  16: 'Filtros',
  17: 'Campos',
  18: 'Tipos de Campo',
  19: 'Valores de Campo',
  20: 'Interações'
};

// Mapeamento de tipos de campo
export const FIELD_TYPES: Record<number, string> = {
  1: 'Texto',
  2: 'Número',
  3: 'Data',
  4: 'Data e Hora',
  5: 'Verdadeiro/Falso',
  6: 'Lista suspensa',
  7: 'Múltipla escolha',
  8: 'URL',
  9: 'E-mail',
  10: 'Telefone',
  11: 'Moeda',
  12: 'Decimal',
  13: 'Inteiro',
  14: 'Texto longo',
  15: 'Arquivo'
};

// Mapeamento de triggers de automação
export const AUTOMATION_TRIGGERS: Record<number, string> = {
  1: 'Ao entrar no estágio',
  2: 'Ao sair do estágio',
  5: 'Ao criar negócio',
  6: 'Ao alterar negócio',
  8: 'Ao ganhar negócio',
  9: 'Ao perder negócio',
  17: 'Recorrente'
};

// Mapeamento de status de automação
export const AUTOMATION_STATUS: Record<string, string> = {
  'active': 'Ativa',
  'inactive': 'Inativa',
  'error': 'Erro'
};

/**
 * Interpreta uma operação de filtro para texto legível
 */
export function getOperationText(operation: string | number): string {
  if (typeof operation === 'number') {
    return OPERATION_IDS[operation] || `Operação ${operation}`;
  }

  // Normalizar a operação
  const normalizedOp = operation.toLowerCase().trim();
  return FILTER_OPERATIONS[normalizedOp] || operation;
}

/**
 * Obtém o nome da entidade pelo ID
 */
export function getEntityName(entityId: number): string {
  return ENTITY_MAPPINGS[entityId] || `Entidade ${entityId}`;
}

/**
 * Obtém o tipo de campo pelo ID
 */
export function getFieldTypeName(typeId: number): string {
  return FIELD_TYPES[typeId] || `Tipo ${typeId}`;
}

/**
 * Obtém o nome do trigger de automação
 */
export function getTriggerName(triggerId: number): string {
  return AUTOMATION_TRIGGERS[triggerId] || `Trigger ${triggerId}`;
}

/**
 * Interpreta um valor de filtro para exibição
 */
export function formatFilterValue(value: any, fieldType?: number): string {
  if (value === null || value === undefined || value === '') {
    return 'vazio';
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  if (typeof value === 'number') {
    // Se for moeda, formatar adequadamente
    if (fieldType === 11) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    return value.toString();
  }

  if (typeof value === 'string') {
    // Se parece com uma data ISO
    if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      return new Date(value).toLocaleDateString('pt-BR');
    }

    return value;
  }

  return String(value);
}

/**
 * Interface para um critério de filtro interpretado
 */
export interface InterpretedFilterCriteria {
  entity: string;
  field: string;
  operation: string;
  value: string;
  fieldType?: number;
  logicalGroup?: number;
}

/**
 * Interpreta um campo de filtro da API Ploomes
 */
export function interpretFilterField(
  filterField: any,
  fieldDetails?: any,
  entityName?: string
): InterpretedFilterCriteria {
  // Nome da entidade
  const entity = entityName ||
                 getEntityName(filterField.EntityId) ||
                 filterField.EntityName ||
                 'Entidade';

  // Nome do campo
  const field = fieldDetails?.Name ||
                filterField.FieldName ||
                filterField.FieldKey ||
                'Campo';

  // Operação
  const operation = getOperationText(
    filterField.OperationId ||
    filterField.Operation ||
    filterField.OperationType ||
    'eq'
  );

  // Valor - pode estar em diferentes propriedades
  let value: any = filterField.Value;
  if (value === undefined || value === null) {
    // Tentar diferentes propriedades onde o valor pode estar
    value = filterField.StringValue ||
            filterField.IntegerValue ||
            filterField.DecimalValue ||
            filterField.DateTimeValue ||
            filterField.BoolValue ||
            filterField.FilterValue;

    // Se ainda for undefined/null, verificar se tem Values array
    if ((value === undefined || value === null) && filterField.Values?.length > 0) {
      const firstValue = filterField.Values[0];
      value = firstValue.StringValue ||
              firstValue.IntegerValue ||
              firstValue.DecimalValue ||
              firstValue.DateTimeValue ||
              firstValue.BoolValue;
    }
  }

  return {
    entity,
    field,
    operation,
    value: formatFilterValue(value, fieldDetails?.TypeId),
    fieldType: fieldDetails?.TypeId,
    logicalGroup: filterField.LogicalGroupNumber
  };
}

/**
 * Agrupa critérios por grupo lógico e conecta com AND/OR
 */
export function groupFilterCriteria(criteria: InterpretedFilterCriteria[]): string[] {
  const groups = new Map<number, InterpretedFilterCriteria[]>();

  // Agrupar por LogicalGroupNumber
  criteria.forEach(criterion => {
    const group = criterion.logicalGroup || 1;
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(criterion);
  });

  const result: string[] = [];

  // Construir descrições para cada grupo
  groups.forEach((groupCriteria, groupNumber) => {
    if (groupCriteria.length === 1) {
      const c = groupCriteria[0];
      result.push(`${c.entity} → ${c.field} → ${c.operation} → ${c.value}`);
    } else {
      // Múltiplos critérios no mesmo grupo = AND
      const groupDescription = groupCriteria
        .map(c => `${c.entity} → ${c.field} → ${c.operation} → ${c.value}`)
        .join(' E ');
      result.push(groupDescription);
    }
  });

  return result;
}

/**
 * Converte uma expressão OData em critérios legíveis
 */
export function parseODataFilter(filterExpression: string): string[] {
  const criteria: string[] = [];

  // Regex básico para capturar operações simples
  const patterns = [
    // field eq 'value'
    /(\w+)\s+(eq|ne|gt|ge|lt|le|contains|startswith|endswith)\s+['"']([^'"]*)['"']/gi,
    // field eq value (sem aspas)
    /(\w+)\s+(eq|ne|gt|ge|lt|le)\s+(\w+)/gi,
    // field operation null
    /(\w+)\s+(eq|ne)\s+null/gi
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(filterExpression)) !== null) {
      const [, field, operation, value] = match;
      const operationText = getOperationText(operation);
      const valueText = value === 'null' ? 'vazio' : (value || 'vazio');
      criteria.push(`${field} → ${operationText} → ${valueText}`);
    }
  });

  return criteria.length > 0 ? criteria : [filterExpression];
}