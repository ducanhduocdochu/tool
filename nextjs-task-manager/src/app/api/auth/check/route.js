export async function GET(req) {
  const cookie = req.headers.get("cookie") || ""
  const isAuth = cookie.includes("authenticated=true")
  return Response.json({ authenticated: isAuth })
}