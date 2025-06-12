import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json({ message: "Email and password required" }, { status: 400 })
    }

    const user = await prisma.auth.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return Response.json({ message: "Invalid password" }, { status: 401 })
    }

    // ✅ Set cookie for session (simple flag for now)
    const res = Response.json({ success: true })
    res.headers.set("Set-Cookie", `authenticated=true; Path=/; HttpOnly`)
    return res
  } catch (err) {
    console.error("Login error:", err)
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
