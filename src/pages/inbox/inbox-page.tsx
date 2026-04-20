import { useState, useRef, useEffect, useMemo } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Send,
  MessageSquare,
  Camera,
  Phone,
  Sparkles,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  MoreVertical,
  ArrowLeft,
  Filter,
  ShieldCheck,
  ChevronRight,
  User,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Channel = "whatsapp" | "instagram"

type MessageStatus = "sent" | "delivered" | "read" | "failed"

type ConversationStatus = "new" | "in_progress" | "qualified" | "closed"

interface Conversation {
  id: string
  contactName: string
  contactInitials: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  channel: Channel
  isOnline: boolean
  phone: string
  assignedTo: string // user name (e.g. "Rafael Silva", "Juliana Santos", "Pedro Henrique")
  status: ConversationStatus
}

interface Message {
  id: string
  conversationId: string
  content: string
  timestamp: Date
  direction: "inbound" | "outbound"
  status: MessageStatus
  senderName?: string
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockConversations: Conversation[] = [
  // --- Assigned to Rafael Silva (closer) ---
  {
    id: "c1",
    contactName: "Maria Silva",
    contactInitials: "MS",
    lastMessage: "Oi, gostaria de saber mais sobre o plano Enterprise",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 3,
    channel: "whatsapp",
    isOnline: true,
    phone: "(11) 99999-1111",
    assignedTo: "Rafael Silva",
    status: "in_progress",
  },
  {
    id: "c2",
    contactName: "Carlos Oliveira",
    contactInitials: "CO",
    lastMessage: "Pode me enviar a proposta atualizada?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 1,
    channel: "whatsapp",
    isOnline: true,
    phone: "(21) 98888-2222",
    assignedTo: "Rafael Silva",
    status: "qualified",
  },
  {
    id: "c3",
    contactName: "Fernanda Costa",
    contactInitials: "FC",
    lastMessage: "Perfeito, vou analisar e retorno amanhã",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 45),
    unreadCount: 0,
    channel: "instagram",
    isOnline: false,
    phone: "(31) 97777-3333",
    assignedTo: "Rafael Silva",
    status: "in_progress",
  },
  {
    id: "c4",
    contactName: "Ricardo Santos",
    contactInitials: "RS",
    lastMessage: "Vocês fazem integração com Salesforce?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 2,
    channel: "whatsapp",
    isOnline: false,
    phone: "(41) 96666-4444",
    assignedTo: "Rafael Silva",
    status: "qualified",
  },
  // --- Assigned to Juliana Santos (closer) ---
  {
    id: "c5",
    contactName: "Patricia Lima",
    contactInitials: "PL",
    lastMessage: "Obrigada! Fechamos então",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
    channel: "whatsapp",
    isOnline: true,
    phone: "(51) 95555-5555",
    assignedTo: "Juliana Santos",
    status: "closed",
  },
  {
    id: "c6",
    contactName: "Andre Moreira",
    contactInitials: "AM",
    lastMessage: "Vi o post de vocês sobre IA, muito bom!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 0,
    channel: "instagram",
    isOnline: false,
    phone: "(61) 94444-6666",
    assignedTo: "Juliana Santos",
    status: "in_progress",
  },
  {
    id: "c7",
    contactName: "Juliana Ferreira",
    contactInitials: "JF",
    lastMessage: "Qual o prazo de implementação?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    unreadCount: 1,
    channel: "whatsapp",
    isOnline: true,
    phone: "(71) 93333-7777",
    assignedTo: "Juliana Santos",
    status: "qualified",
  },
  {
    id: "c8",
    contactName: "Bruno Almeida",
    contactInitials: "BA",
    lastMessage: "Temos reunião marcada para sexta às 14h",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    channel: "instagram",
    isOnline: false,
    phone: "(81) 92222-8888",
    assignedTo: "Juliana Santos",
    status: "in_progress",
  },
  // --- Unqualified / new leads (for SDR) ---
  {
    id: "c9",
    contactName: "Lucas Mendes",
    contactInitials: "LM",
    lastMessage: "Oi, vi o anúncio de vocês. Como funciona?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 10),
    unreadCount: 2,
    channel: "whatsapp",
    isOnline: true,
    phone: "(11) 91111-9999",
    assignedTo: "Pedro Henrique",
    status: "new",
  },
  {
    id: "c10",
    contactName: "Camila Rocha",
    contactInitials: "CR",
    lastMessage: "Gostaria de saber os preços de vocês",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 25),
    unreadCount: 1,
    channel: "instagram",
    isOnline: false,
    phone: "(21) 92222-0000",
    assignedTo: "Pedro Henrique",
    status: "new",
  },
  {
    id: "c11",
    contactName: "Thiago Barbosa",
    contactInitials: "TB",
    lastMessage: "Estou procurando uma solução de CRM acessível",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
    unreadCount: 1,
    channel: "whatsapp",
    isOnline: true,
    phone: "(31) 93333-1111",
    assignedTo: "Pedro Henrique",
    status: "new",
  },
  {
    id: "c12",
    contactName: "Daniela Souza",
    contactInitials: "DS",
    lastMessage: "Boa tarde, quero entender melhor a plataforma",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 90),
    unreadCount: 0,
    channel: "whatsapp",
    isOnline: false,
    phone: "(41) 94444-2222",
    assignedTo: "Pedro Henrique",
    status: "new",
  },
]

