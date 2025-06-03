# Plano de Migração para React Flow

## Estratégia Faseada de Migração

### Fase 1: Preparação e Setup (1-2 dias) ✅ CONCLUÍDA
- [x] Instalar React Flow e dependências
- [x] Criar componente wrapper para manter compatibilidade
- [x] Mapear tipos existentes para React Flow nodes/edges
- [x] Preservar funcionalidades críticas existentes
- [x] Criar PoC funcional com toggle para testes
- [x] Adicionar estilos dark theme customizados

### Fase 2: Migração Core (3-4 dias)
- [ ] Migrar Canvas principal para ReactFlow
- [ ] Converter FunnelComponent → ReactFlow Node
- [ ] Converter Connection → ReactFlow Edge  
- [ ] Migrar sistema de drag & drop
- [ ] Manter funcionalidades customizadas (templates, formas)

### Fase 3: Funcionalidades Avançadas (2-3 dias)
- [ ] Migrar MiniMap para MiniMap do React Flow
- [ ] Implementar controles customizados
- [ ] Migrar animações de sequência
- [ ] Adaptar sistema de templates

### Fase 4: Polimento e Otimização (1-2 dias)
- [ ] Testes de performance
- [ ] Ajustes de UI/UX
- [ ] Cleanup de código antigo
- [ ] Documentação

## ✅ Progresso Fase 1 - Completado!

### O que foi implementado:
1. **React Flow instalado** com sucesso
2. **Tipos de conversão criados** (`src/types/reactflow.ts`)
3. **PoC funcional** (`src/components/ReactFlowCanvas.tsx`)
4. **Toggle de teste** no FunnelEditor (botão no canto superior direito)
5. **Estilos dark theme** customizados para React Flow
6. **Conversão bidirecional** entre FunnelComponent/Connection ↔ ReactFlow Node/Edge

### Como testar agora:
1. Rode o projeto: `npm run dev`
2. Acesse o FunnelEditor
3. Clique no botão **"Canvas Original"** no canto superior direito
4. O botão mudará para **"React Flow"** indicando que está ativo
5. Teste as funcionalidades básicas:
   - Pan (arrastar o fundo)
   - Zoom (scroll do mouse)
   - Mover componentes
   - Criar conexões (arrastar das bordas dos nós)
   - MiniMap funcional
   - Controles de zoom

### Mapeamento de Funcionalidades

### Canvas Atual → React Flow
- `CanvasContainer` → `ReactFlow` component
- `ComponentNode` → Custom Node Types
- `ConnectionManager` → Edge Types + Connection Logic
- `CanvasControls` → Controls + Background
- `MiniMap` → React Flow MiniMap

### Tipos de Dados
```typescript
// Atual
FunnelComponent → ReactFlow Node
{
  id: string
  type: string
  position: {x, y}
  data: {...}
}

// React Flow Node
{
  id: string
  type: string  
  position: {x, y}
  data: FunnelComponent['data']
}
```

### Benefícios Específicos para seu Projeto

1. **Performance**: Virtualização automática para muitos nós
2. **Touch Support**: Melhor suporte mobile nativo
3. **Accessibility**: ARIA labels e keyboard navigation
4. **Extensibilidade**: Plugin system para funcionalidades customizadas
5. **Manutenibilidade**: Menos código customizado de canvas

### Funcionalidades que Preservar
- Sistema de templates robusto
- Formas geométricas personalizadas  
- Categorização de componentes
- Animações de sequência
- Integração com Supabase
- Sistema de projetos e workspaces

### Estimativa de Tempo
**Total: 7-11 dias** de desenvolvimento focado

### Risco/Benefício
- **Risco**: Médio (migração complexa mas viável)
- **Benefício**: Alto (performance + manutenibilidade + funcionalidades)

## Próximos Passos

1. **✅ Instalar React Flow**: `npm install reactflow`
2. **✅ Criar branch de migração**: `git checkout -b feature/react-flow-migration`
3. **✅ Implementar PoC** com componente básico
4. **🔄 ATUAL: Testar PoC** e coletar feedback
5. **⏭️ PRÓXIMO: Fase 2** - Migração dos componentes customizados

## Status Atual: 
**Fase 1 Completa! ✅**
**PoC disponível para testes** 🧪 