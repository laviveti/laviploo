"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Integration } from "@/types/automations";

interface IntegrationCardProps {
  integration: Integration;
}

export const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'Connected':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'Disconnected':
        return 'bg-zinc-400 text-white hover:bg-zinc-500';
      case 'Error':
        return 'bg-red-500 text-white hover:bg-red-600';
      default:
        return 'bg-zinc-400 text-white hover:bg-zinc-500';
    }
  };

  const getStatusText = (status: Integration['status']) => {
    switch (status) {
      case 'Connected':
        return 'Conectado';
      case 'Disconnected':
        return 'Desconectado';
      case 'Error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-zinc-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-zinc-800">
            {integration.name}
          </CardTitle>
          <Badge className={getStatusColor(integration.status)}>
            {getStatusText(integration.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-zinc-600">
            <span className="font-medium">ID:</span> {integration.id}
          </div>

          {integration.fields && integration.fields.length > 0 && (
            <div className="space-y-1">
              <span className="text-sm font-medium text-zinc-700">
                Campos ({integration.fields.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {integration.fields.slice(0, 3).map((field) => (
                  <Badge
                    key={field.id}
                    variant="outline"
                    className="text-xs text-zinc-600 border-zinc-300"
                  >
                    {field.name}
                  </Badge>
                ))}
                {integration.fields.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-zinc-500 border-zinc-300"
                  >
                    +{integration.fields.length - 3} mais
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};