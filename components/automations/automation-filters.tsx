"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter, RotateCcw, Calendar as CalendarIcon, User, ArrowUpDown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { AutomationFilters as Filters, AutomationMatchType, AutomationSortField, SortOrder } from "@/types/filters";

interface AutomationFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  selectedEntityName?: string;
  filters?: Filters;
}

const MATCH_TYPES: { value: AutomationMatchType; label: string }[] = [
  { value: "nome", label: "Nome" },
  { value: "criador", label: "Criador" },
  { value: "gatilho", label: "Gatilho" },
  { value: "filtro", label: "Filtro" },
  { value: "disparo", label: "Disparo" },
  { value: "ação", label: "Ação" },
  { value: "entidade", label: "Entidade" },
  { value: "pipeline", label: "Pipeline" },
  { value: "estágio", label: "Estágio" },
];

const SORT_OPTIONS: { value: AutomationSortField; label: string }[] = [
  { value: "createdAt", label: "Data de Criação" },
  { value: "lastUpdateDate", label: "Última Atualização" },
  { value: "name", label: "Nome" },
];

export const AutomationFilters = ({ onFiltersChange, selectedEntityName, filters }: AutomationFiltersProps) => {
  const [search, setSearch] = useState("");
  const [matchTypes, setMatchTypes] = useState<AutomationMatchType[]>([]);
  const [status, setStatus] = useState<"all" | "active" | "inactive" | "error">("all");
  const [createdBy, setCreatedBy] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [sortBy, setSortBy] = useState<AutomationSortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounced filters change
  const debouncedOnFiltersChange = useCallback(
    debounce((filters: Filters) => {
      onFiltersChange(filters);
    }, 300),
    [onFiltersChange]
  );

  useEffect(() => {
    const newFilters: Filters = {
      search: search || undefined,
      matchTypes: matchTypes.length > 0 ? matchTypes : undefined,
      status: status !== "all" ? status : undefined,
      createdBy: createdBy || undefined,
      dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
      dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      sortBy,
      sortOrder,
    };

    debouncedOnFiltersChange(newFilters);
  }, [search, matchTypes, status, createdBy, dateFrom, dateTo, sortBy, sortOrder, debouncedOnFiltersChange]);

  // Resetar filtros quando props externas estão vazias
  useEffect(() => {
    if (filters && Object.keys(filters).length === 0) {
      setSearch("");
      setMatchTypes([]);
      setStatus("all");
      setCreatedBy("");
      setDateFrom(undefined);
      setDateTo(undefined);
      setSortBy("createdAt");
      setSortOrder("desc");
    }
  }, [filters]);

  // Resetar filtros quando muda de entidade
  useEffect(() => {
    setSearch("");
    setMatchTypes([]);
    setStatus("all");
    setCreatedBy("");
    setDateFrom(undefined);
    setDateTo(undefined);
  }, [selectedEntityName]);

  const clearFilters = () => {
    setSearch("");
    setMatchTypes([]);
    setStatus("all");
    setCreatedBy("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const toggleMatchType = (type: AutomationMatchType) => {
    setMatchTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const hasActiveFilters = search || matchTypes.length > 0 || status !== "all" || createdBy || dateFrom || dateTo;
  const activeFiltersCount = [search, matchTypes.length > 0, status !== "all", createdBy, dateFrom, dateTo].filter(Boolean).length;

  return (
    <div className="bg-white border-b border-zinc-200 p-2 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-zinc-700">
            Filtros {selectedEntityName ? `para ${selectedEntityName}` : ""}
          </h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Main filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1.5 h-3 w-3 text-zinc-400" />
          <Input
            placeholder={`Buscar ${selectedEntityName ? `em ${selectedEntityName}` : "automações"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-6 text-xs rounded-md"
          />
        </div>

        {/* Status */}
        <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
          <SelectTrigger className="w-28 h-6 text-xs rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="inactive">Inativas</SelectItem>
            <SelectItem value="error">Com Erro</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <div className="flex gap-1">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as AutomationSortField)}>
            <SelectTrigger className="w-36 h-6 text-xs rounded-md">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="h-6 w-6 p-0 rounded-md"
            title={sortOrder === "asc" ? "Crescente" : "Decrescente"}>
            <span className="text-xs font-bold">{sortOrder === "asc" ? "↑" : "↓"}</span>
          </Button>
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="h-6 px-2 text-xs rounded-md">
          <Filter className="h-3 w-3 mr-1" />
          Avançado
          <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", showAdvancedFilters && "rotate-180")} />
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs rounded-md" title="Limpar filtros">
            <RotateCcw className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="space-y-2 p-2 bg-zinc-50 rounded-md border">
          {/* Match Types */}
          <div>
            <Label className="text-xs font-medium text-zinc-700 mb-1 block">Buscar em</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {MATCH_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-1">
                  <Checkbox
                    id={`match-${type.value}`}
                    checked={matchTypes.includes(type.value)}
                    onCheckedChange={() => toggleMatchType(type.value)}
                    className="h-3 w-3"
                  />
                  <label
                    htmlFor={`match-${type.value}`}
                    className="text-xs text-zinc-700 cursor-pointer select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Other Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Created By */}
            <div>
              <Label className="text-xs font-medium text-zinc-700 mb-1 block">Criado por</Label>
              <div className="relative">
                <User className="absolute left-2 top-1.5 h-3 w-3 text-zinc-400" />
                <Input
                  placeholder="Nome do usuário"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  className="pl-7 h-6 text-xs rounded-md"
                />
              </div>
            </div>

            {/* Date From */}
            <div>
              <Label className="text-xs font-medium text-zinc-700 mb-1 block">Data inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-6 text-xs rounded-md justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} locale={ptBR} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div>
              <Label className="text-xs font-medium text-zinc-700 mb-1 block">Data final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-6 text-xs rounded-md justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} locale={ptBR} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
