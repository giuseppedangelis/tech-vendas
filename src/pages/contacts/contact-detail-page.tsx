import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Target,
  Tag,
  Globe,
  MessageCircle,
  PhoneCall,
  Video,
  Calendar,
  FileText,
  Send,
  Sparkles,
  Pin,
  Trophy,
  Edit3,
  Kanban as KanbanIcon,
  MoreHorizontal,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

// --- Mock Data ---

const contact = {
  id: "3",
  name: "Camila Rodrigues Ferreira",
  email: "camila.ferreira@tech.io",
  phone: "+55 31 96543-2109",
  company: "Tech Solutions Ltda",
  role: "Diretora de Tecnologia",
  avatar: "CF",
  stage: "SQL" as const,
  source: "Formulário",
  score: 78,
  dealsCount: 2,
  totalValue: "R$ 45.000",
  tags: ["Enterprise", "Tecnologia", "Decisor"],
  customFields: {
    Setor: "Tecnologia da Informação",
    "Tamanho da Empresa": "50-200 funcionários",
    Website: "techsolutions.com.br",
    "Próximo Contato": "08/04/2026",
  },
}

const activities = [
  {
    id: "a1",
    type: "email",
    icon: Mail,
    iconColor: "text-blue-600",
    title: "Email enviado: Proposta comercial Tech Pro",
    date: "05/04/2026 - 14:32",
    description:
      "Proposta enviada com detalhamento do pacote Enterprise com desconto de 15% para fechamento até fim do mês.",
  },
  {
    id: "a2",
    type: "call",
    icon: PhoneCall,
    iconColor: "text-green-600",
    title: "Ligação realizada - 12 min",
    date: "03/04/2026 - 10:15",
    description:
      "Discutimos necessidades de integração com o ERP atual. Camila demonstrou interesse no módulo de automação.",
  },
  {
    id: "a3",
    type: "meeting",
    icon: Video,
    iconColor: "text-primary",
    title: "Reunião online - Demo do produto",
    date: "01/04/2026 - 15:00",
    description:
      "Demo realizada para Camila e equipe técnica. Boa receptividade. Solicitaram proposta formal.",
  },
  {
    id: "a4",
    type: "whatsapp",
    icon: MessageCircle,
    iconColor: "text-emerald-600",
    title: "Mensagem via WhatsApp",
    date: "28/03/2026 - 09:45",
    description:
      "Confirmação de horário para demo. Camila informou que participarão mais 2 pessoas da equipe.",
  },
  {
    id: "a5",
    type: "form",
    icon: FileText,
    iconColor: "text-amber-600",
    title: "Formulário preenchido - Solicitar Demo",
    date: "25/03/2026 - 16:20",
    description:
      "Lead capturado via formulário do site. Interesse em automação de vendas e integração com CRM.",
  },
]

const interactions = [
  {
    id: "i1",
    channel: "Email",
    icon: Mail,
    iconColor: "text-blue-600",
    direction: "Enviado",
    subject: "Proposta comercial - Pacote Enterprise",
    date: "05/04/2026 - 14:32",
    preview:
      "Olá Camila, conforme conversamos, segue em anexo a proposta comercial para o pacote Enterprise...",
  },
  {
    id: "i2",
    channel: "Telefone",
    icon: PhoneCall,
    iconColor: "text-green-600",
    direction: "Realizada",
    subject: "Ligação de follow-up",
    date: "03/04/2026 - 10:15",
    preview:
      "Duração: 12 min. Discutimos integração com ERP e timeline de implementação.",
  },
  {
    id: "i3",
    channel: "Video",
    icon: Video,
    iconColor: "text-primary",
    direction: "Realizada",
    subject: "Demo do produto - Equipe Tech Solutions",
    date: "01/04/2026 - 15:00",
    preview:
      "Participantes: Camila Ferreira, Rafael Lima, Júlia Santos. Demo completa do módulo de vendas.",
  },
  {
    id: "i4",
    channel: "WhatsApp",
    icon: MessageCircle,
    iconColor: "text-emerald-600",
    direction: "Recebido",
    subject: "Confirmação de horário",
    date: "28/03/2026 - 09:45",
    preview:
      "Oi, tudo bem? Confirmando a demo para terça às 15h. Vão participar mais 2 pessoas da equipe.",
  },
  {
    id: "i5",
    channel: "WhatsApp",
    icon: MessageCircle,
    iconColor: "text-emerald-600",
    direction: "Enviado",
    subject: "Primeiro contato",
    date: "26/03/2026 - 11:00",
    preview:
      "Olá Camila! Vi que você se interessou pela nossa solução. Podemos agendar uma conversa?",
  },
  {
    id: "i6",
    channel: "Email",
    icon: Mail,
    iconColor: "text-blue-600",
    direction: "Enviado",
    subject: "Bem-vinda ao Tech Vendas Pro",
    date: "25/03/2026 - 16:25",
    preview:
      "Olá Camila, obrigado pelo interesse! Recebemos sua solicitação de demo e entraremos em contato.",
  },
]

