#!/bin/bash

# Script para configurar o banco de dados com Prisma
# Execute com: bash docker/scripts/db-setup.sh

set -e

echo "🚀 Iniciando configuração do banco de dados LaviPloo..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker Desktop e tente novamente."
    exit 1
fi

echo "📦 Iniciando containers..."
docker-compose up -d postgres

echo "⏳ Aguardando PostgreSQL ficar pronto..."
until docker exec laviploo-postgres pg_isready -U laviploo -d laviploo > /dev/null 2>&1; do
    echo "   Aguardando banco de dados..."
    sleep 2
done

echo "✅ PostgreSQL está pronto!"

echo "🔧 Executando migrações do Prisma..."
docker-compose up prisma-migrate

echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Execute 'pnpm dev' para iniciar o servidor de desenvolvimento"
echo "   2. Acesse http://localhost:3000/login para testar a autenticação"
echo ""
echo "💡 Comandos úteis:"
echo "   - Ver logs: docker-compose logs postgres"
echo "   - Prisma Studio: npx prisma studio"
echo "   - Parar containers: docker-compose down"