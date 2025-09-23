# LaviPloo - Docker Integration

## Integração Completa do Prisma com Docker

✅ **Implementado:**
- PostgreSQL automatizado com Docker
- Migrações automáticas do Prisma
- Scripts de gerenciamento simplificados
- Configuração para desenvolvimento e produção
- Health checks e dependências corretas

## Quick Start

### 🚀 Configuração Automática (Recomendado)
```bash
# Configuração completa em um comando
pnpm db:setup

# Iniciar desenvolvimento
pnpm dev
```

### 📋 Scripts Disponíveis
```bash
# Banco de Dados
pnpm db:setup       # Configuração inicial automática
pnpm db:reset       # Reset completo (⚠️ apaga todos os dados)
pnpm db:start       # Inicia apenas o PostgreSQL
pnpm db:stop        # Para todos os containers
pnpm db:logs        # Ver logs do PostgreSQL

# Prisma Operations
pnpm db:studio      # Interface visual do banco
pnpm db:migrate     # Criar nova migração
pnpm db:generate    # Gerar cliente Prisma
pnpm db:push        # Sincronizar schema (desenvolvimento)
pnpm db:seed        # Popular banco com dados iniciais
```

## Docker Compose

### Desenvolvimento (docker-compose.yml)
```yaml
services:
  postgres:          # PostgreSQL com health check
  prisma-migrate:    # Executa migrações automaticamente
```

### Produção (docker-compose.prod.yml)
```yaml
services:
  postgres:          # PostgreSQL otimizado para produção
  app:              # Aplicação Next.js em container
```

## Comandos Docker

### Desenvolvimento
```bash
# Iniciar apenas PostgreSQL
docker-compose up -d postgres

# Executar migrações
docker-compose up prisma-migrate

# Ver logs detalhados
docker-compose logs -f postgres

# Acessar banco diretamente
docker exec -it laviploo-postgres psql -U laviploo -d laviploo
```

### Produção
```bash
# Preparar ambiente
cp .env.example .env.production
# Editar .env.production com valores de produção

# Build e deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs da aplicação
docker-compose -f docker-compose.prod.yml logs -f app

# Ver status dos serviços
docker-compose -f docker-compose.prod.yml ps
```

## Estrutura de Arquivos

```
docker/
├── postgres/
│   └── init.sql              # Inicialização do PostgreSQL
└── scripts/
    ├── db-setup.sh          # Script de configuração automática
    └── db-reset.sh          # Script de reset completo

prisma/
├── schema.prisma            # Schema do banco
├── seed.ts                  # Dados iniciais
└── migrations/              # Migrações (auto-gerado)

docker-compose.yml           # Desenvolvimento
docker-compose.prod.yml      # Produção
Dockerfile                   # Multi-stage build
.dockerignore               # Arquivos ignorados no build
.env.example                # Template de variáveis
```

## Variáveis de Ambiente

### Desenvolvimento (.env)
```env
DATABASE_URL="postgresql://laviploo:laviploo123@localhost:5432/laviploo?schema=public"
BETTER_AUTH_SECRET=your-dev-secret
BETTER_AUTH_URL=http://localhost:3000
```

### Produção (.env.production)
```env
POSTGRES_PASSWORD=strong-production-password
DATABASE_URL="postgresql://laviploo:${POSTGRES_PASSWORD}@postgres:5432/laviploo?schema=public"
BETTER_AUTH_SECRET=super-secure-production-secret
BETTER_AUTH_URL=https://your-domain.com
```

## Recursos Implementados

### 🐳 Container PostgreSQL
- PostgreSQL 15 Alpine (otimizado)
- Inicialização automática com extensões
- Health checks integrados
- Dados persistentes com volumes
- Configurações de performance

### 🔄 Migrações Automáticas
- Container dedicado para Prisma
- Aguarda PostgreSQL estar pronto
- Executa `prisma generate` e `migrate deploy`
- Logs detalhados do processo

### 📊 Monitoramento
- Health checks do PostgreSQL
- Logs estruturados
- Restart automático dos containers
- Dependências corretas entre serviços

### 🛠️ Ferramentas de Desenvolvimento
- Scripts automatizados no package.json
- Prisma Studio integrado
- Seed de dados de teste
- Reset rápido para desenvolvimento

## Solução de Problemas

### Container não inicia
```bash
# Ver logs detalhados
docker-compose logs postgres

# Verificar status
docker-compose ps

# Reiniciar limpo
pnpm db:reset
```

### Erro de conexão do Prisma
```bash
# Verificar se o PostgreSQL está rodando
docker exec laviploo-postgres pg_isready -U laviploo

# Regenerar cliente Prisma
pnpm db:generate

# Forçar recreação
docker-compose down -v
pnpm db:setup
```

### Dados corrompidos
```bash
# Reset completo (CUIDADO: apaga tudo)
pnpm db:reset

# Popular com dados de teste
pnpm db:seed
```

## Próximos Passos

1. **Backup Automático**
   - Script de backup do PostgreSQL
   - Agendamento com cron

2. **Monitoring em Produção**
   - Prometheus + Grafana
   - Alertas de saúde do banco

3. **CI/CD Integration**
   - GitHub Actions com Docker
   - Deploy automático em produção

4. **Scaling**
   - Load balancer
   - Réplicas de leitura do PostgreSQL