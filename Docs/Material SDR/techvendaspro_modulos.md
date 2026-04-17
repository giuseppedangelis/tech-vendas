# TechVendasPro — Módulos e Funcionalidades

## Visão Geral

| Fase | Módulo | Nome | Escopo |
| :---- | :---- | :---- | :---- |
| Fase 1 | M1 | Mensageria Omnichannel | WhatsApp multi-número, filas, inbox, atribuição automática |
| Fase 1 | M2 | Pipeline/Kanban | Pipelines, stages, triggers, Lead Score, Lead Lock |
| Fase 1 | M3 | Agenda Integrada | Google Calendar, agendamento, no-show |
| Fase 1 | M4 | Dashboard & Métricas | Funil, ranking, SLA, UTMs, RFM |
| Fase 1 | M5 | Camada de IA Copilot + Gestora | Sugestões, score, automação |
| Fase 2 | M6 | CS/NPS | Pesquisas,フィードバック |
| Fase 2 | M7 | Campanhas | Disparo em massa |
| Fase 3 | M8 | Marketplace de Talentos | Jobs Pro |

---

# M1: Mensageria Omnichannel

## Requisitos Funcionais

| ID | Requisito | Prioridade |
| :---- | :---- | :---- |
| RF-001 | Integração WhatsApp Business API Oficial (Meta) | MH |
| RF-002 | Fila de mensagens com processamento paralelo | MH |
| RF-003 | Atribuição automática de leads a closers | MH |
| RF-004 | Histórico completo de diálogo por contato | MH |
| RF-005 | Tarefas nativas por atendimento | MH |
| RF-006 | VOIP embarcado com transcrição automática | SH |
| RF-007 | Integração Instagram Direct via ManyChat | CH |
| RF-008 | Filtros em tempo real na caixa de mensagens | MH |
| RF-009 | Notificações push mobile e in-app | SH |
| RF-010 | Suporte a múltiplos números por conta | MH |

## Descrição

- Integração WhatsApp Business API Oficial com suporte a multi-número (mín. 2 números desde o dia 1)
- Arquitetura de filas (RabbitMQ) com Redis para metadados
- Algoritmo de distribuição de leads: disponibilidade, carga atual, regras configuráveis
- Registro permanente de todas as interações acessível via card
- Criar, atribuir e concluir tarefas diretamente no contexto de um lead
- Chamadas via API (Twilio ou Vonage) com transcrição nativa
- Filtros: closer responsável, status, etapa, data, tag (resposta < 500ms)
- Cada conta pode adicionar múltiplos números WhatsApp com caixas separadas

## Critérios de Aceite

- [ ] Conta consegue conectar 2 números WhatsApp distintos e operar simultaneamente
- [ ] Com 15 closers ativos, carregamento de conversas < 500ms
- [ ] Lead recebido via webhook externo criado e atribuído em < 5 segundos
- [ ] Histórico com 500+ mensagens carrega sem paginação quebrada
- [ ] Template HSM enviado corretamente após janela de sessão expirada

---

# M2: Pipeline / Kanban

## Requisitos Funcionais

| ID | Requisito | Prioridade |
| :---- | :---- | :---- |
| RF-011 | Múltiplos pipelines independentes | MH |
| RF-012 | Movimentação automática de cards via triggers | MH |
| RF-013 | Views individuais por closer | MH |
| RF-014 | Personalização de campos visíveis no card | SH |
| RF-015 | Visualização em modo funil (vertical) | MH |
| RF-016 | Sistema de Lead Scoring visível no card | MH |
| RF-017 | Lead Lock — priorização de leads | MH |
| RF-018 | Webhook de entrada e saída por etapa | SH |
| RF-019 | Campos customizados por pipeline | MH |
| RF-020 | Tags em leads e cards | MH |

## Descrição

- Conta pode ter N pipelines com etapas configuráveis, cor e permissão de acesso
- Cards se movem automaticamente via triggers: interação WhatsApp, webhook pagamento, agendamento/no-show
- Cada closer vê somente seus próprios leads; gestor tem visão global
- Campos extras: texto, número, dropdown, data, checkbox
- Visão funil com: volume por etapa, taxa de conversão, taxa de perda acumulada
- Lead Lock: closer visualiza apenas o lead com maior score até interagir
- Webhooks configuráveis por etapa (entrada/saída)
- Tags coloridas com filtro no Kanban

## Critérios de Aceite

