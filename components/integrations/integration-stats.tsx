"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IntegrationStatsType } from "@/types/integrations";

interface IntegrationStatsProps {
  stats: IntegrationStatsType;
}

export const IntegrationStats = ({ stats }: IntegrationStatsProps) => {
  const statsData = [
    {
      title: "Integrações Totais",
      value: stats.totalIntegrations,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
    },
    {
      title: "Integrações Conectadas",
      value: stats.connectedIntegrations,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
    },
    {
      title: "Comportamentos Totais",
      value: stats.totalBehaviors,
      color: "text-rose-600",
      bgColor: "bg-rose-50 border-rose-200",
    },
    {
      title: "Automações Ativas",
      value: stats.activeAutomations,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {statsData.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} border-2`}>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-zinc-700'>{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
