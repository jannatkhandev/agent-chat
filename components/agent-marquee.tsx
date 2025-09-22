"use client"
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee"
import { usePublicAgents } from "@/hooks/use-agents"
import { AgentDetailsDialog } from "@/components/agent-details-dialog"
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

const AgentCard = ({ agent, onClick }: { agent: Agent; onClick: () => void }) => {
  return (
    <figure
      onClick={onClick}
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img 
          className="rounded-full" 
          width="32" 
          height="32" 
          alt="" 
          src={`https://avatar.vercel.sh/${agent.name}`} 
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {agent.name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">@{agent.name.replace(/\s+/g, "_").toLowerCase()}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">
        {agent.about || "No description available."}
      </blockquote>
    </figure>
  );
};

export function AgentMarquee() {
  const { agents, loading, error } = usePublicAgents()
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="text-center text-muted-foreground">Loading agents...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="text-center text-red-500">Error loading agents: {error}</div>
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="text-center text-muted-foreground">No public agents available.</div>
      </div>
    )
  }

  const firstRow = agents.slice(0, Math.ceil(agents.length / 2));
  const secondRow = agents.slice(Math.ceil(agents.length / 2));

  return (
    <>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onClick={() => handleAgentClick(agent)}
            />
          ))}
        </Marquee>
        {secondRow.length > 0 && (
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onClick={() => handleAgentClick(agent)}
              />
            ))}
          </Marquee>
        )}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
      
      <AgentDetailsDialog 
        agent={selectedAgent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}