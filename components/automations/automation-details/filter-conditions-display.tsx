"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { parseODataFilter, type ParsedFilter, type FilterCondition } from "@/lib/odata-filter-parser";
import {
  Filter,
  Settings,
  Database,
  Zap,
  ArrowRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterConditionsDisplayProps {
  filterExpression?: string;
  filterName?: string;
  stageName?: string;
  stageId?: number;
  className?: string;
}

interface ConditionCardProps {
  condition: FilterCondition;
  index: number;
  total: number;
  logic: 'AND' | 'OR';
}

const ConditionCard = ({ condition, index, total, logic }: ConditionCardProps) => {
  const getEntityColor = (entity?: string) => {
    switch (entity?.toLowerCase()) {
      case 'negócio':
      case 'deal':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'contato':
      case 'contact':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'tarefa':
      case 'task':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'campos personalizados':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      default:
        return 'text-zinc-700 bg-zinc-50 border-zinc-200';
    }
  };

  const getOperatorColor = (operator: string) => {
    if (operator.includes('Igual') || operator.includes('É')) {
      return 'text-blue-600';
    }
    if (operator.includes('Diferente') || operator.includes('Não')) {
      return 'text-red-600';
    }
    if (operator.includes('Maior') || operator.includes('Menor')) {
      return 'text-purple-600';
    }
    if (operator.includes('Contém')) {
      return 'text-green-600';
    }
    return 'text-zinc-600';
  };

  return (
    <div className="relative">
      {/* Card da condição */}
      <div className="bg-white border border-zinc-200 rounded-sm p-3 shadow-sm">
        <div className="grid grid-cols-4 gap-3 items-center">
          {/* Entidade */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
              ENTIDADE
            </span>
            <Badge
              variant="outline"
              className={cn("text-xs px-2 py-1 justify-start", getEntityColor(condition.entity))}
            >
              <Database className="h-3 w-3 mr-1" />
              {condition.entity || 'Sistema'}
            </Badge>
          </div>

          {/* Campo */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
              CAMPO
            </span>
            <div className="text-sm font-medium text-zinc-800">
              {condition.displayName || condition.field}
            </div>
            {condition.fieldId && (
              <div className="text-xs text-zinc-500 mt-1">
                ID: {condition.fieldId}
              </div>
            )}
          </div>

          {/* Operação */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
              OPERAÇÃO
            </span>
            <div className={cn("text-sm font-medium", getOperatorColor(condition.operator))}>
              {condition.operator}
            </div>
          </div>

          {/* Valor */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
              VALOR
            </span>
            <div className="text-sm text-zinc-700 font-mono bg-zinc-50 px-2 py-1 rounded-sm border">
              {condition.value || '(não especificado)'}
            </div>
          </div>
        </div>
      </div>

      {/* Conector lógico */}
      {index < total - 1 && (
        <div className="flex items-center justify-center my-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-full">
            <span className="text-xs font-bold text-zinc-600">
              {logic}
            </span>
            <ArrowRight className="h-3 w-3 text-zinc-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export const FilterConditionsDisplay = ({
  filterExpression,
  filterName,
  stageName,
  stageId,
  className
}: FilterConditionsDisplayProps) => {
  const parsedFilter = useMemo(() => {
    if (!filterExpression) return null;
    return parseODataFilter(filterExpression);
  }, [filterExpression]);

  const hasConditions = parsedFilter?.conditions && parsedFilter.conditions.length > 0;
  const hasStage = stageName || stageId;

  if (!hasConditions && !hasStage) {
    return (
      <div className={cn("text-center py-4 text-zinc-500 text-sm", className)}>
        <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p>Nenhuma condição específica configurada</p>
        <p className="text-xs mt-1">Esta automação será executada sempre que o gatilho for ativado</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Cabeçalho */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-amber-600" />
        <h3 className="text-base font-semibold text-zinc-800">Filtros</h3>
        {parsedFilter?.isComplex && (
          <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-300 text-xs">
            Filtro Complexo
          </Badge>
        )}
      </div>

      {/* Nome do filtro se disponível */}
      {filterName && (
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="h-3 w-3 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {filterName}
            </span>
          </div>
          <p className="text-xs text-blue-700">
            Para ver os critérios detalhados, acesse a automação diretamente no Ploomes
          </p>
        </div>
      )}

      {/* Condições do filtro */}
      {hasConditions && (
        <div className="space-y-3">
          <div className="text-sm text-zinc-600 mb-3">
            <span className="font-medium">Critérios do Filtro</span>
            {parsedFilter && (
              <span className="ml-2 text-xs bg-zinc-100 px-2 py-1 rounded-sm">
                Lógica: {parsedFilter.logic === 'AND' ? 'Todas as condições' : 'Qualquer condição'}
              </span>
            )}
          </div>

          {parsedFilter?.conditions.map((condition, index) => (
            <ConditionCard
              key={`${condition.field}-${index}`}
              condition={condition}
              index={index}
              total={parsedFilter.conditions.length}
              logic={parsedFilter.logic}
            />
          ))}
        </div>
      )}

      {/* Separador se há ambos */}
      {hasConditions && hasStage && <Separator />}

      {/* Estágio específico */}
      {hasStage && (
        <div className="bg-rose-50 border border-rose-200 rounded-sm p-3">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-rose-600" />
            <span className="text-sm font-medium text-rose-800">
              Estágio específico: {stageName || stageId}
            </span>
          </div>
          {stageId && (
            <p className="text-xs text-rose-700 mt-1">
              ID do estágio: {stageId}
            </p>
          )}
        </div>
      )}

      {/* Filtro bruto para debug (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && filterExpression && (
        <details className="text-xs">
          <summary className="text-zinc-500 cursor-pointer hover:text-zinc-700">
            Ver filtro bruto (debug)
          </summary>
          <div className="mt-2 p-2 bg-zinc-100 rounded-sm font-mono text-zinc-600 break-all">
            {filterExpression}
          </div>
        </details>
      )}
    </div>
  );
};