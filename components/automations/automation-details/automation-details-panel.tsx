"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Settings,
  User,
  XCircle,
  AlertCircle,
  Bot,
  Target,
  Filter,
  Play,
  ExternalLink,
  Clock,
  History,
  ChevronRight,
  ChevronDown,
  Package,
  Activity,
  Users,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import { useAutomationDetails, type AutomationWithDetails } from "@/hooks/use-automation-details";
import type { Automation } from "@/types/automations";

interface AutomationDetailsPanelProps {
  automationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AutomationDetailsPanel = ({ automationId, open, onOpenChange }: AutomationDetailsPanelProps) => {
  const [showFilterCriteria, setShowFilterCriteria] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const { data: automation, isLoading, error, refetch } = useAutomationDetails(automationId);

  const handleClose = () => {
    onOpenChange(false);
  };

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
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTriggerTypeDisplay = (triggerType: string) => {
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

  const getEntityDisplay = (entityId: number) => {
    const entities = {
      1: "Contatos",
      2: "Negócios",
      3: "Tarefas",
      4: "Pedidos",
    };
    return entities[entityId as keyof typeof entities] || "Desconhecido";
  };

  const getEntityIcon = (entityId: number) => {
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

  const getActionTypeDisplay = (typeId: string) => {
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full p-2 sm:max-w-2xl overflow-y-auto'>
        {/* Loading state */}
        {isLoading && (
          <div className='space-y-6 py-6'>
            <div className='border-b pb-4'>
              <Skeleton className='h-6 w-3/4 mb-2' />
              <Skeleton className='h-4 w-1/2' />
            </div>
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='border rounded-md p-4'>
                  <Skeleton className='h-4 w-1/3 mb-3' />
                  <Skeleton className='h-3 w-full mb-2' />
                  <Skeleton className='h-3 w-2/3' />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className='flex flex-col items-center justify-center py-12 px-6 text-center'>
            <AlertCircle className='h-8 w-8 text-red-500 mb-3' />
            <h3 className='text-sm font-medium text-zinc-800 mb-2'>Erro ao carregar detalhes</h3>
            <p className='text-xs text-zinc-600 mb-4'>{error instanceof Error ? error.message : "Erro desconhecido"}</p>
            <Button variant='outline' size='sm' onClick={() => refetch()} className='h-8 px-3 text-xs'>
              <RefreshCcw className='h-3 w-3 mr-1' />
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Success state */}
        {automation && !isLoading && !error && (
          <>
            <SheetHeader className='border-b pb-4'>
              <div className='flex items-start justify-between'>
                <div className='flex-1 min-w-0'>
                  <SheetTitle className='text-lg font-semibold text-zinc-900 leading-tight'>{automation.name}</SheetTitle>
                  <div className='flex items-center gap-2 mt-2'>
                    <Badge className={`gap-1 text-xs px-2 py-1 rounded-md ${getStatusColor(automation.status)}`}>
                      {getStatusIcon(automation.status)}
                      {getStatusText(automation.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Subtitle with entity and trigger */}
              <div className='flex items-center gap-2 text-sm text-zinc-600 mt-2'>
                {getEntityIcon(automation.entityId)}
                <span className='font-medium'>{getEntityDisplay(automation.entityId)}</span>
                <span>{getTriggerTypeDisplay(automation.triggerType)}</span>
              </div>
            </SheetHeader>

            <div className='space-y-6 py-6'>
              {/* Trigger Section */}
              <Card className='border-zinc-200'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
                    <Target className='h-4 w-4 text-blue-600' />
                    {/* {getTriggerTypeDisplay(automation.triggerType)} */}
                    Gatilho: {` ${getTriggerTypeDisplay(automation.triggerType)}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='space-y-2'>
                    <div className='text-xs text-zinc-600'>
                      <span className='font-medium'>Entidade:</span> {getEntityDisplay(automation.entityId)}
                    </div>
                    {automation.stageId && (
                      <div className='text-xs text-zinc-600'>
                        <span className='font-medium'>Estágio específico:</span> {automation.stageName || automation.stageId}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Execution Conditions */}
              <Card className='border-zinc-200'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center justify-between text-sm font-medium text-zinc-800'>
                    <div className='flex items-center gap-2'>
                      <Filter className='h-4 w-4 text-orange-600' />
                      Condições de Execução
                    </div>
                    {automation.filterCriteria && automation.filterCriteria.length > 0 && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setShowFilterCriteria(!showFilterCriteria)}
                        className='h-6 w-6 p-0 hover:bg-zinc-100 rounded-md'>
                        {showFilterCriteria ? <ChevronDown className='h-3 w-3' /> : <ChevronRight className='h-3 w-3' />}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='space-y-3'>
                    {/* Filter Conditions */}
                    {automation.filterConditions && automation.filterConditions.length > 0 && (
                      <div className='space-y-3'>
                        {automation.filterConditions.map((condition, index) => (
                          <div key={index} className='p-3 bg-zinc-50 border border-zinc-200 rounded-md'>
                            <div className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
                              <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                              <span>Filtro {index + 1}</span>
                            </div>
                            <div className='text-sm text-zinc-700 mt-1 font-mono bg-white p-2 rounded border'>{condition}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Expanded Filter Criteria */}
                    {showFilterCriteria && automation.filterCriteria && automation.filterCriteria.length > 0 && (
                      <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md'>
                        <div className='text-sm font-medium text-blue-800 mb-3 flex items-center gap-2'>
                          <Filter className='h-4 w-4' />
                          Critérios detalhados dos filtros
                        </div>
                        <div className='space-y-3'>
                          {automation.filterCriteria.map((criteria, index) => (
                            <div key={index} className='bg-white border border-blue-200 rounded-md p-3'>
                              <div className='flex items-center justify-between mb-2'>
                                <span className='text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded'>Critério {index + 1}</span>
                                {criteria.logicalGroup && <span className='text-xs text-blue-600'>Grupo {criteria.logicalGroup}</span>}
                              </div>

                              <div className='grid grid-cols-1 gap-2 text-sm'>
                                <div className='flex items-center gap-2'>
                                  <span className='text-zinc-500 text-xs font-medium w-16'>Entidade:</span>
                                  <span className='font-medium text-zinc-800 bg-zinc-100 px-2 py-1 rounded'>{criteria.entity}</span>
                                </div>

                                <div className='flex items-center gap-2'>
                                  <span className='text-zinc-500 text-xs font-medium w-16'>Campo:</span>
                                  <span className='font-medium text-zinc-800 bg-zinc-100 px-2 py-1 rounded'>{criteria.field}</span>
                                </div>

                                <div className='flex items-center gap-2'>
                                  <span className='text-zinc-500 text-xs font-medium w-16'>Operação:</span>
                                  <span className='font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded'>{criteria.operation}</span>
                                </div>

                                <div className='flex items-center gap-2'>
                                  <span className='text-zinc-500 text-xs font-medium w-16'>Valor:</span>
                                  <span className='font-medium text-zinc-800 bg-green-100 px-2 py-1 rounded text-green-700'>{criteria.value}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Filter Expression */}
                    {automation.filterExpression && (
                      <div className='p-2 bg-zinc-100 border rounded-md'>
                        <div className='text-xs font-medium text-zinc-600 mb-1'>Expressão do filtro:</div>
                        <code className='text-xs text-zinc-700 break-all'>{automation.filterExpression}</code>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className='border-zinc-200'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center justify-between text-sm font-medium text-zinc-800'>
                    <div className='flex items-center gap-2'>
                      <Settings className='h-4 w-4 text-green-600' />
                      Ações da Automação
                      {automation.actions && automation.actions.length > 0 && (
                        <Badge variant='outline' className='text-xs px-2 py-0 ml-2'>
                          {automation.actions.length} ações
                        </Badge>
                      )}
                    </div>
                    {automation.actions && automation.actions.length > 0 && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setShowActions(!showActions)}
                        className='h-6 w-6 p-0 hover:bg-zinc-100 rounded-md'>
                        {showActions ? <ChevronDown className='h-3 w-3' /> : <ChevronRight className='h-3 w-3' />}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {automation.actions && automation.actions.length > 0 ? (
                      <>
                        {showActions && (
                          <div className='space-y-3'>
                            {automation.actions.map((action, index) => (
                              <div key={action.id} className='p-3 bg-zinc-50 border rounded-md'>
                                <div className='flex items-start justify-between'>
                                  <div className='flex-1'>
                                    <div className='text-sm font-medium text-zinc-800 flex items-center gap-2'>
                                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                      <span>
                                        {index + 1}. {action.name}
                                      </span>
                                    </div>
                                    <div className='text-xs text-zinc-600 mt-1'>Tipo: {getActionTypeDisplay(action.type)}</div>
                                    {action.parameters && Object.keys(action.parameters).length > 0 && (
                                      <div className='text-xs text-zinc-500 mt-1'>Parâmetros configurados</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className='flex items-center gap-2 text-sm text-zinc-500'>
                        <div className='w-2 h-2 bg-zinc-400 rounded-full'></div>
                        <span>Nenhuma ação configurada</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Execution History */}
              {automation.executionHistory && automation.executionHistory.length > 0 && (
                <Card className='border-zinc-200'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='flex items-center justify-between text-sm font-medium text-zinc-800'>
                      <div className='flex items-center gap-2'>
                        <History className='h-4 w-4 text-purple-600' />
                        Histórico de Execução
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setShowHistory(!showHistory)}
                        className='h-6 w-6 p-0 hover:bg-zinc-100 rounded-md'>
                        {showHistory ? <ChevronDown className='h-3 w-3' /> : <ChevronRight className='h-3 w-3' />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showHistory && (
                    <CardContent>
                      <div className='space-y-2'>
                        {automation.executionHistory.map((execution, index) => (
                          <div key={index} className='p-2 bg-zinc-50 border rounded-md'>
                            <div className='flex items-center justify-between text-xs'>
                              <div className='flex items-center gap-2'>
                                {execution.status === "success" && <CheckCircle2 className='h-3 w-3 text-green-500' />}
                                {execution.status === "error" && <XCircle className='h-3 w-3 text-red-500' />}
                                {execution.status === "skipped" && <Clock className='h-3 w-3 text-yellow-500' />}
                                <span className='font-medium'>{formatDate(execution.date)}</span>
                              </div>
                            </div>
                            {execution.message && <div className='text-xs text-zinc-600 mt-1'>{execution.message}</div>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Metadata */}
              <Card className='border-zinc-200'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
                    <Bot className='h-4 w-4 text-purple-600' />
                    Informações da Automação
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='grid grid-cols-1 gap-3 text-xs'>
                    <div className='flex justify-between'>
                      <span className='text-zinc-600'>ID:</span>
                      <span className='font-medium text-zinc-900'>{automation.id}</span>
                    </div>

                    {automation.filterId && (
                      <div className='flex justify-between'>
                        <span className='text-zinc-600'>ID do Filtro:</span>
                        <span className='font-medium text-zinc-900'>{automation.filterId}</span>
                      </div>
                    )}

                    {automation.creator && (
                      <div className='flex justify-between'>
                        <span className='text-zinc-600 flex items-center gap-1'>
                          <User className='h-3 w-3' />
                          Criada por:
                        </span>
                        <span className='font-medium text-zinc-900'>
                          {automation.creator} em {formatDate(automation.createdAt)}
                        </span>
                      </div>
                    )}

                    {/* Last Update Information */}
                    {(automation.lastUpdateDate || automation.updater) && (
                      <div className='flex justify-between'>
                        <span className='text-zinc-600 flex items-center gap-1'>
                          <User className='h-3 w-3' />
                          Última atualização por:
                        </span>
                        <span className='font-medium text-zinc-900'>
                          {automation.updater || automation.creator || "Sistema"} em{" "}
                          {automation.lastUpdateDate
                            ? new Date(automation.lastUpdateDate).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }) +
                              " às " +
                              new Date(automation.lastUpdateDate).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date(automation.createdAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }) +
                              " às " +
                              new Date(automation.createdAt).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </span>
                      </div>
                    )}

                    {/* última execução */}
                    {automation.lastRun && (
                      <div className='flex justify-between'>
                        <span className='text-zinc-600 flex items-center gap-1'>
                          <Play className='h-3 w-3' />
                          Última execução:
                        </span>
                        <span className='font-medium text-zinc-900'>{formatDate(automation.lastRun)}</span>
                      </div>
                    )}

                    <div className='flex justify-between'>
                      <span className='text-zinc-600'>Status:</span>
                      <span className='font-medium text-zinc-900'>
                        {automation.enabled ? "Habilitada" : "Desabilitada"}
                        {automation.hasError && " (com erro)"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
