"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// Using simple div with overflow for scrolling and HTML checkbox
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function CreateAgentDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')?.toString()
    const about = formData.get('about')?.toString()
    const systemPrompt = formData.get('systemPrompt')?.toString()
    const isPublic = formData.get('isPublic') === 'on'

    if (!name || !systemPrompt) {
      setError('Name and system prompt are required')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          about,
          systemPrompt,
          isPublic,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create agent')
      }

      const data = await response.json()

      // Close dialog and refresh the page to show the new agent
      setOpen(false)
      router.refresh()

      // Reset form
      event.currentTarget.reset()
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Create a new AI agent with custom behavior and personality
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter agent name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Input
                  id="about"
                  name="about"
                  placeholder="Brief description of your agent"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt *</Label>
                <Textarea
                  id="systemPrompt"
                  name="systemPrompt"
                  placeholder="Enter the system prompt that defines your agent's behavior, personality, and capabilities..."
                  className="min-h-[120px] resize-none"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  This prompt will determine how your agent behaves and responds to users.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  disabled={isLoading}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                />
                <Label htmlFor="isPublic" className="text-sm">
                  Make this agent public (others can discover and use it)
                </Label>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Agent'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}