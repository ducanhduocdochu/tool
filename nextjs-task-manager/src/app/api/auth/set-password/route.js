import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json()

    // Kiểm tra đầu vào
    if (!email || !newPassword || newPassword.length < 6) {
      return Response.json(
        { message: "Email and new password (min 6 characters) are required" },
        { status: 400 }
      )
    }

    console.log(email, newPassword)

    // Kiểm tra đã tồn tại mật khẩu chưa
    const exists = await prisma.auth.count()
    if (exists > 0) {
        return Response.json(
            { message: "Password has already been set" },
            { status: 400 }
        )
    }


    console.log(email, newPassword)

    // Hash mật khẩu
    const hashed = await bcrypt.hash(newPassword, 10)

    console.log(email, newPassword)

    // Tạo bản ghi mới
    await prisma.auth.create({
      data: {
        id: "auth", // dùng ID cố định
        email,
        password: hashed,
      },
    })

    console.log(email, newPassword)

    return Response.json({ success: true })
  } catch (err) {
    console.error("Set password error:", err)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
