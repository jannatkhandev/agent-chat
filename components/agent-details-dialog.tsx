"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Agent {
  id: string
  name: string
  about: string | null
  createdAt: string
  user: {
    name: string
  }
}

interface AgentDetailsDialogProps {
  agent: Agent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgentDetailsDialog({ agent, open, onOpenChange }: AgentDetailsDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStartChat = async () => {
    if (!agent) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agent.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create conversation')
      }

      const data = await response.json()
      router.push(`/chat/${data.conversation.id}`)
    } catch (error) {
      console.error('Error starting chat:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!agent) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img 
              src={`https://avatar.vercel.sh/${agent.name}`} 
              alt={agent.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <DialogTitle>{agent.name}</DialogTitle>
              <DialogDescription>
                @{agent.name.replace(/\s+/g, "_").toLowerCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {agent.about || "No description available."}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartChat} disabled={loading}>
            {loading ? "Starting..." : "Start Chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}