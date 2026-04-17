# Funcionalidades por Ator do Sistema — TechVendasPro

**Data:** 2026-04-14  
**Fonte:** gap_analysis.md + techvendaspro_modulos.md  
**Escopo:** 195 features do cliente × 5 perfis de acesso definidos

---

## Atores do Sistema

| Ator | Descrição | Acesso Principal |
|:---|:---|:---|
| **Empresário** | Dono do negócio, visão estratégica e KPIs financeiros | Dashboard executivo, metas, receita, MRR/ARR |
| **Líder Comercial** | Gestor de squads e closers, aprovação e coaching | Pipeline global, ranking, metas, aprovação OTES |
| **Closer (Vendedor)** | Responsável por fechar vendas e gerenciar oportunidades | Meu pipeline, inbox, agenda, copiloto IA |
| **SDR** | Prospecção ativa, qualificação de leads | Inbox, cadência de outreach, agendamento |
| **Admin** | Configuração técnica do workspace e integrações | Workspace, API keys, permissões, integrações |

---

## 1. Empresário

> Foco: Visão macro do negócio, receita, ROI e tomada de decisão estratégica

| # | Feature | Módulo | Status | RF/Origem | Observação |
|:---|:---|:---|:---|:---|:---|
| 097 | Resumo do pipeline vs meta do mês em linguagem natural | 06 · IA | ⚠️ PARCIAL | RF-043 | Sugestão proativa existe; meta vs realizado não explicitado |
| 098 | Projeção de fechamento do mês com base no pipeline atual | 06 · IA | ❌ GAP | — | Não mapeado |
| 101 | Dashboard executivo simplificado (receita, conversão, MRR) | 06 · IA | ⚠️ PARCIAL | RF-027/033 | RF-027 cobre funil; MRR/ARR em RF-033 |
| 102 | Resumo semanal em linguagem natural por WhatsApp ou email | 06 · IA | ❌ GAP | — | Não mapeado |
| 139 | KPIs do empresário: receita, vendas, ticket médio, conversão | 09 · Tracking | ⚠️ PARCIAL | RF-027 | KPIs financeiros como ticket médio não explicitados |
| 140 | Gráfico de receita no tempo com comparativo mensal | 09 · Tracking | ⚠️ PARCIAL | RF-027 | Comparativo mensal não detalhado |
| 151 | Painel meta vs realizado em tempo real por período | 10 · Planejamento | ❌ GAP | — | Módulo inteiro ausente |
| 152 | Alerta automático quando abaixo de X% da meta | 10 · Planejamento | ❌ GAP | — | |

### Resumo — Empresário

| Métrica | Valor |
|:---|:---|
| Total de features | 8 |
| ✅ Cobertas | 0 |
| ⚠️ Parciais | 5 |
| ❌ Gaps | 3 |
| **Cobertura** | **62% parcial** |

---

## 2. Líder Comercial

> Foco: Gestão de time, metas, aprovação, coaching e performance dos squads

| # | Feature | Módulo | Status | RF/Origem | Observação |
|:---|:---|:---|:---|:---|:---|
| 029 | Roteamento de oportunidade para vendedor do squad | 02 · CRM | ✅ COBERTO | RF-003 | Atribuição automática de leads a closers |
| 030 | Criar card em pipeline CS/Onboard ao ganhar venda | 02 · CRM | ⚠️ PARCIAL | RF-012 | Criação em outro pipeline não explicitada |
| 036 | Configurar framework de vendas por pipeline (SPIN, BANT, GPCT) | 02 · CRM | ⚠️ PARCIAL | RF-039 | Prioridade baixa na equipe, mas P1 no cliente |
| 093 | Sugestão de próxima ação por oportunidade (copiloto) | 06 · IA | ✅ COBERTO | RF-035/036 | Sugestão proativa de ações |
| 094 | Lista de leads quentes priorizados para contato hoje | 06 · IA | ⚠️ PARCIAL | RF-017 | Lead Lock existe; lista diária não explicitada |
| 095 | Alerta de oportunidades paradas (sem atividade em X dias) | 06 · IA | ❌ GAP | — | |
| 099 | Ranking de performance do time em tempo real | 06 · IA | ✅ COBERTO | RF-029 | Ranking de performance do time |
| 100 | Sugestão de ações para recuperar meta pelo copiloto | 06 · IA | ⚠️ PARCIAL | RF-043 | Recuperação de meta não específica |
| 141 | Performance individual de cada vendedor para o líder | 09 · Tracking | ✅ COBERTO | RF-029 | |
| 142 | Meta vs realizado por vendedor e squad para o líder | 09 · Tracking | ❌ GAP | — | Squads não mapeados como entidade |
| 147 | Definir meta anual global por produto e serviço | 10 · Planejamento | ❌ GAP | — | Módulo inteiro ausente |
| 148 | Dividir meta por produto com sazonalidade mensal configurável | 10 · Planejamento | ❌ GAP | — | |
| 149 | Distribuir meta por squad e vendedor (cascata) | 10 · Planejamento | ❌ GAP | — | |
| 150 | Visualização em árvore da cascata de metas | 10 · Planejamento | ❌ GAP | — | |
| 157 | Aprovação do líder antes de publicar folha ao vendedor | 11 · OTES | ❌ GAP | — | |
| 179 | Criar squads e atribuir líderes e pipelines | 15 · Admin | ❌ GAP | — | Squads não mapeados como entidade |

