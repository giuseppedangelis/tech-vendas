import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Mail,
  Phone,
  Building2,
  Tag,
  ArrowRightLeft,
  UserPlus,
  Plus,
  MessageSquare,
  FileText,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

// ---------------------------------------------------------------------------
// Types (reused from pipeline-page inline types)
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

// ---------------------------------------------------------------------------
// Mock timeline data
// ---------------------------------------------------------------------------

interface TimelineItem {
  id: string
  type: "message" | "note" | "call" | "stage_change" | "meeting"
  description: string
  date: Date
  user: string
}

function getMockTimeline(): TimelineItem[] {
  return [
    {
      id: "t1",
      type: "message",
      description: "Enviou mensagem via WhatsApp com proposta comercial",
      date: new Date(Date.now() - 1000 * 60 * 30),
      user: "João",
    },
    {
      id: "t2",
      type: "call",
      description: "Ligação de 15 minutos discutindo requisitos",
      date: new Date(Date.now() - 1000 * 60 * 60 * 4),
      user: "Ana",
    },
    {
      id: "t3",
      type: "stage_change",
      description: "Lead movido de Qualificação para Proposta",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      user: "João",
    },
    {
      id: "t4",
      type: "note",
      description: "Cliente interessado no plano Enterprise. Pediu desconto de 10%.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 48),
      user: "Ana",
    },
    {
      id: "t5",
      type: "meeting",
      description: "Reunião de descoberta com equipe de TI do cliente",
      date: new Date(Date.now() - 1000 * 60 * 60 * 72),
      user: "João",
    },
  ]
}

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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function getTimelineIcon(type: TimelineItem["type"]) {
  switch (type) {
    case "message":
      return <MessageSquare className="size-3.5" />
    case "note":
      return <FileText className="size-3.5" />
    case "call":
      return <PhoneCall className="size-3.5" />
    case "stage_change":
      return <ArrowRightLeft className="size-3.5" />
    case "meeting":
      return <Calendar className="size-3.5" />
  }
}

function getScoreExplanation(score: number): string {
  if (score > 80) return "Lead altamente qualificado com forte intenção de compra"
  if (score > 50) return "Lead com potencial moderado, requer mais nutrição"
  return "Lead frio, precisa de mais engajamento inicial"
}

function getScoreColor(score: number): string {
  if (score > 80) return "text-emerald-600 dark:text-emerald-400"
  if (score > 50) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

// ---------------------------------------------------------------------------
// Custom fields mock
// ---------------------------------------------------------------------------

const customFields = [
  { label: "Origem", value: "Google Ads" },
  { label: "Segmento", value: "Tecnologia" },
  { label: "Tamanho da empresa", value: "50-200 funcionários" },
  { label: "Orçamento anual", value: "R$ 100.000 - R$ 500.000" },
]

// ---------------------------------------------------------------------------
// LeadDetailSheet
// ---------------------------------------------------------------------------

export function LeadDetailSheet({
  lead,
  open,
  onOpenChange,
  stages,
}: {
  lead: PipelineLead | null
  open: boolean
  onOpenChange: (open: boolean) => void
  stages: PipelineStage[]
}) {
  const timeline = getMockTimeline()

  if (!lead) return null

  const currentStage = stages.find((s) => s.id === lead.stageId)

  function handleAction(action: string) {
    toast.info(`${action}`, {
      description: "Funcionalidade em desenvolvimento.",
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="text-lg">{lead.name}</SheetTitle>
          <SheetDescription>
            {lead.company ? `${lead.company} - ` : ""}
            {formatBRL(lead.value)}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="animate-page-in space-y-6 pb-6">
            {/* Contact Info */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Informações de Contato
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
                {lead.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span>{lead.company}</span>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Lead Score */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Lead Score
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 text-2xl font-bold ${getScoreColor(lead.score)}`}
                >
                  <Star className="size-5" />
                  {lead.score}
                </div>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        lead.score > 80
                          ? "bg-emerald-500"
                          : lead.score > 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline size-3" />
                {getScoreExplanation(lead.score)}
              </p>
            </section>

            <Separator />

            {/* Stage & Pipeline */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Etapa Atual
              </h3>
              <div className="flex items-center gap-2">
                {currentStage && (
                  <>
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: currentStage.color }}
                    />
                    <span className="text-sm font-medium">
                      {currentStage.name}
                    </span>
                  </>
                )}
              </div>
              <Select defaultValue={lead.stageId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mover para..." />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            <Separator />

            {/* Tags */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="mr-1 size-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>

            <Separator />

            {/* Custom Fields */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Campos Personalizados
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {customFields.map((field) => (
                  <div key={field.label}>
                    <p className="text-[11px] text-muted-foreground">
                      {field.label}
                    </p>
                    <p className="text-sm font-medium">{field.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Timeline */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Linha do Tempo
              </h3>
              <div className="space-y-0">
                {timeline.map((item, idx) => (
                  <div key={item.id} className="flex gap-3">
                    {/* Line connector */}
                    <div className="flex flex-col items-center">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted ring-offset-2 ring-offset-background">
                        {getTimelineIcon(item.type)}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-4">
                      <p className="text-sm">{item.description}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.user} &middot; {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Actions */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ações
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction("Mover etapa")}
                  className="btn-lift gap-1.5"
                >
                  <ArrowRightLeft className="size-3.5" />
                  Mover Etapa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction("Atribuir responsável")}
                  className="btn-lift gap-1.5"
                >
                  <UserPlus className="size-3.5" />
                  Atribuir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction("Adicionar tag")}
                  className="btn-lift gap-1.5"
                >
                  <Plus className="size-3.5" />
                  Adicionar Tag
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction("Marcar como ganho")}
                  className="btn-lift gap-1.5"
                >
                  <CheckCircle2 className="size-3.5" />
                  Marcar Ganho
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
