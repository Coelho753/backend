import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors({ origin: "frontend-phi-nine-78.vercel.app" 
methods: ['GET', 'POST', 'PUT', 'DELETE'],
credentials: true
}));
}));

app.post('/usuarios', async (req, res) => {

    const { name, email, age } = req.body;

    // ✅ Validação antes de criar
    if (!name?.trim() || !email?.trim() || !age?.trim()) {
        return res.status(400).json({ error: "Nome, email e idade são obrigatórios." });
    }

    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                age: req.body.age,
                email: req.body.email
            }
        })
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar usuário." });
    }

    res.json(user);
});





app.get('/usuarios', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
})

app.put('/usuarios/:id', async (req, res) => {

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
        }
    })
    res.status(200).json(req.body)
})

app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: (req.params.id)
        }
    })
    res.status(204).json({ message: 'Usuário deletado com sucesso' })
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
})


