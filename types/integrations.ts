export interface Integration {
  id: string;
  name: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  description?: string;
  imageUrl?: string;
  enabled: boolean;
  authorized: boolean;
  fields?: IntegrationField[];
}

export interface IntegrationField {
  id: number;
  name: string;
  key: string;
  required: boolean;
  type: string;
  typeId: number;
}

export interface IntegrationBehavior {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  isActive: boolean;
  lastExecution: string | null;
  integrationId: string;
  integrationName: string;
}

export interface IntegrationStats {
  totalIntegrations: number;
  connectedIntegrations: number;
  totalBehaviors: number;
  activeAutomations: number;
}

export interface IntegrationsData {
  integrations: Integration[];
  behaviors: IntegrationBehavior[];
  stats: IntegrationStats;
}

// API Response Types - Real Ploomes API Structure
export interface PloomesIntegrationResponse {
  "@odata.context": string;
  value: Array<PloomesAccountIntegration>;
}

export interface PloomesAccountIntegration {
  Id: number;
  AccountId: number;
  IntegrationId: number;
  Key: string;
  IntegrationUserId?: number;
  IntegrationUserKey?: string;
  Enabled: boolean;
  StatusId: number;
  Authorized: boolean;
  CreatorId: number;
  CreateDate: string;
  UpdaterId: number;
  UpdateDate: string;
  Integration: PloomesIntegrationDetails;
}

export interface PloomesIntegrationDetails {
  Id: number;
  Name: string;
  Key: string;
  Description: string;
  TypeId: number;
  ImageUrl: string;
  BaseUrl: string;
  IntegrationUserAvatarUrl: string;
  RedirectUrl?: string;
  ProfileConfigurable: boolean;
  Fields?: Array<PloomesIntegrationField>;
}

export interface PloomesIntegrationField {
  Id: number;
  IntegrationId: number;
  Name: string;
  Key: string;
  Required: boolean;
  Multiple: boolean;
  Hidden: boolean;
  AutoSave: boolean;
  TypeId: number;
  SecondaryEntityId?: number;
  OptionsTableId?: number;
  CallbackHubActionName?: string;
  DependentFieldId?: number;
  Ordination: number;
  DependentAuthorized: boolean;
  MaxValue?: number;
  Restricted?: boolean;
  Tooltip?: string;
  QueryDependentFieldId?: number;
  QueryDependentFieldProp?: string;
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