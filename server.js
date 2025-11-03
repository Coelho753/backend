import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors({ origin: '*' }))

// 🔹 Criar usuário
app.post('/usuarios', async (req, res) => {
  console.log('📩 Corpo recebido:', req.body)

  // converte tudo para string ou número conforme o tipo
  const name = String(req.body.name || '').trim()
  const sexo = String(req.body.sexo || '').trim()
  const faculdade = String(req.body.faculdade || '').trim()
  const mensagem = String(req.body.mensagem || '').trim()
  const age = Number(req.body.age)

  // validação
  if (!name || !age || !sexo || !faculdade || !mensagem) {
    console.log('⚠️ Falha na validação:', { name, age, sexo, faculdade, mensagem })
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })
  }

  const user = await prisma.user.create({
    data: { name, age, sexo, faculdade, mensagem }
  })

  res.status(201).json(user)
})

// 🔹 Listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(users)
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    res.status(500).json({ error: 'Erro ao listar usuários.' })
  }
})

// 🔹 Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, age, sexo, faculdade, mensagem } = req.body

    if (!name?.trim() || !age || !sexo?.trim() || !faculdade?.trim() || !mensagem?.trim()) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { name, age: Number(age), sexo, faculdade, mensagem }
    })

    res.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
})

// 🔹 Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    res.status(500).json({ error: 'Erro ao deletar usuário.' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`))