const deals = [
  {
    id: "d1",
    name: "Tech Solutions - Pacote Enterprise",
    pipeline: "Vendas B2B",
    stage: "Proposta",
    value: "R$ 32.000",
    status: "Aberto" as const,
  },
  {
    id: "d2",
    name: "Tech Solutions - Módulo Automação",
    pipeline: "Upsell",
    stage: "Negociação",
    value: "R$ 13.000",
    status: "Aberto" as const,
  },
  {
    id: "d3",
    name: "Tech Solutions - Consultoria Inicial",
    pipeline: "Vendas B2B",
    stage: "Ganho",
    value: "R$ 5.000",
    status: "Ganho" as const,
  },
]

const notes = [
  {
    id: "n1",
    author: "Ricardo Mendes",
    date: "05/04/2026 - 15:10",
    content:
      "Camila tem urgência para fechar até fim de abril. Orçamento já aprovado pela diretoria. Oferecer desconto de 10% se fechar nesta semana.",
  },
  {
    id: "n2",
    author: "Juliana Martins",
    date: "01/04/2026 - 16:30",
    content:
      "Demo foi muito bem recebida. Time técnico ficou impressionado com as integrações. Principal preocupação: migração de dados do sistema legado.",
  },
  {
    id: "n3",
    author: "Ricardo Mendes",
    date: "28/03/2026 - 10:00",
    content:
      "Primeiro contato via WhatsApp. Camila é decisora final. Empresa usa atualmente planilhas para gestão de vendas. Dor principal: falta de visibilidade do funil.",
  },
  {
    id: "n4",
    author: "Juliana Martins",
    date: "25/03/2026 - 17:00",
    content:
      "Lead qualificado via formulário do site. Perfil ideal: empresa de tecnologia, 50-200 funcionários, decisora C-level. Prioridade alta.",
  },
]

