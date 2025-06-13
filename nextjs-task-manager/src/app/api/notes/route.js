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
    const { action, id, title, content, dueAt } = await req.json();

    if (action === 'delete') {
      await prisma.note.delete({ where: { id } });
      return Response.json({ message: 'Deleted' });
    }

    if (action === 'create') {
      const note = await prisma.note.create({
        data: {
          title,
          content,
          dueAt: dueAt ? new Date(dueAt) : null,
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
          dueAt: dueAt ? new Date(dueAt) : null,
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
