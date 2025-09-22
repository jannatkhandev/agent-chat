import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'my') {
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const agents = await prisma.agent.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ agents })
    }

    // Default: Return public agents
    const publicAgents = await prisma.agent.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        name: true,
        about: true,
        createdAt: true,
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ agents: publicAgents })

  } catch (error) {
    console.error('GET /api/agents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create new agent
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, systemPrompt, about, isPublic } = body

    // Basic validation
    if (!name || !systemPrompt) {
      return NextResponse.json(
        { error: 'Name and system prompt are required' },
        { status: 400 }
      )
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        systemPrompt,
        about: about || '',
        isPublic: isPublic || false,
        userId: session.user.id
      }
    })

    return NextResponse.json({ agent }, { status: 201 })

  } catch (error) {
    console.error('POST /api/agents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Update existing agent (must own it)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, systemPrompt, about, isPublic } = body

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 })
    }

    // Check if user owns the agent
    const existingAgent = await prisma.agent.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Agent not found or access denied' },
        { status: 404 }
      )
    }

    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(systemPrompt && { systemPrompt }),
        ...(about !== undefined && { about }),
        ...(isPublic !== undefined && { isPublic })
      }
    })

    return NextResponse.json({ agent: updatedAgent })

  } catch (error) {
    console.error('PUT /api/agents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}