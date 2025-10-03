/**
 * Tradução e mapeamento de Actions do Ploomes
 *
 * Este arquivo centraliza o mapeamento de ActionId para nomes legíveis
 * e fornece funções auxiliares para interpretar diferentes tipos de ações.
 */

/**
 * Mapeamento de ActionId para nome da ação em português
 * Baseado na API Ploomes V2
 */
export const ACTION_TYPE_NAMES: Record<number, string> = {
  1: "Editar dados",
  2: "Mover para estágio",
  3: "Criar registro de interação",
  4: "Enviar email",
  5: "Criar tarefa",
  6: "Webhook",
  7: "Alterar responsável",
  8: "Criar negócio",
  9: "Executar integração",
  10: "Adicionar tag",
  11: "Remover tag",
  12: "Criar contato",
  13: "Atualizar contato",
  14: "Criar empresa",
  15: "Atualizar empresa",
};

/**
 * Retorna o nome legível da ação pelo ActionId
 */
export function getActionTypeName(actionId: number | undefined): string {
  if (!actionId) return "Ação desconhecida";
  return ACTION_TYPE_NAMES[actionId] || `Ação ${actionId}`;
}

/**
 * Retorna descrição do tipo de preenchimento baseado no tipo de valor
 */
export function getFillTypeDescription(valueType: string): string {
  const fillTypeMap: Record<string, string> = {
    string: "Texto",
    integer: "Número inteiro",
    decimal: "Número decimal",
    boolean: "Sim/Não",
    datetime: "Data/Hora",
    reference: "Referência",
  };

  return fillTypeMap[valueType] || "Valor fixo";
}

/**
 * Formata valor de datetime para exibição
 */
export function formatActionValue(value: string, valueType: string): string {
  if (valueType === 'datetime') {
    try {
      const date = new Date(value);
      return date.toLocaleString('pt-BR');
    } catch {
      return value;
    }
  }

  return value;
}