function generateMessages(conversationId: string): Message[] {
  const messages: Message[] = [
    {
      id: `${conversationId}-m1`,
      conversationId,
      content: "Olá! Tudo bem? Vi que vocês oferecem soluções de CRM.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m2`,
      conversationId,
      content: "Olá! Tudo ótimo, obrigado pelo contato! Sim, temos diversas soluções de CRM. Como posso ajudar?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
      direction: "outbound",
      status: "read",
    },
    {
      id: `${conversationId}-m3`,
      conversationId,
      content: "Estamos procurando uma solução completa para gerenciar nossos leads e pipeline de vendas.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m4`,
      conversationId,
      content: "Entendi! Nosso plano Enterprise é perfeito para isso. Inclui pipeline personalizado, automação de follow-up e relatórios avançados.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21),
      direction: "outbound",
      status: "read",
    },
    {
      id: `${conversationId}-m5`,
      conversationId,
      content: "Interessante! Qual o valor mensal?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m6`,
      conversationId,
      content: "O plano Enterprise começa em R$ 299/mês por usuário, com desconto progressivo para equipes maiores. Quantas pessoas usariam a ferramenta?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 19),
      direction: "outbound",
      status: "read",
    },
    {
      id: `${conversationId}-m7`,
      conversationId,
      content: "Somos uma equipe de 12 vendedores, mais 3 gestores.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m8`,
      conversationId,
      content: "Ótimo! Para 15 usuários, conseguimos um valor especial de R$ 249/mês por usuário. Posso preparar uma proposta formal?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      direction: "outbound",
      status: "read",
    },
    {
      id: `${conversationId}-m9`,
      conversationId,
      content: "Sim, por favor! Pode incluir as opções de pagamento anual também?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m10`,
      conversationId,
      content: "Claro! No pagamento anual oferecemos 20% de desconto. Vou preparar a proposta e envio até amanhã.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      direction: "outbound",
      status: "delivered",
    },
    {
      id: `${conversationId}-m11`,
      conversationId,
      content: "Perfeito! Vocês também oferecem treinamento para a equipe?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m12`,
      conversationId,
      content: "Sim! Oferecemos treinamento online completo, com sessões ao vivo e material gravado. Está incluso no plano Enterprise.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      direction: "outbound",
      status: "delivered",
    },
    {
      id: `${conversationId}-m13`,
      conversationId,
      content: "Oi, gostaria de saber mais sobre o plano Enterprise",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
  ]
  return messages
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 24) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (diffHours < 24 * 7) {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date)
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date)
}

function formatMessageTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function getStatusIcon(status: MessageStatus) {
  switch (status) {
    case "sent":
      return <Check className="size-3 text-muted-foreground" />
    case "delivered":
      return <CheckCheck className="size-3 text-muted-foreground" />
    case "read":
      return <CheckCheck className="size-3 text-blue-500" />
    case "failed":
      return <Clock className="size-3 text-destructive" />
  }
}

// ---------------------------------------------------------------------------
// ChannelBadge
// ---------------------------------------------------------------------------

function ChannelBadge({ channel }: { channel: Channel }) {
  if (channel === "whatsapp") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-400">
        <MessageSquare className="size-2.5" />
        WA
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-pink-100 px-1.5 py-0.5 text-[10px] font-medium text-pink-700 shadow-sm dark:bg-pink-900/40 dark:text-pink-400">
      <Camera className="size-2.5" />
      IG
    </span>
  )
}

// ---------------------------------------------------------------------------
// ConversationItem
// ---------------------------------------------------------------------------

