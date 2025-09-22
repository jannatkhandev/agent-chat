"use client"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"

import React from "react";
import { usePublicAgents } from "@/hooks/use-agents"
import { AgentDetailsDialog } from "@/components/agent-details-dialog"

interface Agent {
  id: string
  name: string
  about: string | null
  createdAt: string
  user: {
    name: string
  }
}

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null)
    const [detailsOpen, setDetailsOpen] = React.useState(false)
    const { agents, loading } = usePublicAgents()
  
    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen((open) => !open)
        }
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [])

    const openDialog = () => setOpen(true)

    const filteredAgents = agents.filter(agent => 
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.about?.toLowerCase().includes(search.toLowerCase())
    )

    const handleAgentSelect = (agent: Agent) => {
      setSelectedAgent(agent)
      setOpen(false)
      setDetailsOpen(true)
    }
  
    return {
      dialog: (
        <>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput 
              placeholder="Search agents..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? "Loading agents..." : "No agents found."}
              </CommandEmpty>
              {filteredAgents.length > 0 && (
                <CommandGroup heading="Public Agents">
                  {filteredAgents.map((agent) => (
                    <CommandItem 
                      key={agent.id}
                      onSelect={() => handleAgentSelect(agent)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <img 
                        src={`https://avatar.vercel.sh/${agent.name}`} 
                        alt={agent.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{agent.name}</span>
                        <span className="text-xs text-muted-foreground">
                          @{agent.name.replace(/\s+/g, "_").toLowerCase()}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </CommandDialog>
          <AgentDetailsDialog 
            agent={selectedAgent}
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
          />
        </>
      ),
      openDialog
    }
  }