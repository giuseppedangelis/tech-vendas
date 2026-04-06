import { useState, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LeadDetailSheet } from "@/components/pipeline/lead-detail-sheet"
import {
  Search,
  Plus,
  GripVertical,
  MessageSquare,
  Camera,
  Phone,
  Mail,
  Clock,
  DollarSign,
  User,
  Eye,
  Zap,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PipelineLead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  score: number
  value: number
  tags: string[]
  channel: "whatsapp" | "instagram" | "phone" | "email"
  stageId: string
  assignedTo: string
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost"
  lastInteraction: Date
  createdAt: Date
}

interface PipelineStage {
  id: string
  name: string
  order: number
  color: string
}

interface Pipeline {
  id: string
  name: string
  stages: PipelineStage[]
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockPipelines: Pipeline[] = [
  {
    id: "p1",
    name: "Vendas B2B",
    stages: [
      { id: "s1", name: "Prospecção", order: 1, color: "#6366f1" },
      { id: "s2", name: "Qualificação", order: 2, color: "#f59e0b" },
      { id: "s3", name: "Proposta", order: 3, color: "#3b82f6" },
      { id: "s4", name: "Negociação", order: 4, color: "#8b5cf6" },
      { id: "s5", name: "Fechamento", order: 5, color: "#22c55e" },
    ],
  },
  {
    id: "p2",
    name: "Vendas B2C",
    stages: [
      { id: "s6", name: "Interesse", order: 1, color: "#6366f1" },
      { id: "s7", name: "Demonstração", order: 2, color: "#f59e0b" },
      { id: "s8", name: "Proposta", order: 3, color: "#3b82f6" },
      { id: "s9", name: "Fechamento", order: 4, color: "#22c55e" },
    ],
  },
  {
    id: "p3",
    name: "Pós-Venda",
    stages: [
      { id: "s10", name: "Onboarding", order: 1, color: "#6366f1" },
      { id: "s11", name: "Implementação", order: 2, color: "#f59e0b" },
      { id: "s12", name: "Acompanhamento", order: 3, color: "#3b82f6" },
      { id: "s13", name: "Sucesso", order: 4, color: "#22c55e" },
    ],
  },
]

const mockLeads: PipelineLead[] = [
  // Pipeline B2B
  { id: "l1", name: "Maria Silva", email: "maria@techcorp.com.br", phone: "(11) 99999-1111", company: "TechCorp", score: 92, value: 45000, tags: ["Enterprise", "Urgente"], channel: "whatsapp", stageId: "s1", assignedTo: "Rafael", status: "new", lastInteraction: new Date(Date.now() - 1000 * 60 * 30), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
  { id: "l2", name: "Carlos Oliveira", email: "carlos@dataflow.com.br", phone: "(21) 98888-2222", company: "DataFlow", score: 78, value: 32000, tags: ["PME"], channel: "email", stageId: "s1", assignedTo: "Juliana", status: "contacted", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 2), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
  { id: "l3", name: "Fernanda Costa", email: "fernanda@inovatech.com.br", phone: "(31) 97777-3333", company: "InovaTech", score: 85, value: 67000, tags: ["Enterprise", "Referencia"], channel: "phone", stageId: "s2", assignedTo: "Rafael", status: "qualified", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 4), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
  { id: "l4", name: "Ricardo Santos", email: "ricardo@megasoft.com.br", phone: "(41) 96666-4444", company: "MegaSoft", score: 65, value: 28000, tags: ["PME", "Retorno"], channel: "instagram", stageId: "s2", assignedTo: "Juliana", status: "qualified", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 8), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) },
  { id: "l5", name: "Patricia Lima", email: "patricia@cloudbase.com.br", phone: "(51) 95555-5555", company: "CloudBase", score: 90, value: 95000, tags: ["Enterprise", "Urgente"], channel: "whatsapp", stageId: "s3", assignedTo: "Rafael", status: "proposal", lastInteraction: new Date(Date.now() - 1000 * 60 * 45), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
  { id: "l6", name: "Andre Moreira", email: "andre@nextgen.com.br", phone: "(61) 94444-6666", company: "NextGen", score: 42, value: 15000, tags: ["Startup"], channel: "email", stageId: "s3", assignedTo: "Juliana", status: "proposal", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 24), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20) },
  { id: "l7", name: "Juliana Ferreira", email: "juliana@alphatech.com.br", phone: "(71) 93333-7777", company: "AlphaTech", score: 88, value: 120000, tags: ["Enterprise", "Decisor"], channel: "phone", stageId: "s4", assignedTo: "Rafael", status: "proposal", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 3), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25) },
  { id: "l8", name: "Bruno Almeida", email: "bruno@smartsys.com.br", phone: "(81) 92222-8888", company: "SmartSys", score: 55, value: 22000, tags: ["PME"], channel: "whatsapp", stageId: "s4", assignedTo: "Juliana", status: "proposal", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 12), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) },
  { id: "l9", name: "Camila Rocha", email: "camila@devhouse.com.br", phone: "(91) 91111-9999", company: "DevHouse", score: 95, value: 78000, tags: ["Enterprise", "Fechamento"], channel: "whatsapp", stageId: "s5", assignedTo: "Rafael", status: "won", lastInteraction: new Date(Date.now() - 1000 * 60 * 15), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35) },
  // Pipeline B2C
  { id: "l10", name: "Lucas Barbosa", email: "lucas@email.com", phone: "(11) 98000-1010", company: "", score: 60, value: 2500, tags: ["Plano Pro"], channel: "instagram", stageId: "s6", assignedTo: "Juliana", status: "new", lastInteraction: new Date(Date.now() - 1000 * 60 * 60), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: "l11", name: "Isabela Martins", email: "isabela@email.com", phone: "(21) 98000-1111", company: "", score: 75, value: 4800, tags: ["Plano Business"], channel: "whatsapp", stageId: "s7", assignedTo: "Rafael", status: "contacted", lastInteraction: new Date(Date.now() - 1000 * 60 * 90), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) },
  { id: "l12", name: "Thiago Nascimento", email: "thiago@email.com", phone: "(31) 98000-1212", company: "", score: 83, value: 7200, tags: ["Plano Enterprise"], channel: "whatsapp", stageId: "s8", assignedTo: "Juliana", status: "proposal", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 6), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8) },
  { id: "l13", name: "Amanda Souza", email: "amanda@email.com", phone: "(41) 98000-1313", company: "", score: 91, value: 4800, tags: ["Plano Business", "Urgente"], channel: "phone", stageId: "s9", assignedTo: "Rafael", status: "won", lastInteraction: new Date(Date.now() - 1000 * 60 * 20), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12) },
  // Pipeline Pos-Venda
  { id: "l14", name: "Roberto Campos", email: "roberto@globaltech.com.br", phone: "(51) 98000-1414", company: "GlobalTech", score: 70, value: 55000, tags: ["Enterprise", "Onboarding"], channel: "email", stageId: "s10", assignedTo: "Juliana", status: "won", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 5), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6) },
  { id: "l15", name: "Daniela Lopes", email: "daniela@bitwise.com.br", phone: "(61) 98000-1515", company: "Bitwise", score: 82, value: 38000, tags: ["PME", "Implementacao"], channel: "whatsapp", stageId: "s11", assignedTo: "Rafael", status: "won", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 10), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15) },
  { id: "l16", name: "Felipe Carvalho", email: "felipe@netcore.com.br", phone: "(71) 98000-1616", company: "NetCore", score: 88, value: 42000, tags: ["Enterprise", "Ativo"], channel: "phone", stageId: "s12", assignedTo: "Juliana", status: "won", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40) },
  { id: "l17", name: "Renata Pinto", email: "renata@webflow.com.br", phone: "(81) 98000-1717", company: "WebFlow", score: 96, value: 61000, tags: ["Enterprise", "Sucesso"], channel: "whatsapp", stageId: "s13", assignedTo: "Rafael", status: "won", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 48), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60) },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "agora"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

