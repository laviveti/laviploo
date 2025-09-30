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
  MessageSquare
} from "lucide-react";

export interface AutomationEntity {
  id: number;
  name: string;
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export const AUTOMATION_ENTITIES: AutomationEntity[] = [
  { id: 1, name: "contacts", displayName: "Cliente", icon: Users },
  { id: 2, name: "workflow", displayName: "Workflow", icon: Bot },
  { id: 4, name: "deals", displayName: "Venda", icon: ShoppingCart },
  { id: 7, name: "proposals", displayName: "Proposta", icon: ClipboardList },
  { id: 10, name: "products", displayName: "Produto", icon: Package },
  { id: 12, name: "tasks", displayName: "Tarefa", icon: Activity },
  { id: 24, name: "users", displayName: "Usuário", icon: User },
  { id: 36, name: "interactions", displayName: "Registro de Interação", icon: MessageSquare },
  { id: 66, name: "documents", displayName: "Documento", icon: FileText },
];