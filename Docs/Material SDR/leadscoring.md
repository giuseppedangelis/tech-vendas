# DeepWiki Q&A with Code Context for Repository: thaleslaray/nossocrm
## Q1
como funciona o calculo de lead scoring?
### Answer
O cálculo de lead scoring no NossoCRM é baseado em uma fórmula inteligente que combina valor, probabilidade e tempo para priorizar negócios.

## Cálculo Principal de Score

A função `calculateDealScore` em `features/inbox/hooks/useInboxController.ts` implementa o algoritmo principal nossocrm:230-245 :

```typescript
const calculateDealScore = useCallback((deal: DealView, type: 'STALLED' | 'UPSELL'): number => {
  const value = deal.value || 0;
  const probability = deal.probability || 50;
  const daysSinceUpdate = Math.floor((Date.now() - Date.parse(deal.updatedAt)) / (1000 * 60 * 60 * 24));

  // Base score from value (log scale to handle big differences)
  const valueScore = Math.log10(Math.max(value, 1)) * 10;

  // Probability factor (higher prob = higher urgency for stalled, lower for upsell)
  const probFactor = type === 'STALLED' ? probability / 100 : (100 - probability) / 100;

  // Time decay: older = more urgent
  const timeFactor = Math.min(daysSinceUpdate / 30, 2); // Cap at 2x for very old deals

  return (valueScore * probFactor * (1 + timeFactor));
}, []);
```

## Componentes do Score

### 1. **Score de Valor** 
- Usa escala logarítmica (`Math.log10`) para lidar com grandes diferenças de valor
- Multiplicado por 10 para normalizar

### 2. **Fator Probabilidade**
- Para negócios parados (`STALLED`): maior probabilidade = maior urgência
- Para upsell (`UPSELL`): menor probabilidade = maior oportunidade

### 3. **Fator Tempo**
- Calcula dias desde última atualização
- Aplica decaimento: negócios mais antigos recebem score maior
- Limitado a 2x máximo para evitar distorções

## Health Score Adicional

No `DealCockpitClient.tsx`, há um "Health score" que combina análise de IA com probabilidade do deal nossocrm:1578-1610 . Este score é exibido como uma barra de progresso colorida e pode ser recalculado sob demanda.

## Aplicação do Scoring

O sistema usa esses scores para gerar sugestões priorizadas no inbox nossocrm:247-321 :
- **Negócios parados**: ordenados por score de urgência
- **Oportunidades de upsell**: ordenadas por potencial
- **Prioridades**: classificadas como high/medium/low baseada nos thresholds de score

## Notes

O sistema também extrai dados BANT (Budget, Authority, Need, Timeline) das conversas nossocrm:27-42 , mas isso é usado principalmente para qualificação e avanço de estágios, não diretamente no cálculo de lead scoring.

