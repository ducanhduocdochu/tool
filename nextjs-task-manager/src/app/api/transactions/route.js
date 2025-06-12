import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const search = url.searchParams.get("search");
  const keywordId = url.searchParams.get("keywordId");
  const type = url.searchParams.get("type");

  // Build filter object…
  const where = {};
  if (search)    where.description = { contains: search, mode: "insensitive" };
  if (keywordId) where.keywordId   = keywordId;
  if (type)      where.type        = type;

  const total = await prisma.transaction.count({ where });

  const data = await prisma.transaction.findMany({
    where,
    include: { account: true, keyword: true },
    orderBy: { timestamp: "desc" },  // ← sửa ở đây
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalPages = Math.ceil(total / pageSize);
  return Response.json({ data, meta: { page, pageSize, total, totalPages } });
}
