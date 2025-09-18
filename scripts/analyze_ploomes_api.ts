import * as fs from "fs";
import * as path from "path";

interface PostmanItem {
  name: string;
  item?: PostmanItem[];
  request?: {
    method: string;
    url: string | { raw: string };
    header?: Array<{ key: string; value: string }>;
    body?: any;
    description?: string;
  };
}

interface PostmanCollection {
  info: {
    name: string;
    description?: string;
  };
  item: PostmanItem[];
}

// Estatísticas globais
let stats = {
  totalEndpoints: 0,
  totalGroups: 0,
  methods: {} as Record<string, number>,
  groups: [] as Array<{ name: string; endpointCount: number }>,
};

function analyzeEndpoints(items: PostmanItem[], prefix = "", depth = 0): void {
  console.log(`\\n${"  ".repeat(depth)}🔍 ANÁLISE DO ARRAY item[] (nível ${depth}):`);
  console.log(`${"  ".repeat(depth)}   Total de itens neste nível: ${items.length}`);

  items.forEach((item, index) => {
    const currentPath = prefix ? `${prefix} > ${item.name}` : item.name;

    console.log(`\\n${"  ".repeat(depth)}[${index + 1}/${items.length}] Analisando: "${item.name}"`);

    // Verificar se é um endpoint (tem request)
    if (item.request) {
      console.log(`${"  ".repeat(depth)}   ✅ É um endpoint (tem request)`);

      // Incrementar estatísticas
      stats.totalEndpoints++;

      const method = item.request.method;
      let url = "";

      if (typeof item.request.url === "string") {
        url = item.request.url;
      } else if (item.request.url && typeof item.request.url === "object") {
        url = item.request.url.raw || "";
      }

      // Contabilizar métodos HTTP
      stats.methods[method] = (stats.methods[method] || 0) + 1;

      console.log(`${"  ".repeat(depth)}   📍 ${currentPath}`);
      console.log(`${"  ".repeat(depth)}      Método: ${method}`);
      console.log(`${"  ".repeat(depth)}      URL: ${url}`);

      // Mostrar headers importantes
      if (item.request.header) {
        const importantHeaders = item.request.header.filter((h) => h.key !== "User-Key" && h.key !== "Content-Type");
        if (importantHeaders.length > 0) {
          console.log(`${"  ".repeat(depth)}      Headers: ${importantHeaders.map((h) => h.key).join(", ")}`);
        }
      }

      // Mostrar body se existir
      if (item.request.body && item.request.body.raw) {
        try {
          const bodyPreview = item.request.body.raw.substring(0, 100);
          console.log(`${"  ".repeat(depth)}      Body: ${bodyPreview}${item.request.body.raw.length > 100 ? "..." : ""}`);
        } catch (e) {
          console.log(`${"  ".repeat(depth)}      Body: [presente]`);
        }
      }

      // Mostrar descrição se existir
      if (item.request.description) {
        console.log(`${"  ".repeat(depth)}      Descrição: ${item.request.description}`);
      }
    }
    // Verificar se é um grupo (tem item[] aninhado)
    else if (item.item && Array.isArray(item.item)) {
      console.log(`${"  ".repeat(depth)}   🗂️ É um grupo (contém item[] aninhado)`);
      console.log(`${"  ".repeat(depth)}      Itens aninhados: ${item.item.length}`);

      stats.totalGroups++;
      stats.groups.push({
        name: currentPath,
        endpointCount: countEndpoints(item.item),
      });

      // Análise recursiva do array item[] aninhado
      analyzeEndpoints(item.item, currentPath, depth + 1);
    }
    // Caso não seja nem endpoint nem grupo
    else {
      console.log(`${"  ".repeat(depth)}   ❓ Item não identificado (sem request e sem item[])`);
      console.log(`${"  ".repeat(depth)}      Propriedades: ${Object.keys(item).join(", ")}`);
    }
  });
}

function countEndpoints(items: PostmanItem[]): number {
  let count = 0;
  items.forEach((item) => {
    if (item.request) {
      count++;
    } else if (item.item) {
      count += countEndpoints(item.item);
    }
  });
  return count;
}

function displayStats() {
  console.log("\\n📊 ESTATÍSTICAS DA API:");
  console.log("=".repeat(50));
  console.log(`Total de Endpoints: ${stats.totalEndpoints}`);
  console.log(`Total de Grupos: ${stats.totalGroups}`);

  console.log("\\n📋 MÉTODOS HTTP:");
  Object.entries(stats.methods)
    .sort((a, b) => b[1] - a[1])
    .forEach(([method, count]) => {
      console.log(`   ${method}: ${count} endpoints`);
    });

  console.log("\\n📋 GRUPOS COM MAIS ENDPOINTS:");
  stats.groups
    .sort((a, b) => b.endpointCount - a.endpointCount)
    .slice(0, 10) // Top 10
    .forEach((group, index) => {
      console.log(`   ${index + 1}. ${group.name}: ${group.endpointCount} endpoints`);
    });
}

function main() {
  try {
    const apiDocPath = path.join(process.cwd(), "docs", "ploomes", "api-v2-documentation.full.json");

    // Verificar se o arquivo existe
    if (!fs.existsSync(apiDocPath)) {
      console.error(`❌ Arquivo não encontrado: ${apiDocPath}`);
      return;
    }

    console.log(`🔍 Lendo arquivo: ${apiDocPath}`);

    // Ler o arquivo em partes para evitar problemas de memória
    const jsonContent = fs.readFileSync(apiDocPath, "utf8");
    console.log(`✅ Arquivo lido com sucesso (${(jsonContent.length / 1024 / 1024).toFixed(2)} MB)`);

    const collection: PostmanCollection = JSON.parse(jsonContent);

    console.log(`\\n🚀 ANÁLISE DA API: ${collection.info.name}`);
    if (collection.info.description) {
      console.log(`📝 Descrição: ${collection.info.description}`);
    }
    console.log(`Total de grupos principais: ${collection.item.length}\\n`);

    // Primeiro, mostrar visão geral dos grupos
    console.log("📋 GRUPOS PRINCIPAIS:");
    collection.item.forEach((item, index) => {
      const endpointCount = item.item ? countEndpoints(item.item) : 0;
      console.log(`${index + 1}. ${item.name} (${endpointCount} endpoints)`);
    });

    console.log("\\n" + "=".repeat(80) + "\\n");

    // Depois, analisar todos os endpoints
    console.log("🔍 ANÁLISE DETALHADA DOS ENDPOINTS (focada no array item[]):\\n");
    console.log("📋 O array item[] é a estrutura principal que contém todos os endpoints e grupos\\n");
    analyzeEndpoints(collection.item);

    // Exibir estatísticas finais
    displayStats();
  } catch (error) {
    console.error("❌ Erro ao analisar a API:", error);
    if (error instanceof Error) {
      console.error(`Detalhes do erro: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    }
  }
}

main();
