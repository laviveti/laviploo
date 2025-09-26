"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, RotateCcw, Calendar as CalendarIcon, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AutomationFiltersProps {
  onFiltersChange: (filters: { search?: string; status?: string; createdBy?: string; dateFrom?: string; dateTo?: string }) => void;
  selectedEntityName?: string;
}

export const AutomationFilters = ({ onFiltersChange, selectedEntityName }: AutomationFiltersProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [createdBy, setCreatedBy] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounced search
  const debouncedOnFiltersChange = useCallback(
    debounce((filters: any) => {
      onFiltersChange(filters);
    }, 300),
    [onFiltersChange]
  );

  useEffect(() => {
    const filters = {
      search: search || undefined,
      status: status !== "all" ? status : undefined,
      createdBy: createdBy || undefined,
      dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
      dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
    };

    debouncedOnFiltersChange(filters);
  }, [search, status, createdBy, dateFrom, dateTo, debouncedOnFiltersChange]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setCreatedBy("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = search || status !== "all" || createdBy || dateFrom || dateTo;
  const activeFiltersCount = [search, status !== "all", createdBy, dateFrom, dateTo].filter(Boolean).length;

  return (
    <div className='bg-white border-b border-zinc-200 p-3 space-y-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-semibold text-zinc-800'>Automações {selectedEntityName ? `de ${selectedEntityName}` : ""}</h2>
          {hasActiveFilters && (
            <Badge variant='secondary' className='text-xs'>
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Main filters */}
      <div className='flex flex-col sm:flex-row gap-2'>
        {/* Search */}
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-2 h-3 w-3 text-zinc-400' />
          <Input
            placeholder='Buscar automações...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-7 h-7 text-xs rounded-sm'
          />
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className='w-32 h-7 text-xs rounded-sm'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='rounded-sm'>
            <SelectItem value='all'>Todos</SelectItem>
            <SelectItem value='active'>Ativas</SelectItem>
            <SelectItem value='inactive'>Inativas</SelectItem>
            <SelectItem value='error'>Com Erro</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button variant='outline' size='sm' onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className='h-7 px-2 text-xs rounded-sm'>
          <Filter className='h-3 w-3 mr-1' />
          Filtros
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant='outline' size='sm' onClick={clearFilters} className='h-7 px-2 text-xs rounded-sm'>
            <RotateCcw className='h-3 w-3' />
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-zinc-50 rounded-sm border'>
          {/* Created By */}
          <div>
            <label className='text-xs font-medium text-zinc-700 mb-1 block'>Criado por</label>
            <div className='relative'>
              <User className='absolute left-2 top-2 h-3 w-3 text-zinc-400' />
              <Input
                placeholder='Nome do usuário'
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                className='pl-7 h-7 text-xs rounded-sm'
              />
            </div>
          </div>

          {/* Date From */}
          <div>
            <label className='text-xs font-medium text-zinc-700 mb-1 block'>Data inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn("w-full h-7 text-xs rounded-sm justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                  <CalendarIcon className='mr-2 h-3 w-3' />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar mode='single' selected={dateFrom} onSelect={setDateFrom} locale={ptBR} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div>
            <label className='text-xs font-medium text-zinc-700 mb-1 block'>Data final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn("w-full h-7 text-xs rounded-sm justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                  <CalendarIcon className='mr-2 h-3 w-3' />
                  {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar mode='single' selected={dateTo} onSelect={setDateTo} locale={ptBR} initialFocus />
              </PopoverContent>
            </Popover>
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
