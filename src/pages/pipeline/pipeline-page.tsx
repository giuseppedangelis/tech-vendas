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
  { id: "l3", name: "Fernanda Costa", email: "fernanda@inovatech.com.br", phone: "(31) 97777-3333", company: "InovaTech", score: 85, value: 67000, tags: ["Enterprise", "Referência"], channel: "phone", stageId: "s2", assignedTo: "Rafael", status: "qualified", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 4), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
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
  // Pipeline Pós-Venda
  { id: "l14", name: "Roberto Campos", email: "roberto@globaltech.com.br", phone: "(51) 98000-1414", company: "GlobalTech", score: 70, value: 55000, tags: ["Enterprise", "Onboarding"], channel: "email", stageId: "s10", assignedTo: "Juliana", status: "won", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 5), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6) },
  { id: "l15", name: "Daniela Lopes", email: "daniela@bitwise.com.br", phone: "(61) 98000-1515", company: "Bitwise", score: 82, value: 38000, tags: ["PME", "Implementação"], channel: "whatsapp", stageId: "s11", assignedTo: "Rafael", status: "won", lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 10), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15) },
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
        className="card-hover cursor-pointer transition-all duration-200 hover:shadow-card-hover border-border/50"
        onClick={() => onOpen(lead)}
      >
        <CardContent className="space-y-2.5 p-3">
          {/* Header: grip + name + score */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                className="shrink-0 cursor-grab touch-none text-muted-foreground/30 opacity-0 transition-opacity group-hover:opacity-100 hover:text-muted-foreground"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="size-3.5" />
              </button>
              <span className="truncate text-[13px] font-semibold">{lead.name}</span>
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
            <div className="flex items-center gap-1.5 pt-1 border-t border-dashed border-primary/20 dark:border-primary/30">
              <Sparkles className="size-3 text-primary shrink-0" />
              <span className="text-[10px] text-primary dark:text-primary truncate">
                {lead.score > 90 ? "IA: Prioridade máxima — alto potencial de fechamento" : "IA: Lead quente — recomendo contato imediato"}
              </span>
            </div>
          )}
          {lead.score <= 80 && lead.score > 50 && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-dashed">
              <Sparkles className="size-3 text-muted-foreground/60 shrink-0" />
              <span className="text-[10px] text-muted-foreground truncate">
                IA: Nurturing recomendado — envie conteúdo de valor
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
    <Card size="sm" className="w-[280px] shadow-lg">
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
      className="kanban-column flex h-full w-[300px] min-w-[300px] flex-col"
      style={{ backgroundColor: `${stage.color}05` }}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3.5">
        <div
          className="size-2.5 shrink-0 rounded-full shadow-sm"
          style={{ backgroundColor: stage.color, boxShadow: `0 0 8px ${stage.color}40` }}
        />
        <span className="text-[13px] font-semibold">{stage.name}</span>
        <Badge variant="secondary" className="ml-auto text-[10px] font-bold">
          {leads.length}
        </Badge>
      </div>
      <div className="px-3.5 pb-2.5">
        <span className="text-xs font-medium text-muted-foreground/70">
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

function GestorPipelinePage() {
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

  // "Próximo Lead" for closers: highest-score uncontacted lead assigned to them
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
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-950/40">
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
            Pipeline de Pré-qualificação — {roleFilteredLeads.length} leads
          </span>
        </div>
      )}
      {(userRole === "admin" || userRole === "gestor") && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900/40">
          <Eye className="size-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Visão completa da equipe — {roleFilteredLeads.length} leads
          </span>
        </div>
      )}

      {/* AI Pipeline Analysis */}
      <div className="animate-card-in flex items-center gap-3 rounded-xl px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500 text-white shadow-sm">
          <Sparkles className="size-4 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">IA Pipeline Analysis</span>
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-emerald-500" /></span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            3 leads em risco de esfriar · 2 prontos para avançar estágio · Score médio: 74 · Valor total no pipeline: R$ 612.000
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary dark:text-primary shrink-0">
          <Sparkles className="mr-1 size-3" />
          AI Insights
        </Badge>
      </div>

      {/* Próximo Lead card for closers */}
      {nextLeadForCloser && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Zap className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Próximo Lead
                </p>
                <Badge className="bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary dark:text-primary border-primary/20 dark:border-primary/30 text-[10px]">
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

// ===========================================================================
// CLOSER PIPELINE (Reference: AI flags, deal modal, Won/Lost drop zones)
// ===========================================================================

type CloserStageId = "prospect" | "qualificado" | "proposta" | "negociacao" | "fechamento"

interface CloserStage {
  id: CloserStageId
  name: string
  color: string
}

const CLOSER_STAGES: CloserStage[] = [
  { id: "prospect", name: "Prospect", color: "bg-slate-400" },
  { id: "qualificado", name: "Qualificado", color: "bg-sky-500" },
  { id: "proposta", name: "Proposta", color: "bg-purple-500" },
  { id: "negociacao", name: "Negociação", color: "bg-amber-500" },
  { id: "fechamento", name: "Fechamento", color: "bg-emerald-500" },
]

type TagColor = "p" | "b" | "g" | "r"

interface CloserDeal {
  id: number
  title: string
  company: string
  contact: string
  avatar: string
  value: number
  stage: CloserStageId
  score: number
  tags: [string, TagColor][]
  age: number
  ai?: string
  aiKind?: "hot" | "cold" | "info"
}

const CLOSER_INITIAL_DEALS: CloserDeal[] = [
  { id: 1, title: "Pepsico — Contrato Enterprise", company: "Pepsico Brasil", contact: "Mariana Teixeira", avatar: "MT", value: 48500, stage: "proposta", score: 92, tags: [["Enterprise", "p"], ["SAP", "b"]], age: 4, ai: 'Pronta pra fechar: cliente mencionou "fechar essa semana" 2x hoje.', aiKind: "hot" },
  { id: 2, title: "Klabin — Upgrade + 2 squads", company: "Klabin S/A", contact: "Ricardo Albuquerque", avatar: "RA", value: 120000, stage: "negociacao", score: 88, tags: [["Upsell", "g"]], age: 11, ai: "Ricardo abriu proposta 3x hoje — follow-up agora converte.", aiKind: "hot" },
  { id: 3, title: "Natura — Piloto Analytics", company: "Natura", contact: "Juliana Prates", avatar: "JP", value: 32000, stage: "qualificado", score: 85, tags: [["Piloto", "b"]], age: 3 },
  { id: 4, title: "Raia Drogasil — Rollout nacional", company: "Raia Drogasil", contact: "Fábio Guedes", avatar: "FG", value: 78000, stage: "proposta", score: 82, tags: [["Varejo", "b"]], age: 6 },
  { id: 5, title: "iFood — Módulo premium", company: "iFood", contact: "Camila Herrera", avatar: "CH", value: 56000, stage: "proposta", score: 79, tags: [["Expansion", "g"]], age: 7 },
  { id: 6, title: "Localiza — Contrato anual", company: "Localiza", contact: "Diego Rosso", avatar: "DR", value: 22000, stage: "negociacao", score: 58, tags: [["Risco", "r"]], age: 14, ai: "Esfriando — 7 dias sem resposta. Sugiro reativar com case Movida.", aiKind: "cold" },
  { id: 7, title: "Nubank — POC 60 dias", company: "Nubank", contact: "Ana Beatriz Freitas", avatar: "AF", value: 95000, stage: "qualificado", score: 73, tags: [["Fintech", "b"], ["POC", "p"]], age: 2 },
  { id: 8, title: "Movida — Renovação", company: "Movida", contact: "Otávio Menezes", avatar: "OM", value: 18000, stage: "prospect", score: 71, tags: [["Renovação", "g"]], age: 1 },
  { id: 9, title: "Ambev — Expansão LATAM", company: "Ambev", contact: "Leonardo Baptista", avatar: "LB", value: 210000, stage: "fechamento", score: 91, tags: [["LATAM", "p"]], age: 21, ai: "Contrato em revisão jurídica — sem ação necessária.", aiKind: "info" },
  { id: 10, title: "Magalu — Upgrade squads", company: "Magazine Luiza", contact: "Renata Dalla", avatar: "RD", value: 64000, stage: "qualificado", score: 76, tags: [["Varejo", "b"]], age: 5 },
  { id: 11, title: "BRF — Piloto", company: "BRF", contact: "Henrique Pó", avatar: "HP", value: 28000, stage: "prospect", score: 62, tags: [], age: 1 },
  { id: 12, title: "Vivo — Contrato Enterprise", company: "Vivo", contact: "Sofia Lemos", avatar: "SL", value: 140000, stage: "fechamento", score: 87, tags: [["Enterprise", "p"]], age: 18 },
  { id: 13, title: "Stone — Add-on", company: "Stone", contact: "Bernardo Mello", avatar: "BM", value: 34000, stage: "negociacao", score: 70, tags: [["Fintech", "b"]], age: 9 },
  { id: 14, title: "Hotmart — Expansion", company: "Hotmart", contact: "Lívia Caetano", avatar: "LC", value: 42000, stage: "proposta", score: 74, tags: [["Expansion", "g"]], age: 8 },
  { id: 15, title: "Riachuelo — POC", company: "Riachuelo", contact: "Tiago Veríssimo", avatar: "TV", value: 19000, stage: "prospect", score: 55, tags: [], age: 2 },
]

function fmtBRLPipeline(v: number) {
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
function fmtBRLkPipeline(v: number) {
  if (v >= 1000) {
    const k = v / 1000
    return "R$ " + k.toFixed(v >= 10000 ? 0 : 1).replace(".", ",") + "k"
  }
  return fmtBRLPipeline(v)
}
function scoreDotClosePipe(score: number) {
  if (score >= 75) return "bg-emerald-500"
  if (score >= 50) return "bg-amber-500"
  return "bg-sky-500"
}
function tagColorClass(c: TagColor) {
  if (c === "p") return "bg-purple-500/15 text-purple-600 dark:text-purple-400"
  if (c === "b") return "bg-sky-500/15 text-sky-600 dark:text-sky-400"
  if (c === "g") return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
  return "bg-red-500/15 text-red-600 dark:text-red-400"
}

function CloserPipelinePage() {
  const [deals, setDeals] = useState<CloserDeal[]>(CLOSER_INITIAL_DEALS)
  const [dragId, setDragId] = useState<number | null>(null)
  const [overStage, setOverStage] = useState<CloserStageId | null>(null)
  const [overDrop, setOverDrop] = useState<"won" | "lost" | null>(null)
  const [modalDeal, setModalDeal] = useState<CloserDeal | null>(null)

  const onDragStart = (e: React.DragEvent, id: number) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = "move"
  }
  const onDragEnd = () => {
    setDragId(null)
    setOverStage(null)
    setOverDrop(null)
  }
  const onDragOverStage = (e: React.DragEvent, sid: CloserStageId) => {
    e.preventDefault()
    setOverStage(sid)
  }
  const onDropStage = (e: React.DragEvent, sid: CloserStageId) => {
    e.preventDefault()
    if (dragId != null) {
      setDeals(deals.map((d) => (d.id === dragId ? { ...d, stage: sid } : d)))
      toast.success(`Movido para ${CLOSER_STAGES.find((s) => s.id === sid)?.name}`)
    }
    onDragEnd()
  }
  const onDropZone = (kind: "won" | "lost") => {
    if (dragId != null) {
      setDeals(deals.filter((d) => d.id !== dragId))
      toast.success(kind === "won" ? "Deal ganho! 🏆" : "Deal marcado como perdido")
    }
    onDragEnd()
  }

  const stageDeals = (sid: CloserStageId) => deals.filter((d) => d.stage === sid)
  const stageSum = (sid: CloserStageId) =>
    stageDeals(sid).reduce((s, d) => s + d.value, 0)
  const totalPipe = deals.reduce((s, d) => s + d.value, 0)
  const avgScore =
    deals.length > 0
      ? Math.round(deals.reduce((s, d) => s + d.score, 0) / deals.length)
      : 0

  return (
    <div className="animate-page-in flex h-full flex-col gap-4">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-xl font-bold tracking-tight">
          <span className="text-gradient">Pipeline</span>{" "}
          <span className="text-muted-foreground">· Q2 2026</span>
        </h2>
        <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
          {deals.length} deals ativos
        </Badge>
        <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs">
          <Search className="size-3" />
          Filtrar
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs">
          Agrupar
        </Button>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-4 mr-2 px-3 py-1.5 rounded-lg border border-border/60 bg-card/50">
          <div className="text-[11px]">
            <span className="text-muted-foreground">Pipe total</span>{" "}
            <span className="font-mono font-semibold">{fmtBRLkPipeline(totalPipe)}</span>
          </div>
          <div className="text-[11px] flex items-center gap-1.5">
            <span className="text-muted-foreground">Score médio</span>{" "}
            <span className={`size-2 rounded-full ${scoreDotClosePipe(avgScore)}`} />
            <span className="font-mono font-semibold">{avgScore}</span>
          </div>
          <div className="text-[11px]">
            <span className="text-muted-foreground">Forecast</span>{" "}
            <span className="font-mono font-semibold text-primary">
              {fmtBRLkPipeline(480000)}
            </span>
          </div>
        </div>
        <Button variant="gradient" size="sm" className="btn-lift h-8">
          <Plus className="size-3.5" />
          Nova oportunidade
        </Button>
      </div>

      {/* ── Kanban board ── */}
      <ScrollArea className="flex-1 pb-2">
        <div className="flex gap-3 h-full min-h-[calc(100vh-280px)]">
          {CLOSER_STAGES.map((stage) => {
            const sd = stageDeals(stage.id)
            const isOver = overStage === stage.id && dragId != null
            return (
              <div
                key={stage.id}
                className={`flex flex-col gap-2 min-w-[260px] w-[260px] rounded-lg p-2 transition-all ${
                  isOver ? "bg-primary/[0.06] outline-2 outline-dashed outline-primary/40" : ""
                }`}
                onDragOver={(e) => onDragOverStage(e, stage.id)}
                onDrop={(e) => onDropStage(e, stage.id)}
              >
                <div className="flex items-center gap-2 px-1 pb-1">
                  <span className={`size-2 rounded-full ${stage.color}`} />
                  <span className="text-[12px] font-semibold">{stage.name}</span>
                  <span className="inline-flex items-center rounded-md bg-muted text-muted-foreground px-1.5 py-0.5 text-[10px] font-bold font-mono">
                    {sd.length}
                  </span>
                  <div className="flex-1" />
                  <span className="font-mono text-[10.5px] text-muted-foreground">
                    {fmtBRLkPipeline(stageSum(stage.id))}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {sd.map((d) => (
                    <div
                      key={d.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, d.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => setModalDeal(d)}
                      className={`group rounded-lg border bg-card p-2.5 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-primary/30 ${
                        d.ai ? "border-l-[3px] border-l-primary" : ""
                      } ${dragId === d.id ? "opacity-40" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`size-2 rounded-full mt-1 shrink-0 ${scoreDotClosePipe(d.score)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] font-semibold leading-snug truncate">
                            {d.title}
                          </div>
                          <div className="text-[10.5px] text-muted-foreground truncate">
                            {d.contact}
                          </div>
                        </div>
                        {d.ai && <Sparkles className="size-3.5 text-primary shrink-0 mt-0.5" />}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono text-[12px] font-semibold">
                          {fmtBRLPipeline(d.value)}
                        </span>
                        <span className="font-mono text-[10.5px] text-muted-foreground">
                          {d.age}d
                        </span>
                      </div>
                      {d.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {d.tags.map(([t, c]) => (
                            <span
                              key={t}
                              className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${tagColorClass(c)}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {d.ai && (
                        <div className="mt-2 pt-2 border-t border-border/50 flex items-start gap-1.5 text-[10.5px] text-primary leading-snug">
                          <Sparkles className="size-3 shrink-0 mt-0.5" />
                          <span>{d.ai}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start h-8 text-[11.5px] text-muted-foreground"
                  >
                    <Plus className="size-3" />
                    Adicionar deal
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* ── Drop zones (Won / Lost) ── */}
      {dragId != null && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-50 animate-card-in">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setOverDrop("won")
            }}
            onDragLeave={() => setOverDrop(null)}
            onDrop={() => onDropZone("won")}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg border-2 transition-all ${
              overDrop === "won"
                ? "bg-emerald-500 text-white border-emerald-500 scale-110"
                : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40"
            }`}
          >
            <Zap className="size-4" />
            Ganhar (Won)
          </div>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setOverDrop("lost")
            }}
            onDragLeave={() => setOverDrop(null)}
            onDrop={() => onDropZone("lost")}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg border-2 transition-all ${
              overDrop === "lost"
                ? "bg-red-500 text-white border-red-500 scale-110"
                : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/40"
            }`}
          >
            <DollarSign className="size-4 rotate-45" />
            Perder (Lost)
          </div>
        </div>
      )}

      {/* ── Deal modal ── */}
      {modalDeal && <CloserDealModal deal={modalDeal} onClose={() => setModalDeal(null)} />}
    </div>
  )
}

function CloserDealModal({
  deal,
  onClose,
}: {
  deal: CloserDeal
  onClose: () => void
}) {
  const [stage, setStage] = useState<CloserStageId>(deal.stage)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-card-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-border/60">
          <span className={`size-2.5 rounded-full mt-2 shrink-0 ${scoreDotClosePipe(deal.score)}`} />
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-bold leading-tight">{deal.title}</div>
            <div className="text-[12.5px] text-muted-foreground">
              {deal.company} · {deal.contact} · aberto há {deal.age} dias
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display font-mono text-xl font-bold tracking-tight">
              {fmtBRLPipeline(deal.value)}
            </div>
            <div className="text-[10.5px] text-muted-foreground">Valor do contrato</div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <Plus className="size-4 rotate-45" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {deal.ai && (
            <div className="rounded-lg border border-l-[3px] border-l-primary bg-primary/[0.04] p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
                  Copiloto
                </span>
              </div>
              <p className="text-[13px]">{deal.ai}</p>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs btn-lift bg-gradient-to-r from-primary to-orange-600 text-white"
                >
                  Abrir conversa
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-3 text-xs">
                  Aplicar sugestão
                </Button>
              </div>
            </div>
          )}

          {/* Stage selector */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground/70 mb-2">
              Estágio do pipeline
            </div>
            <div className="flex gap-1 rounded-lg overflow-hidden border border-border/60">
              {CLOSER_STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStage(s.id)}
                  className={`flex-1 px-2 py-2 text-[11.5px] font-medium transition-all ${
                    s.id === stage
                      ? s.id === "fechamento"
                        ? "bg-emerald-500 text-white"
                        : s.id === "negociacao"
                          ? "bg-amber-500 text-white"
                          : s.id === "proposta"
                            ? "bg-purple-500 text-white"
                            : s.id === "qualificado"
                              ? "bg-sky-500 text-white"
                              : "bg-slate-500 text-white"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground/70 mb-2">
                Campos do deal
              </div>
              <div className="space-y-1.5 text-[12.5px]">
                {[
                  ["Fonte", "Inbound · webinar", false],
                  ["Probabilidade", `${deal.score}%`, true],
                  ["Prev. fechamento", "30 abril 2026", true],
                  ["Produto", "Plataforma Enterprise + Analytics", false],
                  ["Concorrente", "Zendesk", false],
                  ["Decisor", "Rodrigo (CTO)", false],
                ].map(([label, val, mono]) => (
                  <div
                    key={label as string}
                    className="flex items-center justify-between gap-3 py-1 border-b border-border/40 last:border-0"
                  >
                    <span className="text-muted-foreground/80 text-[11.5px]">{label}</span>
                    <span className={mono ? "font-mono" : ""}>{val as string}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground/70 mb-2">
                Histórico do negócio
              </div>
              <div className="space-y-2 text-[12.5px]">
                {[
                  ["hoje 14:16", "Conversa WhatsApp (6 mensagens)"],
                  ["ontem 10:22", "Proposta enviada · versão 3"],
                  ["14/abr", "Estágio alterado → Proposta"],
                  ["10/abr", "Call de descoberta · 38min"],
                  ["08/abr", "Deal criado a partir de Natura"],
                ].map(([when, what]) => (
                  <div key={when} className="flex items-baseline gap-2.5">
                    <div className="font-mono text-[10.5px] text-muted-foreground w-[68px] shrink-0">
                      {when}
                    </div>
                    <div>{what}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-1.5 p-4 border-t border-border/60 bg-muted/30">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Clock className="size-3.5" />
            Agendar reunião
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <MessageSquare className="size-3.5" />
            Ir para conversa
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <User className="size-3.5" />
            Perfil 360
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Perder
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs btn-lift bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
          >
            <Zap className="size-3.5" />
            Marcar como ganho
          </Button>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// Role dispatcher
// ===========================================================================

export function PipelinePage() {
  const { user } = useAuth()
  if (user?.role === "closer") return <CloserPipelinePage />
  return <GestorPipelinePage />
}