const dealStatusColors: Record<string, string> = {
  Aberto: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Ganho: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Perdido: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

function GestorContactDetailPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="animate-page-in space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/contacts")}
        className="gap-1.5 transition-all duration-200 hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Voltar para contatos
      </Button>

      {/* Contact Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar size="lg" className="size-16">
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-orange-500/10 text-primary text-lg">{contact.avatar}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-gradient font-display text-2xl font-bold tracking-tight">
              {contact.name}
            </h2>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground/60">
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {contact.email}
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5" />
                {contact.phone}
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="size-3.5" />
                {contact.company}
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="size-3.5" />
                {contact.role}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5">
            <Send className="size-4" />
            Enviar Email
          </Button>
          <Button variant="gradient" className="btn-lift rounded-xl shadow-md shadow-primary/10">
            <Calendar className="size-4" />
            Agendar Reunião
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="animate-card-in stagger-1 accent-top card-hover border-border/50 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Lead Score</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500 text-white shadow-sm">
              <Sparkles className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">{contact.score}</div>
              <Badge className="bg-gradient-to-r from-primary/10 to-primary/10 text-primary dark:text-primary text-[10px] border-primary/20 dark:border-primary/30">
                <Sparkles className="mr-1 size-2.5" />
                Powered by AI
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground/60">+12 pontos este mês</p>
            <div className="space-y-1.5 border-t pt-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Por que este score?</span>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  <span>Perfil decisor (C-level) +25pts</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  <span>Empresa 50-200 func (ICP) +20pts</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <div className="size-1.5 rounded-full bg-blue-500" />
                  <span>3 interações em 10 dias +18pts</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <div className="size-1.5 rounded-full bg-blue-500" />
                  <span>Pediu proposta formal +15pts</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-card-in stagger-2 accent-top card-hover border-border/50 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Deals Ativos</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
              <Target className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contact.dealsCount}</div>
            <p className="text-xs text-muted-foreground/60">
              1 em negociação, 1 proposta
            </p>
          </CardContent>
        </Card>
        <Card className="animate-card-in stagger-3 accent-top card-hover border-border/50 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Valor Total</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
              <DollarSign className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contact.totalValue}</div>
            <p className="text-xs text-muted-foreground/60">
              Em todos os deals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="animate-card-in stagger-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="interactions">Interações</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
        </TabsList>

        {/* Visão Geral Tab */}
        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="glass-strong flex items-center gap-3 rounded-xl border border-border/50 px-4 py-3 shadow-sm backdrop-blur-xl animate-card-in">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500 text-white shadow-sm">
              <Sparkles className="size-4 animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">Recomendação da IA</span>
                <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>
              </div>
              <p className="text-[11px] text-muted-foreground/60">Melhor horário para contato: Ter/Qui 10h-12h · Probabilidade de conversão: 72% · Próximo passo: Enviar proposta formal com desconto 15%</p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Info Card */}
            <Card className="glass border-border/50 rounded-xl backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Informações do Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground/60">
                    Estágio do Ciclo de Vida
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                  >
                    {contact.stage}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground/60">Origem</span>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Globe className="size-3.5 text-blue-600" />
                    {contact.source}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground/60">Tags</span>
                  <div className="flex gap-1.5">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="size-2.5" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border/50 pt-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Campos Personalizados</p>
                  <div className="space-y-2">
                    {Object.entries(contact.customFields).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground/60">{key}</span>
                          <span>{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Timeline */}
            <Card className="glass border-border/50 rounded-xl backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="animate-card-in flex gap-3" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex flex-col items-center">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-orange-500/10 ring-4 ring-background shadow-sm">
                          <activity.icon
                            className={`size-4 ${activity.iconColor}`}
                          />
                        </div>
                        {index < activities.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-gradient-to-b from-border/60 to-transparent" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium leading-snug">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                          {activity.date}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interações Tab */}
        <TabsContent value="interactions" className="space-y-4 pt-4">
          {interactions.map((interaction, index) => (
            <Card key={interaction.id} className="animate-card-in card-hover border-border/50 rounded-xl transition-all duration-200" style={{ animationDelay: `${index * 40}ms` }}>
              <CardContent className="flex items-start gap-4 pt-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/5 to-orange-500/5">
                  <interaction.icon
                    className={`size-5 ${interaction.iconColor}`}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {interaction.subject}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {interaction.channel}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {interaction.direction}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground/60 whitespace-nowrap">
                      {interaction.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground/60">
                    {interaction.preview}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals" className="pt-4">
          <div className="glass rounded-xl border border-border/50 backdrop-blur-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Deal</TableHead>
                  <TableHead>Pipeline</TableHead>
                  <TableHead>Estágio</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.name}</TableCell>
                    <TableCell className="text-muted-foreground/60">
                      {deal.pipeline}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{deal.stage}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{deal.value}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={dealStatusColors[deal.status]}
                      >
                        {deal.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Notas Tab */}
        <TabsContent value="notes" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Button variant="gradient" className="btn-lift rounded-xl shadow-md shadow-primary/10">
              <FileText className="size-4" />
              Nova Nota
            </Button>
          </div>
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-orange-500/10 text-primary text-[10px]">
                        {note.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{note.author}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {note.date}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}

// ===========================================================================
// CLOSER CONTACT DETAIL (Reference: LTV + timeline + pinned notes + AI call)
// ===========================================================================

const closerContact = {
  name: "Mariana Teixeira",
  title: "Gerente de TI · Pepsico Brasil",
  email: "mariana.teixeira@pepsico.com",
  phone: "+55 11 98823-4401",
  city: "São Paulo, SP",
  linkedin: "in/mariana-teixeira-pep",
  birthday: "12 de setembro",
  firstTouch: "08/01/2025",
  tags: ["VIP", "Enterprise", "SAP", "Decisor técnico"],
  score: 92,
  ltv: 340000,
  initials: "MT",
}

const closerReceipts = [
  { date: "02/03/2026", prod: "Plataforma Enterprise · renovação anual", amt: 120000 },
  { date: "15/10/2025", prod: "Módulo Analytics Pro · 12 meses", amt: 48000 },
  { date: "22/04/2025", prod: "Plataforma Enterprise · contrato inicial", amt: 120000 },
  { date: "18/02/2025", prod: "Setup + onboarding", amt: 32000 },
  { date: "08/01/2025", prod: "Primeira compra · POC 90 dias", amt: 20000 },
]

const closerContactDeals = [
  { name: "Pepsico — Contrato Enterprise", stage: "Proposta · há 4 dias", value: 48500, score: 92 },
  { name: "Add-on Analytics Pro", stage: "Qualificado · há 12 dias", value: 12000, score: 68 },
  { name: "Expansão 2 squads adicionais", stage: "Prospect · há 1 dia", value: 28000, score: 60 },
]

function fmtBRLFull(v: number) {
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function scoreDotClass(score: number) {
  if (score >= 75) return "bg-emerald-500"
  if (score >= 50) return "bg-amber-500"
  return "bg-sky-500"
}

function CloserContactDetailPage() {
  const navigate = useNavigate()
  const [noteText, setNoteText] = useState("")
  const [pinnedNotes, setPinnedNotes] = useState([
    {
      id: 1,
      when: "2 dias atrás",
      text: "Mariana mencionou que o Rodrigo (CTO) é o decisor real. Ela tem ótimo relacionamento mas depende da aprovação dele para qualquer compra acima de R$30k.",
    },
  ])

  const addNote = () => {
    if (!noteText.trim()) return
    setPinnedNotes([{ id: Date.now(), when: "agora", text: noteText }, ...pinnedNotes])
    setNoteText("")
  }

  return (
    <div className="animate-page-in space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/contacts")}
        className="gap-1.5 transition-all duration-200 hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Voltar para contatos
      </Button>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr_320px]">
        {/* ── LEFT: Profile + LTV + Receipts ── */}
        <div className="space-y-5">
          {/* Profile hero */}
          <Card className="overflow-hidden">
            <CardContent className="pt-6 text-center space-y-3">
              <Avatar className="size-20 mx-auto ring-2 ring-primary/15">
                <AvatarFallback className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-400 text-xl font-bold">
                  {closerContact.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-display text-lg font-bold">{closerContact.name}</div>
                <div className="text-[12.5px] text-muted-foreground">{closerContact.title}</div>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {closerContact.tags.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="text-[10px] bg-primary/10 text-primary"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <Button
                  variant="gradient"
                  size="sm"
                  className="h-8 text-xs btn-lift"
                  onClick={() => navigate("/inbox")}
                >
                  <MessageCircle className="size-3.5" />
                  Conversar
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Phone className="size-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Video className="size-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dados pessoais */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Dados pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[12.5px]">
              {[
                ["E-mail", closerContact.email, false],
                ["Telefone", closerContact.phone, true],
                ["Cidade", closerContact.city, false],
                ["LinkedIn", closerContact.linkedin, false],
                ["Aniversário", closerContact.birthday, false],
                ["Primeiro toque", closerContact.firstTouch, true],
                ["Dono", "Você", false],
              ].map(([label, val, mono]) => (
                <div key={label as string} className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground/80 shrink-0 text-[11.5px]">{label}</span>
                  <span
                    className={`text-right truncate ${mono ? "font-mono" : ""} ${
                      label === "LinkedIn" ? "text-primary" : ""
                    }`}
                  >
                    {val as string}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* LTV big */}
          <Card className="overflow-hidden relative accent-line-left">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-transparent" />
            <CardContent className="relative pt-5 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Lifetime Value
              </div>
              <div className="font-display font-mono text-[1.75rem] font-bold tracking-tight text-emerald-600 dark:text-emerald-400 leading-none">
                {fmtBRLFull(closerContact.ltv)}
              </div>
              <div className="text-[11.5px] text-muted-foreground/80">
                5 compras · integração Hotmart · ticket médio R$ 68.000
              </div>
            </CardContent>
          </Card>

          {/* Receipt history */}
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Histórico de recibos
              </CardTitle>
              <Badge variant="secondary" className="text-[9px]">
                Hotmart
              </Badge>
            </CardHeader>
            <CardContent className="space-y-1.5 pb-3">
              {closerReceipts.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 py-1.5 text-[12px] border-b border-border/50 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{r.prod}</div>
                    <div className="text-[10.5px] text-muted-foreground/60 font-mono">
                      {r.date}
                    </div>
                  </div>
                  <div className="font-mono text-[12px] font-semibold shrink-0">
                    {fmtBRLFull(r.amt)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── CENTER: Timeline ── */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-bold tracking-tight">Timeline completa</h2>
            <Badge variant="secondary" className="text-[10px]">
              284 eventos
            </Badge>
            <div className="flex-1" />
            <div className="inline-flex rounded-lg border border-border/60 p-0.5 text-[11px]">
              {["Tudo", "Mensagens", "Deals", "Faturas", "Notas"].map((tab, i) => (
                <button
                  key={tab}
                  className={`rounded-md px-2 py-1 ${
                    i === 0
                      ? "bg-muted shadow-sm font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Pin className="size-3.5" />
              Fixar nota
            </Button>
          </div>

          {/* Pinned note composer */}
          <Card className="border-amber-500/30 bg-amber-500/[0.04] border-dashed">
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Pin className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/80">
                  Nova nota fixada
                </span>
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Escreva uma nota de reunião, insight de conversa, contexto para o time…"
                className="w-full min-h-[50px] bg-transparent border-none outline-none text-[13px] resize-y placeholder:text-muted-foreground/50"
              />
              {noteText.trim() && (
                <div className="flex items-center gap-1.5 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-3 text-xs"
                    onClick={() => setNoteText("")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    className="h-7 px-3 text-xs btn-lift"
                    onClick={addNote}
                  >
                    Fixar nota
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline events */}
          <div className="space-y-3">
            {pinnedNotes.map((n) => (
              <TLRow key={n.id} icon={<Pin className="size-3" />} tone="amber">
                <div className="text-[12px]">
                  <span className="font-semibold">Rafael Silva</span>{" "}
                  <span className="text-muted-foreground">fixou uma nota · {n.when}</span>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.04] p-3 mt-1.5 text-[13px]">
                  {n.text}
                </div>
              </TLRow>
            ))}

            {/* AI Call Analysis */}
            <TLRow icon={<Sparkles className="size-3" />} tone="ai">
              <div className="text-[12px]">
                <span className="font-semibold">Copiloto · Análise de reunião</span>{" "}
                <span className="inline-flex items-center rounded-lg ai-shimmer px-1.5 py-0.5 text-[8px] font-bold ai-text-shimmer mx-1">
                  AI
                </span>
                <span className="text-muted-foreground">· hoje, 11:02</span>
              </div>
              <Card className="overflow-hidden relative border-primary/20">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent" />
                <div className="relative p-3 border-b border-border/60 flex items-center gap-2">
                  <Video className="size-3.5 text-primary" />
                  <strong className="text-[12.5px]">Call Pepsico — Alinhamento de proposta</strong>
                  <div className="flex-1" />
                  <span className="font-mono text-[10.5px] text-muted-foreground">
                    38:24 · Google Meet
                  </span>
                </div>
                <div className="relative p-3 space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground/70 mb-1.5">
                      Resumo (IA)
                    </div>
                    <p className="text-[12.5px] leading-relaxed text-foreground/90">
                      Mariana reforçou urgência em fechar o contrato nesta semana. Principal
                      objeção: integração com SAP exige homologação de 30 dias. Rodrigo (CTO) entra
                      como stakeholder obrigatório. Orçamento aprovado até R$ 52k. Próximos passos:
                      envio de contrato com cláusula SLA e call técnica com time de TI.
                    </p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground/70 mb-1.5">
                      Sentimento
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] text-muted-foreground">Negativo</span>
                      <div className="flex-1 relative h-1.5 rounded-full bg-gradient-to-r from-red-500/40 via-amber-500/40 to-emerald-500/70">
                        <div
                          className="absolute -top-1 size-3.5 rounded-full bg-foreground border-2 border-background shadow-sm"
                          style={{ left: "calc(78% - 7px)" }}
                        />
                      </div>
                      <span className="text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Positivo · 0.78
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                      <FileText className="size-3" />
                      Transcrição completa
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs btn-lift bg-gradient-to-r from-primary to-orange-600 text-white"
                    >
                      <Sparkles className="size-3" />
                      Criar 3 tarefas
                    </Button>
                  </div>
                </div>
              </Card>
            </TLRow>

            <TLRow icon={<Mail className="size-3" />}>
              <div className="text-[12px]">
                <span className="font-semibold">Você</span>{" "}
                <span className="text-muted-foreground">enviou e-mail · hoje, 10:22</span>
              </div>
              <div className="rounded-lg border border-border/60 p-2.5 mt-1.5 text-[12px]">
                <div className="font-medium">Proposta comercial — Pepsico Enterprise v3</div>
                <div className="text-muted-foreground mt-1 leading-snug">
                  Olá Mariana, conforme alinhado na nossa call, segue a proposta revisada com as
                  cláusulas de SLA e homologação...
                </div>
                <Badge variant="secondary" className="mt-2 text-[10px] gap-1">
                  <FileText className="size-2.5" />
                  Contrato_Pepsico_v3.pdf · 240KB
                </Badge>
              </div>
            </TLRow>

            <TLRow icon={<MessageCircle className="size-3" />}>
              <div className="text-[12px]">
                <span className="font-semibold">Mariana Teixeira</span>{" "}
                <span className="text-muted-foreground">respondeu no WhatsApp · ontem, 17:48</span>
              </div>
              <div className="text-[12.5px] italic text-muted-foreground">
                "Show! Aguardando o contrato."
              </div>
            </TLRow>

            <TLRow icon={<KanbanIcon className="size-3" />}>
              <div className="text-[12px]">
                Estágio do deal alterado:{" "}
                <span className="font-semibold text-primary">Qualificado</span> →{" "}
                <span className="font-semibold text-primary">Proposta</span>{" "}
                <span className="text-muted-foreground">· 14/04, 10:22</span>
              </div>
              <div className="text-[12px] text-muted-foreground">
                Contrato Enterprise — 3 squads · {fmtBRLFull(48500)}
              </div>
            </TLRow>

            <TLRow icon={<Tag className="size-3" />}>
              <div className="text-[12px]">
                <span className="font-semibold">Rafael</span>{" "}
                <span className="text-muted-foreground">adicionou as tags · 10/04</span>
              </div>
              <div className="flex gap-1.5 mt-1">
                <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                  VIP
                </Badge>
                <Badge variant="secondary" className="text-[10px] bg-sky-500/10 text-sky-600">
                  SAP
                </Badge>
              </div>
            </TLRow>

            <TLRow icon={<Trophy className="size-3" />} tone="won">
              <div className="text-[12px]">
                <span className="font-semibold">Deal ganho:</span> Renovação anual · Plataforma
                Enterprise <span className="text-muted-foreground">· 02/03/2026</span>
              </div>
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-2.5 mt-1.5">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-[13px]">{fmtBRLFull(120000)}</span>
                  <span className="text-muted-foreground text-[11.5px]">
                    · ciclo 12 meses · fatura via Hotmart
                  </span>
                </div>
              </div>
            </TLRow>

            <TLRow icon={<PhoneCall className="size-3" />}>
              <div className="text-[12px]">
                <span className="font-semibold">Você</span>{" "}
                <span className="text-muted-foreground">ligou · 12min 33s · 01/03</span>
              </div>
              <div className="text-[12.5px] text-muted-foreground">
                Chamada de renegociação anual. Cliente confirmou continuidade.
              </div>
            </TLRow>

            <div className="text-center py-4 text-[11.5px] text-muted-foreground">
              — Mostrando 7 de 284 eventos —{" "}
              <button className="text-primary hover:underline">Carregar mais</button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Score + Deals + Insights ── */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                  Score de fechamento
                </CardTitle>
                <Sparkles className="size-3 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="flex items-start gap-3 pb-4">
              <div className="font-display font-mono text-[2.5rem] font-bold text-primary leading-none tracking-tight">
                {closerContact.score}
              </div>
              <div className="text-[12px] flex-1 pt-1">
                <strong>Muito alto.</strong>
                <div className="text-muted-foreground mt-0.5">
                  Cliente ativo, pagamentos em dia, 3 deals abertos.
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Oportunidades
              </span>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => navigate("/pipeline")}
              >
                <Briefcase className="size-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {closerContactDeals.map((d) => (
                <Card
                  key={d.name}
                  className="cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => navigate("/pipeline")}
                >
                  <CardContent className="pt-3 pb-3">
                    <div className="text-[12.5px] font-medium truncate">{d.name}</div>
                    <div className="text-[10.5px] text-muted-foreground mt-0.5">{d.stage}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-mono text-[12px] font-semibold">
                        {fmtBRLFull(d.value)}
                      </span>
                      <span className={`size-2 rounded-full ${scoreDotClass(d.score)}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Insights do Copiloto
              </span>
            </div>
            <Card className="border-l-[3px] border-l-primary overflow-hidden relative">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-transparent" />
              <CardContent className="relative pt-4 space-y-2">
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-primary/10 text-primary gap-1 w-fit"
                >
                  <Sparkles className="size-2.5" />
                  Upsell sugerido
                </Badge>
                <p className="text-[12.5px] leading-snug">
                  Contas com perfil similar (Enterprise + SAP) compraram Módulo Segurança em média
                  45 dias após Analytics.
                </p>
                <p className="text-[11.5px] text-primary">↳ Oferecer no próximo contato</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function TLRow({
  icon,
  tone,
  children,
}: {
  icon: React.ReactNode
  tone?: "amber" | "ai" | "won"
  children: React.ReactNode
}) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
      : tone === "ai"
        ? "bg-primary/15 text-primary border-primary/30"
        : tone === "won"
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
          : "bg-muted text-muted-foreground border-border/60"
  return (
    <div className="flex gap-3">
      <div
        className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${toneClass}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0 space-y-1">{children}</div>
    </div>
  )
}

// ===========================================================================
// Role dispatcher
// ===========================================================================

export function ContactDetailPage() {
  const { user } = useAuth()
  if (user?.role === "closer") return <CloserContactDetailPage />
  return <GestorContactDetailPage />
}
