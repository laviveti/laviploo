// Real Ploomes Automation Structure
export interface PloomesAutomation {
  Id: number;
  Name: string;
  EntityId: number;
  TriggerId: number;
  TriggerFilterId?: number;
  TriggerDealStageId?: number;
  TriggerDealPipelineId?: number;
  TriggerRepeatIntervalUnitId?: number;
  TriggerRepeatIntervalLength?: number;
  TriggerRepeatStartDateTime?: string;
  Ordination?: number;
  Enabled: boolean;
  CreatorId: number;
  CreateDate: string;
  LastRunTime?: string;
  BlockTriggerByAutomation: boolean;
  UpdaterId?: number;
  LastUpdateDate?: string;
  DisabledDueToError: boolean;
  // Expanded fields when using $expand
  Entity?: PloomesEntity;
  Trigger?: PloomesTrigger;
  Actions?: PloomesAutomationAction[];
  Creator?: PloomesUser;
  Updater?: PloomesUser;
}

export interface PloomesEntity {
  Id: number;
  Name: string;
  TypeName?: string;
}

export interface PloomesTrigger {
  Id: number;
  Name: string;
  Description?: string;
  TypeName?: string;
}

export interface PloomesAutomationAction {
  Id: number;
  AutomationId: number;
  ActionId: number;
  Name: string;
  TypeId?: number;
  Parameters?: any;
}

export interface PloomesUser {
  Id: number;
  Name: string;
  Email?: string;
}

// UI-friendly transformed types
export interface Automation {
  id: number;
  name: string;
  entityId: number | null;
  entityName?: string;
  triggerId: number;
  triggerName?: string;
  triggerType: AutomationTriggerType;
  status: AutomationStatus;
  enabled: boolean;
  hasError: boolean;
  createdAt: string;
  lastRun?: string;
  creator?: string;
  updater?: string;
  lastUpdateDate?: string;
  actions?: AutomationAction[];
  description?: string;
  // Pipeline/Stage information
  triggerDealStageId?: number;
  triggerDealPipelineId?: number;
  pipelineName?: string;
  stageName?: string;
}

export interface AutomationAction {
  id: number;
  name: string;
  type: string;
  parameters?: Record<string, any>;
}

export type AutomationTriggerType =
  | 'stage_entry' // TriggerId 1 - Ao entrar no estágio
  | 'stage_exit' // TriggerId 2 - Ao sair do estágio
  | 'deal_created' // TriggerId 5 - Ao criar negócio
  | 'deal_updated' // TriggerId 6 - Ao alterar negócio
  | 'deal_won' // TriggerId 8 - Ao ganhar negócio
  | 'deal_lost' // TriggerId 9 - Ao perder negócio
  | 'recurring' // TriggerId 17 - Recorrente
  | 'unknown';

export type AutomationStatus =
  | 'active' // Enabled=true, DisabledDueToError=false
  | 'inactive' // Enabled=false
  | 'error'; // DisabledDueToError=true

export type AutomationEntityType =
  | 'contacts' // EntityId 1
  | 'deals' // EntityId 2
  | 'tasks' // EntityId 3
  | 'orders' // EntityId 4
  | 'unknown';

// Legacy types (keeping for backward compatibility)
export interface Integration {
  id: number;
  name: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  fields?: IntegrationField[];
}

export interface IntegrationField {
  id: number;
  name: string;
  type?: string;
}

export interface IntegrationBehavior {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  integrationName: string;
}

export interface AutomationStats {
  totalAutomations: number;
  activeAutomations: number;
  totalIntegrations: number;
  activeIntegrations: number;
  totalBehaviors: number;
  activeBehaviors: number;
  automationsByEntity: Record<string, number>;
  automationsByTrigger: Record<string, number>;
}

export interface AutomationsData {
  automations: Automation[];
  integrations: Integration[];
  behaviors: IntegrationBehavior[];
  stats: AutomationStats;
}

// API Response Types
export interface PloomesAutomationsResponse {
  "@odata.context": string;
  value: PloomesAutomation[];
}

export interface PloomesIntegrationResponse {
  "@odata.context": string;
  value: Array<{
    Id: number;
    AccountId: number;
    IntegrationId: number;
    Key: string;
    IntegrationUserId?: number;
    IntegrationUserKey?: string;
    Integration: {
      Id: number;
      Name: string;
      Fields?: Array<{
        Id: number;
        Name: string;
        Type?: string;
      }>;
    };
  }>;
}

export interface PloomesBehaviorResponse {
  "@odata.context": string;
  value: Array<{
    Id: number;
    Name: string;
    DealStageIdRequired?: boolean;
  }>;
}

export interface PloomesMailChimpResponse {
  "@odata.context": string;
  value: Array<any>;
}

export interface PloomesDealsResponse {
  "@odata.context": string;
  value: Array<{
    Id: number;
    Title: string;
    PipelineId: number;
    StageId: number;
    StatusId: number;
    Amount?: number;
    CreateDate: string;
    // Add more fields as needed
  }>;
}

export interface PloomesTasksResponse {
  "@odata.context": string;
  value: Array<{
    Id: number;
    Title: string;
    Description?: string;
    DateTime?: string;
    Finished: boolean;
    CreateDate: string;
    // Add more fields as needed
  }>;
}