import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return Response.json(notes);
  } catch (err) {
    console.error('GET /api/notes error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { action, id, title, content, dueAt, warningHours, dangerHours } = await req.json();
        if (action === 'delete') {
      await prisma.note.delete({ where: { id } });
      return Response.json({ message: 'Deleted' });
    }

    // Validate required fields
    if (!dueAt) {
      return Response.json({ error: 'dueAt is required' }, { status: 400 });
    }
    if (warningHours === undefined || dangerHours === undefined) {
      return Response.json({ error: 'warningHours and dangerHours are required' }, { status: 400 });
    }

    const dueDate = new Date(dueAt);
    if (isNaN(dueDate.getTime())) {
      return Response.json({ error: 'Invalid dueAt format' }, { status: 400 });
    }


    if (action === 'create') {
      const note = await prisma.note.create({
        data: {
          title,
          content,
          dueAt: dueDate,
          warningHours: parseFloat(warningHours),
          dangerHours: parseFloat(dangerHours),
        },
      });
      return Response.json(note);
    }

    if (action === 'update') {
      const note = await prisma.note.update({
        where: { id },
        data: {
          title,
          content,
          dueAt: dueDate,
          warningHours: parseFloat(warningHours),
          dangerHours: parseFloat(dangerHours),
        },
      });
      return Response.json(note);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('POST /api/notes error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
