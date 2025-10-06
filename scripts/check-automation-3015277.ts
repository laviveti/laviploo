/**
 * Script para verificar a estrutura da automação 3015277
 * Uso: pnpm tsx scripts/check-automation-3015277.ts
 */

import { config } from "dotenv";

// Carregar variáveis de ambiente
config();

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const PLOOMES_API_KEY = process.env.PLOOMES_API_KEY;

if (!PLOOMES_API_KEY) {
  console.error("❌ PLOOMES_API_KEY não está definida nas variáveis de ambiente");
  process.exit(1);
}

async function checkAutomation() {
  try {
    console.log("🔍 Buscando automação 3015277...\n");

    const url = `${PLOOMES_API_BASE}/Automations?$expand=Actions,Creator,Entity&$filter=Id eq 3015277`;
    const response = await fetch(url, {
      headers: {
        "User-Key": PLOOMES_API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.value || result.value.length === 0) {
      console.error("❌ Automação 3015277 não encontrada");
      process.exit(1);
    }

    const data = result.value[0];

    console.log("✅ Automação encontrada!\n");
    console.log("📋 Informações básicas:");
    console.log(`   ID: ${data.Id}`);
    console.log(`   Nome: ${data.Name}`);
    console.log(`   Criador: ${data.Creator?.Name || "N/A"}`);
    console.log(`   Entidade: ${data.Entity?.Name || "N/A"}`);
    console.log(`   Habilitada: ${data.Enabled}`);
    console.log(`   Total de ações: ${data.Actions?.length || 0}\n`);

    if (data.Actions && data.Actions.length > 0) {
      console.log("⚡ Ações (Disparos):");
      data.Actions.forEach((action: any, index: number) => {
        console.log(`\n   ${index + 1}. ${action.Name}`);
        console.log(`      ActionId: ${action.ActionId}`);
        console.log(`      TypeId: ${action.TypeId}`);

        // Mostrar todos os campos que podem conter valores
        const fields = [
          "FieldKey",
          "StringValue",
          "BigStringValue",
          "IntegerValue",
          "DecimalValue",
          "BoolValue",
          "DateTimeValue",
          "ObjectValueName",
          "DealStageId",
          "EmailTemplateId",
          "UserId",
          "UserValueId",
          "TaskTypeId",
          "InteractionRecordTypeId",
        ];

        console.log(`      Parâmetros:`);
        fields.forEach((field) => {
          if (action[field] !== undefined && action[field] !== null) {
            console.log(`         ${field}: ${action[field]}`);
          }
        });

        // Parsear RequestBody se existir
        if (action.RequestBody) {
          try {
            const requestBodyData = JSON.parse(action.RequestBody);
            console.log(`\n      📦 RequestBody parseado:`);

            // Mostrar campos interessantes
            if (requestBodyData.Title) {
              console.log(`         Title: ${requestBodyData.Title}`);
            }
            if (requestBodyData.Description) {
              console.log(`         Description: ${requestBodyData.Description}`);
            }
            if (requestBodyData.Users && Array.isArray(requestBodyData.Users)) {
              console.log(`         Users (${requestBodyData.Users.length}):`);
              requestBodyData.Users.forEach((user: any) => {
                console.log(`            - ${user.Name} (ID: ${user.Id})`);
              });
            }
            if (requestBodyData.Contacts && Array.isArray(requestBodyData.Contacts)) {
              console.log(`         Contacts (${requestBodyData.Contacts.length}):`);
              requestBodyData.Contacts.forEach((contact: any) => {
                console.log(`            - ${contact.Name || contact.display || contact.Id}`);
              });
            }
          } catch (e) {
            console.log(`         ⚠️ Erro ao parsear RequestBody`);
          }
        }
      });
    }

    console.log("\n\n📄 JSON completo:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Erro ao buscar automação:", error);
    process.exit(1);
  }
}

checkAutomation();