### Resumo — Líder Comercial

| Métrica | Valor |
|:---|:---|
| Total de features | 16 |
| ✅ Cobertas | 4 |
| ⚠️ Parciais | 5 |
| ❌ Gaps | 7 |
| **Cobertura** | **25% coberta + 31% parcial** |

---

## 3. Closer (Vendedor)

> Foco: Fechar vendas, gerenciar pipeline, responder leads, agendar reuniões

| # | Feature | Módulo | Status | RF/Origem | Observação |
|:---|:---|:---|:---|:---|:---|
| 018 | Cadastro de contato com campos padrão e customizados | 02 · CRM | ⚠️ PARCIAL | RF-019 | Cadastro base não explicitado |
| 020 | Timeline de atividades 360° por contato | 02 · CRM | ⚠️ PARCIAL | RF-004 | Timeline 360° é mais ampla que histórico de diálogo |
| 021 | LTV calculado automaticamente por contato | 02 · CRM | ❌ GAP | — | LTV não existe em nenhum RF |
| 022 | Importação de contatos via CSV | 02 · CRM | ❌ GAP | — | |
| 023 | Busca e filtros avançados de contatos | 02 · CRM | ⚠️ PARCIAL | RF-008 | Filtro na caixa de mensagens, não de contatos |
| 024 | Criação de múltiplos pipelines com estágios customizáveis | 02 · CRM | ✅ COBERTO | RF-011 | |
| 025 | Card de oportunidade com campos custom por pipeline | 02 · CRM | ✅ COBERTO | RF-019 | |
| 026 | Kanban view de oportunidades por estágio | 02 · CRM | ✅ COBERTO | RF-015 | |
| 027 | Lista view de oportunidades com filtros e ordenação | 02 · CRM | ❌ GAP | — | |
| 028 | Mover oportunidade entre estágios (drag-and-drop) | 02 · CRM | ⚠️ PARCIAL | RF-012 | RF-012 cobre via trigger, não drag-and-drop manual |
| 031 | Configurar ação ao ganhar ou perder oportunidade | 02 · CRM | ✅ COBERTO | RF-012 | |
| 032 | Regras de transição automática entre estágios | 02 · CRM | ✅ COBERTO | RF-012 | |
| 033 | Campos custom por tipo: texto, select, data, moeda, número | 02 · CRM | ✅ COBERTO | RF-019 | |
| 034 | Sistema de tags em contatos, oportunidades e conversas | 02 · CRM | ✅ COBERTO | RF-020 | |
| 035 | Score de lead calculado por regras configuráveis | 02 · CRM | ✅ COBERTO | RF-016 | |
| 037 | Perguntas do framework exibidas no card da oportunidade | 02 · CRM | ❌ GAP | — | |
| 042 | Conectar número via WABA (Business API oficial Meta) | 03 · Inbox | ✅ COBERTO | RF-001 | |
| 044 | Enviar e receber mensagens de texto, mídia e documentos | 03 · Inbox | ✅ COBERTO | RF-001 | Implícito |
| 045 | Status de entrega e leitura das mensagens WhatsApp | 03 · Inbox | ❌ GAP | — | |
| 048 | Unificar conversas de todos os canais no mesmo inbox | 03 · Inbox | ❌ GAP | — | Unified inbox não mapeado |
| 049 | Exibir dados do contato no sidepanel da conversa | 03 · Inbox | ❌ GAP | — | Sidepanel não mapeado |
| 050 | Mostrar oportunidades vinculadas ao contato no sidepanel | 03 · Inbox | ❌ GAP | — | |
| 051 | Mostrar LTV e histórico de transações no sidepanel | 03 · Inbox | ❌ GAP | — | |
| 052 | Ações rápidas da conversa: criar tarefa, oportunidade ou reunião | 03 · Inbox | ⚠️ PARCIAL | RF-005 | Criar oportunidade/reunião não mapeado |
| 053 | Atribuir conversa a agente ou squad | 03 · Inbox | ✅ COBERTO | RF-003 | |
| 054 | Status de conversa: aberta, aguardando, resolvida | 03 · Inbox | ❌ GAP | — | |
| 055 | Filtros de inbox por canal, agente, status e tag | 03 · Inbox | ✅ COBERTO | RF-008 | |
| 056 | Respostas rápidas (canned responses) por canal | 03 · Inbox | ❌ GAP | — | |
| 078 | OAuth com Google Calendar | 05 · Calendário | ✅ COBERTO | RF-021 | |
| 079 | Sincronização bidirecional de eventos com Google Calendar | 05 · Calendário | ✅ COBERTO | RF-021 | |
| 080 | Link de agendamento público (tipo Calendly) por usuário | 05 · Calendário | ✅ COBERTO | RF-026 | |
| 081 | Configurar disponibilidade e horários por usuário | 05 · Calendário | ⚠️ PARCIAL | RF-026 | Não detalhada |
| 082 | Confirmação e lembrete automático de reunião por WhatsApp | 05 · Calendário | ✅ COBERTO | RF-024 | |
| 086 | Criar reunião a partir do card de oportunidade | 05 · Calendário | ❌ GAP | — | |
| 087 | Histórico de reuniões na timeline do contato | 05 · Calendário | ⚠️ PARCIAL | RF-004 | |
| 089 | Score calculado automaticamente em tempo real | 06 · IA | ✅ COBERTO | RF-040 | |
| 090 | Exibir score no card de oportunidade, lista e inbox | 06 · IA | ✅ COBERTO | RF-016 | |
| 091 | Alerta quando lead atinge threshold de score configurado | 06 · IA | ❌ GAP | — | |
| 092 | Decay automático de score por inatividade do lead | 06 · IA | ❌ GAP | — | |
| 093 | Sugestão de próxima ação por oportunidade (copiloto) | 06 · IA | ✅ COBERTO | RF-035/036 | |
| 096 | Sugestão de mensagem de follow-up baseada no histórico | 06 · IA | ✅ COBERTO | RF-036 | |
| 144 | Minha meta do mês e progresso em tempo real (closer) | 09 · Tracking | ❌ GAP | — | |
| 145 | Lista de tarefas do dia e leads prioritários (closer) | 09 · Tracking | ❌ GAP | — | |

