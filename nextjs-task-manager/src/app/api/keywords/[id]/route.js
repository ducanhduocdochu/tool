import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req, { params }) {
  const body = await req.json()
  const {id} = params

  if (!id) return Response.json({ error: "Missing id" }, { status: 400 })

  const updated = await prisma.actionKeyword.update({
    where: { id },
    data: body,
  })

  return Response.json(updated)
}

export async function DELETE(req, { params }) {
  const id = params.id

  await prisma.actionKeyword.delete({
    where: { id: Number(id) },
  })

  return Response.json({ success: true })
}
