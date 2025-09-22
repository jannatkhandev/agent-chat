"use client"
import { useState, useEffect } from 'react'

interface Agent {
  id: string
  name: string
  about: string | null
  createdAt: string
}

interface Conversation {
  id: string
  title: string | null
  createdAt: string
  agent: {
    id: string
    name: string
  }
  _count: {
    messages: number
  }
}

export function useUserAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await fetch('/api/agents?type=my')
        if (response.ok) {
          const data = await response.json()
          setAgents(data.agents || [])
        }
      } catch (error) {
        console.error('Error fetching user agents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  return { agents, loading }
}

export function useUserConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch('/api/conversations')
        if (response.ok) {
          const data = await response.json()
          setConversations(data.conversations || [])
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  return { conversations, loading }
}