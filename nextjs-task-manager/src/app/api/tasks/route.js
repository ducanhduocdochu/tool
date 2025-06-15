import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// GET: Lấy danh sách tasks, có filter và phân trang
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const q = searchParams.get('q')
  const tags = searchParams.get('tags')
  // Đổi tên tham số cho nhất quán với FE, dễ nhớ, dễ dùng
  const startFrom = searchParams.get('startFrom')      // ngày bắt đầu từ
  const startTo = searchParams.get('startTo')          // ngày bắt đầu đến
  const endFrom = searchParams.get('endFrom')          // ngày kết thúc từ
  const endTo = searchParams.get('endTo')              // ngày kết thúc đến
  // fallback cho các tên cũ nếu cần giữ compatibility:
  const startTimeFrom = searchParams.get('startTimeFrom') || startFrom
  const startTimeTo = searchParams.get('startTimeTo') || startTo
  const endTimeFrom = searchParams.get('endTimeFrom') || endFrom
  const endTimeTo = searchParams.get('endTimeTo') || endTo

  const progressMin = searchParams.get('progressMin')
  const progressMax = searchParams.get('progressMax')
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 20)

  const filters = {}

  if (status) filters.status = status
  if (priority) filters.priority = priority
  if (q) {
    filters.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } }
    ]
  }
  if (tags) {
    let tagArray = tags
    if (typeof tags === 'string') {
      tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
    }
    if (Array.isArray(tagArray) && tagArray.length > 0) {
      filters.tags = { hasSome: tagArray }
    }
  }
  if (startTimeFrom || startTimeTo) {
    filters.startTime = {}
    if (startTimeFrom) filters.startTime.gte = new Date(startTimeFrom)
    if (startTimeTo) filters.startTime.lte = new Date(startTimeTo)
  }
  if (endTimeFrom || endTimeTo) {
    filters.endTime = {}
    if (endTimeFrom) filters.endTime.gte = new Date(endTimeFrom)
    if (endTimeTo) filters.endTime.lte = new Date(endTimeTo)
  }
  if (progressMin || progressMax) {
    filters.progress = {}
    if (progressMin) filters.progress.gte = Number(progressMin)
    if (progressMax) filters.progress.lte = Number(progressMax)
  }

  const skip = (page - 1) * pageSize
  const take = pageSize

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: {},
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    prisma.task.count({ where: filters }),
  ])

  return Response.json({ tasks, total, page, pageSize })
}

function applyTimezoneOffset(dateStr, offsetMinutes = 420) {
  const localDate = new Date(dateStr);
  const utcDate = new Date(localDate.getTime() - offsetMinutes * 60000);
  return utcDate;
}

// POST: Tạo task mới
export async function POST(request) {
  const body = await request.json()
  const { title, description, status, priority, progress, startTime, endTime, tags } = body

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title required' }), { status: 400 })
  }

  // Bắt buộc phải có startTime và endTime
  if (!startTime || !endTime) {
    return new Response(JSON.stringify({ error: 'Start time and end time are required' }), { status: 400 })
  }

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      progress,
      startTime: (new Date(startTime)),
      endTime: (new Date(endTime)),
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : [],
    }
  })
  return Response.json(newTask, { status: 201 })
}

// PUT: Cập nhật task
export async function PUT(request) {
  const body = await request.json()
  const { id, ...updateData } = body

  if (!id) return new Response(JSON.stringify({ error: 'Task ID required' }), { status: 400 })

  // Xử lý đúng kiểu dữ liệu cho các trường
  if (updateData.startTime) updateData.startTime = (new Date(updateData.startTime))
  if (updateData.endTime) updateData.endTime = (new Date(updateData.endTime))
  if (updateData.tags) {
    updateData.tags = Array.isArray(updateData.tags)
      ? updateData.tags
      : typeof updateData.tags === 'string'
      ? updateData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []
  }

  const updated = await prisma.task.update({
    where: { id },
    data: updateData,
  })
  return Response.json(updated)
}

// DELETE: Xóa task
export async function DELETE(request) {
  console.log('a')
  const body = await request.json()
  const { id } = body
  if (!id) return new Response(JSON.stringify({ error: 'Task ID required' }), { status: 400 })

  await prisma.task.delete({ where: { id } })
  return Response.json({ success: true })
}