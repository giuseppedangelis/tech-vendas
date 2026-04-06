import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  BarChart3,
  Users,
  Share2,
  Repeat,
  TrendingDown,
  TrendingUp,
  DollarSign,
  ArrowRightLeft,
} from "lucide-react"

// --- Funil data ---
const funnelData = [
  { stage: "Novos Leads", count: 320, color: "hsl(var(--chart-1))" },
  { stage: "Qualificados", count: 210, color: "hsl(var(--chart-2))" },
  { stage: "Proposta", count: 125, color: "hsl(var(--chart-3))" },
  { stage: "Negociacao", count: 78, color: "hsl(var(--chart-4))" },
  { stage: "Fechados", count: 42, color: "hsl(var(--chart-5))" },
]

const conversionRates = [
  { from: "Novos Leads", to: "Qualificados", rate: 65.6 },
  { from: "Qualificados", to: "Proposta", rate: 59.5 },
  { from: "Proposta", to: "Negociacao", rate: 62.4 },
  { from: "Negociacao", to: "Fechados", rate: 53.8 },
]

const lossReasons = [
  { name: "Preco alto", value: 35, color: "#ef4444" },
  { name: "Concorrencia", value: 25, color: "#f97316" },
  { name: "Sem resposta", value: 20, color: "#eab308" },
  { name: "Timing ruim", value: 12, color: "#6366f1" },
  { name: "Sem fit", value: 8, color: "#8b5cf6" },
]

// --- Time data ---
const sellerRanking = [
  { name: "Rafael Silva", deals: 52, revenue: "R$ 156.000", conversion: 31.0, rank: 1 },
  { name: "Carlos Eduardo", deals: 45, revenue: "R$ 135.000", conversion: 28.5, rank: 2 },
  { name: "Juliana Santos", deals: 41, revenue: "R$ 123.000", conversion: 22.8, rank: 3 },
  { name: "Ana Beatriz", deals: 38, revenue: "R$ 114.000", conversion: 25.2, rank: 4 },
  { name: "Pedro Henrique", deals: 15, revenue: "R$ 45.000", conversion: 9.5, rank: 5 },
]

const sellerRevenueChart = [
  { name: "Rafael S.", receita: 156000 },
  { name: "Carlos E.", receita: 135000 },
  { name: "Juliana S.", receita: 123000 },
  { name: "Ana B.", receita: 114000 },
  { name: "Pedro H.", receita: 45000 },
]

// --- Atribuicao data ---
const sourceData = [
  { source: "WhatsApp", percentage: 45, leads: 144, color: "#25d366" },
  { source: "Instagram", percentage: 25, leads: 80, color: "#e1306c" },
  { source: "Formulario", percentage: 20, leads: 64, color: "#3b82f6" },
  { source: "Manual", percentage: 10, leads: 32, color: "#8b5cf6" },
]

const sourcePieData = sourceData.map((s) => ({
  name: s.source,
  value: s.percentage,
  color: s.color,
}))

function FunnelBarChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={funnelData} barSize={48}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="stage"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--popover-foreground))",
          }}
        />
        <Bar dataKey="count" name="Leads" radius={[4, 4, 0, 0]}>
          {funnelData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function LossReasonsChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={lossReasons}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {lossReasons.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--popover-foreground))",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

function SellerRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={sellerRevenueChart} barSize={48}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="name"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--popover-foreground))",
          }}
          formatter={(value) =>
            `R$ ${Number(value).toLocaleString("pt-BR")}`
          }
        />
        <Bar
          dataKey="receita"
          name="Receita"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

function SourcePieChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={sourcePieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {sourcePieData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--popover-foreground))",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

