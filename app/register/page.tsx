import { Bot } from "lucide-react"

import { RegisterForm } from "@/components/register-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Bot className="size-4" />
            </div>
            Agent Chat
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800">
          <div className="bg-primary text-primary-foreground flex size-24 items-center justify-center rounded-3xl mb-8 shadow-2xl">
            <Bot className="size-12" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Join Agent Chat</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-md">
            Create your account and start building amazing conversations with AI agents
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 opacity-20">
            <div className="bg-primary/20 rounded-full size-16 flex items-center justify-center">
              <Bot className="size-8" />
            </div>
            <div className="bg-primary/20 rounded-full size-16 flex items-center justify-center">
              <Bot className="size-8" />
            </div>
            <div className="bg-primary/20 rounded-full size-16 flex items-center justify-center">
              <Bot className="size-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
