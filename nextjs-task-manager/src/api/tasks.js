import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } })
    return res.json(tasks)
  }
  if (req.method === 'POST') {
    const { title, description } = req.body
    const newTask = await prisma.task.create({ data: { title, description } })
    return res.json(newTask)
  }
  res.status(405).end()
}