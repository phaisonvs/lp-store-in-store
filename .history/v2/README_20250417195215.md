# Seja um Franqueado v2 - Instruções para Execução Local

Este diretório contém a versão adaptada do site "Seja um Franqueado" da ABC da Construção para execução local.

## Como Executar

### 1. Usando Visual Studio Code + Live Server

1. Instale a extensão "Live Server" no VS Code:

   - Abra o VS Code
   - Acesse a aba de extensões (Ctrl+Shift+X)
   - Busque por "Live Server" (desenvolvida por Ritwick Dey)
   - Clique em "Instalar"

2. Abra a pasta v2 no VS Code

3. Clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server" ou clique no botão "Go Live" na barra inferior do VS Code.

4. O navegador abrirá automaticamente com o site funcionando.

### 2. Usando qualquer servidor web local

Se preferir usar outro servidor web:

1. Navegue até a pasta v2 no terminal
2. Inicie um servidor web. Exemplos:
   - Python: `python -m http.server`
   - Node.js: Instale `http-server` via npm e execute `http-server`
3. Acesse o site pelo navegador (geralmente em `http://localhost:8000` ou similar)

## Observações Importantes

- Os arquivos foram adaptados do framework Salesforce Lightning Web Component (LWC) para HTML, CSS e JavaScript padrão.
- As imagens e fontes ainda estão sendo carregadas dos servidores da Salesforce. Caso precise de uma versão totalmente offline, será necessário baixar esses recursos.
- O carrossel foi reconstruído para funcionar sem as dependências do LWC.

## Possíveis Problemas

- **Imagens não carregam**: Como os recursos visuais são carregados de servidores externos, você pode enfrentar erros de CORS. Se isso ocorrer, será necessário baixar as imagens e atualizar os caminhos no HTML.
- **Carrossel não funciona**: Verifique se o JavaScript está sendo carregado corretamente. O console do navegador (F12) pode ajudar a identificar erros.
- **Fontes não carregam**: As fontes também estão referenciadas a servidores externos. Pode ser necessário usar fontes alternativas ou baixá-las localmente.

## Modificações Realizadas

1. **index.html**:

   - Convertido de `<template>` para estrutura HTML padrão
   - Adicionado `<!DOCTYPE html>`, `<html>`, `<head>` e `<body>`
   - Incluídos links para CSS e JS

2. **style.css**:

   - Convertido `:host` para `:root` e `body`
   - Ajustados caminhos relativos para URLs absolutas

3. **script.js**:
   - Removida a importação do LWC
   - Convertida a classe para JavaScript vanilla
   - Substituídos os seletores `this.template.querySelector` por `document.querySelector`
   - Adicionada inicialização via `DOMContentLoaded`
