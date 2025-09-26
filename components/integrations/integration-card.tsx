"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { Integration } from "@/types/integrations";
import { Hint } from "../system/hint";

interface IntegrationCardProps {
  integration: Integration;
}

export const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  const [showFields, setShowFields] = useState(false);

  const getFieldTypeName = (typeId: number): string => {
    const typeMap: Record<number, string> = {
      1: "Texto",
      2: "Número",
      3: "Data",
      4: "Booleano",
      5: "Email",
      6: "URL",
      7: "Senha",
      8: "Seleção",
      9: "Múltipla Seleção",
      10: "Textarea",
      11: "Arquivo",
      12: "Token",
    };
    return typeMap[typeId] || `Tipo ${typeId}`;
  };

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
    <Card className='hover:shadow-md transition-all duration-200 border-zinc-200 group rounded-md'>
      <CardHeader className='pb-2 px-3 py-3'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-base font-semibold text-zinc-800 group-hover:text-rose-600 transition-colors leading-tight line-clamp-2'>
            {integration.name}
          </CardTitle>
          <Badge className={`${getStatusColor(integration.status)} gap-1 text-xs shrink-0 rounded-md`}>
            {getStatusIcon(integration.status)}
            <span className='hidden sm:inline'>{getStatusText(integration.status)}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-3 px-3 pb-3'>
        {/* Description */}
        {integration.description && (
          <div className='text-xs text-zinc-600 line-clamp-2 leading-relaxed'>
            <div
              dangerouslySetInnerHTML={{
                __html: integration.description.replace(/<br\s*\/?>/gi, "<br />"),
              }}
            />
          </div>
        )}

        {/* Integration Details */}
        <div className='flex items-center justify-between text-xs text-zinc-500'>
          <span className='truncate'>ID: {integration.id}</span>
          <div className='flex gap-1 shrink-0'>
            {integration.enabled && (
              <Badge variant='outline' className='text-xs h-5 px-2 rounded-md'>
                Habilitado
              </Badge>
            )}
            {integration.authorized && (
              <Badge variant='outline' className='text-xs h-5 px-2 text-green-600 rounded-md'>
                Autorizado
              </Badge>
            )}
          </div>
        </div>

        {/* Fields Summary */}
        {integration.fields && integration.fields.length > 0 && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium text-zinc-700'>Campos de configuração</span>
              <div className='flex items-center gap-2'>
                <Badge
                  variant='outline'
                  className='text-xs px-2 py-1 text-zinc-600 border-zinc-300 bg-zinc-50 rounded-md cursor-pointer hover:bg-zinc-100 transition-colors'
                  onClick={() => setShowFields(!showFields)}>
                  {integration.fields.length} campos
                  {showFields ? <ChevronUp className='h-3 w-3 ml-1' /> : <ChevronDown className='h-3 w-3 ml-1' />}
                </Badge>
                {integration.fields.some((f) => f.required) && (
                  <Badge
                    variant='outline'
                    className='text-xs px-2 py-1 text-orange-600 border-orange-300 bg-orange-50 rounded-md cursor-pointer hover:bg-orange-100 transition-colors'
                    onClick={() => setShowFields(!showFields)}>
                    {integration.fields.filter((f) => f.required).length} obrigatórios
                    {showFields ? <ChevronUp className='h-3 w-3 ml-1' /> : <ChevronDown className='h-3 w-3 ml-1' />}
                  </Badge>
                )}
              </div>
            </div>

            {/* Expanded Fields List */}
            {showFields && (
              <div className='mt-3 space-y-2 border-t pt-2'>
                <div className='grid gap-1'>
                  {integration.fields.map((field) => (
                    <div key={field.id} className='flex items-center justify-between text-xs py-1'>
                      <span className={`font-medium ${field.required ? "text-orange-600" : "text-zinc-700"}`}>
                        {field.name}
                        {field.required && "*"}
                      </span>
                      <div className='flex items-center gap-2'>
                        <Hint content={`Tipo de campo`} contentClassName='max-w-48 pointer-events-none' align='center' side='bottom'>
                          <Badge variant='outline' className='text-xs px-1 py-0 text-zinc-500 border-zinc-300 rounded-sm cursor-help'>
                            {getFieldTypeName(field.typeId)}
                          </Badge>
                        </Hint>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
