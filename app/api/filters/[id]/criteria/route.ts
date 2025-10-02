import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/handle-error";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  Accept: "application/json",
};

interface FilterCriteria {
  entity: string;
  field: string;
  operation: string;
  value: string;
}

// Mapeamento de operações
const operationMap: Record<string, string> = {
  eq: "Igual a",
  ne: "Diferente de",
  gt: "Maior que",
  ge: "Maior ou igual a",
  lt: "Menor que",
  le: "Menor ou igual a",
  contains: "Contém",
  startswith: "Começa com",
  endswith: "Termina com",
};

// Mapeamento de tipos de valor
const valueTypeMap: Record<string, string> = {
  StringValue: "Texto",
  IntegerValue: "Número",
  DecimalValue: "Decimal",
  DateTimeValue: "Data",
  BooleanValue: "Sim/Não",
};

// Parser para filtros OData
function parseODataFilter(filterString: string) {
  const criteria: any[] = [];

  if (!filterString) return criteria;

  // Remover $filter= do início se existir
  let filter = filterString.replace(/^\$filter=/, "");

  // Decodificar URL
  filter = decodeURIComponent(filter.replace(/\+/g, " "));

  // Padrões para extrair critérios (priorizando os mais específicos)
  const patterns = [
    // Padrão para valores entre aspas simples
    {
      regex: /o\/FieldId\s+eq\s+(\d+)\s+and\s+\(o\/(\w+Value)\s+(\w+)\s+'([^']+)'\)/g,
      type: "quoted",
    },
    // Padrão completo: FieldId + ValueType + Operation + Value
    {
      regex: /o\/FieldId\s+eq\s+(\d+)\s+and\s+\(o\/(\w+Value)\s+(\w+)\s+([^)]+)\)/g,
      type: "complete",
    },
  ];

  // Usar Set para evitar duplicatas baseado em uma chave única
  const criteriaSet = new Set<string>();

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.regex.exec(filter)) !== null) {
      let criterion: any = {};

      if (pattern.type === "quoted") {
        criterion = {
          fieldId: match[1],
          valueType: valueTypeMap[match[2]] || match[2],
          operation: operationMap[match[3]] || match[3],
          value: match[4],
        };
      } else if (pattern.type === "complete") {
        let value = match[4].replace(/'/g, "").trim();

        // Tratar valores especiais
        if (value === "null") {
          value = "vazio";
        } else if (value.includes("T") && value.includes("Z")) {
          // Formato de data ISO
          try {
            const date = new Date(value);
            value = date.toLocaleDateString("pt-BR");
          } catch {
            // Manter valor original se não conseguir converter
          }
        }

        criterion = {
          fieldId: match[1],
          valueType: valueTypeMap[match[2]] || match[2],
          operation: operationMap[match[3]] || match[3],
          value: value,
        };
      }

      // Criar chave única para evitar duplicatas
      const key = `${criterion.fieldId}-${criterion.operation}-${criterion.value}`;

      if (!criteriaSet.has(key) && criterion.fieldId) {
        criteriaSet.add(key);
        criteria.push(criterion);
      }
    }
  });

  return criteria;
}

// Buscar nomes dos campos
async function getFieldNames(fieldIds: string[]) {
  if (fieldIds.length === 0) return {};

  try {
    const fieldMap: Record<string, any> = {};

    // Buscar campos em lotes
    for (const fieldId of fieldIds) {
      try {
        const response = await fetch(`${PLOOMES_API_BASE}/Fields?$filter=Id eq ${fieldId}`, { headers, cache: "no-cache" });

        if (response.ok) {
          const data = await response.json();
          if (data.value && data.value.length > 0) {
            const field = data.value[0];
            fieldMap[fieldId] = {
              name: field.Name || `Campo ${fieldId}`,
              entity: field.EntityName || "Entidade",
            };
          }
        }
      } catch (error) {
        console.warn(`Erro ao buscar campo ${fieldId}:`, error);
        fieldMap[fieldId] = {
          name: `Campo ${fieldId}`,
          entity: "Entidade",
        };
      }
    }

    return fieldMap;
  } catch (error) {
    console.error("Erro ao buscar nomes dos campos:", error);
    return {};
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filterId = parseInt(id);

    if (isNaN(filterId)) {
      return NextResponse.json({ error: "ID do filtro inválido" }, { status: 400 });
    }

    // Buscar o filtro
    const response = await fetch(`${PLOOMES_API_BASE}/Filters?$filter=Id eq ${filterId}`, {
      headers,
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`API Ploomes returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.value || data.value.length === 0) {
      return NextResponse.json({
        criteria: [],
        message: "Filtro não encontrado",
      });
    }

    const filter = data.value[0];
    let criteria: FilterCriteria[] = [];

    // Tentar extrair critérios de diferentes fontes
    if (filter.Criteria) {
      // Se tem string de critério OData, fazer parse

      const parsedCriteria = parseODataFilter(filter.Criteria);

      if (parsedCriteria.length > 0) {
        // Buscar nomes dos campos
        const fieldIds = parsedCriteria.map((c) => c.fieldId);
        const fieldNames = await getFieldNames(fieldIds);

        // Mapear entidades
        const entityMap: Record<string, string> = {
          Contact: "Cliente",
          Deal: "Negócio",
          Task: "Tarefa",
          Order: "Pedido",
          Workflow: "Workflow",
        };

        criteria = parsedCriteria.map((c) => ({
          entity: entityMap[fieldNames[c.fieldId]?.entity] || fieldNames[c.fieldId]?.entity || "Negócio",
          field: fieldNames[c.fieldId]?.name || `Campo ${c.fieldId}`,
          operation: c.operation,
          value: c.value,
        }));
      }
    }

    // Fallback: tentar usar Fields se existir
    if (criteria.length === 0 && filter.Fields && filter.Fields.length > 0) {
      const entityMap: Record<string, string> = {
        Contact: "Cliente",
        Deal: "Negócio",
        Task: "Tarefa",
        Order: "Pedido",
        Workflow: "Workflow",
      };

      criteria = filter.Fields.map((field: any) => ({
        entity: entityMap[field.EntityName] || field.EntityName || "Entidade",
        field: field.FieldName || field.Name || field.FieldId || "Campo",
        operation: operationMap[field.Operation] || field.Operation || "Operação",
        value: field.Value || field.FilterValue || "Valor",
      }));
    }

    return NextResponse.json({
      criteria,
      filterName: filter.Name,
      rawCriteria: filter.Criteria, // Para debug
      message: `${criteria.length} critérios encontrados`,
    });
  } catch (error) {
    const { id } = await params;
    console.error(`Erro ao buscar critérios do filtro ${id}:`, error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
