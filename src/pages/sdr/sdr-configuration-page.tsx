import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Repeat,
  ClipboardList,
  Bot,
  Target,
  Route,
  MessageSquare,
  Clock,
  SlidersHorizontal,
  GitBranch,
  KeyRound,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { WorkflowSection } from "./configuracao/workflow-section"
import { CadenciasSection } from "./configuracao/cadencias-section"
import { ScriptsSection } from "./configuracao/scripts-section"
import { AgenteIaSection } from "./configuracao/agente-ia-section"
import { ProvedoresSection } from "./configuracao/provedores-section"
import { ScoringSection } from "./configuracao/scoring-section"
import { RoteamentoSection } from "./configuracao/roteamento-section"
import { TemplatesSection } from "./configuracao/templates-section"
import { HorariosSection } from "./configuracao/horarios-section"

interface ConfigTab {
  id: string
  label: string
  icon: typeof Repeat
  group?: "motor" | "ai" | "operacao"
}

const configTabs: ConfigTab[] = [
  { id: "workflow", label: "Workflow de Entrada", icon: GitBranch, group: "motor" },
  { id: "cadencias", label: "Cadências", icon: Repeat, group: "motor" },
  { id: "scripts", label: "Scripts de Qualificação", icon: ClipboardList, group: "motor" },
  { id: "scoring", label: "Lead Scoring", icon: Target, group: "motor" },
  { id: "roteamento", label: "Roteamento", icon: Route, group: "motor" },
  { id: "agente-ia", label: "Agentes IA SDR", icon: Bot, group: "ai" },
  { id: "provedores", label: "Chaves & Modelos LLM", icon: KeyRound, group: "ai" },
  { id: "templates", label: "Templates WhatsApp", icon: MessageSquare, group: "operacao" },
  { id: "horarios", label: "Horários & SLA", icon: Clock, group: "operacao" },
]

const groupLabels: Record<NonNullable<ConfigTab["group"]>, string> = {
  motor: "Motor SDR",
  ai: "Inteligência Artificial",
  operacao: "Operação",
}

function SectionContent({ tab }: { tab: string }) {
  switch (tab) {
    case "workflow":
      return <WorkflowSection />
    case "cadencias":
      return <CadenciasSection />
    case "scripts":
      return <ScriptsSection />
    case "agente-ia":
      return <AgenteIaSection />
    case "provedores":
      return <ProvedoresSection />
    case "scoring":
      return <ScoringSection />
    case "roteamento":
      return <RoteamentoSection />
    case "templates":
      return <TemplatesSection />
    case "horarios":
      return <HorariosSection />
    default:
      return <WorkflowSection />
  }
}

export function SdrConfigurationPage() {
  const { tab = "workflow" } = useParams<{ tab?: string }>()
  const navigate = useNavigate()

  const groups: Array<{
    id: NonNullable<ConfigTab["group"]>
    label: string
    items: ConfigTab[]
  }> = (
    ["motor", "ai", "operacao"] as const
  ).map((g) => ({
    id: g,
    label: groupLabels[g],
    items: configTabs.filter((t) => t.group === g),
  }))

  return (
    <div className="animate-page-in space-y-6">
      {/* Header */}
      <header>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="gap-1 bg-primary/10 text-primary border-primary/20"
          >
            <SlidersHorizontal className="size-3" />
            Configuração SDR
          </Badge>
          <Badge
            variant="secondary"
            className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
          >
            <span className="size-1.5 rounded-full bg-emerald-500 pulse-online" />
            Todos os módulos ativos
          </Badge>
        </div>
        <h2 className="text-gradient mt-2 text-2xl font-bold tracking-tight">
          Configuração SDR
        </h2>
        <p className="text-muted-foreground">
          Parametrize o motor SDR — workflow de entrada, cadências, agentes IA, scoring e regras operacionais.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left nav */}
        <nav
          className="w-full shrink-0 lg:w-64"
          aria-label="Seções de configuração SDR"
        >
          <div className="space-y-4">
            {groups.map((g) => (
              <div key={g.id} className="space-y-0.5">
                <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/50">
                  {g.label}
                </p>
                {g.items.map((t) => {
                  const active = tab === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => navigate(`/sdr/configuracao/${t.id}`)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors border-l-[3px]",
                        active
                          ? "bg-primary/[0.06] text-primary border-l-primary font-medium"
                          : "text-muted-foreground border-l-transparent hover:bg-primary/[0.03] hover:border-l-primary/30 hover:text-foreground/80"
                      )}
                    >
                      <t.icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-primary" : "text-muted-foreground/70"
                        )}
                      />
                      <span className="flex-1 text-left">{t.label}</span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </nav>

        <Separator orientation="vertical" className="hidden lg:block" />
        <Separator className="lg:hidden" />

        {/* Content */}
        <div className="min-w-0 flex-1">
          <SectionContent tab={tab} />
        </div>
      </div>
    </div>
  )
}
