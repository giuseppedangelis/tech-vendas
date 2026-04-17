import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Check,
  Clock,
  XCircle,
  MessageSquare,
  Megaphone,
  Shield,
  Wrench,
  Copy,
  Edit3,
  Trash2,
  ExternalLink,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"

type MetaStatus = "approved" | "pending" | "rejected"
type Category = "marketing" | "utility" | "authentication"

interface WabaTemplate {
  id: string
  name: string
  language: string
  category: Category
  status: MetaStatus
  body: string
  header?: string
  footer?: string
  cta?: string
  usedCount: number
  lastUsed: string
  placeholders: string[]
}

const templates: WabaTemplate[] = [
  {
    id: "t1",
    name: "prospecao_inicial_v2",
    language: "pt_BR",
    category: "marketing",
    status: "approved",
    header: "Oi {{1}}! 👋",
    body:
      "Aqui é a Ana da Tech Vendas. Vi que você demonstrou interesse em otimizar o comercial da {{2}}. Topa uma conversa de 15 min esta semana pra eu entender se a gente pode ajudar?",
    footer: "Tech Vendas Pro · CRM AI-First",
    cta: "Agendar 15 min",
    usedCount: 1842,
    lastUsed: "há 12 min",
    placeholders: ["nome", "empresa"],
  },
  {
    id: "t2",
    name: "followup_sem_resposta",
    language: "pt_BR",
    category: "marketing",
    status: "approved",
    body:
      "{{1}}, tudo bem? Passando só pra garantir que minha mensagem chegou. Vou te mandar um case de 2 min de uma empresa parecida com a {{2}} — vale olhar?",
    usedCount: 962,
    lastUsed: "há 2h",
    placeholders: ["nome", "empresa"],
  },
  {
    id: "t3",
    name: "reativacao_30d",
    language: "pt_BR",
    category: "marketing",
    status: "approved",
    body:
      "Olá {{1}}! Faz um tempo que não falamos. A gente lançou novidades que podem fazer sentido para a {{2}}. Posso te mandar um resumo rápido?",
    usedCount: 284,
    lastUsed: "há 1 dia",
    placeholders: ["nome", "empresa"],
  },
  {
    id: "t4",
    name: "confirmacao_reuniao",
    language: "pt_BR",
    category: "utility",
    status: "approved",
    body:
      "Oi {{1}}, só confirmando nossa reunião de {{2}} às {{3}}. Pode me confirmar aqui? 🙌",
    cta: "Confirmar",
    usedCount: 612,
    lastUsed: "há 34 min",
    placeholders: ["nome", "data", "horário"],
  },
  {
    id: "t5",
    name: "qualificacao_v3",
    language: "pt_BR",
    category: "marketing",
    status: "pending",
    body:
      "{{1}}, antes da gente conversar, me ajuda com 2 coisas: quantos vendedores vocês têm hoje na {{2}} e qual é a principal dor do comercial?",
    usedCount: 0,
    lastUsed: "—",
    placeholders: ["nome", "empresa"],
  },
  {
    id: "t6",
    name: "desconto_urgencia",
    language: "pt_BR",
    category: "marketing",
    status: "rejected",
    body:
      "🔥 {{1}}, promoção relâmpago! Últimas vagas com 30% OFF. Clica agora antes que acabe!",
    usedCount: 0,
    lastUsed: "—",
    placeholders: ["nome"],
  },
]

const statusMeta: Record<
  MetaStatus,
  { label: string; icon: typeof Check; tone: string }
