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
    lastMessage: "Perfeito, vou analisar e retorno amanha",
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
    lastMessage: "Voces fazem integracao com Salesforce?",
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
    lastMessage: "Obrigada! Fechamos entao",
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
    lastMessage: "Vi o post de voces sobre IA, muito bom!",
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
    lastMessage: "Qual o prazo de implementacao?",
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
    lastMessage: "Temos reuniao marcada para sexta as 14h",
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
    lastMessage: "Oi, vi o anuncio de voces. Como funciona?",
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
    lastMessage: "Gostaria de saber os precos de voces",
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
    lastMessage: "Estou procurando uma solucao de CRM acessivel",
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
      content: "Ola! Tudo bem? Vi que voces oferecem solucoes de CRM.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m2`,
      conversationId,
      content: "Ola! Tudo otimo, obrigado pelo contato! Sim, temos diversas solucoes de CRM. Como posso ajudar?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
      direction: "outbound",
      status: "read",
    },
    {
      id: `${conversationId}-m3`,
      conversationId,
      content: "Estamos procurando uma solucao completa para gerenciar nossos leads e pipeline de vendas.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m4`,
      conversationId,
      content: "Entendi! Nosso plano Enterprise e perfeito para isso. Inclui pipeline personalizado, automacao de follow-up e relatorios avancados.",
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
      content: "O plano Enterprise comeca em R$ 299/mes por usuario, com desconto progressivo para equipes maiores. Quantas pessoas usariam a ferramenta?",
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
      content: "Otimo! Para 15 usuarios, conseguimos um valor especial de R$ 249/mes por usuario. Posso preparar uma proposta formal?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      direction: "outbound",
      status: "read",
    },
    {
      id: `${conversationId}-m9`,
      conversationId,
      content: "Sim, por favor! Pode incluir as opcoes de pagamento anual tambem?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m10`,
      conversationId,
      content: "Claro! No pagamento anual oferecemos 20% de desconto. Vou preparar a proposta e envio ate amanha.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      direction: "outbound",
      status: "delivered",
    },
    {
      id: `${conversationId}-m11`,
      conversationId,
      content: "Perfeito! Voces tambem oferecem treinamento para a equipe?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      direction: "inbound",
      status: "read",
      senderName: "Cliente",
    },
    {
      id: `${conversationId}-m12`,
      conversationId,
      content: "Sim! Oferecemos treinamento online completo, com sessoes ao vivo e material gravado. Esta incluso no plano Enterprise.",
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
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-muted/60 ${
        isSelected ? "border-l-3 border-l-primary bg-muted" : "border-l-3 border-l-transparent"
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
              <Badge className="size-5 justify-center rounded-full px-0 text-[10px] shadow-[0_0_8px_2px_oklch(0.55_0.24_265/0.3)]">
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
    <div className="flex h-full w-full flex-col border-r bg-gradient-to-b from-primary/[0.03] to-transparent md:w-[320px]">
      {/* Header */}
      <div className="flex flex-col border-b px-4 py-3 gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Conversas</h2>
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
            className="pl-8"
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
            ? "rounded-br-md bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
            : "rounded-bl-md bg-card text-foreground shadow-sm"
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
    <form onSubmit={handleSubmit} className="glass flex items-end gap-2 border-t p-3">
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
      <div className="flex items-center gap-3 border-b px-4 py-3">
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
          {userRole === "closer" ? (
            <Button variant="ghost" size="sm" className="glow-primary gap-1.5" title="IA Copilot">
              <Sparkles className="size-4 text-amber-500" />
              <span className="hidden sm:inline text-xs">IA Copilot</span>
            </Button>
          ) : userRole === "sdr" ? (
            <Button variant="ghost" size="sm" className="gap-1.5" title="Sugestao de Qualificacao">
              <Sparkles className="size-4" />
              <span className="hidden sm:inline text-xs">Sugestao de Qualificacao</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="gap-1.5" title="Monitoramento">
              <Sparkles className="size-4" />
              <span className="hidden sm:inline text-xs">Monitoramento</span>
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" title="Ligar">
            <Phone className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Mais opcoes">
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-3">
          {/* Date divider */}
          <div className="flex items-center gap-3 py-2">
            <Separator className="flex-1" />
            <span className="shrink-0 text-[11px] text-muted-foreground">
              Hoje
            </span>
            <Separator className="flex-1" />
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
        Escolha uma conversa na lista ao lado para comecar
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// InboxPage
// ---------------------------------------------------------------------------

export function InboxPage() {
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
    <div className="flex h-[calc(100vh-3.5rem-3rem)] overflow-hidden rounded-lg border bg-background">
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
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
