<div align="center">

<img height="180" alt="hikariBot's logo" src="https://i.imgur.com/SwQu4DR.jpg">

# 📚 hikariBot 

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

- **Exploração de Livros por Categoria e Autor**: Usuários podem explorar categorias de livros, escolher um autor específico e visualizar todos os livros disponíveis desse autor.
- **Links Compartilháveis**: Geração automática de links compartilháveis para download ou leitura direta dos livros no Google Drive.
- **Cache de Links**: Otimização do desempenho com cache local para links compartilháveis, evitando a geração repetida e desnecessária de links.
- **Sistema de Menu Interativo**: Interface de seleção baseada em menus interativos no Discord para uma navegação intuitiva e simples.
- **Informações sobre Autores**: Obtenha resumos e informações sobre autores utilizando a Wikipedia API.
- **Busca de Versículos da Bíblia**: Encontre versículos específicos utilizando API REST da Bíblia.
- **Notificação automática**: O bot envia uma notificação automática que usa um "event" específico como trigger.
- **Recomendação**: Obtenha recomendações de livros baseadas em categorias e palavras-chaves preestabelecidas.
- **Registro de progresso**: Possibilita o usuário de registrar o progresso de leitura.
- **Ranking**: Juntamente com o **Registro de progresso**, permite ao usuário ver um ranking de leitura com todos os membros participantes.

## 💻 Tecnologias

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **Discord.js**: Biblioteca para interagir com a API do Discord.
- **Google Drive API**: Utilizada para acessar e gerenciar os arquivos no Google Drive.
- **Google Books API**: Buscar informações de livros e enviar recomendações.
- **Wikipedia API**: Para buscar informações sobre autores.
- **API REST da Bíblia**: Busca qualquer versículo bíblico rápido e fácil.
- **dotenv**: Para o gerenciamento seguro das variáveis de ambiente.

## 📜 Comandos Disponíveis

O bot possui os seguintes comandos que podem ser utilizados no Discord:

- ***/biblioteca***: Mostra uma lista de categorias de livros disponíveis e permite a seleção de um autor.
- ***/recomendacao***: Envia uma recomendação aleatória de livro.
- ***/autor***: Fornece informações sobre um autor com base no nome fornecido.
- ***/biblia***: Busca um versículo específico da Bíblia, fornecendo livro, capítulo e versículo.
- ***/progresso***: Permite ao usuário registrar seu progresso de leitura.
- ***/rank***: Exibe um ranking com todos os progressos registrados.
- ***/addsugestao***: Permite que o usuário adicione uma sugestão de livro na lista do servidor.
- ***/listarsugestoes***: Envia a lista de sugestões.
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



