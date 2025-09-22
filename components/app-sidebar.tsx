"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  MessagesSquare,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { AgentDetailsDialog } from "@/components/agent-details-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUserAgents, useUserConversations } from "@/hooks/use-user-data"

// This is sample data.
const data = {
  user: {
    name: "Jannat Khan",
    email: "jannatkhandev@gmail.com",
    avatar: "https://github.com/jannatkhandev.png",
  },
  teams: [
    {
      name: "Agent Chat",
      logo: Bot,
      plan: "Chat with agents",
    }
  ],
  navMain: [
    {
      title: "Agents",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Chats",
      url: "#",
      icon: MessagesSquare,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { agents, loading: agentsLoading } = useUserAgents()
  const { conversations, loading: conversationsLoading } = useUserConversations()
  const [selectedAgent, setSelectedAgent] = React.useState<any>(null)
  const [isAgentDialogOpen, setIsAgentDialogOpen] = React.useState(false)

  // Build dynamic nav items based on user data
  const navMain = [
    {
      title: "Agents",
      url: "#agents",
      icon: Bot,
      isActive: true,
      items: agents.length > 0 ? agents.map(agent => ({
        title: agent.name,
        url: `#${agent.name}`,
        onClick: () => {
          setSelectedAgent(agent)
          setIsAgentDialogOpen(true)
        },
      })) : [
        {
          title: agentsLoading ? "Loading..." : "Your created agents will appear here",
          url: "#",
          disabled: true,
        }
      ],
    },
    {
      title: "Chats",
      url: "#",
      icon: MessagesSquare,
      items: conversations.length > 0 ? conversations.slice(0, 10).map(conversation => ({
        title: conversation.title || `Chat with ${conversation.agent.name}`,
        url: `/chat/${conversation.id}`,
      })) : [
        {
          title: conversationsLoading ? "Loading..." : "Your recent chats will appear here",
          url: "#",
          disabled: true,
        }
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
      
      <AgentDetailsDialog
        agent={selectedAgent}
        open={isAgentDialogOpen}
        onOpenChange={setIsAgentDialogOpen}
      />
    </Sidebar>
  )
}
