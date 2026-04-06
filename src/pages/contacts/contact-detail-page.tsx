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
  TrendingUp,
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
} from "lucide-react"

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
  source: "Formulario",
  score: 78,
  dealsCount: 2,
  totalValue: "R$ 45.000",
  tags: ["Enterprise", "Tecnologia", "Decisor"],
  customFields: {
    Setor: "Tecnologia da Informacao",
    "Tamanho da Empresa": "50-200 funcionarios",
    Website: "techsolutions.com.br",
    "Proximo Contato": "08/04/2026",
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
      "Proposta enviada com detalhamento do pacote Enterprise com desconto de 15% para fechamento ate fim do mes.",
  },
  {
    id: "a2",
    type: "call",
    icon: PhoneCall,
    iconColor: "text-green-600",
    title: "Ligacao realizada - 12 min",
    date: "03/04/2026 - 10:15",
    description:
      "Discutimos necessidades de integracao com o ERP atual. Camila demonstrou interesse no modulo de automacao.",
  },
  {
    id: "a3",
    type: "meeting",
    icon: Video,
    iconColor: "text-violet-600",
    title: "Reuniao online - Demo do produto",
    date: "01/04/2026 - 15:00",
    description:
      "Demo realizada para Camila e equipe tecnica. Boa receptividade. Solicitaram proposta formal.",
  },
  {
    id: "a4",
    type: "whatsapp",
    icon: MessageCircle,
    iconColor: "text-emerald-600",
    title: "Mensagem via WhatsApp",
    date: "28/03/2026 - 09:45",
    description:
      "Confirmacao de horario para demo. Camila informou que participarao mais 2 pessoas da equipe.",
  },
  {
    id: "a5",
    type: "form",
    icon: FileText,
    iconColor: "text-amber-600",
    title: "Formulario preenchido - Solicitar Demo",
    date: "25/03/2026 - 16:20",
    description:
      "Lead capturado via formulario do site. Interesse em automacao de vendas e integracao com CRM.",
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
      "Ola Camila, conforme conversamos, segue em anexo a proposta comercial para o pacote Enterprise...",
  },
  {
    id: "i2",
    channel: "Telefone",
    icon: PhoneCall,
    iconColor: "text-green-600",
    direction: "Realizada",
    subject: "Ligacao de follow-up",
    date: "03/04/2026 - 10:15",
    preview:
      "Duracao: 12 min. Discutimos integracao com ERP e timeline de implementacao.",
  },
  {
    id: "i3",
    channel: "Video",
    icon: Video,
    iconColor: "text-violet-600",
    direction: "Realizada",
    subject: "Demo do produto - Equipe Tech Solutions",
    date: "01/04/2026 - 15:00",
    preview:
      "Participantes: Camila Ferreira, Rafael Lima, Julia Santos. Demo completa do modulo de vendas.",
  },
  {
    id: "i4",
    channel: "WhatsApp",
    icon: MessageCircle,
    iconColor: "text-emerald-600",
    direction: "Recebido",
    subject: "Confirmacao de horario",
    date: "28/03/2026 - 09:45",
    preview:
      "Oi, tudo bem? Confirmando a demo para terca as 15h. Vao participar mais 2 pessoas da equipe.",
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
      "Ola Camila! Vi que voce se interessou pela nossa solucao. Podemos agendar uma conversa?",
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
      "Ola Camila, obrigado pelo interesse! Recebemos sua solicitacao de demo e entraremos em contato.",
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
    name: "Tech Solutions - Modulo Automacao",
    pipeline: "Upsell",
    stage: "Negociacao",
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
      "Camila tem urgencia para fechar ate fim de abril. Orcamento ja aprovado pela diretoria. Oferecer desconto de 10% se fechar nesta semana.",
  },
  {
    id: "n2",
    author: "Juliana Martins",
    date: "01/04/2026 - 16:30",
    content:
      "Demo foi muito bem recebida. Time tecnico ficou impressionado com as integracoes. Principal preocupacao: migracao de dados do sistema legado.",
  },
  {
    id: "n3",
    author: "Ricardo Mendes",
    date: "28/03/2026 - 10:00",
    content:
      "Primeiro contato via WhatsApp. Camila e decisora final. Empresa usa atualmente planilhas para gestao de vendas. Dor principal: falta de visibilidade do funil.",
  },
  {
    id: "n4",
    author: "Juliana Martins",
    date: "25/03/2026 - 17:00",
    content:
      "Lead qualificado via formulario do site. Perfil ideal: empresa de tecnologia, 50-200 funcionarios, decisora C-level. Prioridade alta.",
  },
]