### Resumo — Closer

| Métrica | Valor |
|:---|:---|
| Total de features | 42 |
| ✅ Cobertas | 18 |
| ⚠️ Parciais | 9 |
| ❌ Gaps | 15 |
| **Cobertura** | **43% coberta + 21% parcial** |

---

## 4. SDR

> Foco: Prospecção ativa, qualificação de leads, cadência de outreach, agendamento de reuniões para closers

| # | Feature | Módulo | Status | RF/Origem | Observação |
|:---|:---|:---|:---|:---|:---|
| 029 | Roteamento de oportunidade para vendedor do squad | 02 · CRM | ✅ COBERTO | RF-003 | Atribuição automática de leads |
| 035 | Score de lead calculado por regras configuráveis | 02 · CRM | ✅ COBERTO | RF-016 | Lead Scoring |
| 042 | Conectar número via WABA (Business API oficial Meta) | 03 · Inbox | ✅ COBERTO | RF-001 | |
| 044 | Enviar e receber mensagens de texto, mídia e documentos | 03 · Inbox | ✅ COBERTO | RF-001 | |
| 053 | Atribuir conversa a agente ou squad | 03 · Inbox | ✅ COBERTO | RF-003 | |
| 055 | Filtros de inbox por canal, agente, status e tag | 03 · Inbox | ✅ COBERTO | RF-008 | |
| 056 | Respostas rápidas (canned responses) por canal | 03 · Inbox | ❌ GAP | — | |
| 078 | OAuth com Google Calendar | 05 · Calendário | ✅ COBERTO | RF-021 | |
| 080 | Link de agendamento público (tipo Calendly) por usuário | 05 · Calendário | ✅ COBERTO | RF-026 | |
| 082 | Confirmação e lembrete automático de reunião por WhatsApp | 05 · Calendário | ✅ COBERTO | RF-024 | |
| 089 | Score calculado automaticamente em tempo real | 06 · IA | ✅ COBERTO | RF-040 | |
| 090 | Exibir score no card de oportunidade, lista e inbox | 06 · IA | ✅ COBERTO | RF-016 | |
| 093 | Sugestão de próxima ação por oportunidade (copiloto) | 06 · IA | ✅ COBERTO | RF-035/036 | |
| 094 | Lista de leads quentes priorizados para contato hoje | 06 · IA | ⚠️ PARCIAL | RF-017 | Lista diária não explicitada |
| 096 | Sugestão de mensagem de follow-up baseada no histórico | 06 · IA | ✅ COBERTO | RF-036 | |
| 110 | Agente SDR pré-configurado para prospecção ativa via WhatsApp | 07 · AI Agent | ❌ GAP | — | Módulo inteiro ausente |
| 111 | Qualificação via perguntas do framework de vendas configurado | 07 · AI Agent | ❌ GAP | — | |
| 112 | Criar contato e oportunidade ao qualificar lead | 07 · AI Agent | ❌ GAP | — | |
| 113 | Agendar reunião automaticamente ao qualificar lead | 07 · AI Agent | ❌ GAP | — | |
| 114 | Agente de reativação para leads perdidos e inativos | 07 · AI Agent | ❌ GAP | — | |
| 115 | Sequência de mensagens configurável para recuperação | 07 · AI Agent | ❌ GAP | — | |
| 145 | Lista de tarefas do dia e leads prioritários (closer) | 09 · Tracking | ❌ GAP | — | Aplicável a SDR também |

