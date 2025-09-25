"use client";

import { useState, useMemo } from "react";
import { useIntegrations } from "@/hooks/use-integrations";
import { IntegrationStatsComponent } from "./integration-stats";
import { IntegrationCard } from "./integration-card";
import { BehaviorList } from "./behavior-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw } from "lucide-react";
import type { Integration } from "@/types/integrations";

type StatusFilter = 'All' | 'Connected' | 'Disconnected' | 'Error';

export const IntegrationsDashboard = () => {
  const { data, isLoading, error } = useIntegrations();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filteredIntegrations = useMemo(() => {
    if (!data?.integrations) return [];

    return data.integrations.filter((integration) => {
      const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || integration.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data?.integrations, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    if (!data?.integrations) return { Connected: 0, Disconnected: 0, Error: 0 };

    return data.integrations.reduce((acc, integration) => {
      acc[integration.status] = (acc[integration.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [data?.integrations]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  if (isLoading) {
    return (
      <div className='space-y-6 overflow-y-auto'>
        {/* Stats Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className='pb-2'>
                <Skeleton className='h-4 w-24' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-12' />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent>
            <div className='flex gap-4'>
              <Skeleton className='h-10 flex-1' />
              <Skeleton className='h-10 w-32' />
            </div>
          </CardContent>
        </Card>

        {/* Integrations Skeleton */}
        <div>
          <Skeleton className='h-6 w-32 mb-4' />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className='h-5 w-24' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-4 w-16 mb-2' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-5 w-12' />
                    <Skeleton className='h-5 w-16' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Behaviors Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-48' />
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className='border-red-200 bg-red-50'>
        <CardContent className='pt-6'>
          <div className='text-center text-red-600'>
            <h3 className='font-semibold mb-2'>Erro ao carregar integrações</h3>
            <p className='text-sm'>{error instanceof Error ? error.message : "Erro desconhecido"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center text-zinc-500'>Nenhum dado de integração encontrado</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats */}
      <IntegrationStatsComponent stats={data.stats} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-zinc-600" />
              <CardTitle className="text-lg font-semibold text-zinc-800">
                Filtros
              </CardTitle>
            </div>
            {(searchTerm || statusFilter !== "All") && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Buscar integração..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {(['All', 'Connected', 'Disconnected', 'Error'] as StatusFilter[]).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="whitespace-nowrap"
                >
                  {status === 'All' ? 'Todos' :
                   status === 'Connected' ? 'Conectados' :
                   status === 'Disconnected' ? 'Desconectados' : 'Com Erro'}
                  {status !== 'All' && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className='text-xl font-semibold text-zinc-800'>
            Integrações ({filteredIntegrations.length})
          </h2>
          {searchTerm && (
            <Badge variant="outline" className="gap-2">
              <Search className="h-3 w-3" />
              "{searchTerm}"
            </Badge>
          )}
        </div>

        {filteredIntegrations.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            {filteredIntegrations.map((integration: Integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center text-zinc-500'>
                {searchTerm || statusFilter !== "All"
                  ? "Nenhuma integração encontrada com os filtros aplicados"
                  : "Nenhuma integração encontrada"
                }
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Behaviors */}
      <BehaviorList behaviors={data.behaviors} />
    </div>
  );
};