Wiki pages you might want to explore:
- [Glossary (thaleslaray/nossocrm)](/wiki/thaleslaray/nossocrm#12)
- [Autonomous Sales Agent (thaleslaray/nossocrm)](/wiki/thaleslaray/nossocrm#4.2)
### Citations
**File:** features/inbox/hooks/useInboxController.ts (L230-245)
```typescript
  const calculateDealScore = useCallback((deal: DealView, type: 'STALLED' | 'UPSELL'): number => {
    const value = deal.value || 0;
    const probability = deal.probability || 50;
    const daysSinceUpdate = Math.floor((Date.now() - Date.parse(deal.updatedAt)) / (1000 * 60 * 60 * 24));

    // Base score from value (log scale to handle big differences)
    const valueScore = Math.log10(Math.max(value, 1)) * 10;

    // Probability factor (higher prob = higher urgency for stalled, lower for upsell)
    const probFactor = type === 'STALLED' ? probability / 100 : (100 - probability) / 100;

    // Time decay: older = more urgent
    const timeFactor = Math.min(daysSinceUpdate / 30, 2); // Cap at 2x for very old deals

    return (valueScore * probFactor * (1 + timeFactor));
  }, []);
```
**File:** features/inbox/hooks/useInboxController.ts (L247-321)
```typescript
  // Gerar sugestões de IA como objetos com scoring inteligente
  const aiSuggestions = useMemo((): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];
    const nowIso = new Date().toISOString();

    // Stalled/Rescue - Score and rank
    const scoredStalledDeals = stalledDeals
      .map(deal => ({ deal, score: calculateDealScore(deal, 'STALLED') }))
      .sort((a, b) => b.score - a.score);

    scoredStalledDeals.forEach(({ deal, score }) => {
      const id = `stalled-${deal.id}`;
      if (!hiddenSuggestionIds.has(id)) {
        const daysSinceUpdate = Math.floor((Date.now() - Date.parse(deal.updatedAt)) / (1000 * 60 * 60 * 24));
        suggestions.push({
          id,
          type: 'STALLED',
          title: `Negócio Parado (${daysSinceUpdate}d)`,
          description: `${deal.title} - R$ ${deal.value.toLocaleString('pt-BR')} • ${deal.probability}% probabilidade`,
          priority: score > 30 ? 'high' : score > 15 ? 'medium' : 'low',
          data: { deal },
          createdAt: nowIso,
        });
      }
    });

    // Upsell - Score and rank
    const scoredUpsellDeals = upsellDeals
      .map(deal => ({ deal, score: calculateDealScore(deal, 'UPSELL') }))
      .sort((a, b) => b.score - a.score);

    scoredUpsellDeals.forEach(({ deal, score }) => {
      const id = `upsell-${deal.id}`;
      if (!hiddenSuggestionIds.has(id)) {
        const daysSinceClose = Math.floor((Date.now() - Date.parse(deal.updatedAt)) / (1000 * 60 * 60 * 24));
        suggestions.push({
          id,
          type: 'UPSELL',
          title: `Oportunidade de Upsell`,
          description: `${deal.companyName} fechou há ${daysSinceClose} dias • R$ ${deal.value.toLocaleString('pt-BR')}`,
          priority: score > 25 ? 'high' : score > 10 ? 'medium' : 'low',
          data: { deal },
          createdAt: nowIso,
        });
      }
    });

    // Clientes em risco de churn (RESCUE)
    rescueContacts.forEach(contact => {
      const id = `rescue-${contact.id}`;
      if (!hiddenSuggestionIds.has(id)) {
        const lastDate = contact.lastInteraction || contact.lastPurchaseDate;
        const daysSince = lastDate
          ? Math.floor((Date.now() - Date.parse(lastDate)) / (1000 * 60 * 60 * 24))
          : null;

        suggestions.push({
          id,
          type: 'RESCUE',
          title: `Risco de Churn`,
          description: daysSince
            ? `${contact.name} não interage há ${daysSince} dias`
            : `${contact.name} nunca interagiu - reative!`,
          priority: daysSince && daysSince > 60 ? 'high' : 'medium',
          data: { contact },
          createdAt: nowIso,
        });
      }
    });

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [upsellDeals, stalledDeals, rescueContacts, hiddenSuggestionIds, calculateDealScore]);
```
**File:** features/deals/cockpit/DealCockpitClient.tsx (L1578-1610)
```typescript
              title="Health"
              icon={<HeartPulse className="h-4 w-4 text-emerald-300" />}
              right={<Chip tone={health.status === 'excellent' || health.status === 'good' ? 'success' : 'neutral'}>{health.score}%</Chip>}
              className="shrink-0"
            >
              <div className="h-2 w-full rounded-full bg-white/10">
                <div
                  className={`h-2 rounded-full ${
                    health.status === 'excellent'
                      ? 'bg-emerald-500'
                      : health.status === 'good'
                        ? 'bg-green-500'
                        : health.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                  }`}
                  style={{ width: `${health.score}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500">IA + probabilidade do deal.</div>
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/3 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-white/5"
                  onClick={() => void refetchAI()}
                  title="Reanalisar com IA"
                >
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    {aiLoading ? 'Analisando…' : 'Reanalisar'}
                  </span>
                </button>
              </div>
```
**File:** lib/ai/extraction/extraction.service.ts (L27-42)
```typescript
const EXTRACTION_SYSTEM_PROMPT = `Você é um especialista em extrair informações de qualificação de leads (BANT) de conversas de vendas.

Analise o histórico de conversa e extraia:

1. **Budget (Orçamento)**: Valor disponível, faixa de investimento, menções a preço
2. **Authority (Autoridade)**: Quem decide, quem influencia, estrutura de decisão
3. **Need (Necessidade)**: Dores, problemas, objetivos, o que querem resolver
4. **Timeline (Prazo)**: Urgência, deadline, quando precisam, fase do projeto

REGRAS:
- Extraia APENAS informações explicitamente mencionadas na conversa
- NÃO invente ou assuma informações
- Se não encontrar, retorne null para o value
- Confidence deve refletir clareza da informação (0.9+ = muito claro, 0.7-0.9 = mencionado, 0.5-0.7 = implícito)
- Reasoning deve citar brevemente de onde veio a informação
- Responda SEMPRE em português brasileiro`;
```
