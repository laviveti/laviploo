"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
  ClipboardList
} from "lucide-react";

interface AutomationEntity {
  id: number;
  name: string;
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface AutomationEntitiesSidebarProps {
  selectedEntityId: number | null;
  onEntitySelect: (entityId: number | null) => void;
  entityCounts?: Record<number, number>;
}

const AUTOMATION_ENTITIES: AutomationEntity[] = [
  { id: 1, name: "contacts", displayName: "Contatos", icon: Users },
  { id: 2, name: "deals", displayName: "Workflow", icon: Bot },
  { id: 3, name: "tasks", displayName: "Tarefas", icon: Activity },
  { id: 4, name: "orders", displayName: "Pedidos", icon: Package },
  { id: 5, name: "quotes", displayName: "Cotações", icon: FileText },
  { id: 6, name: "leads", displayName: "Leads", icon: Building2 },
  { id: 7, name: "quotes", displayName: "Proposta", icon: ClipboardList },
  { id: 8, name: "users", displayName: "Usuários", icon: User },
  { id: 9, name: "workflow", displayName: "Workflow", icon: Workflow },
  { id: 10, name: "system", displayName: "Sistema", icon: Settings }
];

export const AutomationEntitiesSidebar = ({
  selectedEntityId,
  onEntitySelect,
  entityCounts = {}
}: AutomationEntitiesSidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-zinc-200 h-full">
      <div className="p-3 border-b border-zinc-100">
        <button
          onClick={() => onEntitySelect(null)}
          className={cn(
            "w-full text-left px-2 py-2 text-xs rounded-sm transition-colors",
            selectedEntityId === null
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "text-zinc-600 hover:bg-zinc-50"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3" />
              <span>Todas as Entidades</span>
            </div>
            {Object.values(entityCounts).reduce((sum, count) => sum + count, 0) > 0 && (
              <Badge variant="secondary" className="h-4 text-xs px-1">
                {Object.values(entityCounts).reduce((sum, count) => sum + count, 0)}
              </Badge>
            )}
          </div>
        </button>
      </div>

      <div className="p-2">
        <h3 className="text-sm font-semibold text-zinc-800 mb-2 px-2">Entidades</h3>
        <div className="space-y-1">
          {AUTOMATION_ENTITIES.map((entity) => {
            const Icon = entity.icon;
            const count = entityCounts[entity.id] || 0;
            const isSelected = selectedEntityId === entity.id;

            return (
              <button
                key={entity.id}
                onClick={() => onEntitySelect(entity.id)}
                disabled={count === 0}
                className={cn(
                  "w-full text-left px-2 py-2 text-xs rounded-sm transition-colors",
                  isSelected
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : count > 0
                      ? "text-zinc-700 hover:bg-zinc-50"
                      : "text-zinc-400 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3 w-3" />
                    <span>{entity.displayName}</span>
                  </div>
                  {count > 0 && (
                    <Badge
                      variant={isSelected ? "default" : "secondary"}
                      className="h-4 text-xs px-1"
                    >
                      {count}
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-2 border-t border-zinc-100">
        <div className="text-xs text-zinc-500 px-2">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="h-3 w-3" />
            <span>Última atualização</span>
          </div>
          <p>Há {Math.floor(Math.random() * 5) + 1} minutos</p>
        </div>
      </div>
    </div>
  );
};