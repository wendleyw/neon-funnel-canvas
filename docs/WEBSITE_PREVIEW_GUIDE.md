# Guia: Preview de Páginas Web no Canvas

## 📋 Visão Geral

A funcionalidade de **Preview de Páginas Web** permite que você adicione URLs de sites nos componentes do canvas e visualize automaticamente screenshots das páginas completas.

## 🎯 Como Funciona

### 1. Detecção Automática de Tipo de URL

O sistema detecta automaticamente se a URL fornecida é:
- **Imagem direta**: `https://example.com/image.jpg`
- **Página web**: `https://example.com` ou `https://example.com/about`

### 2. Geração de Screenshot

Para páginas web, o sistema:
1. Envia a URL para um serviço de screenshot
2. Captura uma imagem da página completa
3. Otimiza a imagem para exibição no card
4. Armazena em cache para performance

## 🛠️ Como Usar

### Passo a Passo

1. **Abra o Editor**
   - Clique no botão **"Editar"** (ícone de lápis) em qualquer componente do canvas

2. **Cole a URL**
   - No campo **"Custom Image URL or Website URL"**
   - Cole uma URL válida de um site ou imagem

3. **Aguarde a Geração**
   - Para URLs de páginas web, um indicador de carregamento aparecerá
   - O processo pode levar de 3-10 segundos

4. **Visualize o Resultado**
   - O preview aparecerá na seção "Preview"
   - Clique em **"Save"** para aplicar ao componente

## 📝 Exemplos de URLs Suportadas

### ✅ Páginas Web (geram screenshot)
```
https://github.com
https://www.wikipedia.org
https://stripe.com
https://tailwindcss.com
https://reactjs.org
```

### ✅ Imagens Diretas (exibição direta)
```
https://example.com/image.jpg
https://via.placeholder.com/400x300
https://picsum.photos/800/600
```

### ❌ URLs Não Suportadas
```
localhost:3000 (URLs locais)
file:///local/file.html (arquivos locais)
ftp://example.com (protocolos não HTTP/HTTPS)
```

## 🔧 Funcionalidades Avançadas

### Cache Inteligente
- Screenshots são automaticamente cacheados
- Reduz tempo de carregamento em visualizações subsequentes
- Cache expira automaticamente para manter conteúdo atualizado

### Fallback Gracioso
Se o screenshot falhar, o sistema:
1. Exibe um placeholder informativo
2. Mantém link para visualizar a página original
3. Permite tentar novamente alterando a URL

### Otimização de Performance
- Screenshots são redimensionados automaticamente
- Compressão inteligente mantém qualidade visual
- Carregamento assíncrono não bloqueia a interface

## 🐛 Resolução de Problemas

### Preview Não Carrega
**Possíveis causas:**
- Site bloqueia screenshots (ex: bancos, sites com proteção)
- URL inválida ou inacessível
- Problemas temporários do serviço de screenshot

**Soluções:**
1. Verifique se a URL está correta e acessível
2. Tente uma URL diferente da mesma página
3. Use uma imagem direta como alternativa

### Imagem Aparece Cortada
**Possíveis causas:**
- Site tem conteúdo muito longo
- Layout responsivo não otimizado

**Soluções:**
1. A captura mostra uma preview representativa
2. Use o link "View original" para ver a página completa
3. Para layouts específicos, considere usar uma imagem personalizada

### Carregamento Lento
**Possíveis causas:**
- Sites complexos demoram mais para renderizar
- Limitações da API de screenshot

**Expectativa:**
- Sites simples: 3-5 segundos
- Sites complexos: 5-10 segundos
- Timeout automático: 15 segundos

## 🔒 Privacidade e Segurança

### Dados Processados
- Apenas a URL fornecida é enviada para o serviço de screenshot
- Nenhum dado pessoal ou de sessão é compartilhado
- Screenshots são temporários e não armazenados permanentemente

### Serviços Utilizados
- **Thumbnail.ws**: Serviço principal confiável
- **ScreenshotOne**: Backup com recursos avançados
- **HTML/CSS to Image**: Para casos especiais

## 💡 Dicas de Uso

### Para Melhores Resultados
1. **Use URLs principais** (ex: `https://example.com` ao invés de `https://example.com/complex/path`)
2. **Aguarde o carregamento completo** antes de salvar
3. **Teste com diferentes URLs** se uma não funcionar
4. **Mantenha URLs atualizadas** para refletir mudanças no site

### Casos de Uso Ideais
- **Landing pages** de campanhas
- **Páginas de produto** para demonstração
- **Sites de referência** em fluxos de conversão
- **Concorrentes** para análise comparativa

## 🚀 Próximas Melhorias

### Em Desenvolvimento
- [ ] API keys customizáveis para maior volume
- [ ] Agendamento automático de atualizações
- [ ] Múltiplos formatos de captura (PDF, etc.)
- [ ] Seleção de área específica da página
- [ ] Modo escuro automático

---

**Tem dúvidas?** Consulte a documentação principal ou abra uma issue no repositório. 