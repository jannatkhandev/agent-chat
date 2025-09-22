"use client"
import { useState, useEffect } from 'react'

interface Agent {
  id: string
  name: string
  about: string | null
  createdAt: string
  user: {
    name: string
  }
}

export function usePublicAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await fetch('/api/agents')
        if (!response.ok) {
          throw new Error('Failed to fetch agents')
        }
        const data = await response.json()
        setAgents(data.agents || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  return { agents, loading, error }
}