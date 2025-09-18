import fs from 'fs';
import path from 'path';

interface PostmanRequest {
  method: string;
  header?: Array<{key: string, value: string}>;
  url: string | {
    raw?: string;
    host?: string | string[];
    path?: string | string[];
    query?: Array<{key: string, value: string}>;
  };
  body?: {
    mode: string;
    raw?: string;
  };
}

interface PostmanItem {
  name: string;
  item?: PostmanItem[];
  request?: PostmanRequest;
  response?: any[];
}

interface PostmanCollection {
  info: {
    name: string;
    _postman_id: string;
  };
  item: PostmanItem[];
}

function formatBody(body?: {mode: string, raw?: string}): string {
  if (!body?.raw) return '';

  try {
    const parsed = JSON.parse(body.raw);
    return `\n\`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\`\n`;
  } catch {
    return `\n\`\`\`\n${body.raw}\n\`\`\`\n`;
  }
}

function formatHeaders(headers?: Array<{key: string, value: string}>): string {
  if (!headers || headers.length === 0) return '';

  const headerTable = headers
    .map(h => `| ${h.key} | ${h.value} |`)
    .join('\n');

  return `\n**Headers:**\n\n| Header | Value |\n|--------|-------|\n${headerTable}\n`;
}

function formatQueryParams(url: string | {raw?: string, query?: Array<{key: string, value: string}>}): string {
  if (typeof url === 'string') return '';
  if (!url.query || url.query.length === 0) return '';

  const queryTable = url.query
    .map(q => `| ${q.key} | ${q.value} |`)
    .join('\n');

  return `\n**Query Parameters:**\n\n| Parameter | Value |\n|-----------|-------|\n${queryTable}\n`;
}

function processEndpoint(item: PostmanItem, groupName: string, level: number = 2): string {
  if (!item.request) return '';

  const { request } = item;
  const indent = '#'.repeat(level + 1);

  // Extract URL - handle different URL formats
  let url = '';
  if (typeof request.url === 'string') {
    url = request.url;
  } else if (request.url?.raw) {
    url = request.url.raw;
  } else if (request.url?.host && request.url?.path) {
    const host = Array.isArray(request.url.host) ? request.url.host.join('.') : request.url.host;
    const pathStr = Array.isArray(request.url.path) ? request.url.path.join('/') : request.url.path;
    url = `${host}/${pathStr}`;
  }

  // Create unique endpoint name
  const endpointName = `${item.name} (${request.method})`;

  let markdown = `${indent} ${endpointName}\n\n`;
  markdown += `**Method:** \`${request.method}\`\n\n`;
  markdown += `**URL:** \`${url || 'URL não especificada'}\`\n`;

  // Headers
  markdown += formatHeaders(request.header);

  // Query Parameters
  markdown += formatQueryParams(request.url);

  // Body
  if (request.body?.raw) {
    markdown += `\n**Request Body:**${formatBody(request.body)}`;
  }

  markdown += '\n---\n\n';

  return markdown;
}

function processGroup(group: PostmanItem, level: number = 1): string {
  const indent = '#'.repeat(level + 1);
  let markdown = `${indent} ${group.name}\n\n`;

  if (!group.item) return markdown;

  // Count endpoints
  const endpointCount = group.item.filter(item => item.request).length;
  markdown += `*${endpointCount} endpoints*\n\n`;

  // Process each item in the group
  group.item.forEach((item, index) => {
    if (item.request) {
      // It's an endpoint - use level + 2 for endpoints to be subheadings
      markdown += processEndpoint(item, group.name, level + 1);
    } else if (item.item) {
      // It's a subgroup
      markdown += processGroup(item, level + 1);
    }
  });

  return markdown;
}

function generateTableOfContents(collection: PostmanCollection): string {
  let toc = '## Índice\n\n';

  collection.item.forEach((group, index) => {
    const endpointCount = group.item?.filter(item => item.request).length || 0;
    const anchor = group.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    toc += `${index + 1}. [${group.name}](#${anchor}) (${endpointCount} endpoints)\n`;
  });

  toc += '\n---\n\n';
  return toc;
}

function generateMarkdown(collection: PostmanCollection): string {
  let markdown = `# ${collection.info.name}\n\n`;
  markdown += `**Collection ID:** ${collection.info._postman_id}\n\n`;

  // Summary
  const totalGroups = collection.item.length;
  const totalEndpoints = collection.item.reduce((acc, group) => {
    return acc + (group.item?.filter(item => item.request).length || 0);
  }, 0);

  markdown += `## Resumo\n\n`;
  markdown += `- **Total de grupos:** ${totalGroups}\n`;
  markdown += `- **Total de endpoints:** ${totalEndpoints}\n\n`;

  // Table of Contents
  markdown += generateTableOfContents(collection);

  // Process all groups
  collection.item.forEach(group => {
    markdown += processGroup(group);
  });

  return markdown;
}

async function main() {
  const jsonFilePath = path.join(process.cwd(), 'docs', 'ploomes', 'api-v2-documentation.full.json');
  const outputPath = path.join(process.cwd(), 'docs', 'ploomes', 'README.md');

  console.log('🔍 Lendo arquivo JSON...');
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
  const collection: PostmanCollection = JSON.parse(jsonContent);

  console.log('📝 Gerando markdown...');
  const markdown = generateMarkdown(collection);

  console.log('💾 Salvando arquivo...');
  fs.writeFileSync(outputPath, markdown, 'utf8');

  console.log(`✅ Documentação gerada com sucesso: ${outputPath}`);
  console.log(`📊 Estatísticas:`);
  console.log(`   - Grupos: ${collection.item.length}`);
  console.log(`   - Endpoints: ${collection.item.reduce((acc, group) => acc + (group.item?.filter(item => item.request).length || 0), 0)}`);
  console.log(`   - Tamanho do arquivo: ${(markdown.length / 1024).toFixed(2)} KB`);
}

main().catch(console.error);