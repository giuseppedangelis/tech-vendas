import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Upload,
  UserPlus,
  MessageCircle,
  Aperture,
  FileText,
  PenLine,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

type LifecycleStage = "Lead" | "MQL" | "SQL" | "Oportunidade" | "Cliente"
type Source = "WhatsApp" | "Instagram" | "Formulario" | "Manual"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  source: Source
  stage: LifecycleStage
  score: number
  createdAt: string
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Ana Carolina Silva",
    email: "ana.silva@email.com",
    phone: "+55 11 98765-4321",
    source: "WhatsApp",
    stage: "Lead",
    score: 25,
    createdAt: "2026-04-01",
  },
  {
    id: "2",
    name: "Bruno Oliveira Santos",
    email: "bruno.santos@empresa.com.br",
    phone: "+55 21 97654-3210",
    source: "Instagram",
    stage: "MQL",
    score: 52,
    createdAt: "2026-03-28",
  },
  {
    id: "3",
    name: "Camila Rodrigues Ferreira",
    email: "camila.ferreira@tech.io",
    phone: "+55 31 96543-2109",
    source: "Formulario",
    stage: "SQL",
    score: 78,
    createdAt: "2026-03-25",
  },
  {
    id: "4",
    name: "Diego Almeida Costa",
    email: "diego.costa@startup.com",
    phone: "+55 41 95432-1098",
    source: "Manual",
    stage: "Oportunidade",
    score: 85,
    createdAt: "2026-03-20",
  },
  {
    id: "5",
    name: "Fernanda Barbosa Lima",
    email: "fernanda.lima@corp.com.br",
    phone: "+55 51 94321-0987",
    source: "WhatsApp",
    stage: "Cliente",
    score: 92,
    createdAt: "2026-03-15",
  },
  {
    id: "6",
    name: "Gustavo Pereira Souza",
    email: "gustavo.souza@digital.com",
    phone: "+55 61 93210-9876",
    source: "Instagram",
    stage: "Lead",
    score: 18,
    createdAt: "2026-04-03",
  },
  {
    id: "7",
    name: "Helena Martins Rocha",
    email: "helena.rocha@agencia.com.br",
    phone: "+55 71 92109-8765",
    source: "Formulario",
    stage: "MQL",
    score: 45,
    createdAt: "2026-03-30",
  },
  {
    id: "8",
    name: "Igor Nascimento Dias",
    email: "igor.dias@consultoria.com",
    phone: "+55 81 91098-7654",
    source: "WhatsApp",
    stage: "SQL",
    score: 67,
    createdAt: "2026-03-22",
  },
  {
    id: "9",
    name: "Juliana Teixeira Gomes",
    email: "juliana.gomes@varejo.com.br",
    phone: "+55 85 90987-6543",
    source: "Manual",
    stage: "Oportunidade",
    score: 73,
    createdAt: "2026-03-18",
  },
  {
    id: "10",
    name: "Kaio Rezende Pinto",
    email: "kaio.pinto@fintech.io",
    phone: "+55 48 99876-5432",
    source: "Instagram",
    stage: "Cliente",
    score: 95,
    createdAt: "2026-03-10",
  },
  {
    id: "11",
    name: "Larissa Moreira Cunha",
    email: "larissa.cunha@saude.com.br",
    phone: "+55 19 98765-4320",
    source: "Formulario",
    stage: "Lead",
    score: 30,
    createdAt: "2026-04-02",
  },
  {
    id: "12",
    name: "Marcos Vieira Araujo",
    email: "marcos.araujo@industria.com",
    phone: "+55 27 97654-3219",
    source: "WhatsApp",
    stage: "MQL",
    score: 58,
    createdAt: "2026-03-27",
  },
  {
    id: "13",
    name: "Natalia Cardoso Mendes",
    email: "natalia.mendes@educacao.com.br",
    phone: "+55 62 96543-2108",
    source: "Manual",
    stage: "SQL",
    score: 70,
    createdAt: "2026-03-24",
  },
  {
    id: "14",
    name: "Pedro Henrique Lopes",
    email: "pedro.lopes@logistica.com",
    phone: "+55 92 95432-1097",
    source: "Instagram",
    stage: "Oportunidade",
    score: 82,
    createdAt: "2026-03-19",
  },
  {
    id: "15",
    name: "Rafaela Duarte Campos",
    email: "rafaela.campos@midia.com.br",
    phone: "+55 47 94321-0986",
    source: "Formulario",
    stage: "Cliente",
    score: 88,
    createdAt: "2026-03-12",
  },
]

const stageColors: Record<LifecycleStage, string> = {
  Lead: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  MQL: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  SQL: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  Oportunidade:
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  Cliente:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
}

const sourceIcons: Record<Source, React.ReactNode> = {
  WhatsApp: <MessageCircle className="size-3.5 text-green-600" />,
  Instagram: <Aperture className="size-3.5 text-pink-600" />,
  Formulario: <FileText className="size-3.5 text-blue-600" />,
  Manual: <PenLine className="size-3.5 text-gray-600" />,
}

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 shadow-sm shadow-emerald-500/20"
  if (score >= 50) return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
  return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
}

function getInitials(name: string): string {
  const parts = name.split(" ")
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function ContactsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("Todos")
  const [sourceFilter, setSourceFilter] = useState("Todos")

  const filtered = contacts.filter((c) => {
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)

    const matchesStage = stageFilter === "Todos" || c.stage === stageFilter
    const matchesSource = sourceFilter === "Todos" || c.source === sourceFilter

    return matchesSearch && matchesStage && matchesSource
  })

  return (
    <div className="animate-page-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-gradient text-2xl font-bold tracking-tight">Contatos</h2>
          <p className="text-muted-foreground">
            Gerencie seus contatos e leads
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="transition-all duration-200 hover:border-primary/30">
            <Upload className="size-4" />
            Importar CSV
          </Button>
          <Button className="btn-lift bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/20">
            <UserPlus className="size-4" />
            Novo Contato
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Busca por nome, email ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todas as origens</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Formulario">Formulario</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={stageFilter} onValueChange={setStageFilter}>
          <TabsList>
            <TabsTrigger value="Todos">Todos</TabsTrigger>
            <TabsTrigger value="Lead">Lead</TabsTrigger>
            <TabsTrigger value="MQL">MQL</TabsTrigger>
            <TabsTrigger value="SQL">SQL</TabsTrigger>
            <TabsTrigger value="Oportunidade">Oportunidade</TabsTrigger>
            <TabsTrigger value="Cliente">Cliente</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <div className="animate-card-in stagger-1 rounded-xl border bg-card shadow-lg shadow-primary/[0.03] ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Estagio</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum contato encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((contact) => (
                <TableRow
                  key={contact.id}
                  className="cursor-pointer transition-all duration-200 hover:bg-primary/[0.03]"
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary text-[10px]">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{contact.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.phone}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {sourceIcons[contact.source]}
                      <span className="text-muted-foreground">
                        {contact.source}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={stageColors[contact.stage]}
                    >
                      {contact.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getScoreColor(contact.score)}
                    >
                      {contact.score}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando 1-{filtered.length} de 127 contatos
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="transition-all duration-200">
            <ChevronLeft className="size-4" />
            Anterior
          </Button>
          <Button variant="outline" size="sm" className="transition-all duration-200">
            Proximo
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
