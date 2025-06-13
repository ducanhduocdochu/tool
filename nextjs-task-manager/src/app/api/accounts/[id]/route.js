import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function PUT(request, context) {
  const params = await context.params;

  const id = params?.id;
  if (!id) {
    return Response.json({ error: "Missing account id" }, { status: 400 });
  }
  const data = await request.json()

  try {
    const updated = await prisma.account.update({
      where: { id },
      data,
    })
    return Response.json(updated)
  } catch (e) {
    return Response.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  const params = await context.params;
  const id = params?.id;

  if (!id) {
    return Response.json({ error: "Missing account id" }, { status: 400 });
  }

  try {
    await prisma.transaction.deleteMany({
      where: { accountId: id }
    });

    await prisma.account.delete({
      where: { id }
    });

    return Response.json({ message: "Deleted account and related transactions" });
  } catch (e) {
    console.error("Failed to delete account:", e);
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
