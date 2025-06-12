import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const accounts = await prisma.account.findMany({ include: { transactions: true } })
  return Response.json(accounts)
}

export async function POST(request) {
  const { name, balance } = await request.json()
  const account = await prisma.account.create({
    data: {
      name,
      balance: parseInt(balance),
    },
  })
  return Response.json(account)
}
