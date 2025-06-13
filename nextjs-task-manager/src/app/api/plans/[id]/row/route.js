import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req, context) {
  const params = await context.params

  const id = params?.id
  if (!id) {
    return Response.json({ error: 'Missing plan id' }, { status: 400 })
  }

  const body = await req.json()
  const { position } = body

  const cells = await prisma.planData.findMany({
    where: { planId: id }
  })

  const updates = cells
    .filter((cell) => cell.row >= position)
    .map((cell) =>
      prisma.planData.update({
        where: {
          planId_row_column: {
            planId: cell.planId,
            row: cell.row,
            column: cell.column
          }
        },
        data: { row: cell.row + 1 }
      })
    )

  await prisma.$transaction(updates)

  const maxColumn = Math.max(...cells.map(cell => cell.column), 0)

  const newRowData = Array.from({ length: maxColumn + 1 }).map((_, column) => ({
    planId: id,
    row: position,
    column,
    value: ''
  }))

  await prisma.planData.createMany({
    data: newRowData
  })

  return Response.json({ message: 'Row inserted' })
}

export async function DELETE(req, context) {
   const params = await context.params

  const id = params?.id
  if (!id) {
    return Response.json({ error: 'Missing plan id' }, { status: 400 })
  }


  const { position } = await req.json()

  // 1. Xoá toàn bộ ô ở dòng cần xoá
  await prisma.planData.deleteMany({
    where: {
      planId: id,
      row: position
    }
  })

  // 2. Dời các ô ở dòng bên dưới lên 1 dòng
  const cellsBelow = await prisma.planData.findMany({
    where: {
      planId: id,
      row: { gt: position }
    }
  })

  const updates = cellsBelow.map((cell) =>
    prisma.planData.update({
      where: {
        planId_row_column: {
          planId: id,
          row: cell.row,
          column: cell.column
        }
      },
      data: { row: cell.row - 1 }
    })
  )

  await prisma.$transaction(updates)

  return Response.json({ success: true })
}
