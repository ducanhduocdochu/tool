import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/folders -> lấy danh sách folder
export async function GET() {
  const folders = await prisma.folder.findMany({
    orderBy: { createdAt: "asc" },
  });
  return new Response(JSON.stringify(folders), { status: 200 });
}

// POST /api/folders -> tạo folder mới
export async function POST(request) {
  const { name, description } = await request.json();
  if (!name) return new Response("Missing folder name", { status: 400 });

  const folder = await prisma.folder.create({
    data: { name, description },
  });
  return new Response(JSON.stringify(folder), { status: 201 });
}
