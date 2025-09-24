import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Thêm cột mới
export async function POST(req, context) {
  const params = await context.params
  const id = params?.id

  if (!id) {
    return Response.json({ error: "Missing plan id" }, { status: 400 })
  }

  const { position } = await req.json()

  // B1: Tìm các cell cần shift sang phải
  const cells = await prisma.planData.findMany({
    where: {
      planId: id,
      column: { gte: position }
    }
  })

  // B2: Xoá các cell đó
  await prisma.planData.deleteMany({
    where: {
      planId: id,
      column: { gte: position }
    }
  })

  // B3: Tạo lại với column + 1
  const shiftedCells = cells.map(cell => ({
    planId: id,
    row: cell.row,
    column: cell.column + 1,
    value: cell.value
  }))
  await prisma.planData.createMany({ data: shiftedCells })

  // B4: Lấy danh sách row hiện có để chèn cột mới
  const rowResult = await prisma.planData.findMany({
    where: { planId: id },
    select: { row: true },
    distinct: ['row']
  })
  const rows = rowResult.map(r => r.row)

  const newCells = rows.map(row => ({
    planId: id,
    row,
    column: position,
    value: ''
  }))
  await prisma.planData.createMany({ data: newCells })

  return Response.json({ message: "Column inserted (safe strategy)" })
}


// Xoá cột
export async function DELETE(req, context) {
  const params = await context.params
  const id = params?.id

  if (!id) {
    return Response.json({ error: "Missing plan id" }, { status: 400 })
  }

  const { position } = await req.json()

  // 1. Kiểm tra xem có cột nào tại vị trí cần xoá không
  const cellsToDelete = await prisma.planData.findMany({
    where: {
      planId: id,
      column: position
    }
  })

  if (cellsToDelete.length === 0) {
    return Response.json({ error: "Column does not exist" }, { status: 404 })
  }

  // 2. Xoá tất cả ô trong cột
  await prisma.planData.deleteMany({
    where: {
      planId: id,
      column: position
    }
  })

  // 3. Dời các ô bên phải sang trái 1
  const cellsRight = await prisma.planData.findMany({
    where: {
      planId: id,
      column: { gt: position }
    }
  })

  if (cellsRight.length > 0) {
    const updates = cellsRight.map(cell =>
      prisma.planData.update({
        where: {
          planId_row_column: {
            planId: id,
            row: cell.row,
            column: cell.column
          }
        },
        data: {
          column: cell.column - 1
        }
      })
    )

    await prisma.$transaction(updates)
  }

  return Response.json({ message: "Column deleted successfully" })
}
