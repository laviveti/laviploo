/**
 * Tipos de campos que podem ser buscados na busca global
 */
export type AutomationMatchType = "nome" | "criador" | "gatilho" | "filtro" | "disparo" | "ação" | "entidade" | "pipeline" | "estágio";

/**
 * Campos de ordenação disponíveis
 */
export type AutomationSortField = "createdAt" | "lastUpdateDate" | "name";

/**
 * Direção da ordenação
 */
export type SortOrder = "asc" | "desc";

/**
 * Filtros completos para automações
 */
export interface AutomationFilters {
  // Busca de texto
  search?: string;

  // Tipos de match para busca
  matchTypes?: AutomationMatchType[];

  // Filtros de status
  status?: "all" | "active" | "inactive" | "error";

  // Filtro por criador
  createdBy?: string;

  // Filtros de data
  dateFrom?: string; // yyyy-MM-dd
  dateTo?: string;   // yyyy-MM-dd

  // Ordenação
  sortBy?: AutomationSortField;
  sortOrder?: SortOrder;
}
