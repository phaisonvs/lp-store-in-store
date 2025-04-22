# Documentação do Projeto "Seja um Franqueado v2"

Este repositório contém os arquivos da segunda versão do site "Seja um Franqueado" da ABC da Construção.

## Estrutura de Arquivos

O projeto está organizado na pasta `v2/` e contém os seguintes arquivos principais:

- `index.html` - Estrutura da página
- `style.css` - Estilos visuais do site
- `script.js` - Funcionalidades interativas

## Visão Geral do Projeto

O site "Seja um Franqueado" é uma landing page para captação de potenciais franqueados da rede ABC da Construção. Apresenta o modelo de negócio da empresa, incluindo Guide Shops, benefícios de ser um franqueado, e depoimentos de parceiros.

## Detalhes dos Arquivos

### index.html

Estrutura principal do site organizada em seções:

1. **Cabeçalho e Navegação**

   - Menu de navegação fixo com logo e links
   - CTA principal para contato

2. **Seção "Seja um Franqueado"**

   - Banner principal
   - Texto introdutório sobre o modelo de negócio
   - Carrossel de vídeos com depoimentos de franqueados
   - Números e métricas importantes (Big Numbers)
   - Destaque para notícias e reconhecimentos (Financial Times, Valor Econômico, etc.)

3. **Nossas Guide Shops**
   - Apresentação das lojas físicas
   - Carrossel de imagens das Guide Shops em diversas cidades brasileiras

O arquivo está estruturado como um template, indicado pela tag `<template>` no início do documento, o que sugere que é originário de um framework Salesforce Lightning Web Component (LWC).

### style.css

Arquivo extenso (1435 linhas) com todos os estilos do site:

1. **Configurações Globais**

   - Variáveis CSS com cores e fontes
   - Reset de estilos
   - Importação da fonte Satoshi-Variable

2. **Estilos Responsivos**

   - Múltiplos breakpoints (1440px, 900px, 800px, 600px, 430px)
   - Adaptações para diferentes tamanhos de tela

3. **Componentes Principais**
   - Menu de navegação
   - Carrosséis (Guide Shops e vídeos)
   - Cards e elementos interativos
   - Animações e transições

O CSS utiliza abordagem mobile-first com media queries para ajustar a layout em diferentes dispositivos.

### script.js

Arquivo JavaScript exportando uma classe `Carousel` como componente Lightning Web Component (LWC):

1. **Funcionalidades do Carrossel**

   - Animação contínua
   - Interatividade com arrastar (mouse e touch)
   - Clonagem de cards para criar efeito de loop infinito
   - Controle de velocidade

2. **Carrossel de Vídeos**

   - Navegação por setas
   - Comportamento responsivo

3. **Cálculo Dinâmico**
   - Determinação automática da idade da empresa (desde 1958)
   - Atualização dos elementos com classe `.experience-years`

O código incorpora manipulação DOM avançada e está estruturado como um componente reutilizável.

## Destaques Visuais

- Design moderno com carrosséis interativos
- Gradientes e animações para elementos de destaque
- Layout responsivo adaptado para dispositivos móveis
- Galeria de vídeos com depoimentos
- Integração com conteúdo externo (YouTube)

## Observações Técnicas

- O código usa Salesforce Lightning Web Components (LWC) como framework
- As imagens são hospedadas em CDN com URLs da Salesforce
- Implementação avançada de carrossel com suporte a touch e drag
- Código otimizado para múltiplos dispositivos

## Adaptação para Execução Local

### Desafios para Execução Local

O projeto foi originalmente desenvolvido para o ambiente Salesforce, portanto, necessita de ajustes para funcionar corretamente em um servidor local:

1. **Tag `<template>`**: A estrutura do HTML começa com `<template>`, que precisa ser convertida para um HTML padrão para visualização local.

2. **Imports do LWC**: O JavaScript usa a sintaxe de importação do LWC (`import { LightningElement } from 'lwc'`), que não funcionará em um ambiente de navegador padrão.

3. **Recursos Externos**: Todas as imagens estão sendo carregadas de CDNs da Salesforce, o que pode causar problemas de CORS ou falha no carregamento em ambiente local.

4. **Fontes**: As fontes são referenciadas com caminhos relativos ao ambiente Salesforce.

### Ajustes Necessários para Go Live Server

Prioridade alta para funcionamento no Go Live Server:

1. **Estrutura HTML**:

   - Remover a tag `<template>` e substituir por estrutura HTML válida (`<!DOCTYPE html>`, `<html>`, etc.)
   - Adicionar `<head>` com meta tags e links para CSS e JS

2. **JavaScript**:

   - Remover a importação do LWC
   - Converter a classe LWC para JavaScript vanilla ou uma classe padrão
   - Substituir seletores do template (this.template.querySelector) por seletores DOM padrão

3. **CSS**:

   - Ajustar caminhos para fontes e recursos locais
   - Remover o seletor `:host` para CSS global

4. **Imagens**:
   - Baixar e hospedar localmente as imagens referenciadas por URLs externas
   - Atualizar os caminhos no HTML e CSS

A adaptação deve ser feita em etapas, priorizando a estrutura básica para visualização e, posteriormente, implementando as funcionalidades interativas.

## Próximos Passos e Melhorias

### Melhorias Planejadas

1. **Otimização de Performance**:

   - Minificar CSS e JavaScript para produção
   - Otimizar carregamento de imagens com lazy loading
   - Implementar técnicas de carregamento assíncrono para recursos não-críticos

2. **Melhorias de Acessibilidade**:

   - Melhorar estrutura semântica do HTML
   - Adicionar atributos ARIA onde necessário
   - Garantir contraste adequado para texto e elementos interativos
   - Implementar navegação via teclado para todos os componentes interativos

3. **SEO**:

   - Adicionar meta tags para otimização em mecanismos de busca
   - Estruturar conteúdo com cabeçalhos apropriados
   - Implementar schema.org para dados estruturados

4. **Melhorias de UX**:
   - Adicionar indicadores de progresso nos carrosséis
   - Implementar feedback visual mais claro para interações do usuário
   - Melhorar a experiência em dispositivos móveis com gestos intuitivos

### Plano de Implementação

1. **Fase 1: Adaptação Básica**

   - Converter a estrutura para HTML padrão
   - Adaptar JavaScript para funcionar sem o framework LWC
   - Substituir recursos externos por versões locais

2. **Fase 2: Restauração de Funcionalidades**

   - Reimplementar carrosséis e componentes interativos
   - Testar em múltiplos dispositivos e navegadores
   - Verificar e corrigir problemas de layout

3. **Fase 3: Otimização e Melhorias**

   - Implementar melhorias de performance
   - Melhorar acessibilidade
   - Otimizar para SEO
   - Refinar animações e interações

4. **Fase 4: Monitoramento e Evolução**
   - Implementar analytics para acompanhar métricas de uso
   - Coletar feedback de usuários
   - Planejar melhorias contínuas baseadas em dados de uso
