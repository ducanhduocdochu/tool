import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  const params = await context.params;
  const body = await req.json()

  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Missing keyword id" }, { status: 400 });
  }

  const updated = await prisma.actionKeyword.update({
    where: { id },
    data: body,
  });

  return Response.json(updated);
}

export async function DELETE(req, context) {
  const params = await context.params
  const id = params?.id

  if (!id) {
    return Response.json({ error: "Missing keyword id" }, { status: 400 })
  }

  try {
    await prisma.transaction.deleteMany({
      where: { keywordId: id }
    })

    await prisma.actionKeyword.delete({
      where: { id }
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to delete" }, { status: 500 })
  }
}