const dealStatusColors: Record<string, string> = {
  Aberto: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Ganho: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Perdido: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export function ContactDetailPage() {
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
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary text-lg">{contact.avatar}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-gradient text-2xl font-bold tracking-tight">
              {contact.name}
            </h2>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
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
          <Button variant="outline" className="transition-all duration-200 hover:border-primary/30">
            <Send className="size-4" />
            Enviar Email
          </Button>
          <Button className="btn-lift bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/20">
            <Calendar className="size-4" />
            Agendar Reuniao
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="animate-card-in stagger-1 card-hover shadow-lg shadow-primary/[0.03] border-gradient">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lead Score</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-primary text-white shadow-sm">
              <Sparkles className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">{contact.score}</div>
              <Badge className="bg-gradient-to-r from-violet-500/10 to-primary/10 text-violet-700 dark:text-violet-300 text-[10px] border-violet-200 dark:border-violet-800">
                <Sparkles className="mr-1 size-2.5" />
                Powered by AI
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">+12 pontos este mes</p>
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
                  <span>3 interacoes em 10 dias +18pts</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <div className="size-1.5 rounded-full bg-blue-500" />
                  <span>Pediu proposta formal +15pts</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-card-in stagger-2 card-hover shadow-lg shadow-primary/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Deals Ativos</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-violet-500/10">
              <Target className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contact.dealsCount}</div>
            <p className="text-xs text-muted-foreground">
              1 em negociacao, 1 proposta
            </p>
          </CardContent>
        </Card>
        <Card className="animate-card-in stagger-3 card-hover shadow-lg shadow-primary/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-violet-500/10">
              <DollarSign className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contact.totalValue}</div>
            <p className="text-xs text-muted-foreground">
              Em todos os deals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="animate-card-in stagger-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visao Geral</TabsTrigger>
          <TabsTrigger value="interactions">Interacoes</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
        </TabsList>

        {/* Visao Geral Tab */}
        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="flex items-center gap-3 rounded-xl border-gradient glass px-4 py-3 shadow-sm animate-card-in">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-primary text-white shadow-sm">
              <Sparkles className="size-4 animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">Recomendacao da IA</span>
                <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>
              </div>
              <p className="text-[11px] text-muted-foreground">Melhor horario para contato: Ter/Qui 10h-12h · Probabilidade de conversao: 72% · Proximo passo: Enviar proposta formal com desconto 15%</p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informacoes do Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estagio do Ciclo de Vida
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                  >
                    {contact.stage}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Origem</span>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Globe className="size-3.5 text-blue-600" />
                    {contact.source}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tags</span>
                  <div className="flex gap-1.5">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="size-2.5" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="mb-2 text-sm font-medium">Campos Personalizados</p>
                  <div className="space-y-2">
                    {Object.entries(contact.customFields).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">{key}</span>
                          <span>{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/5 to-violet-500/5 ring-4 ring-background">
                          <activity.icon
                            className={`size-4 ${activity.iconColor}`}
                          />
                        </div>
                        {index < activities.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium leading-snug">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
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

        {/* Interacoes Tab */}
        <TabsContent value="interactions" className="space-y-4 pt-4">
          {interactions.map((interaction) => (
            <Card key={interaction.id} className="card-hover transition-all duration-200">
              <CardContent className="flex items-start gap-4 pt-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
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
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {interaction.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {interaction.preview}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals" className="pt-4">
          <div className="rounded-xl border bg-card ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Deal</TableHead>
                  <TableHead>Pipeline</TableHead>
                  <TableHead>Estagio</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.name}</TableCell>
                    <TableCell className="text-muted-foreground">
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
            <Button className="btn-lift bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/20">
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
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary text-[10px]">
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
