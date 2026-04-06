**CHECKLIST \- DOSSIÊ DO PROJETO**  
*Quando não tiver informação concreta, escreva “NDA”.*

1. Nome: Tech Vendas Pro  
2. Contexto: O objetivo declarado de Netto é construir uma Plataforma de Gestão Comercial completa: o CRM alimenta um PDI do vendedor, retroalimenta o marketing com dados de origem/atribuição, e se conecta a um marketplace de talentos onde closers são avaliados, contratados e integrados ao produto com base em seu histórico de performance.  
     
3. Link das referências em ordem de importância:  
   1. Creatio \-\> [https://www.creatio.com/?activity=adwords\_brand\_latam\&utm\_term=creatio\&utm\_campaign=google-brand\&gbraid=0AAAAADqObVwYVq6LGDqZolVscg1zntxXb\&gclid=CjwKCAjw687NBhB4EiwAQ645drjI7YZyUGkAq73ymVES2kV0q-dCLzpuTeL4NjqnPwOIe-OgBqxd5hoC1MQQAvD\_BwE](https://www.creatio.com/?activity=adwords_brand_latam&utm_term=creatio&utm_campaign=google-brand&gbraid=0AAAAADqObVwYVq6LGDqZolVscg1zntxXb&gclid=CjwKCAjw687NBhB4EiwAQ645drjI7YZyUGkAq73ymVES2kV0q-dCLzpuTeL4NjqnPwOIe-OgBqxd5hoC1MQQAvD_BwE)  
        
4. Explicação do motivo da referência: O Creatio é um CRM IA First com interface moderna. O principal atributo de inspiração é a interface, que pode ter um amostral acesso aqui: [https://www.creatio.com/s3/files/styles/webp/public/pages/front/screen-v.3@2x.jpg.webp](https://www.creatio.com/s3/files/styles/webp/public/pages/front/screen-v.3@2x.jpg.webp)

5. Bônus com mentoria do Bruno Okamoto:  
   1. \[  \] Sim  
   2. \[X\] Não  
6. Softwares existentes a serem utilizados como insumo de desenvolvimento:  
   1. SmartZap  
   2. NossoCRM  
   3. Cockpit  
   4. JobsPro

   

7. Responsabilidade da Dizevolv  
   1. \[X\] Desenvolvimento do zero  
      1. **ENTREGÁVEIS:**   
           
   2. \[X\] Desenvolvimento a partir de código “legado”/já existente  
      1. **ENTREGÁVEIS:**   
           
   3. \[  \] Desenvolvimento a partir de consumo de API de outro software  
      1. **ENTREGÁVEIS:**   
           
   4. \[X\] Desenvolvimento \+ Unificação e melhoria de softwares já existentes  
      1. **ENTREGÁVEIS:**   
           
   5. \[  \] Desenvolvimento \+ Unificação de softwares já existentes  
      1. **ENTREGÁVEIS:**   
           
   6. \[  \] Desenvolvimento a partir de projeto feito no Lovable  
      1. **ENTREGÁVEIS:**   
           
   7. \[  \] Auditoria de segurança \+ Unificação de Softwares  
      1. **ENTREGÁVEIS:** 

      

8. Definição se é **\[Clone absoluto ou clone \+ melhorias\]** de determinado software  
   1. \[  \] Clone absoluto   
   2. \[  \] Clone \+ melhorias  
   3. \[X\] NDA

9. Tipo de escopo contratado  
   1. \[  \] Fechado  
   2. \[X\] Flexível

10. Formato  
    1. \[  \] Web  
    2. \[X\] Web \+ mobile responsivo  
    3. \[  \] Web \+ mobile offline  
    4. \[  \] Web \+ Mobile online  
         
11. Publicação em Lojas?  
    1. \[  \] SIM  
    2. \[X\] Não  
         
12. Lojas para publicação?  
    1. \[  \] Play Store  
    2. \[  \] App Store

13. Software Interno ou SaaS?  
    1. \[X\] SaaS  
    2. \[  \] Interno

14. SaaS em formato White Label?  
    1. \[X\] SIM  
    2. \[  \] Não

    

15. Qual o OUTPUT principal do Software:   
    

**Decisões comerciais executadas com maior velocidade e precisão, pelo closer, pelo gestor e pela IA, em cada etapa do funil de vendas.**

Mais concretamente, o software entrega:

**Para o Closer:** a próxima ação mais inteligente, qual lead abordar agora (Lead Lock \+ Score), o que responder (IA Copilot com metodologia DEF), e quando agir (agenda \+ alertas de no-show).

**Para o Gestor:** visibilidade total da operação em tempo real, quem está convertendo, onde os leads estão travando, qual origem está gerando receita, e quem precisa de intervenção.

**Para a Operação como um todo:** um funil comercial que se move sozinho, cards que avançam por triggers automáticos (pagamento, agendamento, resposta), sem depender de input manual do vendedor.

16. APIs necessárias:   
    

Cada decisão técnica abaixo foi tomada com base nos requisitos de volume (8M+ conversas/mês), escalabilidade horizontal e custo-benefício para o estágio atual do produto.

| Funcionalidade | Solução / API | Custo Estimado | Justificativa |
| :---- | :---- | :---- | :---- |
| WhatsApp Mensageria | Meta WhatsApp Business API (oficial) | por conversa (variável Meta) | API oficial garantida pela Meta, compatível com alta volumetria, suporte a multi-número e templates HSM. Único caminho para escalar sem risco de ban. |
| Fila de Mensagens | RabbitMQ \+ Redis | Open Source | RabbitMQ para filas paralelas de processamento; Redis para metadados leves e sessões ativas. Arquitetura que elimina o gargalo atual de travamento de front. |
| Banco de Dados Principal | PostgreSQL (híbrido) | Open Source | PostgreSQL para dados estruturados; Redis para cache de filas ativas. Banco híbrido garante leitura rápida sem sobrecarregar o banco relacional. |
| VOIP Embarcado | Twilio Voice API ou Vonage | \~$0.013/min (Twilio) | APIs maduras com SDK para transcrição nativa. Twilio é referência para volume; Vonage é alternativa mais econômica. Escolha final após POC. |
| IA Copilot / Gestora | OpenAI GPT-4o / Claude API (Anthropic) | por token (variável) | Arquitetura multi-model: Claude para análise de conversas longas (janela de contexto maior); GPT-4o para sugestões em tempo real. Decisão final após benchmark interno. |
| Agenda | Google Calendar API (embed \+ sync) | Free tier generoso | Embed direto do Google Calendar eliminando reescrita de funcionalidade. Integração bidirecional: criação de evento no CRM reflete no Google e vice-versa. |
| Integrações de Pagamento | Webhooks nativos (Hotmart, Kiwify, Eduzz, Ticto, Guru, Pagarme) | Sem custo adicional | Webhook resolve 100% do caso de uso: receber eventos de compra, abandono de carrinho, assinatura. Não é necessário SDK proprietário de cada gateway. |
| E-mail Marketing | API/Webhook: ActiveCampaign, ConvertKit, Brevo | Conforme plano do cliente | Integração via webhook ao invés de desenvolvimento nativo. O cliente usa a plataforma de e-mail de sua escolha; o CRM envia os dados via evento. |
| Instagram Direct | ManyChat API (app no marketplace) | Conforme plano ManyChat | ManyChat já gerencia conversação no Instagram. A integração traz os dados para dentro do CRM sem reescrever o canal. Lançado como app no marketplace interno. |
| Front-end | React \+ PWA (mobile-first) | Open Source | PWA entrega experiência mobile sem custo de app store em fase 1\. App nativo iOS/Android planejado para fase 2\. |

17. Prazo final do primeiro escopo do projeto: 75 DIAS (Tudo abaixo, exceto os itens delimitados como “fase 2” ou “fase 3”.  
18. Primeiro escopo do projeto, etapa limitante e defasagens de tempo anexados ab aixo:

**O escopo inicial compreende:**

# **01\. Escopo do Produto — Módulos Principais**

O DEF CRM é estruturado em cinco módulos principais, integrados sob uma arquitetura AI-First. Cada módulo possui requisitos funcionais próprios, mas compartilham a camada de IA que une e potencializa todos eles.

| Módulo | Prioridade | Descrição Resumida |
| :---- | :---- | :---- |
| M1 | CRÍTICO — Largada | Mensageria Omnichannel (WhatsApp API Oficial \+ Instagram) |
| M2 | CRÍTICO — Largada | Pipeline / Kanban com automação de movimentação de cards |
| M3 | CRÍTICO — Largada | Agenda Integrada (Google Calendar embed \+ agendamentos nativos) |
| M4 | ALTO — Largada | Dashboard & Métricas (funil, performance, atribuição, RFM) |
| M5 | ALTO — Largada | IA Copilot (atendimento) \+ IA Gestora (analytics e insights) |
| M6 | MÉDIO — Fase 2 | Funil de CS \+ NPS/CSAT \+ Coleta de Depoimentos |
| M7 | MÉDIO — Fase 2 | Campanhas / Disparos Segmentados \+ Recuperação de Carrinho |
| M8 | FUTURO — Fase 3 | Marketplace de Talentos \+ PDI Automatizado \+ Ecossistema |

# **02\. Requisitos Funcionais Detalhados**

## **M1 — Mensageria Omnichannel**

Módulo central da operação. A VendaLíder opera com altíssima volumetria (até 8 milhões de conversas/mês com picos de lançamento adicionando 7M+ em semanas específicas). O módulo de mensageria atual trava o front-end do líder com 15+ vendedores em tela e não suporta filtragens em tempo real.

### **Requisitos Funcionais**

* Integração via WhatsApp Business API Oficial (Meta) — multi-número desde a largada (mín. 2 números: vendas e suporte)

* Suporte a templates pré-aprovados (HSM) e mensagens em janela de sessão aberta

* Atribuição automática de leads a closers com base em algoritmo (ver Seção 3.6)

* Registro de histórico completo de diálogo por contato, acessível no card do Kanban

* Fila de mensagens com processamento paralelo (arquitetura de filas — ver Seção 5\)

* Integração futura: Instagram Direct via ManyChat (app no marketplace interno)

* VOIP embarcado via API de mercado — chamadas com transcrição automática

* Tarefas nativas por atendimento (hoje inexistentes no white label)

## **M2 — Pipeline / Kanban**

O Kanban é o coração da operação comercial. Hoje ele não oferece visualização em funil, não move cards automaticamente e não permite views personalizadas por closer.

### **Requisitos Funcionais**

* Múltiplos pipelines independentes (ex: pré-qualificação, sessão estratégica, aplicação, vendas diretas)

* Movimentação automática de cards via triggers: interação WhatsApp, resposta de formulário, evento de pagamento (webhook), agendamento/reagendamento/cancelamento/no-show

* Personalização de campos visíveis no card — o closer define o que aparece na sua tela

* Views individuais por closer (referência: Close CRM)

* Webhook de entrada e saída por etapa do funil para integrações externas

* Visualização do pipeline em modo funil (vertical) com volumetria e taxa de passagem por etapa

* Sistema de Lead Scoring visível no card

* Dinâmica de Lead Lock: o closer visualiza apenas o lead com maior score até interagir com ele, então o próximo é desbloqueado — baseado na lógica de priorização de Close CRM

## **M3 — Agenda Integrada**

Hoje não existe nenhuma tela de agenda dentro do white label. O closer não consegue visualizar sua própria semana dentro da ferramenta.

### **Requisitos Funcionais**

* Embed do Google Calendar via API (visualização interativa — arrastar/mover reuniões)

* Tela nativa de agendamentos com filtros por closer, status e data

* Trigger de no-show: verificação automatizada por tempo \+ notificação ao closer para confirmação com 1 clique

* Lembrete de agenda com notificações in-app e mobile push

## **M4 — Dashboard & Métricas**

O módulo de relatórios atual é, nas palavras do próprio cliente, 'bem insipiente, não leva a lugar nenhum'. O novo dashboard precisa ser consultado diariamente por gestores e closers.

### **Dados de Funil Comercial**

* Visualização do funil com volumetria por fase, taxa de conversão e taxa de perda em cada etapa

* Motivos de perda categorizados (extraídos automaticamente pela IA a partir das interações)

* Tempo médio de permanência em cada etapa

### **Performance do Time**

* Ranking de vendedores por volume fechado, taxa de conversão e tempo médio de resposta (SLA)

* Produto com maior volume de vendas e por closer

* Análise de SLA de primeira resposta e SLA intermediário (gap atual crítico)

### **Atribuição e Origem**

* Captura de UTMs na entrada do lead (formulário ou webhook) — rastreamento de origem

* Atribuição ponta a ponta: criativo A → closer B → produto C → fechamento

* Análise RFM (Recência, Frequência, Monetário) — diferencial competitivo ausente em todos os CRMs pesquisados

### **Recorrência (para produtos de assinatura)**

* MRR, ARR, Churn, % de recompra — visões em tabs separadas no dashboard

## **M5 — Camada de IA**

A IA não é uma feature opcional — é a premissa arquitetural do produto. O DEF CRM nasce AI-First: toda a interface e toda a lógica de priorização parte do pressuposto de que existe inteligência processando dados em segundo plano.

### **IA Copilot — Atendimento**

* Leitura em tempo real da conversa de WhatsApp e chamadas

* Sugestão de resposta baseada na metodologia DEF (objeção detectada → sugestão contextualizada)

* Matriz de objeções dinâmica: a IA aprende com cada fechamento e alimenta a base de objeções do time

* Síntese automática de ligações: insights, próximos passos, movimentação de card

* Opção de seleção de metodologia: DEF (padrão), BANT, SPIN — matriz de escolha multi-framework

### **IA Gestora — Analytics**

* Sugestão proativa de indicadores com base nos dados disponíveis (o usuário não precisa saber o que é RFM para ter uma análise RFM)

* Análise de lead score automatizada — ordena a fila de leads por probabilidade de fechamento

* Detecção de padrões de perda e recomendação de ações corretivas

* Consolidação do input do vendedor: detectar agendamento numa conversa e mover o card automaticamente — eliminando o trabalho manual no funil

## **M6 — Funil de CS (Customer Success)**

Módulo de fase 2\. A jornada completa da plataforma é: Marketing → Vendas → CS. Quando uma venda é fechada, o card é clonado e inserido automaticamente no pipeline de CS.

* Funil dedicado ao pós-venda com etapas configuráveis

* Coleta automatizada de NPS e CSAT por gatilho de tempo ou milestone

* Módulo de depoimentos: captura, aprovação e armazenamento dentro do CRM

* Métricas de CS: tempo de primeira resposta, CSAT médio, churn por cohort

## **M7 — Campanhas e Disparos**

Módulo de fase 2\. Crítico para operações de low-ticket, lançamentos e reativação de base.

* Criação de segmentos dinâmicos por tag, campo personalizado, etapa do funil, UTM de origem

* Disparo manual e agendado de campanhas WhatsApp (templates HSM de utilidade e marketing)

* Automação de recuperação de carrinho para produtos low-ticket

* Importação de contatos via CSV

* Integração com plataformas de e-mail marketing: ActiveCampaign, ConvertKit, Brevo (via webhook/API — não desenvolvimento nativo)

**Aproveitamento de Códigos Existentes (Laudo Técnico)**

| Projeto | Nível de Reuso | Observação |
| ----- | ----- | ----- |
| **SmartZap** | Alto | Principalmente mensageria e filas |
| **NossoCRM** | Moderado | Services bons, mas RLS precisa ser refeito |
| **Cockpit** | Parcial | Cálculos OK, camada de actions será refatorada |
| **JobsPro** | Alto | Internalizar ao ecossistema |

**Etapa limitante e defagens de tempo:** *[https://drive.google.com/file/d/1G1BFLFfbpE3aDoK4Cgy9\_kXPcLCx05sw/view?usp=sharing*](https://drive.google.com/file/d/1G1BFLFfbpE3aDoK4Cgy9_kXPcLCx05sw/view?usp=sharing)  
