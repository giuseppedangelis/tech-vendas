import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Building2,
  MessageSquare,
  Kanban,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  QrCode,
  Plus,
  Trash2,
  Rocket,
} from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Seu Negocio", icon: Building2 },
  { id: 2, title: "WhatsApp", icon: MessageSquare },
  { id: 3, title: "Pipeline", icon: Kanban },
  { id: 4, title: "Equipe", icon: Users },
  { id: 5, title: "Concluido", icon: CheckCircle2 },
]

const pipelineTemplates = [
  {
    id: "b2b",
    name: "Vendas B2B",
    description: "Pipeline para vendas empresariais com ciclo longo de vendas",
    stages: ["Prospeccao", "Qualificacao", "Apresentacao", "Proposta", "Negociacao", "Fechamento"],
    color: "border-blue-500/50 bg-blue-500/5",
    iconColor: "text-blue-600",
  },
  {
    id: "b2c",
    name: "Vendas B2C",
    description: "Pipeline otimizado para vendas diretas ao consumidor",
    stages: ["Novo Lead", "Contato", "Interesse", "Proposta", "Venda"],
    color: "border-emerald-500/50 bg-emerald-500/5",
    iconColor: "text-emerald-600",
  },
  {
    id: "info",
    name: "Infoprodutos",
    description: "Pipeline para lancamentos e vendas de produtos digitais",
    stages: ["Captacao", "Aquecimento", "Lancamento", "Carrinho Aberto", "Fechamento"],
    color: "border-primary/50 bg-primary/5",
    iconColor: "text-primary",
  },
]

