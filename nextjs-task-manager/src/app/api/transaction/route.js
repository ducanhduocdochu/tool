import { prisma } from '@/lib/prisma'

export async function GET() {
  const transactions = await prisma.transaction.findMany({ include: { account: true } })
  return Response.json(transactions)
}

export async function POST(request) {
  const body = await request.json()
  const { description, amount, accountId } = body

  const actionWords = await prisma.actionKeyword.findMany()
  const matched = actionWords.find(k => description.includes(k.phrase))
  const type = matched?.type || 'expense'

  const transaction = await prisma.transaction.create({
    data: {
      description,
      amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      type,
      accountId,
    },
  })

  await prisma.account.update({
    where: { id: accountId },
    data: {
      balance: { increment: transaction.amount },
    },
  })

  return Response.json(transaction)
}

export async function PUT(request) {
  const body = await request.json()
  const { id, ...data } = body

  const old = await prisma.transaction.findUnique({ where: { id } })
  if (!old) return new Response('Not found', { status: 404 })

  const updated = await prisma.transaction.update({ where: { id }, data })
  const diff = updated.amount - old.amount

  if (diff !== 0) {
    await prisma.account.update({ where: { id: updated.accountId }, data: { balance: { increment: diff } } })
  }

  return Response.json(updated)
}

export async function DELETE(request) {
  const body = await request.json()
  const { id } = body
  const existing = await prisma.transaction.findUnique({ where: { id } })
  if (!existing) return new Response('Not found', { status: 404 })

  await prisma.account.update({ where: { id: existing.accountId }, data: { balance: { increment: -existing.amount } } })
  await prisma.transaction.delete({ where: { id } })

  return Response.json({ success: true })
}