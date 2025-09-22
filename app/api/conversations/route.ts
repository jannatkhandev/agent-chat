import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agentId } = body

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      )
    }

    // Verify agent exists and is public or owned by user
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: {
        id: true,
        isPublic: true,
        userId: true,
        name: true
      }
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Check if user can access this agent
    if (!agent.isPublic && agent.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        agentId: agentId,
        title: `Chat with ${agent.name}`
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            systemPrompt: true
          }
        }
      }
    })

    return NextResponse.json({ conversation }, { status: 201 })

  } catch (error) {
    console.error('POST /api/conversations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: session.user.id },
      include: {
        agent: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ conversations })

  } catch (error) {
    console.error('GET /api/conversations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}