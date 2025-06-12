import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const { id } = params
  const data = await request.json()

  try {
    const updated = await prisma.account.update({
      where: { id },
      data,
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    await prisma.account.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
