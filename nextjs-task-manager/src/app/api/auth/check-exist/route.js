import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const exists = await prisma.auth.findFirst()
    return Response.json({ hasPassword: !!exists }) // ✅ đảm bảo luôn trả về JSON
  } catch (e) {
    return new Response(JSON.stringify({ message: "Internal error" }), { status: 500 })
  }
}