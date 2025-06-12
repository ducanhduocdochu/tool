import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const keywords = await prisma.actionKeyword.findMany()
  return Response.json(keywords)
}

export async function POST(req) {
  const body = await req.json()
  const { phrase, type } = body

  const keyword = await prisma.actionKeyword.create({
    data: { phrase, type },
  })

  return Response.json(keyword)
}
