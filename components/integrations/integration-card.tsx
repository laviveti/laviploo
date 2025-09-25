"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { Integration } from "@/types/integrations";
import { Hint } from "../system/hint";

interface IntegrationCardProps {
  integration: Integration;
}

export const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "Connected":
        return <CheckCircle2 className='h-4 w-4' />;
      case "Disconnected":
        return <XCircle className='h-4 w-4' />;
      case "Error":
        return <AlertCircle className='h-4 w-4' />;
      default:
        return <XCircle className='h-4 w-4' />;
    }
  };

  const getStatusColor = (status: Integration["status"]) => {
    switch (status) {
      case "Connected":
        return "bg-green-500 text-white hover:bg-green-600";
      case "Disconnected":
        return "bg-zinc-400 text-white hover:bg-zinc-500";
      case "Error":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-zinc-400 text-white hover:bg-zinc-500";
    }
  };

  const getStatusText = (status: Integration["status"]) => {
    switch (status) {
      case "Connected":
        return "Conectado";
      case "Disconnected":
        return "Desconectado";
      case "Error":
        return "Erro";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Card className='hover:shadow-lg transition-all duration-200 border-zinc-200 group'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold text-zinc-800 group-hover:text-rose-600 transition-colors'>{integration.name}</CardTitle>
          <Badge className={`${getStatusColor(integration.status)} gap-1`}>
            {getStatusIcon(integration.status)}
            {getStatusText(integration.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Integration Info */}
        <div className='space-y-3'>
          {/* Description */}
          {integration.description && (
            <div className='text-sm text-zinc-600 line-clamp-2'>
              <div
                dangerouslySetInnerHTML={{
                  __html: integration.description.replace(/<br\s*\/?>/gi, "<br />"),
                }}
              />
            </div>
          )}

          {/* Integration Details */}
          <div className='flex items-center justify-between text-xs text-zinc-500'>
            <span>ID: {integration.id}</span>
            <div className='flex gap-2'>
              {integration.enabled && (
                <Badge variant='outline' className='text-xs'>
                  Habilitado
                </Badge>
              )}
              {integration.authorized && (
                <Badge variant='outline' className='text-xs text-green-600'>
                  Autorizado
                </Badge>
              )}
            </div>
          </div>

          {/* Fields */}
          {integration.fields && integration.fields.length > 0 && (
            <div className='space-y-2 overflow-hidden'>
              <span className='text-sm font-medium text-zinc-700'>Campos de configuração ({integration.fields.length}):</span>
              <div className='flex flex-wrap w-full overflow-hidden gap-1'>
                {integration.fields.slice(0, 3).map((field) => (
                  <Hint content={field.name} contentClassName='max-w-80 pointer-events-none' align='start' side='bottom' key={field.id}>
                    <div className='group relative'>
                      <Badge
                        variant='outline'
                        className={`text-xs truncate border-zinc-300 bg-zinc-50 ${field.required ? "text-orange-600 border-orange-300" : "text-zinc-600"}`}>
                        {field.name}
                        {field.required && "*"}
                      </Badge>
                    </div>
                  </Hint>
                ))}
                {integration.fields.length > 3 && (
                  <Badge variant='outline' className='text-xs text-zinc-500 border-zinc-300 bg-zinc-50'>
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
