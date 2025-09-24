"use client";

import { AutomationsDashboard } from "@/components/automations/automations-dashboard";

export default function HomePage() {
  return (
    <div className='bg-white min-h-full h-fit p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-zinc-800 mb-2'>
            Automações do <span className='text-purple-700'>Ploomes</span>
          </h1>
          <p className='text-zinc-600'>Visualize e gerencie suas integrações e automações configuradas</p>
        </div>

        <AutomationsDashboard />
      </div>
    </div>
  );
}
