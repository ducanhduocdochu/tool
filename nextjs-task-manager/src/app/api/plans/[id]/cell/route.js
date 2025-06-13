import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request, context) {
  const params = await context.params;

  const id = params?.id;
  if (!id) {
    return Response.json({ error: "Missing plan id" }, { status: 400 });
  }
  const plan = await prisma.plan.findUnique({
    where: { id },
    include: { data: true },
  });

  if (!plan) return new Response("Plan not found", { status: 404 });
  return Response.json(plan);
}
export async function POST(request, context) {
  const params = await context.params;

  const id = params?.id;
  if (!id) {
    return Response.json({ error: "Missing plan id" }, { status: 400 });
  }

  const { updates } = await request.json(); 

  if (!Array.isArray(updates) || updates.length === 0) {
    return Response.json({ error: "No updates provided" }, { status: 400 });
  }

  const operations = updates.map(({ row, column, value }) =>
    prisma.planData.upsert({
      where: {
        planId_row_column: {
          planId: id,
          row,
          column,
        },
      },
      update: { value },
      create: {
        planId: id,
        row,
        column,
        value,
      },
    })
  );

  await prisma.$transaction(operations);

  return Response.json({ message: "All cells updated successfully" });
}
