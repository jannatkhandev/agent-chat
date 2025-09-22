import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import type { UIMessage } from '@ai-sdk/react';
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/auth-server'

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages, conversationId }: { messages: UIMessage[], conversationId?: string } = await req.json();

    if (!conversationId) {
      return new Response('Conversation ID is required', { status: 400 })
    }

    // Load conversation and verify ownership
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id
      },
      include: {
        agent: {
          select: {
            systemPrompt: true,
            name: true
          }
        },
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!conversation) {
      return new Response('Conversation not found', { status: 404 })
    }

    // Get the latest user message to store in DB
    const latestMessage = messages[messages.length - 1]
    if (latestMessage.role === 'user') {
      const messageText = latestMessage.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('');

      // Store user message in database
      await prisma.message.create({
        data: {
          conversationId,
          role: 'USER',
          content: messageText
        }
      })
    }

    const systemMessage: UIMessage = {
      id: 'system',
      role: 'system',
      parts: [
        {
          type: 'text',
          text: conversation.agent.systemPrompt
        }
      ]
    }

    // Combine system message with conversation messages
    const allMessages = [systemMessage, ...messages]

    const result = streamText({
      model: google("gemini-2.5-flash-lite"),
      messages: convertToModelMessages(allMessages),
      async onFinish({ text }) {
        // Store AI response in database after streaming completes
        try {
          await prisma.message.create({
            data: {
              conversationId,
              role: 'ASSISTANT',
              content: text
            }
          })
        } catch (error) {
          console.error('Error storing AI response:', error)
        }
      }
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}