- [ ] Gestor cria pipeline com etapas customizadas em < 3 minutos
- [ ] Card move automaticamente via webhook de pagamento em < 10 segundos
- [ ] Closer vê somente seus próprios leads na view padrão
- [ ] Lead Lock: segundo lead só aparece após interação com o primeiro
- [ ] Score do lead atualizado e refletido em < 30 segundos

---

# M3: Agenda Integrada

## Requisitos Funcionais

| ID | Requisito | Prioridade |
| :---- | :---- | :---- |
| RF-021 | Embed do Google Calendar (visualização interativa) | MH |
| RF-022 | Tela de agendamentos nativa com filtros | MH |
| RF-023 | Trigger automático de no-show | MH |
| RF-024 | Lembretes de agenda (push + in-app) | SH |
| RF-025 | Agendamento nativo sem Google Calendar | CH |
| RF-026 | Link de agendamento público por closer | SH |

## Descrição

- Tela nativa de agenda com Google Calendar embutido via API
- Sincronização bidirecional (criação no CRM reflete no Google)
- Listagem de agendamentos filtrável por: closer, status, data, produto
- X minutos após horário sem check-in, sistema notifica closer para confirmar no-show
- Notificação Y minutos antes do agendamento (Y configurável)
- Link único de auto-agendamento por closer (estilo Calendly)

## Critérios de Aceite

- [ ] Closer visualiza calendário semanal com eventos do Google Calendar dentro do CRM
- [ ] Evento criado no CRM aparece no Google Calendar em < 30 segundos
- [ ] Trigger de no-show dispara após X minutos (X configurável)
- [ ] Card move para etapa configurada ao closer confirmar no-show com 1 clique
- [ ] Gestor visualiza agenda de todos os closers com filtro

---

# M4: Dashboard & Métricas

## Requisitos Funcionais

| ID | Requisito | Prioridade |
| :---- | :---- | :---- |
| RF-027 | Funil comercial com volumetria e taxas | MH |
| RF-028 | Motivos de perda categorizados por IA | SH |
| RF-029 | Ranking de performance do time | MH |
| RF-030 | Análise de SLA de resposta | MH |
| RF-031 | Captura de UTMs e atribuição ponta a ponta | MH |
| RF-032 | Análise RFM (Recência, Frequência, Monetário) | SH |
| RF-033 | Métricas de recorrência (MRR, ARR, Churn) | SH |
| RF-034 | Filtros globais no dashboard | MH |

## Descrição

- Gráfico de funil: volume por etapa, taxa de conversão etapa a etapa, taxa de perda categorizada, tempo médio por etapa
- IA analisa conversas de leads perdidos e extrai motivos automaticamente
- Tabela por closer: volume de vendas, taxa de conversão, SLA de primeira resposta, SLA intermediário
- Tempo médio de primeira resposta por closer/equipe com alertas
- UTMs capturados na entrada do lead rastreados até fechamento
- Segmentação da base por RFM (Recência, Frequência, Monetário)
- MRR, ARR, Churn rate para contas com produtos de assinatura
- Filtros globais: período, closer, produto, pipeline, tag, origem UTM

## Critérios de Aceite

- [ ] Funil comercial exibe volume, taxa de conversão e tempo médio por etapa
- [ ] Ranking de closers mostra volume fechado, conversão e SLA de resposta
- [ ] UTMs capturados na entrada são rastreados até fechamento
- [ ] Análise RFM segmenta a base e exibe score por contato
- [ ] Dashboard carrega em < 3 segundos para período de 30 dias

---

# M5: Camada de IA

## Requisitos Funcionais

| ID | Requisito | Prioridade |
| :---- | :---- | :---- |
| RF-035 | IA Copilot — leitura em tempo real da conversa | MH |
| RF-036 | Sugestão de resposta com metodologia DEF | MH |
| RF-037 | Matriz de objeções dinâmica e aprendizado | SH |
| RF-038 | Síntese automática de ligações via VOIP | SH |
| RF-039 | Seleção de framework de vendas | CH |
| RF-040 | IA Gestora — análise de lead score | MH |
| RF-041 | IA Gestora — detecção de padrões de perda | SH |
| RF-042 | IA Gestora — movimentação automática de cards | MH |
| RF-043 | Sugestão proativa de métricas (IA Gestora) | SH |

## Descrição

