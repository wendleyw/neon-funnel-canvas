# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7a2a1629-7a38-45e6-b993-e52d2d694973

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7a2a1629-7a38-45e6-b993-e52d2d694973) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7a2a1629-7a38-45e6-b993-e52d2d694973) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Neon Funnel Canvas

Um editor visual avançado para criação de funnels de marketing e diagramas de fluxo.

## Funcionalidades Principais

- **Canvas Infinito**: Crie diagramas complexos com zoom e pan suave
- **Componentes Arrastar e Soltar**: Interface intuitiva para construção de funnels
- **Conexões Animadas**: Visualize o fluxo entre componentes
- **Editor de Componentes**: Edição detalhada de propriedades
- **Auto-scroll de Imagens**: Nova funcionalidade para componentes de página
- **Templates Pré-definidos**: Modelos prontos para diferentes tipos de funnel

## Nova Funcionalidade: Auto-scroll de Imagens

### O que é?

A funcionalidade de auto-scroll permite que imagens carregadas em componentes de página façam um scroll automático de cima para baixo dentro do container, simulando uma prévia de como o usuário navegaria pela página.

### Como funciona?

1. **Componentes Suportados**: A funcionalidade é ativada automaticamente para os seguintes tipos de componente:
   - `landing-page` - Páginas de aterrissagem
   - `sales-page` - Páginas de vendas
   - `opt-in-page` - Páginas de captura de lead
   - `download-page` - Páginas de download
   - `thank-you-page` - Páginas de agradecimento
   - `webinar-live` - Páginas de webinar ao vivo
   - `webinar-replay` - Páginas de replay de webinar
   - `checkout` - Páginas de checkout
   - `member-area` - Área de membros
   - `blog-page` - Páginas de blog
   - `members-page` - Páginas exclusivas para membros

2. **Ativação Automática**: 
   - Quando você adiciona uma imagem a um componente de página no canvas
   - A imagem automaticamente começará a fazer scroll de cima para baixo
   - O ciclo de scroll dura 5 segundos por loop
   - Uma pequena indicação "Auto-scroll preview" aparece no canto inferior direito

3. **Onde aparece**:
   - **No Canvas**: Quando você visualiza o componente no canvas principal
   - **No Editor**: No preview da seção de upload de imagem do editor de componentes

### Como usar:

1. Arraste um componente de página para o canvas
2. Clique duas vezes no componente para abrir o editor
3. Na seção "Media & Assets", faça upload de uma imagem ou cole uma URL
4. A imagem automaticamente começará a fazer o scroll de prévia
5. Salve as alterações para ver o efeito no canvas principal

### Benefícios:

- **Prévia Realística**: Simula como o usuário veria a página completa
- **Economia de Espaço**: Mostra todo o conteúdo da página em um container pequeno
- **Visual Atrativo**: Adiciona movimento e dinamismo ao canvas
- **Feedback Imediato**: Visualize instantaneamente como a página ficará

### Detalhes Técnicos:

- **Performance Otimizada**: Usa `requestAnimationFrame` para animações suaves
- **Limpeza Automática**: Remove automaticamente timers e animações quando o componente é desmontado
- **Fallback Inteligente**: Se a imagem não carregar, mostra um mockup padrão
- **Responsivo**: Adapta-se automaticamente ao tamanho do container

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Flow
- Lucide Icons

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Component Editing

1. Select a component on the canvas.
2. Double-click on the component to open the editor.
3. Modify the component's properties in the editing panel.

### Connections
