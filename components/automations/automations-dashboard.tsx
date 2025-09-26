"use client";

import { useState, useMemo } from "react";
import { useAutomations } from "@/hooks/use-automations";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  RotateCcw,
  Bot,
  Users,
  Package,
  Activity,
  Calendar,
  User,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  Zap
} from "lucide-react";
import type { Automation } from "@/types/automations";

type TabValue = "all" | "active" | "inactive" | "error";
type EntityFilter = "all" | "deals" | "contacts" | "tasks" | "orders";

export const AutomationsDashboard = () => {
  const { data, isLoading, error } = useAutomations();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [entityFilter, setEntityFilter] = useState<EntityFilter>("all");
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);

  const filteredAutomations = useMemo(() => {
    if (!data?.automations) return [];

    return data.automations.filter((automation: Automation) => {
      const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeTab === "all" || automation.status === activeTab;

      let matchesEntity = entityFilter === "all";
      if (entityFilter !== "all") {
        switch (entityFilter) {
          case "deals":
            matchesEntity = automation.entityId === 2;
            break;
          case "contacts":
            matchesEntity = automation.entityId === 1;
            break;
          case "tasks":
            matchesEntity = automation.entityId === 3;
            break;
          case "orders":
            matchesEntity = automation.entityId === 4;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesEntity;
    });
  }, [data?.automations, searchTerm, activeTab, entityFilter]);

  const statusCounts = useMemo(() => {
    if (!data?.automations) return { all: 0, active: 0, inactive: 0, error: 0 };

    const counts = data.automations.reduce(
      (acc: Record<string, number>, automation: Automation) => {
        acc[automation.status] = (acc[automation.status] || 0) + 1;
        return acc;
      },
      { all: 0, active: 0, inactive: 0, error: 0 } as Record<string, number>
    );

    counts.all = data.automations.length;
    return counts;
  }, [data?.automations]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle2 className="h-3 w-3" />;
      case "inactive": return <XCircle className="h-3 w-3" />;
      case "error": return <AlertCircle className="h-3 w-3" />;
      default: return <Zap className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 border-green-300 bg-green-50";
      case "inactive": return "text-zinc-600 border-zinc-300 bg-zinc-50";
      case "error": return "text-red-600 border-red-300 bg-red-50";
      default: return "text-zinc-600 border-zinc-300 bg-zinc-50";
    }
  };

  const getEntityIcon = (entityId: number) => {
    switch (entityId) {
      case 1: return <Users className="h-3 w-3" />;
      case 2: return <Bot className="h-3 w-3" />;
      case 3: return <Activity className="h-3 w-3" />;
      case 4: return <Package className="h-3 w-3" />;
      default: return <Zap className="h-3 w-3" />;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveTab("all");
    setEntityFilter("all");
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Card className="rounded-sm">
          <CardContent className="p-2">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 rounded-sm">
        <CardContent className="p-2">
          <div className="text-center text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mx-auto mb-1" />
            <p>Erro ao carregar automações</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.automations) {
    return (
      <Card className="rounded-sm">
        <CardContent className="p-2">
          <div className="text-center text-zinc-500 text-sm">
            <Bot className="h-4 w-4 mx-auto mb-1" />
            <p>Nenhuma automação encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-rose-600" />
          <h2 className="text-base font-semibold text-zinc-800">
            Automações ({data.automations.length})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2 h-3 w-3 text-zinc-400" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-7 w-48 text-xs rounded-sm"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs rounded-sm">
                <Filter className="h-3 w-3 mr-1" />
                Entidade
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-sm">
              <DropdownMenuItem onClick={() => setEntityFilter("all")}>
                Todas as entidades
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEntityFilter("contacts")}>
                <Users className="h-3 w-3 mr-2" /> Contatos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEntityFilter("deals")}>
                <Bot className="h-3 w-3 mr-2" /> Negócios
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEntityFilter("tasks")}>
                <Activity className="h-3 w-3 mr-2" /> Tarefas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEntityFilter("orders")}>
                <Package className="h-3 w-3 mr-2" /> Pedidos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {(searchTerm || entityFilter !== "all") && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs rounded-sm">
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabs and Table */}
      <Card className="rounded-sm">
        <CardContent className="p-2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-8 rounded-sm">
              <TabsTrigger value="all" className="text-xs px-2 py-1 rounded-sm">
                Todas ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs px-2 py-1 rounded-sm">
                Ativas ({statusCounts.active})
              </TabsTrigger>
              <TabsTrigger value="inactive" className="text-xs px-2 py-1 rounded-sm">
                Inativas ({statusCounts.inactive})
              </TabsTrigger>
              <TabsTrigger value="error" className="text-xs px-2 py-1 rounded-sm">
                Erro ({statusCounts.error})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-2">
              {filteredAutomations.length > 0 ? (
                <div className="border rounded-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="h-8 px-2 text-xs">Nome</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-20">Status</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-24">Entidade</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-32">Trigger</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-24">Criada</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-16">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAutomations.map((automation) => (
                        <TableRow key={automation.id} className="border-b hover:bg-zinc-50">
                          <TableCell className="p-2">
                            <div className="flex items-center gap-2">
                              {getEntityIcon(automation.entityId)}
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-zinc-800 truncate">
                                  {automation.name}
                                </p>
                                {automation.description && (
                                  <p className="text-xs text-zinc-500 truncate">
                                    {automation.description.slice(0, 50)}...
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <Badge
                              variant="outline"
                              className={`text-xs px-1 py-0 rounded-sm ${getStatusColor(automation.status)}`}
                            >
                              {getStatusIcon(automation.status)}
                              <span className="ml-1">
                                {automation.status === "active" ? "Ativa" :
                                 automation.status === "inactive" ? "Inativa" : "Erro"}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="p-2">
                            <span className="text-xs text-zinc-600">
                              {automation.entityName}
                            </span>
                          </TableCell>
                          <TableCell className="p-2">
                            <Badge variant="outline" className="text-xs px-1 py-0 rounded-sm">
                              {automation.triggerName}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-zinc-400" />
                              <span className="text-xs text-zinc-600">
                                {new Date(automation.createdAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit'
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAutomation(automation)}
                                  className="h-6 w-6 p-0 rounded-sm"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl rounded-sm">
                                <DialogHeader>
                                  <DialogTitle className="text-base">{automation.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3 text-sm">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="font-medium text-zinc-700">Status:</label>
                                      <Badge className={`ml-2 text-xs ${getStatusColor(automation.status)}`}>
                                        {getStatusIcon(automation.status)}
                                        <span className="ml-1">
                                          {automation.status === "active" ? "Ativa" :
                                           automation.status === "inactive" ? "Inativa" : "Erro"}
                                        </span>
                                      </Badge>
                                    </div>
                                    <div>
                                      <label className="font-medium text-zinc-700">Entidade:</label>
                                      <span className="ml-2 text-zinc-600">{automation.entityName}</span>
                                    </div>
                                    <div>
                                      <label className="font-medium text-zinc-700">Trigger:</label>
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        {automation.triggerName}
                                      </Badge>
                                    </div>
                                    <div>
                                      <label className="font-medium text-zinc-700">ID:</label>
                                      <span className="ml-2 text-zinc-600">{automation.id}</span>
                                    </div>
                                  </div>
                                  {automation.description && (
                                    <div>
                                      <label className="font-medium text-zinc-700">Descrição:</label>
                                      <p className="text-zinc-600 mt-1">{automation.description}</p>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="font-medium text-zinc-700">Criada em:</label>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Calendar className="h-3 w-3 text-zinc-400" />
                                        <span className="text-zinc-600">
                                          {new Date(automation.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                      </div>
                                    </div>
                                    {automation.lastRun && (
                                      <div>
                                        <label className="font-medium text-zinc-700">Última execução:</label>
                                        <div className="flex items-center gap-1 mt-1">
                                          <Clock className="h-3 w-3 text-zinc-400" />
                                          <span className="text-zinc-600">
                                            {new Date(automation.lastRun).toLocaleDateString('pt-BR')}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {automation.creator && (
                                      <div>
                                        <label className="font-medium text-zinc-700">Criador:</label>
                                        <div className="flex items-center gap-1 mt-1">
                                          <User className="h-3 w-3 text-zinc-400" />
                                          <span className="text-zinc-600">{automation.creator}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {automation.actions && automation.actions.length > 0 && (
                                    <div>
                                      <label className="font-medium text-zinc-700">
                                        Ações ({automation.actions.length}):
                                      </label>
                                      <div className="space-y-1 mt-1">
                                        {automation.actions.map((action, index) => (
                                          <div key={action.id} className="flex items-center justify-between text-xs py-1 px-2 bg-zinc-50 rounded-sm">
                                            <span className="font-medium text-zinc-700">
                                              {index + 1}. {action.name}
                                            </span>
                                            <Badge variant="outline" className="text-xs px-1 py-0">
                                              {action.type}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>
                    {searchTerm || entityFilter !== "all" ?
                      "Nenhuma automação encontrada com os filtros aplicados" :
                      `Nenhuma automação ${activeTab === "all" ? "" : activeTab} encontrada`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};