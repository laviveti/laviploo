#!/bin/bash

# Script para resetar completamente o banco de dados
# Execute com: bash docker/scripts/db-reset.sh

set -e

echo "⚠️  ATENÇÃO: Este script irá APAGAR todos os dados do banco!"
read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operação cancelada."
    exit 1
fi

echo "🗑️  Parando e removendo containers..."
docker-compose down -v

echo "🧹 Limpando volumes..."
docker volume prune -f

echo "🔄 Recriando banco de dados..."
bash docker/scripts/db-setup.sh

echo "✅ Reset concluído!"