### Resumo — SDR

| Métrica | Valor |
|:---|:---|
| Total de features | 22 |
| ✅ Cobertas | 13 |
| ⚠️ Parciais | 1 |
| ❌ Gaps | 8 |
| **Cobertura** | **59% coberta + 5% parcial** |

---

## 5. Admin

> Foco: Configuração do workspace, integrações, API keys, permissões, multi-tenancy, infraestrutura

| # | Feature | Módulo | Status | RF/Origem | Observação |
|:---|:---|:---|:---|:---|:---|
| 001 | Editor drag-and-drop de campos | 01 · Forms | ❌ GAP | — | Form builder não existe |
| 002 | Lógica condicional entre campos | 01 · Forms | ❌ GAP | — | |
| 003 | Steps e páginas múltiplas no form | 01 · Forms | ❌ GAP | — | |
| 004 | Preview em tempo real do form | 01 · Forms | ❌ GAP | — | |
| 005 | Validações customizadas por campo | 01 · Forms | ❌ GAP | — | |
| 010 | Script de pixel para embed em sites externos | 01 · Forms | ❌ GAP | — | |
| 016 | Biblioteca de templates de formulário | 01 · Forms | ❌ GAP | — | |
| 017 | Customização de tema, cores e logo do form | 01 · Forms | ❌ GAP | — | |
| 043 | Gerenciar múltiplos números WABA no mesmo workspace | 03 · Inbox | ✅ COBERTO | RF-010 | |
| 058 | Cadastro e envio de templates WABA aprovados | 03 · Inbox | ⚠️ PARCIAL | RF-001 | Cadastro e envio não detalhados |
| 059 | Aprovação de templates via Meta Business API na plataforma | 03 · Inbox | ❌ GAP | — | |
| 063 | Canvas drag-and-drop para montar flows de chatbot | 04 · Chatbot | ❌ GAP | — | Módulo inteiro ausente |
| 064–077 | Features restantes do Chatbot Builder (14 features) | 04 · Chatbot | ❌ GAP | — | |
| 074 | Associar flow a múltiplos números WABA | 04 · Chatbot | ❌ GAP | — | |
| 106 | Configurar persona, objetivo e instruções do agente de IA | 07 · AI Agent | ❌ GAP | — | Módulo inteiro ausente |
| 107 | Selecionar model provider e modelo (GPT-4o, Claude Sonnet) | 07 · AI Agent | ❌ GAP | — | |
| 108 | Adicionar ferramentas ao agente (consulta CRM, calendário, API) | 07 · AI Agent | ❌ GAP | — | |
| 109 | Testar agente em sandbox antes de publicar | 07 · AI Agent | ❌ GAP | — | |
| 116 | CRUD de API Keys por provider (OpenAI, Anthropic, Meta, Google) | 07 · AI Agent | ❌ GAP | — | |
| 117 | Criptografia de API Keys em repouso (AES-256) | 07 · AI Agent | ❌ GAP | — | |
| 118 | Criar automação com trigger + condições + ações encadeadas | 08 · Automações | ⚠️ PARCIAL | RF-012/018 | Motor genérico não explicitado |
| 119 | Ativar e desativar automação sem excluir | 08 · Automações | ❌ GAP | — | |
| 131 | Biblioteca de templates de automação prontos | 08 · Automações | ❌ GAP | — | |
| 132 | Script JS de pixel para instalar em qualquer site | 09 · Tracking | ❌ GAP | — | |
| 162 | Endpoints REST para contatos, oportunidades e deals | 12 · Integrações | ❌ GAP | — | API pública não mapeada |
| 163 | Autenticação via API Key com escopos de permissão | 12 · Integrações | ❌ GAP | — | |
| 164 | Documentação Swagger / OpenAPI interativa | 12 · Integrações | ❌ GAP | — | |
| 165 | MCP Server para integração com Claude e agentes de IA | 12 · Integrações | ❌ GAP | — | |
| 166 | Webhooks de saída configuráveis por evento do CRM | 12 · Integrações | ✅ COBERTO | RF-018 | |
| 167 | Webhooks de entrada com validação de assinatura HMAC | 12 · Integrações | ❌ GAP | — | |
| 168 | Log de envio e recebimento de webhooks com retry automático | 12 · Integrações | ❌ GAP | — | |
| 176 | Criação de workspace isolado por empresa (multi-tenant) | 15 · Admin | ✅ COBERTO | RNF-005 | RLS para isolamento total |
| 177 | Perfis de acesso: Empresário, Líder, Closer, SDR, Admin | 15 · Admin | ✅ COBERTO | RN-009 | |
| 178 | Permissões granulares por perfil e módulo | 15 · Admin | ✅ COBERTO | RN-009 | |
| 180 | Tela central de configuração de todas as integrações | 15 · Admin | ❌ GAP | — | |
| 181 | Status de cada integração: ativo, erro, desconectado | 15 · Admin | ❌ GAP | — | |
| 182 | Conectar números WABA via Meta Business Manager | 15 · Admin | ✅ COBERTO | RF-001/010 | |
| 184–195 | Features de fundação e infraestrutura (Sprint 0) | 15 · Admin | ✅/⚠️ | Sprint 0 | 12 features, maioria coberta |