function getChannelIcon(channel: PipelineLead["channel"]) {
  switch (channel) {
    case "whatsapp":
      return <MessageSquare className="size-3" />
    case "instagram":
      return <Camera className="size-3" />
    case "phone":
      return <Phone className="size-3" />
    case "email":
      return <Mail className="size-3" />
  }
}

function getChannelLabel(channel: PipelineLead["channel"]) {
  switch (channel) {
    case "whatsapp":
      return "WhatsApp"
    case "instagram":
      return "Instagram"
    case "phone":
      return "Telefone"
    case "email":
      return "E-mail"
  }
}

// ---------------------------------------------------------------------------
// LeadScoreBadge
// ---------------------------------------------------------------------------

function LeadScoreBadge({ score }: { score: number }) {
  let colorClass: string
  if (score > 80) {
    colorClass = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
  } else if (score > 50) {
    colorClass = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
  } else {
    colorClass = "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${colorClass} ${score > 80 ? "shadow-[0_0_8px_2px_rgba(34,197,94,0.25)] dark:shadow-[0_0_8px_2px_rgba(52,211,153,0.2)]" : ""}`}
    >
      {score}
    </span>
  )
}

// ---------------------------------------------------------------------------
// LeadCard
// ---------------------------------------------------------------------------

function LeadCard({
  lead,
  onOpen,
}: {
  lead: PipelineLead
  onOpen: (lead: PipelineLead) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? "z-50 opacity-50" : ""}`}
    >
      <Card
        size="sm"
        className="card-hover cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => onOpen(lead)}
      >
        <CardContent className="space-y-2 p-3">
          {/* Header: grip + name + score */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                className="shrink-0 cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="size-3.5" />
              </button>
              <span className="truncate text-sm font-medium">{lead.name}</span>
            </div>
            <LeadScoreBadge score={lead.score} />
          </div>

          {/* Company */}
          {lead.company && (
            <p className="truncate text-xs text-muted-foreground">
              {lead.company}
            </p>
          )}

          {/* Value */}
          <div className="flex items-center gap-1 text-xs font-medium text-foreground">
            <DollarSign className="size-3 text-muted-foreground" />
            {formatBRL(lead.value)}
          </div>

          {/* Tags */}
          {lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lead.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer: channel + time */}
          <div className="flex items-center justify-between pt-1">
            <Badge variant="outline" className="gap-1 px-1.5 py-0 text-[10px]">
              {getChannelIcon(lead.channel)}
              {getChannelLabel(lead.channel)}
            </Badge>
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Clock className="size-2.5" />
              {timeAgo(lead.lastInteraction)}
            </span>
          </div>

          {/* AI Recommendation */}
          {lead.score > 80 && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-dashed border-violet-200 dark:border-violet-800">
              <Sparkles className="size-3 text-violet-500 shrink-0" />
              <span className="text-[10px] text-violet-600 dark:text-violet-400 truncate">
                {lead.score > 90 ? "IA: Prioridade maxima — alto potencial de fechamento" : "IA: Lead quente — recomendo contato imediato"}
              </span>
            </div>
          )}
          {lead.score <= 80 && lead.score > 50 && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-dashed border-border/50">
              <Sparkles className="size-3 text-muted-foreground/60 shrink-0" />
              <span className="text-[10px] text-muted-foreground truncate">
                IA: Nurturing recomendado — envie conteudo de valor
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DragOverlay Card (non-sortable clone for the overlay)
// ---------------------------------------------------------------------------

function LeadCardOverlay({ lead }: { lead: PipelineLead }) {
  return (
    <Card size="sm" className="w-[280px] shadow-lg ring-2 ring-primary/20">
      <CardContent className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-sm font-medium">{lead.name}</span>
          <LeadScoreBadge score={lead.score} />
        </div>
        {lead.company && (
          <p className="truncate text-xs text-muted-foreground">
            {lead.company}
          </p>
        )}
        <div className="flex items-center gap-1 text-xs font-medium">
          <DollarSign className="size-3 text-muted-foreground" />
          {formatBRL(lead.value)}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// KanbanColumn
// ---------------------------------------------------------------------------

function KanbanColumn({
  stage,
  leads,
  onOpenLead,
}: {
  stage: PipelineStage
  leads: PipelineLead[]
  onOpenLead: (lead: PipelineLead) => void
}) {
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0)
  const leadIds = leads.map((l) => l.id)

  return (
    <div
      className="flex h-full w-[300px] min-w-[300px] flex-col rounded-lg bg-muted/50"
      style={{ backgroundColor: `${stage.color}08` }}
    >
      {/* Column Header */}
      <div
        className="flex items-center gap-2 rounded-t-lg px-3 py-3"
        style={{ borderLeft: `3px solid ${stage.color}` }}
      >
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: stage.color }}
        />
        <span className="text-sm font-semibold">{stage.name}</span>
        <Badge variant="secondary" className="ml-auto text-[10px]">
          {leads.length}
        </Badge>
      </div>
      <div className="px-3 pb-2">
        <span className="text-xs text-muted-foreground">
          {formatBRL(totalValue)}
        </span>
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1 px-2 pb-2">
        <SortableContext
          items={leadIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2 p-1">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onOpen={onOpenLead} />
            ))}
            {leads.length === 0 && (
              <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-transparent text-xs text-muted-foreground/70">
                Nenhum lead nesta etapa
              </div>
            )}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  )
}

// ---------------------------------------------------------------------------
// KanbanBoard
// ---------------------------------------------------------------------------

function KanbanBoard({
  stages,
  leads,
  onOpenLead,
}: {
  stages: PipelineStage[]
  leads: PipelineLead[]
  onOpenLead: (lead: PipelineLead) => void
}) {
  return (
    <ScrollArea className="flex-1">
      <div className="flex h-full gap-4 pb-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stageId === stage.id)
          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              leads={stageLeads}
              onOpenLead={onOpenLead}
            />
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

// ---------------------------------------------------------------------------
// PipelineSelector
// ---------------------------------------------------------------------------

function PipelineSelector({
  pipelines,
  value,
  onChange,
}: {
  pipelines: Pipeline[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList>
        {pipelines.map((p) => (
          <TabsTrigger
            key={p.id}
            value={p.id}
            className="relative transition-all data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:rounded-full data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-primary data-[state=active]:after:to-[oklch(0.60_0.22_300)]"
          >
            {p.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* TabsContent is handled by the parent via state */}
      {pipelines.map((p) => (
        <TabsContent key={p.id} value={p.id} className="hidden" />
      ))}
    </Tabs>
  )
}

// ---------------------------------------------------------------------------
// PipelinePage
// ---------------------------------------------------------------------------

export function PipelinePage() {
  const { user } = useAuth()
  const userRole = user?.role ?? "closer"
  const userFirstName = user?.name?.split(" ")[0] ?? ""

  // Role-based pipeline visibility: SDR only sees the first pipeline
  const visiblePipelines = useMemo(() => {
    if (userRole === "sdr") return mockPipelines.slice(0, 1)
    return mockPipelines
  }, [userRole])

  const [activePipelineId, setActivePipelineId] = useState(visiblePipelines[0].id)
  const [leads, setLeads] = useState<PipelineLead[]>(mockLeads)
  const [searchQuery, setSearchQuery] = useState("")
  const [closerFilter, setCloserFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<PipelineLead | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const activePipeline = mockPipelines.find((p) => p.id === activePipelineId)!

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // Filtered leads for the active pipeline
  const filteredLeads = useMemo(() => {
    const stageIds = new Set(activePipeline.stages.map((s) => s.id))
    return leads.filter((lead) => {
      if (!stageIds.has(lead.stageId)) return false
      if (
        searchQuery &&
        !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lead.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (closerFilter !== "all" && lead.assignedTo !== closerFilter) return false
      if (statusFilter !== "all" && lead.status !== statusFilter) return false
      return true
    })
  }, [leads, activePipeline, searchQuery, closerFilter, statusFilter])

  // Role-based lead filtering: closers only see their own leads
  const roleFilteredLeads = useMemo(() => {
    if (userRole === "closer") {
      return filteredLeads.filter((l) => l.assignedTo === userFirstName)
    }
    return filteredLeads
  }, [filteredLeads, userRole, userFirstName])

  // "Proximo Lead" for closers: highest-score uncontacted lead assigned to them
  const nextLeadForCloser = useMemo(() => {
    if (userRole !== "closer") return null
    const uncontacted = roleFilteredLeads
      .filter((l) => l.status === "new")
      .sort((a, b) => b.score - a.score)
    return uncontacted[0] ?? null
  }, [roleFilteredLeads, userRole])

  const activeDragLead = activeDragId
    ? leads.find((l) => l.id === activeDragId) ?? null
    : null

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDragId(null)

    if (!over) return

    const activeLeadId = active.id as string
    const overLeadId = over.id as string

    if (activeLeadId === overLeadId) return

    // Find the target stage from the lead that was dropped over
    const overLead = leads.find((l) => l.id === overLeadId)
    if (!overLead) return

    setLeads((prev) =>
      prev.map((l) =>
        l.id === activeLeadId ? { ...l, stageId: overLead.stageId } : l
      )
    )
  }

  function handleOpenLead(lead: PipelineLead) {
    setSelectedLead(lead)
    setSheetOpen(true)
  }

  function handleNewLead() {
    toast.info("Funcionalidade em desenvolvimento", {
      description: "O formulário de novo lead será implementado em breve.",
    })
  }

  // Unique closers for filter
  const closers = useMemo(() => {
    const set = new Set(leads.map((l) => l.assignedTo))
    return Array.from(set)
  }, [leads])

  return (
    <div className="animate-page-in flex h-[calc(100vh-3.5rem-3rem)] flex-col gap-4">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pipeline</h2>
          <p className="text-muted-foreground">
            Gerencie seus leads e oportunidades
          </p>
        </div>
        <Button
          onClick={handleNewLead}
          className="btn-lift gap-1.5 bg-gradient-to-r from-primary to-[oklch(0.60_0.22_300)] shadow-md hover:shadow-lg"
        >
          <Plus className="size-4" />
          Novo Lead
        </Button>
      </div>

      {/* Pipeline Tabs */}
      <PipelineSelector
        pipelines={visiblePipelines}
        value={activePipelineId}
        onChange={setActivePipelineId}
      />

      {/* Role-based banner */}
      {userRole === "closer" && (
        <div className="border-gradient flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-950/40">
          <User className="size-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Pipeline pessoal de {userFirstName} — {roleFilteredLeads.length} leads
          </span>
        </div>
      )}
      {userRole === "sdr" && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-950/40">
          <Eye className="size-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            Pipeline de Pre-qualificacao — {roleFilteredLeads.length} leads
          </span>
        </div>
      )}
      {(userRole === "admin" || userRole === "gestor") && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900/40">
          <Eye className="size-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Visao completa da equipe — {roleFilteredLeads.length} leads
          </span>
        </div>
      )}

      {/* AI Pipeline Analysis */}
      <div className="animate-card-in flex items-center gap-3 rounded-xl border-gradient glass px-4 py-3 shadow-lg shadow-primary/[0.04]">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-primary text-white shadow-sm">
          <Sparkles className="size-4 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">IA Pipeline Analysis</span>
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-emerald-500" /></span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            3 leads em risco de esfriar · 2 prontos para avancar estagio · Score medio: 74 · Valor total no pipeline: R$ 612.000
          </p>
        </div>
        <Badge variant="secondary" className="bg-violet-500/10 text-violet-700 dark:text-violet-300 shrink-0">
          <Sparkles className="mr-1 size-3" />
          AI Insights
        </Badge>
      </div>

      {/* Proximo Lead card for closers */}
      {nextLeadForCloser && (
        <Card className="border-gradient bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Zap className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Proximo Lead
                </p>
                <Badge className="bg-gradient-to-r from-violet-500/10 to-primary/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800 text-[10px]">
                  <Sparkles className="mr-1 size-2.5" />
                  Recomendado pela IA
                </Badge>
              </div>
              <p className="truncate text-sm font-medium">
                {nextLeadForCloser.name}
                {nextLeadForCloser.company && (
                  <span className="text-muted-foreground"> — {nextLeadForCloser.company}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LeadScoreBadge score={nextLeadForCloser.score} />
              <span className="text-sm font-medium">{formatBRL(nextLeadForCloser.value)}</span>
              <Button
                size="sm"
                variant="default"
                className="gap-1.5"
                onClick={() => handleOpenLead(nextLeadForCloser)}
              >
                Abrir Lead
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Select value={closerFilter} onValueChange={setCloserFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {closers.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="new">Novo</SelectItem>
            <SelectItem value="contacted">Contactado</SelectItem>
            <SelectItem value="qualified">Qualificado</SelectItem>
            <SelectItem value="proposal">Proposta</SelectItem>
            <SelectItem value="won">Ganho</SelectItem>
            <SelectItem value="lost">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <KanbanBoard
          stages={activePipeline.stages}
          leads={roleFilteredLeads}
          onOpenLead={handleOpenLead}
        />
        <DragOverlay>
          {activeDragLead ? <LeadCardOverlay lead={activeDragLead} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Lead Detail Sheet */}
      <LeadDetailSheet
        lead={selectedLead}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        stages={activePipeline.stages}
      />
    </div>
  )
}