- IA lê conversa do WhatsApp em tempo real e sugere próxima resposta baseada na metodologia DEF
- Quando objeção é detectada, IA sugere resposta seguindo o framework DEF
- Closer pode: aceitar (1 clique), editar, ou ignorar sugestão
- Base de objeções aprende com cada fechamento bem-sucedido
- Ao encerrar chamada VOIP, IA gera: resumo, objeções, próximos passos
- Closer/gestor seleciona framework ativo: DEF (padrão), BANT, SPIN
- IA calcula e atualiza score em tempo real com base em engajamento, perfil, origem, histórico
- IA detecta padrões entre leads perdidos e gera recomendações proativas
- IA detecta eventos e move cards automaticamente
- IA sugere análises relevantes sem usuário solicitar

## Critérios de Aceite

- [ ] Sugestão de resposta da IA aparece em < 3 segundos após mensagem do lead
- [ ] Closer pode aceitar sugestão com 1 clique e enviar sem edição
- [ ] IA detecta agendamento em conversa e move card automaticamente
- [ ] Síntese de ligação gerada e registrada no card em < 60 segundos
- [ ] Score de lead atualizado em < 30 segundos após nova interação

---

# Requisitos Não Funcionais

| ID | Tipo | Prioridade | Descrição |
| :---- | :---- | :---- | :---- |
| RNF-001 | Escalabilidade | MH | Suportar 8M conversas/mês em regime normal |
| RNF-002 | Performance — Caixa de Mensagens | MH | Renderizar e filtrar conversas em < 500ms |
| RNF-003 | Performance — APIs de IA | SH | Sugestões em até 3 segundos |
| RNF-004 | Disponibilidade | MH | 99,5% uptime para M1 e M2 |
| RNF-005 | Multi-tenancy e Isolamento | MH | RLS (Row Level Security) para isolamento total |
| RNF-006 | White Label | MH | Customização: logo, cores, domínio próprio |
| RNF-007 | Responsividade Mobile (PWA) | MH | Interface 100% responsiva via PWA |
| RNF-008 | Segurança e LGPD | MH | Conformidade LGPD, criptografia TLS |
| RNF-009 | Auditoria de Ações | SH | Log imutável de movimentações |
| RNF-010 | Tempo de Onboarding | SH | Primeiro atendimento em até 30 minutos |

---

# Regras de Negócio

| ID | Regra | Tipo |
| :---- | :---- | :---- |
| RN-001 | Lead Lock — desbloqueio sequencial | FATO |
| RN-002 | Atribuição de lead a closer | FATO |
| RN-003 | Movimentação de card por trigger de pagamento | FATO |
| RN-004 | Trigger de no-show | FATO |
| RN-005 | Score de lead — fatores de cálculo | HIPÓTESE |
| RN-006 | Janela de sessão WhatsApp | FATO |
| RN-007 | Isolamento de dados por tenant | FATO |
| RN-008 | Matriz de objeções — curadoria | HIPÓTESE |
| RN-009 | Permissões por perfil | FATO |
| RN-010 | Campanha de aprovação (Fase 2) | WH |

---

# Restrições

| ID | Restrição | Tipo |
| :---- | :---- | :---- |
| REST-001 | Prazo de 75 dias para Fase 1 | Prazo |
| REST-002 | API WhatsApp apenas via canal oficial Meta | Técnica |
| REST-003 | Aproveitamento de código legado | Técnica |
| REST-004 | RLS do NossoCRM deve ser refeito | Técnica |
| REST-005 | Stack front-end: React + PWA | Técnica |
| REST-006 | Sem publicação em lojas (Fase 1) | Técnica |
| REST-007 | Integrações de pagamento via webhook | Técnica |
| REST-008 | IA: decisão de modelo após benchmark | Técnica |
| REST-009 | VOIP: decisão Twilio vs Vonage após POC | Técnica |

---

# Sequência de Implementação Sugerida

| Sprint | Days | Escopo |
| :---- | :---- | :---- |
| Sprint 0 | 1–10 | Fundação: schema multi-tenant, RabbitMQ, Meta Business, React+PWA |
| Sprint 1 | 11–25 | M1: Mensageria Core |
| Sprint 2 | 20–35 | M2: Pipeline/Kanban |
| Sprint 3 | 30–50 | M3: Agenda + M4: Dashboard |
| Sprint 4 | 40–65 | M5: Camada de IA |
| Sprint 5 | 60–75 | Integração e Hardening |

---

*Documento: TechVendasPro — DEF CRM — Fase 1 — 2026*