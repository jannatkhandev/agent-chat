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
import { AgentDetailsDialog } from "@/components/agent-details-dialog"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUserAgents, useUserConversations } from "@/hooks/use-user-data"
import { useSession } from "@/lib/auth-client"

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
  const { data: session } = useSession()
  const [selectedAgent, setSelectedAgent] = React.useState<any>(null)
  const [isAgentDialogOpen, setIsAgentDialogOpen] = React.useState(false)

  // Create user object from session with fallbacks
  const user = React.useMemo(() => {
    const userName = session?.user?.name || "User"
    const userEmail = session?.user?.email || ""
    const userAvatar = session?.user?.image || `https://avatar.vercel.sh/${userEmail || userName}`

    return {
      name: userName,
      email: userEmail,
      avatar: userAvatar,
    }
  }, [session])

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
        <div className="flex items-center gap-2 p-2">
          <Link href="/" className="flex items-center gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg p-2 transition-colors">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Bot className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Agent Chat</span>
              <span className="truncate text-xs">Chat with agents</span>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
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
