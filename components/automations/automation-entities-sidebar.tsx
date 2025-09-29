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
  ClipboardList,
  MapPin,
  MessageSquare
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
  entityCounts?: Record<number, { total: number; active: number }>;
  genericCount?: { total: number; active: number };
  totalCount?: number;
  selectedFilter?: 'all' | 'generic' | null;
  onFilterSelect?: (filter: 'all' | 'generic' | null) => void;
}

const AUTOMATION_ENTITIES: AutomationEntity[] = [
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

export const AutomationEntitiesSidebar = ({
  selectedEntityId,
  onEntitySelect,
  entityCounts = {},
  genericCount = { total: 0, active: 0 },
  totalCount = 0,
  selectedFilter = null,
  onFilterSelect
}: AutomationEntitiesSidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-zinc-200 h-full">
      <div className="p-3 border-b border-zinc-100 space-y-1">
        <button
          onClick={() => {
            onEntitySelect(null);
            onFilterSelect?.('all');
          }}
          className={cn(
            "w-full text-left px-2 py-2 text-xs rounded-sm transition-colors",
            selectedEntityId === null && (selectedFilter === 'all' || selectedFilter === null)
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "text-zinc-600 hover:bg-zinc-50"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3" />
              <span>Todas as Entidades</span>
            </div>
            {totalCount > 0 && (
              <Badge variant="secondary" className="h-4 text-xs px-1">
                {totalCount}
              </Badge>
            )}
          </div>
        </button>
        
        <button
          onClick={() => {
            onEntitySelect(null);
            onFilterSelect?.('generic');
          }}
          className={cn(
            "w-full text-left px-2 py-2 text-xs rounded-sm transition-colors",
            selectedEntityId === null && selectedFilter === 'generic'
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : genericCount.total > 0
                ? "text-zinc-600 hover:bg-zinc-50"
                : "text-zinc-400 cursor-not-allowed"
          )}
          disabled={genericCount.total === 0}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-3 w-3" />
              <span>Genéricas</span>
            </div>
            {genericCount.total > 0 && (
              <Badge 
                variant={selectedEntityId === null && selectedFilter === 'generic' ? "default" : "secondary"} 
                className="h-4 text-xs px-1"
              >
                {genericCount.active}/{genericCount.total}
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
            const entityData = entityCounts[entity.id] || { total: 0, active: 0 };
            const isSelected = selectedEntityId === entity.id;

            return (
              <button
                key={entity.id}
                onClick={() => {
                  onEntitySelect(entity.id);
                  onFilterSelect?.('all');
                }}
                disabled={false}
                className={cn(
                  "w-full text-left px-2 py-2 text-xs rounded-sm transition-colors",
                  isSelected && selectedFilter !== 'generic'
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "text-zinc-700 hover:bg-zinc-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3 w-3" />
                    <span>{entity.displayName}</span>
                  </div>
                  <Badge
                    variant={isSelected ? "default" : "secondary"}
                    className="h-4 text-xs px-1"
                  >
                    {entityData.active}/{entityData.total}
                  </Badge>
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