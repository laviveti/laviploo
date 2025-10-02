"use client";

import { useState, useMemo } from "react";
import { useIntegrations } from "@/hooks/use-integrations";
import { IntegrationStats } from "./integration-stats";
import { IntegrationCard } from "./integration-card";
import { BehaviorList } from "./behavior-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw } from "lucide-react";
import type { Integration } from "@/types/integrations";

type StatusFilter = "All" | "Connected" | "Disconnected" | "Error";

export const IntegrationsDashboard = () => {
  const { data: integrationsData, isLoading, error } = useIntegrations();
  const integrations = integrationsData?.integrations;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [showAll, setShowAll] = useState(false);

  const filteredIntegrations = useMemo(() => {
    if (!integrations) return [];

    return integrations.filter((integration: Integration) => {
      const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || integration.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [integrations, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    if (!integrations) return { Connected: 0, Disconnected: 0, Error: 0 };

    return integrations.reduce(
      (acc: Record<string, number>, integration: Integration) => {
        acc[integration.status] = (acc[integration.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [integrations]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  // Determine which integrations to display
  const displayIntegrations = showAll ? filteredIntegrations : filteredIntegrations.slice(0, 6);

  if (isLoading) {
    return (
      <div className='space-y-4 overflow-y-auto'>
        {/* Stats Skeleton */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className='rounded-md'>
              <CardHeader className='pb-2 px-3 py-3'>
                <Skeleton className='h-4 w-20' />
              </CardHeader>
              <CardContent className='px-3 pb-3'>
                <Skeleton className='h-7 w-10' />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className='rounded-md'>
          <CardHeader className='px-3 py-3'>
            <Skeleton className='h-5 w-28' />
          </CardHeader>
          <CardContent className='px-3 pb-3'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Skeleton className='h-9 flex-1' />
              <div className='flex gap-2 flex-wrap'>
                <Skeleton className='h-9 w-20' />
                <Skeleton className='h-9 w-24' />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Skeleton */}
        <div>
          <Skeleton className='h-5 w-28 mb-3' />
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className='rounded-md'>
                <CardHeader className='px-3 py-3'>
                  <Skeleton className='h-5 w-24' />
                </CardHeader>
                <CardContent className='px-3 pb-3'>
                  <Skeleton className='h-3 w-full mb-2' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-4 w-16' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Behaviors Skeleton */}
        <Card className='rounded-md'>
          <CardHeader className='px-3 py-3'>
            <Skeleton className='h-5 w-40' />
          </CardHeader>
          <CardContent className='px-3 pb-3'>
            <div className='space-y-2'>
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className='border-red-200 bg-red-50 rounded-md'>
        <CardContent className='px-3 py-4'>
          <div className='text-center text-red-600'>
            <h3 className='font-semibold mb-2'>Erro ao carregar integrações</h3>
            <p className='text-sm'>{error instanceof Error ? error.message : "Erro desconhecido"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!integrations) {
    return (
      <Card className='rounded-md'>
        <CardContent className='px-3 py-4'>
          <div className='text-center text-zinc-500'>Nenhum dado de integração encontrado</div>
        </CardContent>
      </Card>
    );
  }

  // Use stats from API response or calculate from integrations
  const stats = integrationsData?.stats || {
    totalIntegrations: integrations?.length || 0,
    connectedIntegrations: integrations?.filter((int) => int.status === "Connected").length || 0,
    activeAutomations: 0,
    totalBehaviors: 0,
  };

  return (
    <div className='space-y-4'>
      {/* Stats */}
      <IntegrationStats stats={stats} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4 text-zinc-600' />
              <CardTitle className='text-base font-semibold text-zinc-800'>Filtros</CardTitle>
            </div>
            {(searchTerm || statusFilter !== "All") && (
              <Button variant='outline' size='sm' onClick={clearFilters} className='gap-2 h-8 px-2 rounded-md'>
                <RotateCcw className='h-3 w-3' />
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='px-3 pb-3'>
          <div className='flex flex-col sm:flex-row gap-3'>
            {/* Search */}
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-zinc-400' />
              <Input
                placeholder='Buscar integração...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-9 h-9 rounded-md'
              />
            </div>

            {/* Status Filter */}
            <div className='flex gap-2 flex-wrap'>
              {(["All", "Connected", "Disconnected", "Error"] as StatusFilter[]).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size='sm'
                  onClick={() => setStatusFilter(status)}
                  className='whitespace-nowrap h-9 px-3 rounded-sm text-xs'>
                  {status === "All" ? "Todos" : status === "Connected" ? "Conectados" : status === "Disconnected" ? "Desconectados" : "Com Erro"}
                  {status !== "All" && (
                    <Badge variant='secondary' className='ml-2 h-4 w-4 p-0 text-xs rounded-md'>
                      {statusCounts[status] || 0}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <div>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-lg font-semibold text-zinc-800'>Integrações ({filteredIntegrations.length})</h2>
          {searchTerm && (
            <Badge variant='outline' className='gap-2 rounded-md'>
              <Search className='h-3 w-3' />"{searchTerm}"
            </Badge>
          )}
        </div>

        {displayIntegrations.length > 0 ? (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3'>
              {displayIntegrations.map((integration: Integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>

            {/* Show "Ver mais" button if there are more than 6 integrations */}
            {filteredIntegrations.length > 6 && (
              <div className='flex justify-center mt-4'>
                <Button onClick={() => setShowAll(!showAll)} variant='outline' className='gap-2 h-9 px-3 rounded-sm'>
                  {showAll ? "Ver menos" : "Ver mais"}
                  <svg
                    className={`h-3 w-3 transition-transform ${showAll ? "rotate-180" : ""}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className='rounded-sm'>
            <CardContent className='px-3 py-4'>
              <div className='text-center text-zinc-500 text-sm'>
                {searchTerm || statusFilter !== "All" ? "Nenhuma integração encontrada com os filtros aplicados" : "Nenhuma integração encontrada"}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Behaviors */}
      <BehaviorList behaviors={integrationsData?.behaviors || []} />
    </div>
  );
};
