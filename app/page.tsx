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
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { PlusCircle, Bot } from "lucide-react"
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea"
import { isAuthenticated } from "@/lib/auth-server"
import { redirect } from "next/navigation"
import { AgentMarquee } from "@/components/agent-marquee"
import { SearchInput } from "@/components/search-input"
import { CreateAgentDialog } from "@/components/create-agent-dialog"



export default async function Page() {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return redirect("/login");
    }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Browse Agents</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center min-h-0 p-4 pt-0">
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl space-y-8">
            {/* Icon */}
            <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            
            {/* Headings */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Welcome to Agent Chat</h1>
              <p className="text-xl text-muted-foreground">Chat with public agents or create your own</p>
            </div>
            
            {/* Search and Create Button */}
            <div className="flex gap-3 items-center w-full max-w-md">
              <div className="flex-1">
                <SearchInput />
              </div>
              <CreateAgentDialog>
                <Button variant="outline" size="sm">
                  <PlusCircle className="w-4 h-4 mr-1" /> New Agent
                </Button>
              </CreateAgentDialog>
            </div>
            
            {/* Marquee */}
            <div className="w-full">
              <AgentMarquee />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
