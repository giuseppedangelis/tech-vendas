import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  GitBranch,
  ListFilter,
  Tags,
  Zap,
  Target,
  BookOpen,
  Plug,
  BrainCircuit,
  Plus,
  GripVertical,
  Settings2,
  MessageSquare,
  Camera,
  ShoppingBag,
  Calendar,
  Mail,
  Construction,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Settings sections
const settingsSections = [
  { id: "conta", label: "Conta", icon: User },
  { id: "pipelines", label: "Pipelines", icon: GitBranch },
  { id: "campos", label: "Campos", icon: ListFilter },
  { id: "tags", label: "Tags", icon: Tags },
  { id: "automacoes", label: "Automações", icon: Zap },
  { id: "lead-scoring", label: "Lead Scoring", icon: Target },
  { id: "metodologias", label: "Metodologias", icon: BookOpen },
  { id: "integracoes", label: "Integrações", icon: Plug },
  { id: "ia", label: "IA", icon: BrainCircuit },
]

// Pipeline mock data
const pipelinesData = [
  {
    id: "1",
    name: "Vendas Principal",
    stages: [
      { name: "Novos Leads", color: "#3b82f6", order: 1 },
      { name: "Qualificação", color: "#8b5cf6", order: 2 },
      { name: "Proposta", color: "#f59e0b", order: 3 },
      { name: "Negociação", color: "#f97316", order: 4 },
      { name: "Fechamento", color: "#22c55e", order: 5 },
    ],
  },
  {
    id: "2",
    name: "Pós-Venda",
    stages: [
      { name: "Onboarding", color: "#06b6d4", order: 1 },
      { name: "Implantação", color: "#8b5cf6", order: 2 },
      { name: "Acompanhamento", color: "#22c55e", order: 3 },
    ],
  },
]

// Integration mock data
const integrations = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Conecte sua conta do WhatsApp Business",
    icon: MessageSquare,
    connected: true,
    color: "text-green-600",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Receba leads do Instagram Direct",
    icon: Camera,
    connected: true,
    color: "text-pink-600",
  },
  {
    id: "hotmart",
    name: "Hotmart",
    description: "Sincronize vendas e leads da Hotmart",
    icon: ShoppingBag,
    connected: false,
    color: "text-orange-600",
  },
  {
    id: "kiwify",
    name: "Kiwify",
    description: "Integre vendas da plataforma Kiwify",
    icon: ShoppingBag,
    connected: false,
    color: "text-blue-600",
  },
  {
    id: "activecampaign",
    name: "ActiveCampaign",
    description: "Sincronize contatos e automações",
    icon: Mail,
    connected: false,
    color: "text-indigo-600",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sincronize agendamentos e reuniões",
    icon: Calendar,
    connected: true,
    color: "text-blue-500",
  },
]

// --- Section Components ---

function ContaSection() {
  const [companyName, setCompanyName] = useState("Tech Vendas Pro")
  const [adminEmail, setAdminEmail] = useState("admin@techvendas.com")
  const [whiteLabel, setWhiteLabel] = useState(false)
  const [theme, setTheme] = useState("light")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-base font-semibold">Conta</h3>
        <p className="text-sm text-muted-foreground">
          Configurações gerais da sua conta e empresa
        </p>
      </div>

      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle className="text-base">Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">E-mail do Administrador</Label>
            <Input
              id="admin-email"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle className="text-base">Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>White-label</Label>
              <p className="text-xs text-muted-foreground">
                Personalize a plataforma com sua marca
              </p>
            </div>
            <Switch checked={whiteLabel} onCheckedChange={setWhiteLabel} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Tema</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">Salvar Alterações</Button>
      </div>
    </div>
  )
}

function PipelinesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">Pipelines</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie seus pipelines e estágios de venda
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
          <Plus className="mr-1.5 size-4" />
          Adicionar Pipeline
        </Button>
      </div>

      <div className="space-y-4">
        {pipelinesData.map((pipeline) => (
          <Card key={pipeline.id} className="animate-card-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{pipeline.name}</CardTitle>
                <Button variant="outline" size="sm">
                  <Settings2 className="mr-1.5 size-3.5" />
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pipeline.stages.map((stage) => (
                  <div
                    key={stage.name}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2 transition-all duration-200 hover:bg-primary/[0.03]"
                  >
                    <GripVertical className="size-4 text-muted-foreground" />
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="flex-1 text-sm">{stage.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stage.order}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function IntegracoesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-base font-semibold">Integrações</h3>
        <p className="text-sm text-muted-foreground">
          Conecte suas ferramentas favoritas ao CRM
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/5 to-orange-500/5">
                    <integration.icon
                      className={cn("size-5", integration.color)}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-sm">
                      {integration.name}
                    </CardTitle>
                    <Badge
                      variant={integration.connected ? "default" : "secondary"}
                      className={
                        integration.connected
                          ? "mt-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "mt-1"
                      }
                    >
                      {integration.connected ? "Conectado" : "Desconectado"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-muted-foreground">
                {integration.description}
              </p>
              <Button
                variant={integration.connected ? "outline" : "default"}
                size="sm"
                className={cn(
                  "w-full",
                  !integration.connected && "btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10"
                )}
              >
                {integration.connected ? "Configurar" : "Conectar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function IASection() {
  const [provider, setProvider] = useState("openai")
  const [copilotEnabled, setCopilotEnabled] = useState(true)
  const [gestoraEnabled, setGestoraEnabled] = useState(false)
  const [methodology, setMethodology] = useState("def")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-base font-semibold">Inteligência Artificial</h3>
        <p className="text-sm text-muted-foreground">
          Configure os recursos de IA do seu CRM
        </p>
      </div>

      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle className="text-base">Provedor de IA</CardTitle>
          <CardDescription>
            Selecione o provedor de inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI (GPT)</SelectItem>
              <SelectItem value="claude">Claude (Anthropic)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle className="text-base">IA Copilot</CardTitle>
          <CardDescription>
            Assistente de IA para sugestões em tempo real durante conversas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativar IA Copilot</Label>
              <p className="text-xs text-muted-foreground">
                Receba sugestões de resposta e próximos passos
              </p>
            </div>
            <Switch checked={copilotEnabled} onCheckedChange={setCopilotEnabled} />
          </div>
          {copilotEnabled && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Contexto do Copilot</Label>
                <Select defaultValue="vendas">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="suporte">Suporte</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle className="text-base">IA Gestora</CardTitle>
          <CardDescription>
            IA autônoma para gestão de pipeline e follow-ups automáticos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativar IA Gestora</Label>
              <p className="text-xs text-muted-foreground">
                Automatize follow-ups e mova deals no pipeline
              </p>
            </div>
            <Switch checked={gestoraEnabled} onCheckedChange={setGestoraEnabled} />
          </div>
          {gestoraEnabled && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Frequência de Análise</Label>
                <Select defaultValue="diario">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tempo-real">Tempo Real</SelectItem>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle className="text-base">Metodologia de Vendas</CardTitle>
          <CardDescription>
            Selecione a metodologia que a IA deve seguir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={methodology} onValueChange={setMethodology}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="def">DEF (Dor, Expectativa, Fechamento)</SelectItem>
              <SelectItem value="spin">SPIN Selling</SelectItem>
              <SelectItem value="bant">BANT</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">Salvar Configurações de IA</Button>
      </div>
    </div>
  )
}

function PlaceholderSection({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-base font-semibold">{title}</h3>
      </div>
      <Card className="animate-card-in">
        <CardContent className="flex h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-orange-500/10 mx-auto mb-3">
              <Construction className="size-7 text-primary" />
            </div>
            <p className="text-lg font-medium">Em breve</p>
            <p className="text-sm text-muted-foreground">
              Esta seção está em desenvolvimento e estará disponível em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsContent({ section }: { section: string }) {
  switch (section) {
    case "conta":
      return <ContaSection />
    case "pipelines":
      return <PipelinesSection />
    case "integracoes":
      return <IntegracoesSection />
    case "ia":
      return <IASection />
    case "campos":
      return <PlaceholderSection title="Campos Personalizados" />
    case "tags":
      return <PlaceholderSection title="Tags" />
    case "automacoes":
      return <PlaceholderSection title="Automações" />
    case "lead-scoring":
      return <PlaceholderSection title="Lead Scoring" />
    case "metodologias":
      return <PlaceholderSection title="Metodologias" />
    default:
      return <ContaSection />
  }
}

export function SettingsPage() {
  const { section = "conta" } = useParams<{ section?: string }>()
  const navigate = useNavigate()

  return (
    <div className="animate-page-in space-y-6">
      <div>
        <h2 className="text-gradient text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Configure pipelines, integrações, equipe e preferências
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left sidebar */}
        <nav className="w-full shrink-0 lg:w-56">
          <div className="space-y-1">
            {settingsSections.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/settings/${s.id}`)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  section === s.id
                    ? "bg-primary/[0.06] text-primary border-l-[3px] border-l-primary font-medium"
                    : "text-muted-foreground border-l-[3px] border-l-transparent hover:bg-primary/[0.03] hover:border-l-primary/30"
                )}
              >
                <s.icon className="size-4" />
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        <Separator orientation="vertical" className="hidden lg:block" />
        <Separator className="lg:hidden" />

        {/* Content area */}
        <div className="min-w-0 flex-1">
          <SettingsContent section={section} />
        </div>
      </div>
    </div>
  )
}
