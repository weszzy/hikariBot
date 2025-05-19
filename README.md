<div align="center">

<img height="180" alt="hikariBot's logo" src="https://i.imgur.com/SwQu4DR.jpg">

# 📚 hikariBot 


</div>

<br>

<div align="center">

# hikariBot: Assistente Literário para Clubes do Livro no Discord

hikariBot é um bot para Discord projetado para enriquecer a experiência de clubes do livro e comunidades literárias. Ele oferece um conjunto robusto de funcionalidades para gerenciar bibliotecas de livros, facilitar discussões, promover o engajamento e ajudar os membros a descobrir novas leituras.

<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E">
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white">
<img src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white">
<img src="https://img.shields.io/badge/Wikipedia-%23000000.svg?style=for-the-badge&logo=wikipedia&logoColor=white">
<img src="https://i.imgur.com/dQ9cEjM.png" height="27px">
</div>






## Sumário

*   [Sobre o Projeto](#sobre-o-projeto)
*   [Funcionalidades Principais](#-funcionalidades-principais)
*   [Tecnologias Utilizadas](#-tecnologias-utilizadas)
*   [Comandos](#-comandos)
*   [Detalhes do Desenvolvimento](#️-detalhes-do-desenvolvimento)
*   [Licença](#-licença)
*   [Contato](#-contato)

## Sobre o Projeto

O HikariBot nasceu da necessidade de centralizar e facilitar a gestão de livros e atividades relacionadas a um clube do livro no Discord. Ele visa automatizar tarefas, prover informações relevantes e criar uma experiência interativa para os amantes da leitura.

## Funcionalidades Principais

*    **Exploração Detalhada da Biblioteca:**
    *   Navegue por categorias de livros pré-definidas.
    *   Filtre livros por autor e visualize todas as obras disponíveis de um autor específico.
*    **Acesso Fácil a Livros Digitais:**
    *   Gere links diretos para download ou leitura de livros armazenados no Google Drive.
    *   **Cache de Links:** Links gerados são armazenados em cache para otimizar o desempenho e evitar recriações desnecessárias.
*    **Interface Intuitiva com Menus Interativos:**
    *   Utiliza os componentes de interface do Discord (menus de seleção, botões) para uma navegação simples e amigável.
*    **Informações sobre Autores:**
    *   Obtenha resumos biográficos e informações sobre autores utilizando a API da Wikipedia.
*    **Busca de Versículos Bíblicos:**
    *   Encontre rapidamente versículos específicos da Bíblia através de uma API dedicada.
*    **Notificações de Eventos:**
    *   Notifica automaticamente os membros quando um usuário designado como "Apresentador" (ou líder da discussão) entra em um canal de voz específico.
*    **Recomendações Inteligentes:**
    *   Receba sugestões de livros baseadas em categorias e palavras-chave preestabelecidas, utilizando a Google Books API.
    *   Inclui um sistema de recomendação automática semanal.
*    **Acompanhamento de Leitura e Gamificação:**
    *   **Registro de Progresso:** Permite que os membros marquem seu progresso de leitura em livros específicos.
    *   **Ranking de Leitores:** Exibe um ranking dos membros que mais leram, incentivando a participação.
*    **Gerenciamento Colaborativo de Sugestões:**
    *   **Adicionar Sugestões:** Membros podem sugerir novos livros para a biblioteca do clube.
    *   **Listar Sugestões:** Visualize todas as sugestões de livros feitas pela comunidade.
    *   **Sortear Sugestões:** Realize sorteios para escolher o próximo livro a ser lido a partir da lista de sugestões.


## Tecnologias Utilizadas

*   **Node.js:** Ambiente de execução JavaScript no lado do servidor.
*   **Discord.js:** Biblioteca principal para interação com a API do Discord.
*   **Google Drive API:** Para acessar e gerenciar arquivos de livros no Google Drive.
*   **Google Books API:** Para buscar informações de livros e enriquecer as recomendações.
*   **Wikipedia API:** Para fornecer informações contextuais sobre autores.
*   **API REST da Bíblia (Bible API):** Para consulta rápida de versículos bíblicos.
*   **`dotenv`:** Para gerenciar variáveis de ambiente de forma segura.
*   **JSON:** Utilizado para armazenamento leve de dados como cache, progresso de leitura e sugestões.


## Comandos

O HikariBot responde a comandos de barra (slash commands) no Discord:

*   `/biblioteca`: Exibe as categorias de livros disponíveis. Permite selecionar uma categoria e, em seguida, um autor para listar seus livros.
*   `/recomendacao`: Sugere um livro aleatório para leitura, podendo ser filtrado por categorias ou palavras-chave.
*   `/autor [nome do autor]`: Fornece informações biográficas sobre o autor especificado, obtidas da Wikipedia.
*   `/biblia [livro] [capítulo:versículo(s)]`: Busca e exibe o versículo ou intervalo de versículos bíblicos especificado.
*   `/progresso`: Permite registrar e atualizar seu progresso de leitura em um livro.
*   `/rank`: Exibe o ranking de leitura dos membros do servidor.
*   `/addsugestao [nome do livro] [autor (opcional)]`: Adiciona uma sugestão de livro à lista colaborativa do servidor.
*   `/listarsugestoes`: Mostra todas as sugestões de livros feitas pelos membros.
*   `/sortearlivros`: Sorteia um livro da lista de sugestões para ser o próximo a ser lido.


## Detalhes do Desenvolvimento

O desenvolvimento do HikariBot foi focado em modularidade e na utilização eficiente das APIs do Discord e de serviços externos.

*   **Arquitetura de Comandos:** Utiliza o sistema de comandos de barra (slash commands) do Discord, com cada comando encapsulado em seu próprio módulo dentro da pasta `commands/`.
*   **Manipulação de Eventos:** Eventos do Discord como `ready`, `interactionCreate` e `voiceStateUpdate` são gerenciados em módulos dedicados na pasta `events/`, permitindo uma lógica organizada para diferentes interações e gatilhos.
*   **Integração com APIs Externas:** O bot consome diversas APIs (Google Drive, Google Books, Wikipedia, Bible API) para fornecer funcionalidades ricas e dinâmicas. O tratamento de respostas e erros dessas APIs é uma parte crucial da lógica.
*   **Cache:** Para otimizar o desempenho e reduzir o número de chamadas a APIs externas (especialmente Google Drive), um sistema de cache simples baseado em arquivos JSON foi implementado para links compartilháveis e recomendações.
*   **Persistência de Dados:** Dados como progresso de leitura e sugestões de livros são armazenados em arquivos JSON na pasta `database/`.
*   **Configuração:** A configuração principal, como categorias de livros e mapeamentos, é centralizada na pasta `config/`, facilitando a personalização do bot para diferentes bibliotecas e preferências.

## 📝 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato
<div align="center">

[![G-mail](https://skillicons.dev/icons?i=gmail)](mailto:danielwcontato@gmail.com)
[![Instagram](https://skillicons.dev/icons?i=instagram)](https://www.instagram.com/weszzy/)
[![Discord](https://skillicons.dev/icons?i=discord)](http://discordapp.com/users/410553521105010688)

</div>