function FunnelTab() {
  return (
    <div className="space-y-6">
      <Card className="animate-card-in border-t-2 border-t-primary/20">
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
          <CardDescription>
            Volume de leads por estagio do funil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FunnelBarChart />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-card-in">
          <CardHeader>
            <CardTitle className="text-base">Taxas de Conversao</CardTitle>
            <CardDescription>
              Conversao entre estagios do funil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionRates.map((cr) => (
                <div key={cr.from} className="flex items-center justify-between transition-all duration-200 hover:bg-primary/[0.03] rounded-lg px-2 py-1.5 -mx-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{cr.from}</span>
                    <ArrowRightLeft className="size-3 text-muted-foreground" />
                    <span>{cr.to}</span>
                  </div>
                  <Badge variant="secondary">{cr.rate}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-card-in">
          <CardHeader>
            <CardTitle className="text-base">Motivos de Perda</CardTitle>
            <CardDescription>
              Principais razoes de perda de deals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LossReasonsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TimeTab() {
  return (
    <div className="space-y-6">
      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle>Ranking de Vendedores</CardTitle>
          <CardDescription>
            Classificacao por numero de deals fechados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead className="text-right">Deals</TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-right">Conversao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerRanking.map((seller) => (
                <TableRow key={seller.name} className="transition-all duration-200 hover:bg-primary/[0.03]">
                  <TableCell>
                    <Badge
                      variant={seller.rank <= 3 ? "default" : "secondary"}
                      className={
                        seller.rank === 1
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 shadow-sm shadow-amber-500/30"
                          : seller.rank === 2
                          ? "bg-slate-400/10 text-slate-600 dark:text-slate-300"
                          : seller.rank === 3
                          ? "bg-orange-500/10 text-orange-700 dark:text-orange-400"
                          : ""
                      }
                    >
                      {seller.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{seller.name}</TableCell>
                  <TableCell className="text-right">{seller.deals}</TableCell>
                  <TableCell className="text-right">{seller.revenue}</TableCell>
                  <TableCell className="text-right">{seller.conversion}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle>Receita por Vendedor</CardTitle>
          <CardDescription>
            Comparativo de receita gerada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SellerRevenueChart />
        </CardContent>
      </Card>
    </div>
  )
}

function AtribuicaoTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sourceData.map((source, index) => (
          <Card key={source.source} className={`card-hover animate-card-in stagger-${index + 1}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {source.source}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{source.percentage}%</div>
              <p className="text-xs text-muted-foreground">
                {source.leads} leads originados
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${source.percentage}%`,
                    backgroundColor: source.color,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-card-in">
          <CardHeader>
            <CardTitle className="text-base">Distribuicao por Fonte</CardTitle>
            <CardDescription>
              Origem dos leads no periodo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SourcePieChart />
          </CardContent>
        </Card>

        <Card className="animate-card-in">
          <CardHeader>
            <CardTitle className="text-base">Rastreamento UTM</CardTitle>
            <CardDescription>
              Acompanhamento de campanhas por UTM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-orange-500/10 mx-auto mb-3">
                  <Share2 className="size-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rastreamento UTM
                </p>
                <p className="text-xs text-muted-foreground">
                  Configure parametros UTM nas suas campanhas para rastrear a
                  origem dos leads.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RecorrenciaTab() {
  const metrics = [
    {
      title: "MRR",
      value: "R$ 87.450",
      description: "Receita Recorrente Mensal",
      change: "+12.3%",
      up: true,
      icon: DollarSign,
    },
    {
      title: "ARR",
      value: "R$ 1.049.400",
      description: "Receita Recorrente Anual",
      change: "+15.1%",
      up: true,
      icon: TrendingUp,
    },
    {
      title: "Churn",
      value: "3.2%",
      description: "Taxa de cancelamento mensal",
      change: "-0.8%",
      up: false,
      icon: TrendingDown,
    },
    {
      title: "Recompra",
      value: "28%",
      description: "Taxa de recompra dos clientes",
      change: "+3.5%",
      up: true,
      icon: Repeat,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={metric.title} className={`card-hover animate-card-in stagger-${index + 1}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 pt-1">
                <Badge
                  variant="secondary"
                  className={
                    metric.up
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                  }
                >
                  {metric.change}
                </Badge>
                <span className="text-xs text-muted-foreground">vs. mes anterior</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle>Evolucao do MRR</CardTitle>
          <CardDescription>
            Historico de receita recorrente mensal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-orange-500/10 mx-auto mb-3">
                <BarChart3 className="size-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Grafico de evolucao do MRR disponivel em breve
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ReportsPage() {
  return (
    <div className="animate-page-in space-y-6">
      <div>
        <h2 className="text-gradient text-2xl font-bold tracking-tight">Relatorios</h2>
        <p className="text-muted-foreground">
          Relatorios detalhados de vendas, equipe e conversao
        </p>
      </div>

      <Tabs defaultValue="funil">
        <TabsList>
          <TabsTrigger value="funil">
            <BarChart3 className="mr-1.5 size-4" />
            Funil
          </TabsTrigger>
          <TabsTrigger value="time">
            <Users className="mr-1.5 size-4" />
            Time
          </TabsTrigger>
          <TabsTrigger value="atribuicao">
            <Share2 className="mr-1.5 size-4" />
            Atribuicao
          </TabsTrigger>
          <TabsTrigger value="recorrencia">
            <Repeat className="mr-1.5 size-4" />
            Recorrencia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funil" className="pt-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Analise detalhada do funil de vendas
          </p>
          <FunnelTab />
        </TabsContent>

        <TabsContent value="time" className="pt-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Performance da equipe de vendas
          </p>
          <TimeTab />
        </TabsContent>

        <TabsContent value="atribuicao" className="pt-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Origem e atribuicao de leads
          </p>
          <AtribuicaoTab />
        </TabsContent>

        <TabsContent value="recorrencia" className="pt-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Metricas de recorrencia e churn
          </p>
          <RecorrenciaTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
