# Dockerfile multi-stage para LaviPloo
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos de configuração
COPY package.json pnpm-lock.yaml* ./

# ================================
# Estágio de dependências
# ================================
FROM base AS deps
RUN pnpm install --frozen-lockfile

# ================================
# Estágio de build
# ================================
FROM base AS builder
WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN pnpm db:generate

# Build da aplicação
RUN pnpm build

# ================================
# Estágio de produção
# ================================
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copiar build do Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar node_modules (apenas produção)
COPY --from=deps /app/node_modules ./node_modules

# Definir usuário
USER nextjs

# Expor porta
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Script de inicialização
CMD ["node", "server.js"]

# ================================
# Estágio de desenvolvimento
# ================================
FROM base AS development
WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN pnpm db:generate

# Expor porta
EXPOSE 3000

# Comando de desenvolvimento
CMD ["pnpm", "dev"]