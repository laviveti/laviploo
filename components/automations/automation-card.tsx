"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Calendar,
  Bot,
  Zap,
  Users,
  Package,
  Activity
} from "lucide-react";
import type { Automation, AutomationAction } from "@/types/automations";
import { Hint } from "../system/hint";

interface AutomationCardProps {
  automation: Automation;
}

export const AutomationCard = ({ automation }: AutomationCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = (status: Automation["status"]) => {
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

  const getStatusColor = (status: Automation["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white hover:bg-green-600";
      case "inactive":
        return "bg-zinc-400 text-white hover:bg-zinc-500";
      case "error":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-zinc-400 text-white hover:bg-zinc-500";
    }
  };

  const getStatusText = (status: Automation["status"]) => {
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

  const getEntityIcon = (entityId: number) => {
    switch (entityId) {
      case 1: return <Users className='h-4 w-4' />; // Contatos
      case 2: return <Bot className='h-4 w-4' />; // Negócios
      case 3: return <Activity className='h-4 w-4' />; // Tarefas
      case 4: return <Package className='h-4 w-4' />; // Pedidos
      default: return <Zap className='h-4 w-4' />;
    }
  };

  const getTriggerTypeColor = (triggerType: string) => {
    switch (triggerType) {
      case "stage_entry":
        return "text-blue-600 border-blue-300 bg-blue-50";
      case "stage_exit":
        return "text-purple-600 border-purple-300 bg-purple-50";
      case "deal_created":
        return "text-green-600 border-green-300 bg-green-50";
      case "deal_updated":
        return "text-orange-600 border-orange-300 bg-orange-50";
      case "deal_won":
        return "text-emerald-600 border-emerald-300 bg-emerald-50";
      case "deal_lost":
        return "text-red-600 border-red-300 bg-red-50";
      case "recurring":
        return "text-indigo-600 border-indigo-300 bg-indigo-50";
      default:
        return "text-zinc-600 border-zinc-300 bg-zinc-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className='hover:shadow-md transition-all duration-200 border-zinc-200 group rounded-md'>
      <CardHeader className='pb-2 px-3 py-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-start gap-2 min-w-0 flex-1'>
            {getEntityIcon(automation.entityId)}
            <div className='min-w-0 flex-1'>
              <CardTitle className='text-sm font-semibold text-zinc-800 group-hover:text-rose-600 transition-colors leading-tight line-clamp-2'>
                {automation.name}
              </CardTitle>
              <div className='flex items-center gap-1 mt-1'>
                <Badge variant='outline' className={`text-xs px-2 py-0 rounded-md ${getTriggerTypeColor(automation.triggerType)}`}>
                  {automation.triggerName}
                </Badge>
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(automation.status)} gap-1 text-xs shrink-0 rounded-md`}>
            {getStatusIcon(automation.status)}
            <span className='hidden sm:inline'>{getStatusText(automation.status)}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-3 px-3 pb-3'>
        {/* Entity and Basic Info */}
        <div className='flex items-center justify-between text-xs text-zinc-500'>
          <span className='flex items-center gap-1'>
            <span className='font-medium'>{automation.entityName}</span>
          </span>
          <span className='truncate ml-2'>
            ID: {automation.id}
          </span>
        </div>

        {/* Description */}
        {automation.description && (
          <div className='text-xs text-zinc-600 leading-relaxed'>
            {automation.description}
          </div>
        )}

        {/* Creator and Date Info */}
        <div className='flex items-center justify-between text-xs text-zinc-500'>
          <div className='flex items-center gap-1 truncate'>
            {automation.creator && (
              <>
                <User className='h-3 w-3' />
                <span className='truncate'>{automation.creator}</span>
              </>
            )}
          </div>
          <div className='flex items-center gap-1 shrink-0'>
            <Calendar className='h-3 w-3' />
            <span>{formatDate(automation.createdAt)}</span>
          </div>
        </div>

        {/* Last Run */}
        {automation.lastRun && (
          <div className='flex items-center gap-1 text-xs text-zinc-500'>
            <Clock className='h-3 w-3' />
            <span>Última execução: {formatDate(automation.lastRun)}</span>
          </div>
        )}

        {/* Actions Summary and Toggle */}
        {automation.actions && automation.actions.length > 0 && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium text-zinc-700'>
                Ações configuradas
              </span>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='text-xs px-2 py-1 text-zinc-600 border-zinc-300 bg-zinc-50 rounded-md'>
                  {automation.actions.length} ações
                </Badge>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowDetails(!showDetails)}
                  className='h-6 w-6 p-0 hover:bg-zinc-100 rounded-md'>
                  {showDetails ? <ChevronUp className='h-3 w-3' /> : <ChevronDown className='h-3 w-3' />}
                </Button>
              </div>
            </div>

            {/* Expanded Actions Details */}
            {showDetails && (
              <div className='mt-2 space-y-1 border-t pt-2'>
                {automation.actions.map((action, index) => (
                  <div key={action.id} className='flex items-center justify-between text-xs py-1'>
                    <span className='font-medium text-zinc-700 truncate'>
                      {index + 1}. {action.name}
                    </span>
                    <Badge variant='outline' className='text-xs px-1 py-0 text-zinc-500 border-zinc-300 rounded-sm'>
                      {action.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};