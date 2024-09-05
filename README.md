<div align="center">

<img height="180" alt="hikariBot's logo" src="https://i.imgur.com/SwQu4DR.jpg">

# 📚 hikariBot 

[![wakatime](https://wakatime.com/badge/user/bdeb95f3-d0ba-450e-bb85-f5c3aa2006a7/project/be0c4a67-6123-42e1-8973-fd1a24bd4531.svg)](https://wakatime.com/badge/user/bdeb95f3-d0ba-450e-bb85-f5c3aa2006a7/project/be0c4a67-6123-42e1-8973-fd1a24bd4531)

<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E">
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white">
<img src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white">
<img src="https://img.shields.io/badge/Wikipedia-%23000000.svg?style=for-the-badge&logo=wikipedia&logoColor=white">
<img src="https://i.imgur.com/dQ9cEjM.png" height="27px">
</div>

<br>

<div align="center">

O hikariBot foi desenvolvido para gerenciar uma biblioteca de livros em servidores Discord. Permite explorar diversos livros disponíveis, além de outras funções como recomendações, bíblia e informações sobre autores.

</div>




## 🚀 Funcionalidades

- **Exploração de Livros por Categoria e Autor**: Navegue pelas categorias de livros, escolha seu autor e veja todos os livros disponíveis desse autor.
- **Links Compartilháveis**: Gere links para baixar ou ler os livros direto no Google Drive, sem complicação.
- **Cache de Links**: O bot guarda os links gerados para não precisar criar de novo toda hora.
- **Sistema de Menu Interativo**: Interface de seleção baseada em menus interativos no Discord para uma navegação intuitiva e simples.
- **Informações sobre Autores**: Quer saber mais sobre algum autor? O bot usa a API da Wikipedia para te dar um resumo rápido.
- **Busca de Versículos da Bíblia**: Encontre aquele versículo específico rapidinho com a ajuda da API da Bíblia.
- **Notificação automática**: O bot manda notificações automáticas quando o ```Apresentador``` entra no canal de voz.
- **Recomendação**: Obtenha recomendações de livros baseadas em categorias e palavras-chaves preestabelecidas.
- **Registro de progresso**: Marque seu progresso de leitura e acompanhe sua evolução.
- **Ranking**: Veja quem está lendo mais no seu servidor e dispute posições com seus amigos!
- **Adicionar sugestões**: Adicione suas sugestões de livros e ajude a criar uma lista colaborativa.
- **Listar sugestões**: Confira todas as sugestões de livros feitas pelos membros do servidor.
- **Sortear sugestões**: Deixe a sorte escolher o próximo livro da lista para ler!

## 💻 Tecnologias

- **Node.js**:  O motor que roda o bot no servidor.
- **Discord.js**: A biblioteca que faz o bot interagir com o Discord.
- **Google Drive API**: Utilizada para acessar e gerenciar os arquivos no Google Drive.
- **Google Books API**: Busca informações de livros e sugere novas leituras.
- **Wikipedia API**: Para buscar informações sobre autores.
- **API REST da Bíblia**: Para encontrar versículos bíblicos com rapidez.
- **dotenv**: Para manter as variáveis de ambiente seguras e organizadas.

## 📜 Comandos Disponíveis

O bot possui os seguintes comandos que podem ser utilizados no Discord:

- ***/biblioteca***: Mostra as categorias de livros disponíveis e permite escolher um autor.
- ***/recomendacao***: Sugere um livro aleatório para você ler.
- ***/autor***: Dá informações sobre um autor com base no nome fornecido.
- ***/biblia***: Encontra um versículo específico da Bíblia.
- ***/progresso***: Permite registrar seu progresso de leitura.
- ***/rank***: Exibe o ranking de leitura entre os membros.
- ***/addsugestao***: Adiciona uma sugestão de livro à lista do servidor.
- ***/listarsugestoes***: Mostra todas as sugestões de livros.
- ***/sortearlivros***: Sorteia um livro da lista de sugestões.



## 📁 Estrutura do Projeto

```
📂 hikariBot
├── 📂 commands
│   ├── autorCommand.js           # Comando para obter informações sobre um autor
│   ├── bibliaCommand.js          # Comando para buscar versículos da Bíblia
│   ├── biblioteca.js             # Comando principal para interação com a biblioteca
│   ├── listarsugestoesCommand.js # Comando para listar as sugestões feitas por membros
│   ├── progressoCommand.js       # Comando que permite registrar progresso de leitura
│   ├── rankCommand.js            # Comando para exibir o ranking de progresso
│   ├── recomendacaoCommand.js    # Comando para enviar recomendações de livros
│   ├── recommendation.js         # Recomendação automática semanal de livros
│   ├── sortearlivrosCommand.js   # Comando para sortear um livro da lista
│   └── sugestaoCommand.js        # Comando para adicionar um livro à lista
├── 📂 config
│   ├── categories.js             # Configurações das categorias e autores
│   ├── commands.js               # Registro de comandos disponíveis
│   └── livroAbreviacoes.js       # Mapeamento de abreviações de livros da Bíblia
├── 📂 cache
│   ├── recommendedBooksCache.json # Cache das recomendações de livros
│   └── sharedLinksCache.json      # Cache dos links compartilháveis
├── 📂 database
│   ├── readingProgress.json         # Dados de progresso de leitura 
│   └── sugestao.json                # Dados da lista de sugestões  
├── 📂 events
│   ├── interactionCreate.js      # Manipulação das interações do bot
│   ├── ready.js                  # Inicialização do bot
│   └── voiceStateUpdate.js       # Notificações sobre o canal de voz
├── 📂 root
    ├── 📄 .env                       # Variáveis de ambiente (não estão no repo)
    ├── 📄 index.js                   # Inicialização do bot
    ├── 📄 app.js                     # Registro dos comandos usando a API do Discord
    ├── 📄 LICENSE
    ├── 📄 package.json               # Dependências e scripts do projeto
    └── 📄 README.md                  # Documentação do projeto

```

## 📝 Licença

 
Licenciado sob a **[Licença MIT](https://github.com/weszzy/hikariBot/blob/main/LICENSE)**. 

Sinta-se livre para usá-lo e modificá-lo conforme necessário.



