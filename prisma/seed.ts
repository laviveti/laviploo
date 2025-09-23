import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional)
  await prisma.magicLink.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Dados antigos removidos');

  // Criar usuário de teste (opcional)
  const testUser = await prisma.user.create({
    data: {
      email: 'admin@lavive.com.br',
      name: 'Administrador',
      emailVerified: true,
    },
  });

  console.log('👤 Usuário de teste criado:', testUser.email);

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });