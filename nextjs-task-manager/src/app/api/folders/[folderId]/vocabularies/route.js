import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/folders/:folderId/vocabularies -> lấy danh sách vocab theo folder
export async function GET(request, { params }) {
  const { folderId } = params;
  const vocabularies = await prisma.vocabulary.findMany({
    where: { folderId },
    orderBy: { createdAt: "asc" },
  });
  return new Response(JSON.stringify(vocabularies), { status: 200 });
}

// POST /api/folders/:folderId/vocabularies -> thêm vocab mới
export async function POST(request, { params }) {
  const { folderId } = params;
  const { word, partOfSpeech, ipa, meaning, example, audioUrl } =
    await request.json();

  if (!word || !meaning)
    return new Response("Missing word or meaning", { status: 400 });

  const vocab = await prisma.vocabulary.create({
    data: {
      word,
      partOfSpeech,
      ipa,
      meaning,
      example,
      folderId,
      audioUrl,
    },
  });

  return new Response(JSON.stringify(vocab), { status: 201 });
}
