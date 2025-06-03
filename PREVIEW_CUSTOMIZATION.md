# 📋 Guia de Customização de Previews - Versão Simplificada

Este guia explica como personalizar os previews dos templates no sistema de funnel canvas.

## 🎨 Como Funcionam os Previews

Os previews são gerados dinamicamente baseados no `type` de cada template. O componente `PageMockup` em `src/components/ModernSidebar/tabs/PageTemplateGrid.tsx` contém a lógica para cada tipo.

**Filosofia dos Previews Simplificados:**
- ✅ Mockups limpos e minimalistas
- ✅ Reconhecimento rápido do tipo de layout
- ✅ Foco na estrutura, não nos detalhes
- ✅ Performance otimizada

## 🔧 Tipos de Template Disponíveis

### 1. Landing Page (`landing-page`)
```tsx
case 'landing-page':
  return (
    <div className="w-full h-full bg-white rounded border overflow-hidden">
      {/* Header azul simples */}
      <div className="h-2 bg-blue-500"></div>
      {/* Conteúdo estruturado */}
      <div className="p-1.5 space-y-1">
        <div className="w-full h-2 bg-blue-500 rounded-sm"></div>
        <div className="w-3/4 h-0.5 bg-gray-300 rounded-sm"></div>
        <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
        <div className="w-12 h-1.5 bg-green-500 rounded-sm mt-2"></div>
      </div>
    </div>
  );
```

### 2. Sales Page (`sales-page`)
```tsx
case 'sales-page':
  return (
    <div className="w-full h-full bg-white rounded border overflow-hidden">
      {/* Header vermelho */}
      <div className="h-1.5 bg-red-500"></div>
      {/* Headlines e CTAs */}
      <div className="p-1.5 space-y-1">
        <div className="w-full h-1.5 bg-red-500 rounded-sm"></div>
        <div className="w-4/5 h-1.5 bg-red-500 rounded-sm"></div>
        <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
        <div className="w-2/3 h-0.5 bg-gray-300 rounded-sm"></div>
        <div className="w-8 h-2 bg-yellow-400 rounded-sm mt-1"></div>
        <div className="w-12 h-1.5 bg-red-500 rounded-sm"></div>
      </div>
    </div>
  );
```

### 3. Opt-in/Download Pages (`opt-in-page`, `download-page`)
```tsx
case 'opt-in-page':
case 'download-page':
  return (
    <div className="w-full h-full bg-white rounded border overflow-hidden">
      <div className="p-1.5 space-y-1 text-center">
        {/* Badge de oferta */}
        <div className="w-6 h-1 bg-purple-500 rounded-sm mx-auto"></div>
        {/* Headlines */}
        <div className="w-full h-1.5 bg-purple-500 rounded-sm"></div>
        <div className="w-3/4 h-1 bg-gray-300 rounded-sm mx-auto"></div>
        {/* Formulário simples */}
        <div className="w-full h-1 bg-gray-200 border border-gray-300 rounded-sm mt-2"></div>
        <div className="w-full h-1 bg-gray-200 border border-gray-300 rounded-sm"></div>
        <div className="w-12 h-1.5 bg-purple-500 rounded-sm mx-auto mt-1"></div>
      </div>
    </div>
  );
```

## 📝 Como Adicionar Novos Tipos

### 1. Definir o Tipo no Template Data
```typescript
{
  id: 'novo-tipo',
  label: 'Novo Tipo',
  description: 'Descrição concisa',
  category: 'categoria',
  type: 'novo-tipo-page',
  color: '#hexcolor',
  tags: ['tag1', 'tag2']
}
```

### 2. Implementar o Preview Simples
```tsx
case 'novo-tipo-page':
  return (
    <div className="w-full h-full bg-white rounded border overflow-hidden">
      <div className="p-1.5 space-y-1">
        {/* Cabeçalho */}
        <div className="w-full h-2 bg-sua-cor rounded-sm"></div>
        {/* Conteúdo */}
        <div className="w-3/4 h-0.5 bg-gray-300 rounded-sm"></div>
        <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
        {/* CTA */}
        <div className="w-12 h-1.5 bg-sua-cor rounded-sm mt-2"></div>
      </div>
    </div>
  );
```

## 🎨 Sistema de Cores Simplificado

### Cores por Categoria
```css
/* Lead Capture */
bg-blue-500, bg-purple-500

/* Sales */
bg-red-500, bg-yellow-400

/* Webinar */
bg-red-500 (live), bg-gray-800 (video)

/* Success/Thank You */
bg-green-500

/* Calendar/Booking */
bg-blue-500

/* Content/Generic */
bg-gray-500
```

### Tamanhos Padrão
```css
/* Headers */
h-1.5, h-2

/* Texto */
h-0.5

/* CTAs/Buttons */
h-1.5

/* Espaçamento */
p-1.5, space-y-1, mt-1, mt-2
```

## 🔄 Estrutura do Layout

### Padrão Base
```tsx
<div className="w-full h-full bg-white rounded border overflow-hidden">
  {/* Opcional: Header colorido */}
  <div className="h-2 bg-cor-principal"></div>
  
  {/* Conteúdo */}
  <div className="p-1.5 space-y-1">
    {/* Elementos do mockup */}
  </div>
</div>
```

### Elementos Comuns
- **Headers**: `div` com altura fixa e cor temática
- **Headlines**: `bg-cor-principal` com larguras variadas
- **Texto**: `bg-gray-300` com `h-0.5`
- **CTAs**: `bg-cor-principal` com `h-1.5`
- **Formulários**: `bg-gray-200 border border-gray-300`

## 📱 Responsividade

Os previews se ajustam automaticamente:
- **Desktop**: Grid 2 colunas
- **Mobile**: 1 coluna
- **Aspecto**: 4:3 fixo
- **Tamanhos**: Responsivos por Tailwind

## 🚀 Vantagens dos Previews Simplificados

1. **Performance**: Renderização mais rápida
2. **Clareza**: Foco na estrutura essencial
3. **Consistência**: Padrão visual uniforme
4. **Manutenção**: Código mais limpo e fácil de manter
5. **Escalabilidade**: Fácil adicionar novos tipos

## 💡 Dicas de Design

- Use no máximo 3 cores por preview
- Mantenha elementos reconhecíveis (header, conteúdo, CTA)
- Evite detalhes desnecessários
- Teste em diferentes tamanhos
- Mantenha consistência entre tipos similares

---

**Resultado:** Previews limpos, rápidos e facilmente reconhecíveis que focam no essencial! 🎯 