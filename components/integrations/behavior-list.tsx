"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { IntegrationBehavior } from "@/types/integrations";

interface BehaviorListProps {
  behaviors: IntegrationBehavior[];
}

export const BehaviorList = ({ behaviors }: BehaviorListProps) => {
  if (behaviors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-800">
            Comportamentos de Integração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-zinc-500">
            Nenhum comportamento de integração encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-800">
          Comportamentos de Integração ({behaviors.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Integração</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {behaviors.map((behavior) => (
              <TableRow key={`${behavior.integrationName}-${behavior.id}`}>
                <TableCell className="font-medium">
                  {behavior.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-purple-700 border-purple-300">
                    {behavior.integrationName}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600 max-w-xs truncate">
                  {behavior.description || "Sem descrição"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      behavior.isActive
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-zinc-400 text-white hover:bg-zinc-500"
                    }
                  >
                    {behavior.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};