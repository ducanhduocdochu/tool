import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { folderId, vocabId } = params;

  try {
    const body = await req.json();
    const { word, partOfSpeech, ipa, meaning, example, audioUrl } = body;

    // Update vocabulary
    const updated = await prisma.vocabulary.update({
      where: { id: vocabId },
      data: {
        word,
        partOfSpeech,
        ipa,
        meaning,
        example,
        audioUrl,
      },
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to update vocabulary" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { folderId, vocabId } = params;

  try {
    await prisma.vocabulary.delete({
      where: { id: vocabId },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to delete vocabulary" }),
      { status: 500 }
    );
  }
}
