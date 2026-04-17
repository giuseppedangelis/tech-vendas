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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CadenciasSection } from "./configuracao/cadencias-section"
import { ScriptsSection } from "./configuracao/scripts-section"
import { AgenteIaSection } from "./configuracao/agente-ia-section"
import { ScoringSection } from "./configuracao/scoring-section"
import { RoteamentoSection } from "./configuracao/roteamento-section"
import { TemplatesSection } from "./configuracao/templates-section"
import { HorariosSection } from "./configuracao/horarios-section"

interface ConfigTab {
  id: string
  label: string
  icon: typeof Repeat
}

const configTabs: ConfigTab[] = [
  { id: "cadencias", label: "Cadências", icon: Repeat },
  { id: "scripts", label: "Scripts de Qualificação", icon: ClipboardList },
  { id: "agente-ia", label: "Agente IA SDR", icon: Bot },
  { id: "scoring", label: "Lead Scoring", icon: Target },
  { id: "roteamento", label: "Roteamento", icon: Route },
  { id: "templates", label: "Templates WhatsApp", icon: MessageSquare },
  { id: "horarios", label: "Horários & SLA", icon: Clock },
]

function SectionContent({ tab }: { tab: string }) {
  switch (tab) {
    case "cadencias":
      return <CadenciasSection />
    case "scripts":
      return <ScriptsSection />
    case "agente-ia":
      return <AgenteIaSection />
    case "scoring":
      return <ScoringSection />
    case "roteamento":
      return <RoteamentoSection />
    case "templates":
      return <TemplatesSection />
    case "horarios":
      return <HorariosSection />
    default:
      return <CadenciasSection />
  }
}

export function SdrConfigurationPage() {
  const { tab = "cadencias" } = useParams<{ tab?: string }>()
  const navigate = useNavigate()

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
          Defina cadências, scripts, agente IA, scoring e regras do módulo.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left nav */}
        <nav
          className="w-full shrink-0 lg:w-64"
          aria-label="Seções de configuração SDR"
        >
          <div className="space-y-0.5">
            {configTabs.map((t) => {
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
