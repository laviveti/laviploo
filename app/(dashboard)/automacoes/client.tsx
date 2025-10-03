"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SearchResult } from "@/types/automations";
import { AutomationsDashboard } from "@/components/automations/automations-dashboard";
import { GlobalAutomationSearch } from "@/components/automations/global-automation-search";

export const AutomationsPageClient = () => {
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [selectedAutomation, setSelectedAutomation] = useState<SearchResult | null>(null);

  const handleAutomationSelect = (automation: SearchResult) => {
    setSelectedAutomation(automation);
  };

  return (
    <div className='flex-1 overflow-hidden flex flex-col'>
      {/* Header */}
      <div className='bg-zinc-50 px-3 pt-3'>
        <h1 className='text-2xl font-bold text-zinc-800'>Automações</h1>
        <p className='text-zinc-600 mt-1 mb-3'>Visualize e monitore todas as automações, workflows e triggers configurados no Ploomes</p>

        {/* Global Search */}
        <div className='mb-3'>
          <GlobalAutomationSearch onAutomationSelect={handleAutomationSelect} placeholder='Busque automações em qualquer lugar...' />
        </div>
      </div>

      {/* Tabs */}
      <div className='flex-1 overflow-hidden flex flex-col'>
        <Tabs defaultValue='todas' className='flex-1 bg-white flex flex-col'>
          <div className='bg-zinc-50 px-3 pb-2'>
            <TabsList>
              <TabsTrigger value='todas'>Todas</TabsTrigger>
              <TabsTrigger value='usuario'>Por Usuário</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='todas' className='flex-1 overflow-hidden'>
            <AutomationsDashboard globalSearch={globalSearchQuery} selectedAutomation={selectedAutomation} />
          </TabsContent>

          <TabsContent value='usuario' className='flex-1 overflow-hidden'>
            <div className='p-6 text-center'>
              <p className='text-sm text-zinc-600'>Filtro por usuário em desenvolvimento...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
