import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ListChecks,
  TrendingUp,
  Repeat,
  XCircle,
  History,
  Activity as ActivityIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LeadsSection } from "./operacao/leads-section"
import { PerformanceSection } from "./operacao/performance-section"
import { CadenciasAnaliseSection } from "./operacao/cadencias-analise-section"
import { DesqualificadosSection } from "./operacao/desqualificados-section"
import { ReativacaoSection } from "./operacao/reativacao-section"

interface OpTab {
  id: string
  label: string
  icon: typeof Repeat
  count?: number
  tone?: "live" | "warn"
}

const operationTabs: OpTab[] = [
  { id: "leads", label: "Leads em Qualificação", icon: ListChecks, count: 9, tone: "live" },
  { id: "performance", label: "Performance por SDR", icon: TrendingUp },
  { id: "cadencias", label: "Análise por Cadência", icon: Repeat },
  { id: "desqualificados", label: "Desqualificados", icon: XCircle, count: 7 },
  { id: "reativacao", label: "Reativação", icon: History, count: 129, tone: "warn" },
]

function SectionContent({ tab }: { tab: string }) {
  switch (tab) {
    case "leads":
      return <LeadsSection />
    case "performance":
      return <PerformanceSection />
    case "cadencias":
      return <CadenciasAnaliseSection />
    case "desqualificados":
      return <DesqualificadosSection />
    case "reativacao":
      return <ReativacaoSection />
    default:
      return <LeadsSection />
  }
}

export function SdrOperationsPage() {
  const { tab = "leads" } = useParams<{ tab?: string }>()
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
            <ActivityIcon className="size-3" />
            Operação SDR
          </Badge>
          <Badge variant="secondary" className="gap-1 text-[10px]">
            <span className="size-1.5 rounded-full bg-emerald-500 pulse-online" />
            Tempo real
          </Badge>
        </div>
        <h2 className="text-gradient mt-2 text-2xl font-bold tracking-tight">
          Operação SDR
        </h2>
        <p className="text-muted-foreground">
          Acompanhe qualificação, performance e recuperação de leads.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left nav */}
        <nav
          className="w-full shrink-0 lg:w-64"
          aria-label="Seções de operação SDR"
        >
          <div className="space-y-0.5">
            {operationTabs.map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => navigate(`/sdr/operacao/${t.id}`)}
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
                  {t.count != null && (
                    <span
                      className={cn(
                        "inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                        active
                          ? "bg-primary/15 text-primary"
                          : t.tone === "live"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : t.tone === "warn"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                              : "bg-muted text-muted-foreground/80"
                      )}
                    >
                      {t.count}
                    </span>
                  )}
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
