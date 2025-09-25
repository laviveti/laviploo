import { IntegrationsDashboard } from "@/components/integrations/integrations-dashboard";

export default function IntegrationsPage() {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full bg-zinc-50 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">Integrações</h1>
          <p className="text-zinc-600 mt-1">
            Visualize suas integrações e comportamentos configurados no Ploomes
          </p>
        </div>

        {/* Dashboard Content */}
        <IntegrationsDashboard />
      </div>
    </div>
  );
}