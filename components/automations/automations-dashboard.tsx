"use client";

import { useAutomations } from "@/hooks/use-automations";
import { AutomationStatsComponent } from "./automation-stats";
import { IntegrationCard } from "./integration-card";
import { BehaviorList } from "./behavior-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Integration } from "@/types/automations";

export const AutomationsDashboard = () => {
  const { data, isLoading, error } = useAutomations();

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
            <h3 className='font-semibold mb-2'>Erro ao carregar automações</h3>
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
          <div className='text-center text-zinc-500'>Nenhum dado de automação encontrado</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats */}
      <AutomationStatsComponent stats={data.stats} />

      {/* Integrations */}
      <div>
        <h2 className='text-xl font-semibold text-zinc-800 mb-4'>Integrações ({data.integrations.length})</h2>
        {data.integrations.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {data.integrations.map((integration: Integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center text-zinc-500'>Nenhuma integração encontrada</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Behaviors */}
      <BehaviorList behaviors={data.behaviors} />
    </div>
  );
};
