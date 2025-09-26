"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntegrations } from "@/hooks/use-integrations";
import { useAutomations } from "@/hooks/use-automations";
import { Bot, Zap, TrendingUp, Users, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data: integrationsData, isLoading: integrationsLoading } = useIntegrations();
  const { data: automationsData, isLoading: automationsLoading } = useAutomations();

  const isLoading = integrationsLoading || automationsLoading;

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-zinc-50 p-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-80 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-md">
                <CardHeader className="pb-2 px-3 py-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="rounded-md">
                <CardHeader className="px-3 py-3">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-9 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const integrationStats = integrationsData?.stats;
  const automationStats = automationsData?.stats;

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full bg-zinc-50 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-800 mb-2">
            Dashboard <span className="text-rose-600">LaviPloo</span>
          </h1>
          <p className="text-zinc-600">
            Visão geral das suas integrações e automações do Ploomes
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
          {/* Total Integrations */}
          <Card className="rounded-md hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-3 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Integrações
                </CardTitle>
                <Zap className="h-4 w-4 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-2xl font-bold text-zinc-800">
                {integrationStats?.connectedIntegrations || 0}
              </div>
              <p className="text-xs text-zinc-500">
                de {integrationStats?.totalIntegrations || 0} disponíveis
              </p>
            </CardContent>
          </Card>

          {/* Total Automations */}
          <Card className="rounded-md hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-3 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Automações
                </CardTitle>
                <Bot className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-2xl font-bold text-zinc-800">
                {automationStats?.activeAutomations || 0}
              </div>
              <p className="text-xs text-zinc-500">
                de {automationStats?.totalAutomations || 0} criadas
              </p>
            </CardContent>
          </Card>

          {/* Behaviors */}
          <Card className="rounded-md hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-3 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Comportamentos
                </CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-2xl font-bold text-zinc-800">
                {automationStats?.totalBehaviors || 0}
              </div>
              <p className="text-xs text-zinc-500">
                de integrações
              </p>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="rounded-md hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-3 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Status Geral
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <Badge variant="outline" className="text-xs text-green-600 border-green-300 bg-green-50 rounded-md">
                  Ativo
                </Badge>
              </div>
              <p className="text-xs text-zinc-500">
                de disponibilidade
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Integrations Quick Access */}
          <Card className="rounded-md hover:shadow-md transition-shadow">
            <CardHeader className="px-3 py-3">
              <CardTitle className="text-base font-semibold text-zinc-800 flex items-center gap-2">
                <Zap className="h-4 w-4 text-rose-500" />
                Integrações do Ploomes
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <p className="text-sm text-zinc-600 mb-3">
                Visualize e gerencie suas integrações ativas: WhatsApp, RD Station, Asana e mais.
              </p>
              <Link href="/integracoes">
                <Button className="gap-2 h-9 px-3 rounded-md">
                  Ver Integrações
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Automations Quick Access */}
          <Card className="rounded-md hover:shadow-md transition-shadow">
            <CardHeader className="px-3 py-3">
              <CardTitle className="text-base font-semibold text-zinc-800 flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-500" />
                Automações e Workflows
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <p className="text-sm text-zinc-600 mb-3">
                Explore todas as automações de funis, estágios, triggers e ações configuradas.
              </p>
              <Link href="/automacoes">
                <Button variant="outline" className="gap-2 h-9 px-3 rounded-md">
                  Ver Automações
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity (Future Enhancement) */}
        {/* <div className="mt-6">
          <Card className="rounded-md">
            <CardHeader className="px-3 py-3">
              <CardTitle className="text-base font-semibold text-zinc-800">
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <p className="text-sm text-zinc-500">
                Em breve: Timeline de execuções de automações e alterações em integrações.
              </p>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