> = {
  approved: {
    label: "Aprovado",
    icon: Check,
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  pending: {
    label: "Em análise",
    icon: Clock,
    tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  rejected: {
    label: "Rejeitado",
    icon: XCircle,
    tone: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
}

const categoryMeta: Record<
  Category,
  { label: string; icon: typeof Megaphone; tone: string }
> = {
  marketing: {
    label: "Marketing",
    icon: Megaphone,
    tone: "bg-primary/10 text-primary border-primary/20",
  },
  utility: {
    label: "Utility",
    icon: Wrench,
    tone: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
  authentication: {
    label: "Autenticação",
    icon: Shield,
    tone: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  },
}

const languageLabel: Record<string, string> = {
  pt_BR: "Português (BR)",
  en_US: "English (US)",
  es_MX: "Español (MX)",
}

function renderTemplate(text: string, placeholders: string[]) {
  // Replace {{n}} with highlighted placeholder labels
  return text.split(/(\{\{\d+\}\})/g).map((part, i) => {
    const match = part.match(/\{\{(\d+)\}\}/)
    if (match) {
      const idx = Number(match[1]) - 1
      const label = placeholders[idx] ?? match[1]
      return (
        <span
          key={i}
          className="inline-flex items-center rounded-md bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold text-primary"
        >
          {"{{"}
          {label}
          {"}}"}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function TemplatesSection() {
  const [statusFilter, setStatusFilter] = useState<"all" | MetaStatus>("all")
  const [categoryFilter, setCategoryFilter] = useState<"all" | Category>("all")
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string>(templates[0].id)

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false
      if (
        search &&
        !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.body.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [statusFilter, categoryFilter, search])

  const selected =
    filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? templates[0]

  const counts = useMemo(() => {
    const c = { all: templates.length, approved: 0, pending: 0, rejected: 0 }
    templates.forEach((t) => (c[t.status] += 1))
    return c
  }, [])

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Templates WhatsApp (WABA)
          </h3>
          <p className="text-sm text-muted-foreground">
            Biblioteca de mensagens aprovadas pela Meta para uso em cadências
            e respostas automáticas.
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
          <Plus className="mr-1.5 size-4" />
          Novo template
        </Button>
      </header>

      {/* Status + category filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "approved", "pending", "rejected"] as const).map((s) => {
          const active = statusFilter === s
          const label =
            s === "all"
              ? "Todos"
              : statusMeta[s as MetaStatus].label
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
                active
                  ? s === "all"
                    ? "border-primary/40 bg-primary/[0.06] text-primary shadow-sm shadow-primary/10"
                    : statusMeta[s as MetaStatus].tone
                  : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
              )}
            >
              {label}
              <span
                className={cn(
                  "inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  active
                    ? "bg-current/10"
                    : "bg-muted text-muted-foreground/80"
                )}
              >
                {counts[s]}
              </span>
            </button>
          )
        })}

        <span className="mx-2 h-4 w-px bg-border" aria-hidden />

        {(["all", "marketing", "utility", "authentication"] as const).map(
          (c) => {
            const active = categoryFilter === c
            const label =
              c === "all" ? "Categorias" : categoryMeta[c as Category].label
            return (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
                  active
                    ? c === "all"
                      ? "border-primary/40 bg-primary/[0.06] text-primary"
                      : categoryMeta[c as Category].tone
                    : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                )}
              >
                {c !== "all" && (() => {
                  const Icon = categoryMeta[c as Category].icon
                  return <Icon className="size-3" />
                })()}
                {label}
              </button>
            )
          }
        )}
      </div>

      {/* Two columns: list + preview */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              placeholder="Buscar por nome ou conteúdo…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Buscar templates"
            />
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted/50">
                  <Search className="size-5 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium">Nenhum template encontrado</p>
                <p className="text-xs text-muted-foreground">
                  Ajuste os filtros ou crie um novo template.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => {
                const active = selected.id === t.id
                const stMeta = statusMeta[t.status]
                const catMeta = categoryMeta[t.category]
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    aria-pressed={active}
                    className={cn(
                      "group w-full rounded-xl border bg-card/50 p-4 text-left transition-all backdrop-blur-sm",
                      active
                        ? "border-primary/40 shadow-sm shadow-primary/10 bg-primary/[0.02]"
                        : "border-border/60 hover:border-primary/20 hover:bg-card"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[12px] font-semibold">
                            {t.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "gap-1 text-[10px]",
                              stMeta.tone
                            )}
                          >
                            <stMeta.icon className="size-2.5" />
                            {stMeta.label}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "gap-1 text-[10px]",
                              catMeta.tone
                            )}
                          >
                            <catMeta.icon className="size-2.5" />
                            {catMeta.label}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="gap-1 text-[10px]"
                          >
                            <Globe className="size-2.5" />
                            {languageLabel[t.language] ?? t.language}
                          </Badge>
                        </div>
                        <p className="mt-2 line-clamp-2 text-[12px] text-muted-foreground">
                          {t.body}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5">
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="size-3" />
                          {t.usedCount.toLocaleString("pt-BR")} envios
                        </span>
                        <span>·</span>
                        <span>Último uso: {t.lastUsed}</span>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label="Duplicar"
                        >
                          <Copy className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label="Editar"
                        >
                          <Edit3 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 hover:text-destructive"
                          aria-label="Remover"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Preview — WhatsApp style */}
        <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Pré-visualização
            </p>
            <Button variant="ghost" size="sm">
              <ExternalLink className="mr-1 size-3.5" />
              Testar envio
            </Button>
          </div>

          <Card className="animate-card-in overflow-hidden">
            <CardContent className="p-0">
              {/* WA header */}
              <div className="flex items-center gap-2.5 bg-[oklch(0.32_0.04_155)] px-3 py-2.5 text-white">
                <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/30 ring-2 ring-white/20">
                  <MessageSquare className="size-4" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold">Lead Marcos A.</p>
                  <p className="text-[10px] opacity-70">online</p>
                </div>
              </div>

              {/* Chat area */}
              <div className="min-h-[320px] space-y-3 bg-[oklch(0.94_0.01_100)] dark:bg-[oklch(0.12_0.008_55)] p-4">
                <div className="flex justify-end">
                  <div className="relative max-w-[88%] rounded-2xl rounded-br-md bg-[oklch(0.88_0.08_155)] dark:bg-[oklch(0.25_0.07_155)] px-3 py-2 shadow-sm">
                    {selected.header && (
                      <p className="mb-1.5 text-[13px] font-semibold leading-snug">
                        {renderTemplate(
                          selected.header,
                          selected.placeholders
                        )}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/90">
                      {renderTemplate(selected.body, selected.placeholders)}
                    </p>
                    {selected.footer && (
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        {selected.footer}
                      </p>
                    )}
                    {selected.cta && (
                      <div className="mx-[-12px] mb-[-8px] mt-2 border-t border-black/5 dark:border-white/10 pt-2 text-center">
                        <button className="w-full rounded text-[12px] font-semibold text-[oklch(0.45_0.15_200)] dark:text-sky-300">
                          {selected.cta}
                        </button>
                      </div>
                    )}
                    <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-muted-foreground">
                      <span>11:42</span>
                      <Check className="size-3 text-sky-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta info */}
              <div className="space-y-2 border-t border-border/60 bg-card/50 p-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Nome interno</span>
                  <span className="font-mono font-semibold">
                    {selected.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">
                    Placeholders detectados
                  </span>
                  <div className="flex gap-1">
                    {selected.placeholders.map((p, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 text-[9px]"
                      >
                        {"{{"}
                        {p}
                        {"}}"}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Caracteres</span>
                  <span className="font-display font-bold tabular-nums">
                    {selected.body.length}
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      / 1024
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-[11px] leading-relaxed text-muted-foreground/70">
            Templates aprovados pela Meta podem ser enviados fora da janela de
            24h. Templates em análise ou rejeitados só funcionam dentro da
            janela ativa.
          </p>
        </aside>
      </div>
    </div>
  )
}
