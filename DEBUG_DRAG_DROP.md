# Debug Guide: Problema com Drag and Drop de Componentes

## Problema Reportado
O usuário não consegue adicionar componentes dos **sources**, **pages** e **actions** no canvas do React Flow.

## 🔍 Análise do Problema

### Caminho do Drag and Drop:
1. **Sidebar Components** → `draggable={true}` ✅
2. **CategorySection** → `onDragStart` ✅  
3. **FunnelEditor** → `handleDragStart` ✅
4. **ReactFlowCanvas** → `onDrop` ✅

### Caminho do Click:
1. **Sidebar Components** → `onClick` ✅
2. **CreateMenuContent** → `onTemplateClick` ✅
3. **FunnelEditor** → `handleComponentAdd` ✅
4. **canvasAddService** → `addComponentTemplate` ✅

## 🚨 Possíveis Problemas Identificados

### 1. **Integração de Handlers**
- O `FunnelEditor` usa `onTemplateClick={handleComponentAdd}` (CLICK)
- Mas o `onDragStart={handleDragStart}` (DRAG) pode não estar funcionando corretamente

### 2. **DataTransfer Issues**
- Alguns componentes usam `JSON.stringify(template)` 
- Outros usam `JSON.stringify(action)`
- Pode haver inconsistência na estrutura dos dados

### 3. **Event Propagation**
- Muitos `e.preventDefault()` e `e.stopPropagation()`
- Pode estar bloqueando events necessários

## 🧪 **Teste Rápido - USAR ESTE PRIMEIRO**

### Passo 1: Teste de Click (Mais Simples)
1. Abra o projeto no navegador
2. Abra o console (F12)
3. **Clique (não arraste)** em qualquer componente da sidebar
4. Observe os logs no console

**Esperado:**
```
🎯 [Action] clicked: landing-page Landing Page
🚀 [FunnelEditor] Component add requested: {...}
✅ [FunnelEditor] Component added successfully
```

**Se não funcionar:** O problema é na integração dos handlers de click.

### Passo 2: Teste de Drag (Mais Complexo)
1. **Arraste** um componente da sidebar para o canvas
2. Observe os logs no console

**Esperado:**
```
🖱️ Action drag started: landing-page Landing Page
🎯 Drop event on React Flow
📦 Template dropped: Landing Page
✅ Creating component: {...}
```

**Se não funcionar:** O problema é no drag and drop.

## 🔧 Soluções Implementadas

### ✅ Logs Detalhados Adicionados
- `CategorySection.tsx` - handleDragStart
- `UserActionItem.tsx` - handleDragStart e handleClick  
- `ActionsTab.tsx` - handleActionClick e handleActionDragStart
- `FunnelEditor.tsx` - handleDragStart e handleComponentAdd
- `ReactFlowCanvas.tsx` - onDrop com validação completa

### ✅ Validação de Dados
- Verificação se template tem estrutura correta
- Fallbacks para dados malformados
- Toast notifications para feedback do usuário

### ✅ Event Handling Melhorado
- `e.preventDefault()` e `e.stopPropagation()` otimizados
- Handlers separados para click vs drag
- Tratamento de erros com try/catch

## 🎯 **Ação Imediata - FAÇA ISTO AGORA**

1. **Abra o navegador** no seu projeto (`http://localhost:8080`)
2. **Abra o console** (F12)
3. **Tente clicar** (não arrastar) em "Landing Page" em Sources
4. **Copie e cole aqui** os logs que aparecem no console
5. **Se não aparecer nada**, há um problema básico na integração

## 📋 **Checklist de Debug**

- [ ] Console está aberto (F12)
- [ ] Testou CLICK em um componente da sidebar
- [ ] Testou DRAG de um componente da sidebar
- [ ] Verificou se aparecem logs no console
- [ ] Copiou os logs para análise

## Status Atual
- ✅ React Flow configurado corretamente
- ✅ Drag handlers implementados na sidebar
- ✅ Click handlers implementados na sidebar  
- ✅ canvasAddService funcionando
- ❓ **Integração entre handlers - EM TESTE**

## Próximo Passo
**Execute o teste de click primeiro** e reporte os resultados!