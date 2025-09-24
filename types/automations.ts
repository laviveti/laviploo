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
  totalIntegrations: number;
  activeIntegrations: number;
  totalBehaviors: number;
  activeBehaviors: number;
}

export interface AutomationsData {
  integrations: Integration[];
  behaviors: IntegrationBehavior[];
  stats: AutomationStats;
}

// API Response Types
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