import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, GitBranch, Repeat, Users } from "lucide-react"

const tabs = [
  { value: "funil", label: "Funil", icon: GitBranch },
  { value: "atribuicao", label: "Atribuicao", icon: Users },
  { value: "rfm", label: "RFM", icon: BarChart3 },
  { value: "recorrencia", label: "Recorrencia", icon: Repeat },
]

export function DashboardAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Metricas Avancadas
        </h2>
        <p className="text-muted-foreground">
          Analise detalhada de metricas e KPIs do seu pipeline
        </p>
      </div>

      <Tabs defaultValue="funil">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon className="size-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <tab.icon className="size-5 text-muted-foreground" />
                  {tab.label}
                </CardTitle>
                <CardDescription>
                  Metricas detalhadas de {tab.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <tab.icon className="mx-auto size-12 text-muted-foreground/40" />
                    <p className="mt-4 text-lg font-medium text-muted-foreground">
                      Metricas Avancadas - Em breve
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground/70">
                      A analise de {tab.label.toLowerCase()} estara disponivel
                      na proxima atualizacao
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
