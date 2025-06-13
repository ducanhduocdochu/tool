import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(_, context) {
  const params = await context.params 
  
    const id = params?.id
    if (!id) {
      return NextResponse.json({ error: 'Missing plan id' }, { status: 400 })
    }
  const plan = await prisma.plan.findUnique({
    where: { id},
    include: { data: true }
  })

  if (!plan) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  }

  return new Response(JSON.stringify(plan), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
export async function DELETE(_, context) {
  try {
      const params = await context.params 
  
    const id = params?.id
    if (!id) {
      return NextResponse.json({ error: 'Missing plan id' }, { status: 400 })
    }
    await prisma.plan.delete({
      where: { id: await params?.id }
    })
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Delete failed' }), { status: 500 })
  }
}

export async function PATCH(request, context) {
        const params = await context.params 
  
    const id = params?.id
    if (!id) {
      return NextResponse.json({ error: 'Missing plan id' }, { status: 400 })
    }
  const { name } = await request.json()
  const updated = await prisma.plan.update({
    where: { id },
    data: { name }
  })
  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}