### Resumo — Admin

| Métrica | Valor |
|:---|:---|
| Total de features | 47 |
| ✅ Cobertas | 11 |
| ⚠️ Parciais | 3 |
| ❌ Gaps | 33 |
| **Cobertura** | **23% coberta + 6% parcial** |

---

## Features Cross-Cutting (compartilhadas entre atores)

| # | Feature | Atores Envolvidos | Módulo | Status |
|:---|:---|:---|:---|:---|
| 006 | Criação automática de contato ao submeter form | Closer, SDR, Admin | 01 | ❌ GAP |
| 007 | Criação automática de oportunidade com pipeline configurável | Closer, Líder, Admin | 01 | ❌ GAP |
| 008 | Mapeamento de campos form → campos CRM | Closer, Admin | 01 | ❌ GAP |
| 048 | Unificar conversas de todos os canais no mesmo inbox | Closer, SDR | 03 | ❌ GAP |
| 049 | Exibir dados do contato no sidepanel da conversa | Closer, SDR | 03 | ❌ GAP |
| 050 | Mostrar oportunidades vinculadas ao contato no sidepanel | Closer, SDR | 03 | ❌ GAP |
| 052 | Ações rápidas: criar tarefa, oportunidade ou reunião | Closer, SDR | 03 | ⚠️ PARCIAL |
| 093 | Sugestão de próxima ação por oportunidade (copiloto) | Closer, SDR, Líder | 06 | ✅ COBERTO |
| 118 | Criar automação com trigger + condições + ações | Admin, Líder | 08 | ⚠️ PARCIAL |
| 127 | Ação: enviar mensagem WhatsApp ou email | Admin, Closer, SDR | 08 | ❌ GAP |
| 128 | Ação: criar oportunidade em outro pipeline | Admin, Líder | 08 | ❌ GAP |
| 129 | Ação: HTTP request para sistema externo | Admin | 08 | ❌ GAP |
| 135 | Capturar UTMs ao submeter formulário | Closer, SDR, Admin | 09 | ✅ COBERTO |
| 166 | Webhooks de saída configuráveis por evento | Admin, Líder | 12 | ✅ COBERTO |
| 179 | Criar squads e atribuir líderes e pipelines | Admin, Líder | 15 | ❌ GAP |

