import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function limpar() {
  await prisma.user.deleteMany({})
  console.log('🧹 Todos os usuários foram removidos')
  process.exit()
}

limpar()