function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-primary/[0.04] ${
        isSelected ? "border-l-3 border-l-primary bg-primary/[0.06] backdrop-blur-sm" : "border-l-3 border-l-transparent"
      }`}
    >
      <div className="relative">
        <Avatar>
          <AvatarFallback className="text-xs">
            {conversation.contactInitials}
          </AvatarFallback>
        </Avatar>
        {conversation.isOnline && (
          <span className="pulse-online absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">
            {conversation.contactName}
          </span>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="truncate text-xs text-muted-foreground">
            {conversation.lastMessage}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <ChannelBadge channel={conversation.channel} />
            {conversation.unreadCount > 0 && (
              <Badge className="size-5 justify-center rounded-md px-0 text-[10px] shadow-[0_0_8px_2px_oklch(0.55_0.24_265/0.3)]">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// ConversationList
// ---------------------------------------------------------------------------

function ConversationList({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  headerContent,
}: {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  headerContent?: React.ReactNode
}) {
  const filtered = conversations.filter((c) =>
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full w-full flex-col border-r border-border/50 glass md:w-[320px]">
      {/* Header */}
      <div className="flex flex-col border-b border-border/50 px-4 py-3 gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Conversas</h2>
          <Badge variant="secondary" className="text-xs">
            {conversations.filter((c) => c.unreadCount > 0).length} novas
          </Badge>
        </div>
        {headerContent}
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 glass border-border/50"
          />
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={selectedId === conv.id}
              onSelect={() => onSelect(conv.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Nenhuma conversa encontrada
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MessageBubble
// ---------------------------------------------------------------------------

function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === "outbound"

  return (
    <div className={`animate-card-in flex ${isOutbound ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${
          isOutbound
            ? "chat-bubble-out rounded-br-md bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
            : "chat-bubble-in rounded-bl-md bg-card text-foreground shadow-sm border border-border/30"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <div
          className={`mt-1 flex items-center justify-end gap-1 ${
            isOutbound ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          <span className="text-[10px]">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOutbound && <span className="transition-colors duration-300">{getStatusIcon(message.status)}</span>}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MessageInput
// ---------------------------------------------------------------------------

function MessageInput({
  onSend,
}: {
  onSend: (message: string) => void
}) {
  const [text, setText] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (text.trim()) {
      onSend(text.trim())
      setText("")
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border/50 p-3">
      <Button type="button" variant="ghost" size="icon-sm">
        <Paperclip className="size-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm">
        <Smile className="size-4" />
      </Button>
      <div className="flex-1">
        <Input
          placeholder="Digite sua mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[36px] transition-all duration-200 focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!text.trim()}
        className="btn-lift bg-gradient-to-r from-primary to-primary/90"
      >
        <Send className="size-4" />
      </Button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// MessagePanel
// ---------------------------------------------------------------------------

function MessagePanel({
  conversation,
  messages,
  onSend,
  onBack,
  userRole = "closer",
}: {
  conversation: Conversation
  messages: Message[]
  onSend: (text: string) => void
  onBack: () => void
  userRole?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="relative">
          <Avatar>
            <AvatarFallback className="text-xs">
              {conversation.contactInitials}
            </AvatarFallback>
          </Avatar>
          {conversation.isOnline && (
            <span className="pulse-online absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight">
              {conversation.contactName}
            </span>
            <ChannelBadge channel={conversation.channel} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {conversation.isOnline ? "Online" : "Offline"}
            </span>
            <span className="text-xs text-muted-foreground">
              &middot; {conversation.phone}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {userRole === "sdr" && (
            <Button variant="outline" size="sm" className="gap-1.5 text-xs mr-1">
              <ShieldCheck className="size-3.5" />
              Qualificar
            </Button>
          )}
          <Badge className="bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary dark:text-primary text-[10px]">
            <Sparkles className="mr-1 size-2.5 animate-spin" style={{ animationDuration: "3s" }} />
            IA Ativa
          </Badge>
          <Button variant="ghost" size="icon-sm" title="Ligar">
            <Phone className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Mais opções">
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-3">
          {/* Date divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">
              Hoje
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          </div>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      {/* Input */}
      <MessageInput onSend={onSend} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="hidden flex-1 flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/[0.03] via-transparent to-[oklch(0.60_0.22_300)]/[0.03] text-muted-foreground md:flex">
      <div className="bounce-gentle flex size-20 items-center justify-center rounded-full bg-muted/80">
        <MessageSquare className="size-9 text-muted-foreground/70" />
      </div>
      <h3 className="text-gradient text-xl font-semibold">
        Selecione uma conversa
      </h3>
      <p className="text-sm">
        Escolha uma conversa na lista ao lado para começar
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AICopilotPanel
// ---------------------------------------------------------------------------

function AICopilotPanel({ conversation }: { conversation: Conversation }) {
  const [expanded, setExpanded] = useState(true)

  if (!expanded) {
    return (
      <div className="hidden lg:flex flex-col items-center border-l border-border/50 glass px-2 py-4">
        <button onClick={() => setExpanded(true)} className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-500 text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105">
          <Sparkles className="size-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="hidden lg:flex w-[280px] shrink-0 flex-col border-l border-border/50 glass">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500 text-white shadow-sm">
            <Sparkles className="size-3.5 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div>
            <span className="text-sm font-bold">IA Copilot</span>
            <div className="flex items-center gap-1">
              <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>
              <span className="text-[10px] text-emerald-600">Analisando</span>
            </div>
          </div>
        </div>
        <button onClick={() => setExpanded(false)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="size-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Sentiment Analysis */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Sentimento</span>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Positivo — Interessado</span>
            </div>
          </div>

          {/* Buying Signals */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Sinais de Compra Detectados</span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Check className="size-3 text-emerald-500 shrink-0" />
                <span>Perguntou sobre preços</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Check className="size-3 text-emerald-500 shrink-0" />
                <span>Mencionou tamanho da equipe</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Check className="size-3 text-emerald-500 shrink-0" />
                <span>Pediu proposta formal</span>
              </div>
            </div>
          </div>

          {/* Suggested Response */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Resposta Sugerida</span>
            <div className="ai-shimmer rounded-lg border border-primary/20 dark:border-primary/30 bg-primary/5 p-3 space-y-2">
              <p className="text-xs leading-relaxed text-foreground">
                "Sim, {conversation.contactName.split(" ")[0]}! O treinamento online está incluso no plano Enterprise. Inclui sessões ao vivo semanais e acesso ilimitado ao material gravado. Posso preparar a proposta com o desconto de 20% no pagamento anual?"
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-[11px] btn-lift bg-gradient-to-r from-primary to-orange-500 text-white">
                  <Check className="size-3 mr-1" />
                  Usar
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-[11px]">
                  Editar
                </Button>
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Metodologia DEF</span>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span>Dor</span>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px]">Identificada</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Expectativa</span>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px]">Alinhada</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Fechamento</span>
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px]">Próximo passo</Badge>
              </div>
            </div>
          </div>

          {/* Objection Matrix */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Objeções Previstas</span>
            <div className="space-y-2">
              <div className="rounded-lg border border-border/50 p-2.5 space-y-1">
                <span className="text-[11px] font-medium">"Preço alto"</span>
                <p className="text-[10px] text-muted-foreground">Resposta: Destaque o ROI com base no ganho de produtividade de 15 vendedores. Custo por vendedor: R$16/dia.</p>
              </div>
              <div className="rounded-lg border border-border/50 p-2.5 space-y-1">
                <span className="text-[11px] font-medium">"Preciso avaliar com o time"</span>
                <p className="text-[10px] text-muted-foreground">Resposta: Ofereça demo personalizada para a equipe. Disponibilize trial de 14 dias sem compromisso.</p>
              </div>
            </div>
          </div>

          {/* Lead Score */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Lead Score</span>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">85</span>
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-medium">Score Alto</p>
                <p className="text-muted-foreground">Probabilidade de conversão: 78%</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

// ---------------------------------------------------------------------------
// InboxPage
// ---------------------------------------------------------------------------

function GestorInboxPage() {
  const { user } = useAuth()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({})
  const [closerFilter, setCloserFilter] = useState<string>("all")

  const userRole = user?.role ?? "closer"
  const userName = user?.name ?? ""

  // ----- Role-based conversation filtering -----
  const filteredConversations = useMemo(() => {
    let result = mockConversations

    if (userRole === "closer") {
      // Closers only see conversations assigned to them
      result = result.filter((c) => c.assignedTo === userName)
    } else if (userRole === "sdr") {
      // SDR only sees new/unqualified conversations
      result = result.filter((c) => c.status === "new")
    }
    // admin/gestor see all, optionally filtered by closer
    if ((userRole === "admin" || userRole === "gestor") && closerFilter !== "all") {
      result = result.filter((c) => c.assignedTo === closerFilter)
    }

    return result
  }, [userRole, userName, closerFilter])

  // ----- Role-based header content -----
  const headerContent = useMemo(() => {
    if (userRole === "closer") {
      return (
        <span className="text-xs text-muted-foreground">
          Minhas Conversas ({filteredConversations.length})
        </span>
      )
    }
    if (userRole === "sdr") {
      return (
        <span className="text-xs text-muted-foreground">
          Conversas para Qualificar ({filteredConversations.length})
        </span>
      )
    }
    // admin or gestor
    return (
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          Todas as Conversas ({filteredConversations.length})
        </span>
        <div className="flex items-center gap-1.5">
          <Filter className="size-3 text-muted-foreground" />
          <Select value={closerFilter} onValueChange={setCloserFilter}>
            <SelectTrigger className="h-7 w-[150px] text-xs">
              <SelectValue placeholder="Filtrar por closer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Rafael Silva">Rafael</SelectItem>
              <SelectItem value="Juliana Santos">Juliana</SelectItem>
              <SelectItem value="Pedro Henrique">Pedro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }, [userRole, filteredConversations.length, closerFilter])

  const selectedConversation = selectedId
    ? filteredConversations.find((c) => c.id === selectedId) ?? null
    : null

  function getMessages(conversationId: string): Message[] {
    if (!messagesMap[conversationId]) {
      const generated = generateMessages(conversationId)
      setMessagesMap((prev) => ({ ...prev, [conversationId]: generated }))
      return generated
    }
    return messagesMap[conversationId]
  }

  function handleSend(text: string) {
    if (!selectedId) return

    const newMessage: Message = {
      id: `${selectedId}-m${Date.now()}`,
      conversationId: selectedId,
      content: text,
      timestamp: new Date(),
      direction: "outbound",
      status: "sent",
    }

    setMessagesMap((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMessage],
    }))
  }

  function handleBack() {
    setSelectedId(null)
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm">
      {/* Conversation list - hidden on mobile when a conversation is selected */}
      <div className={`${selectedId ? "hidden md:flex" : "flex"} w-full md:w-auto`}>
        <ConversationList
          conversations={filteredConversations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          headerContent={headerContent}
        />
      </div>

      {/* Message panel or empty state */}
      {selectedConversation ? (
        <div className={`${selectedId ? "flex" : "hidden md:flex"} flex-1`}>
          <MessagePanel
            conversation={selectedConversation}
            messages={getMessages(selectedConversation.id)}
            onSend={handleSend}
            onBack={handleBack}
            userRole={userRole}
          />
          <AICopilotPanel conversation={selectedConversation} />
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

// ===========================================================================
// CLOSER INBOX (Reference: fila unificada + 360 context + AI suggestion + templates)
// ===========================================================================

type CloserConvStatus = "aberta" | "aguardando" | "resolvida"

interface CloserConversation {
  id: number
  name: string
  company: string
  ch: "whatsapp" | "mail"
  preview: string
  time: string
  unread: number
  tags: string[]
  status: CloserConvStatus
  score: number
  ltv: number
  avatar: string
}

const CLOSER_CONVERSATIONS: CloserConversation[] = [
  { id: 1, name: "Mariana Teixeira", company: "Pepsico Brasil", ch: "whatsapp", preview: "Perfeito, Carla. Consigo alinhar com o jurídico ainda hoje — manda o contrato que a gente fecha essa semana.", time: "14:16", unread: 2, tags: ["Proposta", "Hot"], status: "aberta", score: 92, ltv: 0, avatar: "MT" },
  { id: 2, name: "Ricardo Albuquerque", company: "Klabin S/A", ch: "mail", preview: "Re: Proposta comercial — gostaria de entender melhor a estrutura de desconto por volume", time: "13:48", unread: 1, tags: ["Negociação"], status: "aberta", score: 88, ltv: 340000, avatar: "RA" },
  { id: 3, name: "Juliana Prates", company: "Natura", ch: "whatsapp", preview: "Áudio · 0:42", time: "13:10", unread: 0, tags: ["Qualificado"], status: "aguardando", score: 85, ltv: 0, avatar: "JP" },
  { id: 4, name: "Fábio Guedes", company: "Raia Drogasil", ch: "mail", preview: "Confirmado para amanhã 10h. Vou chamar o time de TI junto.", time: "12:55", unread: 0, tags: ["Reunião"], status: "aberta", score: 82, ltv: 180000, avatar: "FG" },
  { id: 5, name: "Camila Herrera", company: "iFood", ch: "whatsapp", preview: "Consigo confirmar orçamento em 15 dias, pode ser?", time: "11:32", unread: 0, tags: ["Proposta"], status: "aguardando", score: 79, ltv: 0, avatar: "CH" },
  { id: 6, name: "Diego Rosso", company: "Localiza", ch: "mail", preview: 'Sem resposta há 7 dias. Último e-mail enviado: "Seguindo sobre a proposta..."', time: "11/04", unread: 0, tags: ["Risco"], status: "aberta", score: 58, ltv: 45000, avatar: "DR" },
  { id: 7, name: "Ana Beatriz Freitas", company: "Nubank", ch: "whatsapp", preview: "Opa, topei! pode marcar quinta 16h?", time: "10:44", unread: 0, tags: ["Qualificado"], status: "aberta", score: 73, ltv: 0, avatar: "AF" },
  { id: 8, name: "Otávio Menezes", company: "Movida", ch: "mail", preview: "Re: Seu caso com a MyCloud — estamos avaliando internamente", time: "Ontem", unread: 0, tags: ["Nutrição"], status: "aguardando", score: 71, ltv: 22000, avatar: "OM" },
  { id: 9, name: "Leonardo Baptista", company: "Ambev", ch: "whatsapp", preview: "Obrigado pela call! A gente te retorna na semana que vem.", time: "Ontem", unread: 0, tags: ["Proposta"], status: "aguardando", score: 65, ltv: 0, avatar: "LB" },
  { id: 10, name: "Patricia Yamada", company: "B3", ch: "mail", preview: "Fechado — contrato assinado. Obrigada pela parceria, Carla!", time: "08/04", unread: 0, tags: ["Ganho"], status: "resolvida", score: 100, ltv: 92000, avatar: "PY" },
]

const CLOSER_TEMPLATES = [
  { id: 1, name: "Primeiro contato — inbound", shortcut: "/boas", prev: "Oi {nome}, aqui é o Rafael da TechVendas. Vi que você baixou nosso material sobre..." },
  { id: 2, name: "Follow-up pós reunião", shortcut: "/fuproposta", prev: "Obrigado pelo papo hoje, {nome}. Conforme combinamos, segue a proposta formal..." },
  { id: 3, name: "Envio de contrato", shortcut: "/contrato", prev: "Show, {nome}! Segue o contrato revisado em anexo. Qualquer dúvida me chama." },
  { id: 4, name: "Reativar lead frio", shortcut: "/reativar", prev: "Oi {nome}, faz um tempo que não falamos. Novidade: lançamos o módulo de..." },
  { id: 5, name: "Agendamento reunião", shortcut: "/agendar", prev: "Vamos marcar? Segue meu link: techvendaspro.com/agendar/rafael · {nome}" },
]

function fmtBRLInbox(v: number) {
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function scoreDotInbox(score: number) {
  if (score >= 75) return "bg-emerald-500"
  if (score >= 50) return "bg-amber-500"
  return "bg-sky-500"
}

function CloserInboxPage() {
  const [activeId, setActiveId] = useState(1)
  const [filterStatus, setFilterStatus] = useState<"todas" | CloserConvStatus>("todas")
  const [msgText, setMsgText] = useState("")
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAssign, setShowAssign] = useState(false)

  const active = CLOSER_CONVERSATIONS.find((c) => c.id === activeId) ?? CLOSER_CONVERSATIONS[0]

  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value
    setMsgText(v)
    setShowTemplates(v.startsWith("/"))
  }

  const pickTemplate = (t: (typeof CLOSER_TEMPLATES)[number]) => {
    setMsgText(t.prev.replace("{nome}", active.name.split(" ")[0]))
    setShowTemplates(false)
  }

  const filtered = CLOSER_CONVERSATIONS.filter(
    (c) => filterStatus === "todas" || c.status === filterStatus
  )
  const byStatus = (s: CloserConvStatus) =>
    CLOSER_CONVERSATIONS.filter((c) => c.status === s).length

  return (
    <div className="animate-page-in flex h-[calc(100vh-120px)] gap-0 rounded-xl overflow-hidden border border-border/60 bg-card/30">
      {/* ── LEFT: Queue ── */}
      <div className="w-[300px] shrink-0 border-r border-border/60 bg-card/60 flex flex-col">
        <div className="p-3 border-b border-border/60 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold">Fila unificada</span>
            <Badge variant="secondary" className="font-mono text-[10px]">
              {CLOSER_CONVERSATIONS.length}
            </Badge>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Send className="size-3" />
            </Button>
          </div>
          <div className="flex gap-1 text-[10.5px]">
            {(["todas", "aberta", "aguardando", "resolvida"] as const).map((s) => {
              const label =
                s === "todas"
                  ? "Todas"
                  : s === "aberta"
                    ? "Abertas"
                    : s === "aguardando"
                      ? "Aguardando"
                      : "Resolvidas"
              const count = s === "todas" ? CLOSER_CONVERSATIONS.length : byStatus(s)
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 transition-all ${
                    filterStatus === s
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {label}
                  <span className="font-mono opacity-60">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="px-3 py-2 border-b border-border/60 flex items-center gap-1 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-md ai-shimmer px-1.5 py-0.5 text-[9.5px] font-semibold">
            <Sparkles className="size-2.5 text-primary" />
            Ordenar por AI Score
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted text-muted-foreground px-1.5 py-0.5 text-[9.5px]">
            <MessageSquare className="size-2.5" />
            WhatsApp
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted text-muted-foreground px-1.5 py-0.5 text-[9.5px]">
            E-mail
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted text-muted-foreground px-1.5 py-0.5 text-[9.5px]">
            Tags
          </span>
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/50">
            {filtered.map((c) => {
              const isActive = activeId === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left px-3 py-2.5 transition-colors relative ${
                    isActive ? "bg-primary/[0.06]" : "hover:bg-muted/40"
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}
                  <div className="flex items-start gap-2">
                    <div className="relative shrink-0">
                      <Avatar className="size-8">
                        <AvatarFallback
                          className={`text-[10px] font-bold ${
                            c.ch === "whatsapp"
                              ? "bg-gradient-to-br from-emerald-500/20 to-teal-600/20 text-emerald-700 dark:text-emerald-300"
                              : "bg-gradient-to-br from-sky-500/20 to-blue-600/20 text-sky-700 dark:text-sky-300"
                          }`}
                        >
                          {c.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full flex items-center justify-center ${
                          c.ch === "whatsapp" ? "bg-emerald-500" : "bg-sky-500"
                        }`}
                      >
                        {c.ch === "whatsapp" ? (
                          <MessageSquare className="size-2 text-white" />
                        ) : (
                          <Send className="size-2 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-medium truncate flex-1">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                      </div>
                      <div className="text-[10.5px] text-muted-foreground/70 truncate">
                        {c.company}
                      </div>
                      <div className="text-[11.5px] text-muted-foreground/90 line-clamp-1 mt-0.5">
                        {c.preview}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`size-1.5 rounded-full ${scoreDotInbox(c.score)}`} />
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {c.score}
                        </span>
                        {c.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-md bg-muted px-1 py-0.5 text-[9px] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                        {c.unread > 0 && (
                          <span className="ml-auto size-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* ── CENTER: Conversation ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50 relative">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/60">
          <Avatar className="size-8">
            <AvatarFallback className="text-[11px] font-bold bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-400">
              {active.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium truncate">
              {active.name}
              <span className="font-normal text-muted-foreground"> · {active.company}</span>
            </div>
            <div className="text-[10.5px] text-muted-foreground/80 flex items-center gap-1 truncate">
              {active.ch === "whatsapp" ? (
                <MessageSquare className="size-2.5 text-emerald-500" />
              ) : (
                <Send className="size-2.5 text-sky-500" />
              )}
              <span className="truncate">
                {active.ch === "whatsapp" ? "+55 11 98823-4401" : "mariana.teixeira@pepsico.com"}{" "}
                · online agora
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Phone className="size-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <Camera className="size-3.5" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowAssign((v) => !v)}
            >
              <Filter className="size-3.5" />
              Atribuir
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Check className="size-3.5" />
              Resolver
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="size-3.5" />
            </Button>
          </div>
          {showAssign && (
            <div className="absolute right-[160px] top-[52px] z-30 w-[240px] rounded-lg border border-border bg-card shadow-xl p-1.5">
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">
                Atribuir conversa
              </div>
              {["Lucas Vilanova (Closer)", "Squad Enterprise", "Rafael Monteiro (SDR)", "Bia Castelo (CS)"].map((n) => (
                <button
                  key={n}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] hover:bg-muted transition-colors text-left"
                  onClick={() => setShowAssign(false)}
                >
                  <Avatar className="size-5">
                    <AvatarFallback className="text-[8px]">
                      {n.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-2.5 max-w-[640px] mx-auto">
            <div className="self-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/50 my-2">
              Hoje, 14 de abril
            </div>

            <MsgBubble dir="in">
              Oi Rafael, tudo bem? vi que vocês mandaram o deck. queria alinhar uns pontos sobre o módulo de analytics
              <MsgMeta time="10:12" />
            </MsgBubble>

            <MsgBubble dir="out">
              Opa Mariana! 👋 Tudo ótimo. Claro, posso te ligar rapidinho agora ou prefere áudio?
              <MsgMeta time="10:14" read />
            </MsgBubble>

            <MsgBubble dir="in">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-muted flex items-center justify-center">
                  <div className="size-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-foreground ml-0.5" />
                </div>
                <div className="flex items-center gap-0.5 h-5">
                  {Array.from({ length: 26 }, (_, i) => (
                    <span
                      key={i}
                      className="w-0.5 rounded-full bg-current opacity-50"
                      style={{ height: `${20 + Math.sin(i * 0.9) * 40 + Math.random() * 30}%` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">0:42</span>
              </div>
              <MsgMeta time="10:15" />
            </MsgBubble>

            <MsgBubble dir="out">
              Anotado! Vou te enviar o contrato ajustado com a cláusula de SLA que você mencionou, dá pra fechar essa semana se fizer sentido no seu lado ✅
              <MsgMeta time="10:22" read />
            </MsgBubble>

            <MsgBubble dir="in">
              Bom, bati com o Rodrigo aqui. Ele levantou algumas dúvidas na parte de integração com SAP — o time dele precisa de um período de homologação antes de assinar
              <MsgMeta time="13:58" />
            </MsgBubble>

            <MsgBubble dir="in">
              Perfeito, Rafael. Consigo alinhar com o jurídico ainda hoje — manda o contrato que a gente fecha essa semana.
              <MsgMeta time="14:16" />
            </MsgBubble>

            {/* AI suggestion */}
            <div className="self-start max-w-[85%] rounded-xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] to-transparent p-3 mt-2 space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                <Sparkles className="size-3" />
                Copiloto sugere uma resposta
              </div>
              <p className="text-[13px] leading-relaxed">
                "Show, Mariana! Já estou preparando a versão final do contrato com a cláusula de
                homologação SAP que o Rodrigo mencionou. Envio até 17h hoje pra você e jurídico
                revisarem juntos. Confirma o e-mail do Rodrigo pra eu colocar em cópia?"
              </p>
              <div className="text-[10.5px] text-muted-foreground/70">
                Baseado em 3 templates de "envio de contrato" + menção a Rodrigo nesta thread
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs btn-lift bg-gradient-to-r from-primary to-orange-600 text-white"
                >
                  Usar resposta
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                  Editar
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-3 text-xs">
                  Ignorar
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Composer */}
        <div className="border-t border-border/60 p-3 relative">
          {showTemplates && (
            <div className="absolute bottom-[calc(100%+4px)] left-3 right-3 rounded-xl border border-border bg-card shadow-xl overflow-hidden z-20">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70 border-b border-border/60">
                Templates · variáveis auto-preenchidas
              </div>
              {CLOSER_TEMPLATES.filter((t) =>
                t.shortcut.toLowerCase().startsWith(msgText.toLowerCase())
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => pickTemplate(t)}
                  className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors border-b border-border/40 last:border-0"
                >
                  <div className="flex items-center justify-between text-[12.5px] font-medium">
                    <span>{t.name}</span>
                    <span className="font-mono text-[10px] bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                      {t.shortcut}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground/70 truncate mt-0.5">
                    {t.prev}
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 pb-2">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Paperclip className="size-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Camera className="size-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Smile className="size-3.5" />
            </Button>
            <div className="h-4 w-px bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={() => {
                setMsgText("/")
                setShowTemplates(true)
              }}
            >
              <span className="font-mono">/</span> Templates
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] text-primary"
            >
              <Sparkles className="size-3" />
              Gerar com Copiloto
            </Button>
            <div className="flex-1" />
            <span className="text-[10px] text-muted-foreground/60">
              Anexo até <span className="font-mono">64MB</span>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <textarea
              value={msgText}
              onChange={onInput}
              placeholder="Escreva uma mensagem… (digite / para templates)"
              rows={2}
              className="flex-1 resize-none rounded-lg border border-border/60 bg-background px-3 py-2 text-[13px] outline-none focus:border-primary/50 transition-colors"
            />
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shrink-0">
              <Paperclip className="size-4 rotate-45" />
            </Button>
            <Button
              size="sm"
              className="h-10 px-4 text-xs btn-lift bg-gradient-to-r from-primary to-orange-600 text-white shrink-0"
            >
              <Send className="size-3.5" />
              Enviar
            </Button>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60 mt-2 px-1">
            <span>
              <kbd className="font-mono bg-muted rounded px-1 py-0.5">↵</kbd> enviar
            </span>
            <span>
              <kbd className="font-mono bg-muted rounded px-1 py-0.5">⇧↵</kbd> quebra de linha
            </span>
            <span>
              <kbd className="font-mono bg-muted rounded px-1 py-0.5">/</kbd> templates
            </span>
            <span>
              <kbd className="font-mono bg-muted rounded px-1 py-0.5">⌘J</kbd> Copiloto
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: 360 Context ── */}
      <ScrollArea className="w-[300px] shrink-0 border-l border-border/60 bg-card/60">
        <div className="p-4 space-y-5">
          {/* Contact hero */}
          <div>
            <div className="flex items-start gap-3">
              <Avatar className="size-12">
                <AvatarFallback className="text-[14px] font-bold bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-400">
                  {active.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[14px] truncate">{active.name}</div>
                <div className="text-[11.5px] text-muted-foreground truncate">{active.company}</div>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {active.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-md bg-primary/10 text-primary px-1.5 py-0.5 text-[9.5px] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <Button variant="outline" size="sm" className="h-7 flex-1 text-[11px]">
                <User className="size-3" />
                Perfil 360
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Phone className="size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Camera className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Dados cadastrais */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Dados cadastrais
              </span>
              <div className="flex-1" />
              <span className="text-[9.5px] text-muted-foreground/60">clique p/ editar</span>
            </div>
            <div className="space-y-1.5 text-[11.5px]">
              {[
                ["Telefone", "+55 11 98823-4401", true],
                ["E-mail", "mariana.teixeira@pepsico.com", false],
                ["Cargo", "Gerente de TI", false],
                ["Origem", "Inbound · Webinar", false],
                ["Dono", "Você", false],
                ["Custom · ICP", "Enterprise · Industry", false],
                ["Custom · Stack", "SAP + Salesforce", false],
              ].map(([label, val, mono]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5 last:border-0"
                >
                  <span className="text-muted-foreground/80 shrink-0">{label}</span>
                  <span className={`text-right truncate ${mono ? "font-mono" : ""}`}>
                    {val as string}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores-chave */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Indicadores-chave
              </span>
              <Sparkles className="size-2.5 text-primary" />
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
              <div className="font-display font-mono text-[2rem] font-bold text-primary leading-none">
                {active.score}
              </div>
              <div className="text-[11px] flex-1 pt-1">
                <strong>Score de fechamento muito alto.</strong>
                <div className="text-muted-foreground mt-1">
                  Engajamento +83%, menção a "fechar essa semana", proposta aberta 3x hoje.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2.5 rounded-lg bg-muted/40 p-2.5">
              <div className="flex-1">
                <div className="text-[9.5px] font-bold uppercase tracking-[0.06em] text-muted-foreground/60">
                  LTV histórico
                </div>
                <div className="font-mono font-semibold text-[13px] leading-tight">
                  {active.ltv > 0 ? fmtBRLInbox(active.ltv) : "—"}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {active.ltv > 0 ? "Hotmart · 3 compras" : "sem compras ainda"}
              </span>
            </div>
          </div>

          {/* Oportunidades */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Oportunidades
              </span>
              <div className="flex-1" />
              <Button variant="ghost" size="sm" className="h-6 text-[10.5px] px-2">
                <Paperclip className="size-2.5 rotate-45" />
                Nova
              </Button>
            </div>
            <div className="space-y-2">
              {[
                { name: "Contrato Enterprise — 3 squads", stage: "Proposta enviada · há 4 dias", value: 48500, score: 92 },
                { name: "Add-on Analytics Pro", stage: "Qualificado · há 12 dias", value: 12000, score: 68 },
              ].map((d) => (
                <div
                  key={d.name}
                  className="rounded-lg border border-border/60 bg-card/50 p-2.5 cursor-pointer hover:border-primary/30 transition-colors"
                >
                  <div className="text-[12px] font-medium truncate">{d.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{d.stage}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-mono text-[11.5px] font-semibold">
                      {fmtBRLInbox(d.value)}
                    </span>
                    <span className={`size-2 rounded-full ${scoreDotInbox(d.score)}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function MsgBubble({
  dir,
  children,
}: {
  dir: "in" | "out"
  children: React.ReactNode
}) {
  return (
    <div
      className={`max-w-[75%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
        dir === "in"
          ? "self-start bg-muted rounded-bl-sm"
          : "self-end bg-gradient-to-br from-primary to-orange-600 text-white rounded-br-sm"
      }`}
    >
      {children}
    </div>
  )
}

function MsgMeta({ time, read }: { time: string; read?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
      <span>{time}</span>
      {read && (
        <span className="flex">
          <CheckCheck className="size-3" />
        </span>
      )}
    </div>
  )
}

// ===========================================================================
// Role dispatcher
// ===========================================================================

export function InboxPage() {
  const { user } = useAuth()
  if (user?.role === "closer") return <CloserInboxPage />
  return <GestorInboxPage />
}
