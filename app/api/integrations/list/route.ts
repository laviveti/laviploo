import { NextResponse } from "next/server";
import { z } from "zod";
import { getErrorMessage } from "@/lib/handle-error";

const IntegrationFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
});

const IntegrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["Connected", "Disconnected", "Error"]),
  fields: z.array(IntegrationFieldSchema).optional(),
});

export async function GET() {
  try {
    // Mock integration list based on Ploomes screenshot
    const mockIntegrations = [
      {
        id: "int-001",
        name: "ActiveCampaign",
        status: "Disconnected" as const,
        fields: [
          { id: "f1", name: "API URL", type: "text", required: true },
          { id: "f2", name: "API Key", type: "password", required: true },
        ],
      },
      {
        id: "int-002",
        name: "Asana",
        status: "Connected" as const,
        fields: [
          { id: "f3", name: "Personal Access Token", type: "password", required: true },
          { id: "f4", name: "Workspace", type: "select", required: true },
        ],
      },
      {
        id: "int-003",
        name: "Callix",
        status: "Disconnected" as const,
        fields: [
          { id: "f5", name: "API Key", type: "password", required: true },
          { id: "f6", name: "Domain", type: "text", required: true },
        ],
      },
      {
        id: "int-004",
        name: "Clicksign",
        status: "Disconnected" as const,
        fields: [
          { id: "f7", name: "Access Token", type: "password", required: true },
        ],
      },
      {
        id: "int-005",
        name: "eMsg",
        status: "Disconnected" as const,
        fields: [
          { id: "f8", name: "Username", type: "text", required: true },
          { id: "f9", name: "Password", type: "password", required: true },
        ],
      },
      {
        id: "int-006",
        name: "DataPlace Business Solution",
        status: "Disconnected" as const,
        fields: [
          { id: "f10", name: "API URL", type: "text", required: true },
          { id: "f11", name: "Token", type: "password", required: true },
        ],
      },
      {
        id: "int-007",
        name: "DownApp",
        status: "Disconnected" as const,
        fields: [
          { id: "f12", name: "API Key", type: "password", required: true },
        ],
      },
      {
        id: "int-008",
        name: "Ecomdata",
        status: "Disconnected" as const,
        fields: [
          { id: "f13", name: "Client ID", type: "text", required: true },
          { id: "f14", name: "Client Secret", type: "password", required: true },
        ],
      },
      {
        id: "int-009",
        name: "Exact Spotter",
        status: "Disconnected" as const,
        fields: [
          { id: "f15", name: "API Token", type: "password", required: true },
        ],
      },
      {
        id: "int-010",
        name: "Facebook Lead Ads",
        status: "Connected" as const,
        fields: [
          { id: "f16", name: "Page Access Token", type: "password", required: true },
          { id: "f17", name: "Page ID", type: "text", required: true },
        ],
      },
      {
        id: "int-011",
        name: "Foco",
        status: "Disconnected" as const,
        fields: [
          { id: "f18", name: "API Key", type: "password", required: true },
        ],
      },
      {
        id: "int-012",
        name: "Jira",
        status: "Error" as const,
        fields: [
          { id: "f19", name: "Site URL", type: "text", required: true },
          { id: "f20", name: "Email", type: "email", required: true },
          { id: "f21", name: "API Token", type: "password", required: true },
        ],
      },
      {
        id: "int-013",
        name: "LeadLovers",
        status: "Connected" as const,
        fields: [
          { id: "f22", name: "Token", type: "password", required: true },
        ],
      },
      {
        id: "int-014",
        name: "LevDigit",
        status: "Disconnected" as const,
        fields: [
          { id: "f23", name: "API Key", type: "password", required: true },
        ],
      },
      {
        id: "int-015",
        name: "MailChimp",
        status: "Connected" as const,
        fields: [
          { id: "f24", name: "API Key", type: "password", required: true },
          { id: "f25", name: "Data Center", type: "text", required: true },
        ],
      },
      {
        id: "int-016",
        name: "Nectione",
        status: "Disconnected" as const,
        fields: [
          { id: "f26", name: "API Token", type: "password", required: true },
        ],
      },
      {
        id: "int-017",
        name: "Microsoft",
        status: "Disconnected" as const,
        fields: [
          { id: "f27", name: "Client ID", type: "text", required: true },
          { id: "f28", name: "Client Secret", type: "password", required: true },
          { id: "f29", name: "Tenant ID", type: "text", required: true },
        ],
      },
      {
        id: "int-018",
        name: "NewsCuit",
        status: "Disconnected" as const,
        fields: [
          { id: "f30", name: "API Key", type: "password", required: true },
        ],
      },
      {
        id: "int-019",
        name: "Ricron",
        status: "Disconnected" as const,
        fields: [
          { id: "f31", name: "Token", type: "password", required: true },
        ],
      },
      {
        id: "int-020",
        name: "Glaze Online",
        status: "Disconnected" as const,
        fields: [
          { id: "f32", name: "API Key", type: "password", required: true },
        ],
      },
    ];

    // Validate the data
    const validatedIntegrations = z.array(IntegrationSchema).parse(mockIntegrations);

    return NextResponse.json(validatedIntegrations);
  } catch (error) {
    console.error("Error in /api/integrations/list:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}