'use client';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ui/shadcn-io/ai/conversation';
import { Loader } from '@/components/ui/shadcn-io/ai/loader';
import { Message, MessageAvatar, MessageContent } from '@/components/ui/shadcn-io/ai/message';
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ui/shadcn-io/ai/prompt-input';
import { DefaultChatTransport } from 'ai';
import { Response } from '@/components/ui/shadcn-io/ai/response';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MicIcon, PaperclipIcon, RotateCcwIcon } from 'lucide-react';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
const models = [
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
];

interface ChatBoxProps {
  conversationId?: string;
}

const ChatBox = ({ conversationId }: ChatBoxProps) => {
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(!!conversationId);
  const [selectedModel, setSelectedModel] = useState(models[0].id);

  // Manual input state management for AI SDK v5
  const [input, setInput] = useState('')

  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        conversationId,
      },
    }),
  });

  // Load conversation data and set initial messages
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }
// In your ChatBox component, update the loadConversation function:
async function loadConversation() {
  try {
    const response = await fetch(`/api/conversations/${conversationId}`);
    if (!response.ok) {
      throw new Error('Failed to load conversation');
    }
    const data = await response.json();
    setConversation(data.conversation);
    
    if (data.conversation.messages && data.conversation.messages.length > 0) {
      const uiMessages: UIMessage[] = data.conversation.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        parts: [
          {
            type: 'text',
            text: msg.content
          }
        ],
        createdAt: new Date(msg.createdAt)
      }));
      setMessages(uiMessages);
    }
    
    setLoading(false);
  } catch (error) {
    console.error('Error loading conversation:', error);
    setLoading(false);
  }
}

    loadConversation();
  }, [conversationId]);

  const handleReset = () => {
    setMessages([])
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({ text: input })
      setInput('')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const isLoading = status === 'streaming' || status === 'submitted';
  if (loading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="flex items-center gap-2">
          <Loader size={16} />
          <span className="text-muted-foreground">Loading conversation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span className="font-medium text-sm">
              {conversation?.agent?.name || "AI Assistant"}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-muted-foreground text-xs">
            {models.find(m => m.id === selectedModel)?.name}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleReset}
          className="h-8 px-2"
        >
          <RotateCcwIcon className="size-4" />
          <span className="ml-1">Reset</span>
        </Button>
      </div>
      {/* Conversation Area */}
      <Conversation className="flex-1">
      <ConversationContent className="space-y-4">
  {messages.length === 0 && (
    <div className="space-y-3">
      <Message from="assistant">
        <MessageContent>
          {(() => {
            const welcomeMessage = conversation 
              ? `Hello! I'm ${conversation.agent.name}. ${conversation.agent.about || "How can I help you today?"}`
              : "Hello! I'm your AI assistant. How can I help you today?";
            
            return <Response>{welcomeMessage}</Response>;
          })()}
        </MessageContent>
        <MessageAvatar 
          src={conversation ? `https://avatar.vercel.sh/${conversation.agent.name}` : 'https://avatar.vercel.sh/AI'} 
          name={conversation?.agent?.name || 'AI Assistant'} 
        />
      </Message>
    </div>
  )}
    
    {messages.map((message) => {
      const textContent = message.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('');

      return (
        <div key={message.id} className="space-y-3">
          <Message from={message.role}>
            <MessageContent>
              {message.role === 'assistant' ? (
                <Response>{textContent}</Response>
              ) : (
                textContent
              )}
              {isLoading && message.role === 'assistant' && !textContent && (
                <div className="flex items-center gap-2">
                  <Loader size={14} />
                  <span className="text-muted-foreground text-sm">Thinking...</span>
                </div>
              )}
            </MessageContent>
            <MessageAvatar 
              src={message.role === 'user' ? 'https://github.com/jannatkhandev.png' : `https://avatar.vercel.sh/${conversation?.agent?.name || 'AI'}`} 
              name={message.role === 'user' ? 'User' : conversation?.agent?.name || 'AI'} 
            />
          </Message>
        </div>
      );
    })}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>
      {/* Input Area */}
      <div className="border-t p-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            value={input}
            onChange={handleInputChange}
            placeholder={conversation ? `Chat with ${conversation.agent.name}...` : "Ask me anything..."}
            disabled={isLoading}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputModelSelect 
                value={selectedModel} 
                onValueChange={setSelectedModel}
                disabled={isLoading}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit 
              disabled={!input.trim() || isLoading}
              status={isLoading ? 'streaming' : 'ready'}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};
export default ChatBox;