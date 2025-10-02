import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target,
  Users,
  Bot,
  Activity,
  Package,
} from "lucide-react";
import type { Automation } from "@/types/automations";

export const getStatusIcon = (status: Automation["status"]) => {
  switch (status) {
    case "active":
      return <CheckCircle2 className='h-4 w-4' />;
    case "inactive":
      return <XCircle className='h-4 w-4' />;
    case "error":
      return <AlertCircle className='h-4 w-4' />;
    default:
      return <XCircle className='h-4 w-4' />;
  }
};

export const getStatusColor = (status: Automation["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200";
    case "inactive":
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
    case "error":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }
};

export const getStatusText = (status: Automation["status"]) => {
  switch (status) {
    case "active":
      return "Ativa";
    case "inactive":
      return "Inativa";
    case "error":
      return "Erro";
    default:
      return "Desconhecido";
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTriggerTypeDisplay = (triggerType: string) => {
  const triggers = {
    stage_entry: "Ao entrar no estágio",
    stage_exit: "Ao sair do estágio",
    deal_created: "Ao criar negócio",
    deal_updated: "Ao alterar negócio",
    deal_won: "Ao ganhar negócio",
    deal_lost: "Ao perder negócio",
    recurring: "Recorrente",
  };
  return triggers[triggerType as keyof typeof triggers] || triggerType;
};

export const getEntityDisplay = (entityId: number | null) => {
  if (entityId === null) return "Genérica";
  const entities = {
    1: "Contatos",
    2: "Negócios",
    3: "Tarefas",
    4: "Pedidos",
  };
  return entities[entityId as keyof typeof entities] || "Desconhecido";
};

export const getEntityIcon = (entityId: number | null) => {
  if (entityId === null) return <Target className='h-4 w-4' />;
  switch (entityId) {
    case 1:
      return <Users className='h-4 w-4' />; // Contatos
    case 2:
      return <Bot className='h-4 w-4' />; // Negócios
    case 3:
      return <Activity className='h-4 w-4' />; // Tarefas
    case 4:
      return <Package className='h-4 w-4' />; // Pedidos
    default:
      return <Target className='h-4 w-4' />;
  }
};

export const getActionTypeDisplay = (typeId: string) => {
  const actionTypes: Record<string, string> = {
    "1": "Alterar campo",
    "2": "Alterar estágio",
    "3": "Criar tarefa",
    "4": "Enviar email",
    "5": "Criar nota",
    "6": "Webhook",
    unknown: "Desconhecido",
  };
  return actionTypes[typeId] || `Tipo ${typeId}`;
};