interface TeamInvite {
  id: string
  email: string
  role: string
}

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) {
  const progressValue = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="space-y-4">
      <Progress value={progressValue} className="h-1.5" />
      <div className="flex justify-between">
        {steps.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted
                    ? "border-transparent bg-gradient-to-br from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10"
                    : isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <step.icon className="size-4" />
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive
                    ? "text-foreground"
                    : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StepSeuNegocio() {
  const [niche, setNiche] = useState("")

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Sobre seu Negocio</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Conte-nos um pouco sobre sua empresa para personalizar a experiencia
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="business-name">Nome da Empresa</Label>
            <Input id="business-name" placeholder="Ex: Minha Empresa Ltda" />
          </div>

          <div className="space-y-2">
            <Label>Nicho de Atuacao</Label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione seu nicho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS / Software</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="infoprodutos">Infoprodutos</SelectItem>
                <SelectItem value="servicos">Servicos Profissionais</SelectItem>
                <SelectItem value="educacao">Educacao</SelectItem>
                <SelectItem value="saude">Saude e Bem-estar</SelectItem>
                <SelectItem value="imobiliario">Imobiliario</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="products">Produtos / Servicos</Label>
            <Input
              id="products"
              placeholder="Ex: Consultoria, Curso Online, Software"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Cliente</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="b2b">B2B (Empresas)</SelectItem>
                <SelectItem value="b2c">B2C (Consumidores)</SelectItem>
                <SelectItem value="both">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StepWhatsApp() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Conectar WhatsApp</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Conecte seu WhatsApp para receber e enviar mensagens pelo CRM
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="whatsapp-number">Numero do WhatsApp</Label>
            <Input
              id="whatsapp-number"
              placeholder="+55 (11) 99999-9999"
              type="tel"
            />
            <p className="text-xs text-muted-foreground">
              Informe o numero com DDD conectado ao WhatsApp Business
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>QR Code</Label>
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8">
              <QrCode className="size-16 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">Escaneie o QR Code</p>
                <p className="text-xs text-muted-foreground">
                  Abra o WhatsApp no celular, va em Dispositivos Conectados e
                  escaneie o codigo
                </p>
              </div>
              <Button variant="outline" size="sm">
                Gerar QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Separator() {
  return <div className="h-px w-full bg-border" />
}

function StepPipeline() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Escolha seu Pipeline</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecione um modelo de Kanban para comecar
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {pipelineTemplates.map((template, index) => (
          <Card
            key={template.id}
            className={cn(
              `card-hover animate-card-in stagger-${index + 1} cursor-pointer transition-all hover:ring-2 hover:ring-primary/50`,
              selectedTemplate === template.id
                ? "ring-2 ring-primary"
                : "",
              template.color
            )}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <Kanban className={cn("size-5", template.iconColor)} />
                <CardTitle className="text-sm">{template.name}</CardTitle>
              </div>
              <CardDescription className="text-xs">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {template.stages.map((stage, i) => (
                  <div
                    key={stage}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Badge variant="secondary" className="size-5 justify-center p-0 text-[10px]">
                      {i + 1}
                    </Badge>
                    <span>{stage}</span>
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

function StepEquipe() {
  const [invites, setInvites] = useState<TeamInvite[]>([
    { id: "1", email: "", role: "closer" },
  ])

  const addInvite = () => {
    setInvites([
      ...invites,
      { id: String(Date.now()), email: "", role: "closer" },
    ])
  }

  const removeInvite = (id: string) => {
    if (invites.length > 1) {
      setInvites(invites.filter((i) => i.id !== id))
    }
  }

  const updateInvite = (id: string, field: keyof TeamInvite, value: string) => {
    setInvites(
      invites.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Convide sua Equipe</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Adicione os membros da sua equipe de vendas
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          {invites.map((invite, index) => (
            <div key={invite.id} className="flex items-end gap-2">
              <div className="flex-1 space-y-1.5">
                {index === 0 && <Label>E-mail</Label>}
                <Input
                  type="email"
                  placeholder="membro@empresa.com"
                  value={invite.email}
                  onChange={(e) =>
                    updateInvite(invite.id, "email", e.target.value)
                  }
                />
              </div>
              <div className="w-36 space-y-1.5">
                {index === 0 && <Label>Cargo</Label>}
                <Select
                  value={invite.role}
                  onValueChange={(v) => updateInvite(invite.id, "role", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="closer">Closer</SelectItem>
                    <SelectItem value="sdr">SDR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeInvite(invite.id)}
                disabled={invites.length === 1}
                className="shrink-0"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addInvite} className="w-full">
            <Plus className="mr-1.5 size-4" />
            Adicionar outro membro
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Voce pode pular esta etapa e convidar membros depois em Configuracoes.
      </p>
    </div>
  )
}

function StepConcluido() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/10">
        <Rocket className="bounce-gentle size-10 text-emerald-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold">Tudo pronto!</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Sua conta no Tech Vendas Pro esta configurada. Agora voce pode
          comecar a gerenciar seus leads, conversas e pipeline de vendas.
        </p>
      </div>

      <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-3">
        <Card size="sm" className="card-hover animate-card-in stagger-1">
          <CardContent className="pt-4 text-center">
            <MessageSquare className="mx-auto mb-1 size-6 text-muted-foreground" />
            <p className="text-xs font-medium">Inbox Unificado</p>
          </CardContent>
        </Card>
        <Card size="sm" className="card-hover animate-card-in stagger-2">
          <CardContent className="pt-4 text-center">
            <Kanban className="mx-auto mb-1 size-6 text-muted-foreground" />
            <p className="text-xs font-medium">Pipeline Visual</p>
          </CardContent>
        </Card>
        <Card size="sm" className="card-hover animate-card-in stagger-3">
          <CardContent className="pt-4 text-center">
            <Users className="mx-auto mb-1 size-6 text-muted-foreground" />
            <p className="text-xs font-medium">Gestao de Equipe</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function SetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const goNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToDashboard = () => {
    navigate("/dashboard")
  }

  return (
    <div className="animate-page-in relative flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background p-4">
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/[0.07] blur-[120px]" />

      <div className="relative mx-auto w-full max-w-2xl space-y-8">
        {/* Logo / Title */}
        <div className="text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-600 text-primary-foreground shadow-lg shadow-primary/10 mx-auto mb-2">
            <Kanban className="size-6" />
          </div>
          <h1 className="text-gradient text-2xl font-bold tracking-tight">
            Tech Vendas Pro
          </h1>
          <p className="text-sm text-muted-foreground">
            Configuracao inicial da sua conta
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && <StepSeuNegocio />}
          {currentStep === 2 && <StepWhatsApp />}
          {currentStep === 3 && <StepPipeline />}
          {currentStep === 4 && <StepEquipe />}
          {currentStep === 5 && <StepConcluido />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {currentStep > 1 && currentStep < 5 ? (
            <Button variant="outline" onClick={goBack} className="transition-all duration-200 hover:border-primary/30">
              <ArrowLeft className="mr-1.5 size-4" />
              Voltar
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button onClick={goNext} className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
              Proximo
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          ) : (
            <Button onClick={goToDashboard} className="btn-lift mx-auto bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-lg shadow-primary/10">
              <Rocket className="mr-1.5 size-4" />
              Ir para o Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
