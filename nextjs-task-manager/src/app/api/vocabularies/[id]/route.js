import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/vocabularies/:id -> lấy 1 từ
export async function GET(request, { params }) {
  const { id } = params;
  const vocab = await prisma.vocabulary.findUnique({ where: { id } });
  if (!vocab) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(vocab), { status: 200 });
}

// PUT /api/vocabularies/:id -> cập nhật từ
export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();
  const vocab = await prisma.vocabulary.update({
    where: { id },
    data,
  });
  return new Response(JSON.stringify(vocab), { status: 200 });
}

// DELETE /api/vocabularies/:id -> xóa từ
export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.vocabulary.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
