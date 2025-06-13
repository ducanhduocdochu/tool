import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const plans = await prisma.plan.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return Response.json(plans)
}

export async function POST(req) {
  const { name } = await req.json()

  const plan = await prisma.plan.create({ data: { name } })

  const defaultCells = []
  for (let row = 0; row < 10; row++) {
    for (let column = 0; column < 5; column++) {
      defaultCells.push({ planId: plan.id, row, column, value: '' })
    }
  }

  await prisma.planData.createMany({ data: defaultCells })

  return Response.json(plan)
}