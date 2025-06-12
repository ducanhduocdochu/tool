import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req) {
  const { email, oldPassword, newPassword } = await req.json()

  if (!email || !oldPassword || !newPassword)
    return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 })

  const auth = await prisma.auth.findUnique({ where: { email } })
  if (!auth) return new Response(JSON.stringify({ message: "Email not found" }), { status: 404 })

  const valid = await bcrypt.compare(oldPassword, auth.password)
  if (!valid) return new Response(JSON.stringify({ message: "Incorrect old password" }), { status: 401 })

  const newHash = await bcrypt.hash(newPassword, 10)

  await prisma.auth.update({
    where: { email },
    data: { password: newHash },
  })

  return Response.json({ success: true })
}
