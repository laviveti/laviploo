import {
  Users,
  Bot,
  Activity,
  Package,
  ShoppingCart,
  FileText,
  User,
  Settings,
  Clock,
  Workflow,
  Building2,
  ClipboardList,
  MapPin,
  MessageSquare,
  Target
} from "lucide-react";

/**
 * MAPEAMENTO CENTRALIZADO DE ENTIDADES
 * =====================================
 *
 * Este arquivo é a ÚNICA fonte de verdade para mapeamento de entidades.
 *
 * IDs VISUAIS (usados na UI) vs EntityId do Ploomes:
 * - ID Visual 1 → EntityId Ploomes 1 (Contatos)
 * - ID Visual 2 → EntityId Ploomes 2 COM TriggerDealStageId (Workflow)
 * - ID Visual 3 → EntityId Ploomes 3 (Tarefas)
 * - ID Visual 4 → EntityId Ploomes 4 (Pedidos)
 * - ID Visual 7 → EntityId Ploomes 7 (Propostas)
 * - ID Visual 10 → EntityId Ploomes 10 (Produtos)
 * - ID Visual 12 → EntityId Ploomes 12 (Tarefas)
 * - ID Visual 24 → EntityId Ploomes 24 (Usuários)
 * - ID Visual 36 → EntityId Ploomes 36 (Registro de Interação)
 * - ID Visual 66 → EntityId Ploomes 66 (Documentos)
 * - Genéricas → EntityId null OU (EntityId 2 SEM TriggerDealStageId)
 */

export interface AutomationEntity {
  id: number;
  name: string;
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export const AUTOMATION_ENTITIES: AutomationEntity[] = [
  { id: 1, name: "contacts", displayName: "Contatos", icon: Users },
  { id: 2, name: "workflow", displayName: "Workflow", icon: Bot },
  { id: 3, name: "tasks", displayName: "Tarefas", icon: Activity },
  { id: 4, name: "deals", displayName: "Pedidos", icon: Package },
  { id: 7, name: "proposals", displayName: "Propostas", icon: ClipboardList },
  { id: 10, name: "products", displayName: "Produtos", icon: Package },
  { id: 12, name: "tasks", displayName: "Tarefas", icon: Activity },
  { id: 24, name: "users", displayName: "Usuários", icon: User },
  { id: 36, name: "interactions", displayName: "Registro de Interação", icon: MessageSquare },
  { id: 66, name: "documents", displayName: "Documentos", icon: FileText },
];

/**
 * Converte EntityId do Ploomes + contexto para ID Visual da UI
 */
export function getVisualEntityId(
  ploomesEntityId: number | null,
  hasTriggerDealStageId: boolean
): number | null {
  // Genéricas: sem EntityId OU EntityId 2 sem stage
  if (ploomesEntityId === null || (ploomesEntityId === 2 && !hasTriggerDealStageId)) {
    return null;
  }

  // EntityId 2 COM TriggerDealStageId = Workflow (ID visual 2)
  if (ploomesEntityId === 2 && hasTriggerDealStageId) {
    return 2;
  }

  // Outros: mapeamento direto (IDs visuais = EntityIds do Ploomes)
  return ploomesEntityId;
}

/**
 * Converte ID Visual da UI para filtro OData do Ploomes
 */
export function getPloomesFilter(visualEntityId: number | null): string | null {
  // Genéricas
  if (visualEntityId === null) {
    return '(EntityId eq null or (EntityId eq 2 and TriggerDealStageId eq null))';
  }

  // Workflow (ID visual 2)
  if (visualEntityId === 2) {
    return 'EntityId eq 2 and TriggerDealStageId ne null';
  }

  // Outras entidades: filtro simples
  return `EntityId eq ${visualEntityId}`;
}

/**
 * Retorna o nome display da entidade pelo ID visual
 */
export function getEntityDisplayName(visualEntityId: number | null): string {
  if (visualEntityId === null) return 'Genérica';
  const entity = AUTOMATION_ENTITIES.find(e => e.id === visualEntityId);
  return entity?.displayName || `Entidade ${visualEntityId}`;
}

/**
 * Retorna o ícone da entidade pelo ID visual
 */
export function getEntityIcon(visualEntityId: number | null, className = 'h-4 w-4'): React.ReactElement {
  if (visualEntityId === null) {
    const Icon = Target;
    return <Icon className={className} />;
  }

  const entity = AUTOMATION_ENTITIES.find(e => e.id === visualEntityId);
  const Icon = entity?.icon || Target;
  return <Icon className={className} />;
}

/**
 * Retorna a entidade completa pelo ID visual
 */
export function getEntityById(visualEntityId: number | null): AutomationEntity | null {
  if (visualEntityId === null) return null;
  return AUTOMATION_ENTITIES.find(e => e.id === visualEntityId) || null;
}