---

## Módulos Inteiros sem Cobertura (afetam todos os atores)

| Módulo | Features | Atores Mais Afetados | Esforço Estimado |
|:---|:---|:---|:---|
| 01 · Forms (Form Builder) | 17 | Admin, Closer, SDR | ~168h |
| 04 · Chatbot Builder | 15 | Admin, SDR, Closer | ~224h |
| 07 · AI Agent Builder | 12 | Admin, SDR | ~196h |
| 10 · Planejamento Comercial | 6 | Empresário, Líder | ~112h |
| 11 · Folha Comercial (OTES) | 6 | Líder, Admin | ~120h |
| 14 · Academy | 4 | Todos (onboarding/treinamento) | ~68h |
| **Total** | **60** | — | **~888h** |

---

## Resumo Consolidado por Ator

| Ator | Features | ✅ Cobertas | ⚠️ Parciais | ❌ Gaps | Cobertura Total |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Empresário** | 8 | 0 | 5 | 3 | 62% parcial |
| **Líder Comercial** | 16 | 4 | 5 | 7 | 56% (25% + 31%) |
| **Closer** | 42 | 18 | 9 | 15 | 64% (43% + 21%) |
| **SDR** | 22 | 13 | 1 | 8 | 64% (59% + 5%) |
| **Admin** | 47 | 11 | 3 | 33 | 30% (23% + 6%) |

---

## Insights e Recomendações

### 1. SDR é o ator com melhor cobertura funcional (64%)
O core de prospecção (inbox, agenda, score, copiloto) está bem endereçado na Fase 1. O maior gap é o **AI Agent Builder** (módulo 07 inteiro ausente), que automatizaria a prospecção.

### 2. Closer tem cobertura sólida mas gaps críticos
Sidepanel 360° (049–051), status de conversa (054) e respostas rápidas (056) são gaps operacionais que impactam produtividade diária.

### 3. Líder Comercial depende de módulos futuros
Metas, cascata por squad e OTES (módulos 10 e 11) estão previstos para Fases 3–4, criando um gap de gestão até lá.

### 4. Admin é o ator com maior exposição a gaps (33 features)
Isso é esperado — Admin é o ator técnico que configura tudo. Os 6 módulos sem cobertura impactam diretamente o Admin.

### 5. Empresário tem visão parcial mas não crítica
KPIs e funil (RF-027) estão parcialmente cobertos. O gap de metas (módulo 10) é o mais relevante strategicamente.

---

## Priorização Sugerida por Impacto no Ator

| Prioridade | Ação | Ator Beneficiado | Fase Sugerida |
|:---|:---|:---|:---|
| **P0** | Implementar Sidepanel 360° na conversa (049–051) | Closer, SDR | Fase 2 |
| **P0** | Status de conversa: aberta, aguardando, resolvida (054) | Closer, SDR | Fase 2 |
| **P0** | API REST pública (162–163) | Admin | Fase 2 |
| **P1** | Meta vs realizado por vendedor/squad (142, 151) | Líder, Empresário | Fase 3 |
| **P1** | Forms Builder (módulo 01) | Admin, Closer | Fase 3 |
| **P1** | AI Agent Builder (módulo 07) | Admin, SDR | Fase 3 |
| **P2** | Planejamento Comercial (módulo 10) | Empresário, Líder | Fase 3 |
| **P2** | OTES Folha Comercial (módulo 11) | Líder, Admin | Fase 4 |

---

*Documento gerado em 2026-04-14 | TechVendasPro — Funcionalidades por Ator v1.0*
