import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {
      status,
      priority,
      q,
      tags,
      dueDateFrom,
      dueDateTo,
      progressMin,
      progressMax,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      pageSize = 20,
    } = req.query

    const filters = {}

    if (status) filters.status = status
    if (priority) filters.priority = priority
    if (q) {
      filters.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { note: { contains: q, mode: 'insensitive' } },
      ]
    }
    if (tags) {
      let tagArray = tags
      if (typeof tags === 'string') {
        // comma separated
        tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
      }
      if (Array.isArray(tagArray) && tagArray.length > 0) {
        filters.tags = { hasSome: tagArray }
      }
    }
    if (dueDateFrom || dueDateTo) {
      filters.dueDate = {}
      if (dueDateFrom) filters.dueDate.gte = new Date(dueDateFrom)
      if (dueDateTo) filters.dueDate.lte = new Date(dueDateTo)
    }
    if (progressMin || progressMax) {
      filters.progress = {}
      if (progressMin) filters.progress.gte = Number(progressMin)
      if (progressMax) filters.progress.lte = Number(progressMax)
    }

    const skip = (Number(page) - 1) * Number(pageSize)
    const take = Number(pageSize)

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: filters,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
      }),
      prisma.task.count({ where: filters }),
    ])

    return res.json({ tasks, total, page: Number(page), pageSize: Number(pageSize) })
  }

  if (req.method === 'POST') {
    const { title, description, status, priority, progress, dueDate, tags, note } = req.body
    if (!title) return res.status(400).json({ error: 'Title required' })
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        progress,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        tags: Array.isArray(tags)
          ? tags
          : typeof tags === 'string'
          ? tags.split(',').map(t => t.trim()).filter(Boolean)
          : [],
        note,
      }
    })
    return res.status(201).json(newTask)
  }

  if (req.method === 'PUT') {
    const { id, ...updateData } = req.body
    if (!id) return res.status(400).json({ error: 'Task ID required' })
    if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate)
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
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Task ID required' })
    await prisma.task.delete({ where: { id } })
    return res.json({ success: true })
  }

  res.status(405).end()
}