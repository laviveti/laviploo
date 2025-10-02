/**
 * Script para testar a resolução de filtros da automação ID 3015277
 */

import dotenv from "dotenv";
import path from "path";

// Carregar variáveis de ambiente do arquivo .env na raiz do projeto
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const PLOOMES_API_KEY = process.env.PLOOMES_API_KEY;

if (!PLOOMES_API_KEY) {
  console.error("❌ ERRO: PLOOMES_API_KEY não encontrada no arquivo .env");
  console.error("Por favor, configure a variável PLOOMES_API_KEY no arquivo .env");
  process.exit(1);
}

const headers = {
  "User-Key": PLOOMES_API_KEY,
  Accept: "application/json",
};

async function testAutomation() {
  console.log("🔍 Buscando automação ID 3015277...\n");
  console.log("=".repeat(80) + "\n");

  try {
    const response = await fetch(`${PLOOMES_API_BASE}/Automations?$filter=Id eq 3015277&$expand=Entity,Trigger,Actions,Creator,TriggerFilter,Updater`, {
      headers,
      cache: "no-cache" as RequestCache,
    });

    if (!response.ok) {
      console.error("❌ Erro na requisição:", response.status, response.statusText);
      return;
    }

    const data = await response.json();

    if (!data.value || data.value.length === 0) {
      console.error("❌ Automação não encontrada");
      return;
    }

    const automation = data.value[0];

    console.log("📋 Dados da Automação:\n");
    console.log(`ID: ${automation.Id}`);
    console.log(`Nome: ${automation.Name}`);
    console.log(`Entity ID: ${automation.EntityId}`);
    console.log(`Trigger ID: ${automation.TriggerId}`);
    console.log(`Filter ID: ${automation.TriggerFilterId || "N/A"}`);
    console.log("\n" + "=".repeat(80) + "\n");

    // Se tem filtro, buscar detalhes
    if (automation.TriggerFilterId) {
      console.log("🔎 Buscando detalhes do filtro...\n");

      const filterResponse = await fetch(`${PLOOMES_API_BASE}/Filters?$filter=Id eq ${automation.TriggerFilterId}&$expand=Fields($expand=FieldPath)`, {
        headers,
        cache: "no-cache" as RequestCache,
      });

      if (filterResponse.ok) {
        const filterData = await filterResponse.json();

        if (filterData.value && filterData.value.length > 0) {
          const filter = filterData.value[0];

          console.log("📊 Detalhes do Filtro:\n");
          console.log(`Nome: ${filter.Name || "Sem nome"}`);
          console.log(`URL: ${filter.Url || filter.FilterUrl || "N/A"}`);
          console.log(`Criteria: ${filter.Criteria || "N/A"}`);
          console.log("\n" + "-".repeat(80) + "\n");

          if (filter.Fields && Array.isArray(filter.Fields)) {
            console.log(`Campos do Filtro (${filter.Fields.length}):\n`);

            filter.Fields.forEach((field: any, index: number) => {
              console.log(`${index + 1}. Campo:`);
              console.log(`   FieldKey: ${field.FieldKey || field.Key || "N/A"}`);
              console.log(`   EntityId: ${field.EntityId || "N/A"}`);
              console.log(`   LogicalGroupNumber: ${field.LogicalGroupNumber || "N/A"}`);
              console.log(`   OperationId: ${field.OperationId || "N/A"}`);

              if (field.Values && Array.isArray(field.Values)) {
                console.log(`   Values:`);
                field.Values.forEach((value: any, vIndex: number) => {
                  console.log(`     ${vIndex + 1}.`, JSON.stringify(value, null, 2).replace(/\n/g, "\n       "));
                });
              }
              console.log("");
            });
          }

          console.log("=".repeat(80) + "\n");

          // Extrair FilterUrl para teste do parser
          if (filter.Url || filter.FilterUrl) {
            const url = filter.Url || filter.FilterUrl;
            const urlMatch = url.match(/\$filter=([^&]+)/);

            if (urlMatch) {
              const filterExpression = decodeURIComponent(urlMatch[1]);
              console.log("🧪 Expressão OData extraída:\n");
              console.log(filterExpression);
              console.log("\n" + "=".repeat(80) + "\n");
            }
          }
        }
      }
    }

    console.log("✅ Teste concluído!");
  } catch (error) {
    console.error("💥 Erro:", error);
  }
}

testAutomation();
