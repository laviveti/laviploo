import { AutomationsDashboard } from "@/components/automations/automations-dashboard";

export default function AutomacoesPage() {
  return (
    <div className='flex-1 overflow-hidden'>
      <div className='h-full bg-zinc-50 p-3'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-zinc-800'>Automações</h1>
          <p className='text-zinc-600 mt-1'>Visualize e monitore todas as automações, workflows e triggers configurados no Ploomes</p>
        </div>

        {/* Dashboard Content */}
        <AutomationsDashboard />
      </div>
    </div>
  );
}
