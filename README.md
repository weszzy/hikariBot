<div align="center">

<img height="180" alt="hikariBot's logo" src="https://i.imgur.com/SwQu4DR.jpg">

# 📚 hikariBot 

<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E">
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white">
<img src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white">




</div>

Projetado para gerenciar uma biblioteca de livros digitais dentro de um servidor de Discord. Esse bot permite que os usuários explorem uma variedade de categorias e autores, acessando os livros diretamente do Google Drive.



## 🚀 Funcionalidades

- **Exploração de Livros por Categoria e Autor**: Usuários podem explorar categorias de livros, escolher um autor específico e visualizar todos os livros disponíveis desse autor.
- **Links Compartilháveis**: Geração automática de links compartilháveis para download ou leitura direta dos livros no Google Drive.
- **Cache de Links**: Otimização do desempenho com cache local para links compartilháveis, evitando a geração repetida e desnecessária de links.
- **Sistema de Menu Interativo**: Interface de seleção baseada em menus interativos no Discord para uma navegação intuitiva e simples.


## 💻 Tecnologias

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **Discord.js**: Biblioteca para interagir com a API do Discord.
- **Google Drive API**: Utilizada para acessar e gerenciar os arquivos no Google Drive.
- **dotenv**: Para o gerenciamento seguro das variáveis de ambiente.
## 📜 Comandos Disponíveis

O bot possui os seguintes comandos que podem ser utilizados no Discord:

**/biblioteca**: Inicia a navegação pela biblioteca, permitindo a seleção de uma categoria e, em seguida, de um autor.

~~**/lidos**: Envia uma lista de livros que já lemos no clube do livro, juntamente com o link para download de cada um.~~ (**Removido**)

~~**/livroatual**: Envia um breve resumo e informações sobre o livro que estamos lendo atualmente.~~ (**Removido**)
## 📝 Configurações e Personalizações
- **Adicionando Novas Categorias e Autores**

Para adicionar novas categorias e autores, edite o arquivo categories.js dentro da pasta config. O formato segue o exemplo abaixo:
```bash
  module.exports = {
    "Cristãos": {
        "Ellen G. White": "link",
        "C. S. Lewis": "link",
        // etc
    },
    "Outros": {
        "Augusto Cury": "link",
        "Colleen Hoover": "link",
        // etc
    }
};

```

- **Cache de Links Compartilháveis**

O cache é armazenado em **./cache/sharedLinksCache.json**. Isso melhora a performance ao evitar a geração repetida de links compartilháveis para o mesmo arquivo. Se necessário, o cache pode ser manualmente apagado para regenerar os links.
## 🚨 Segurança e Considerações
- **Permissões do Google Drive**: As permissões para os arquivos no Google Drive são configuradas para serem acessíveis por "qualquer pessoa com o link". Certifique-se de revisar essas configurações para não infringir nenhuma regra.

- **Gerenciamento de Tokens**: O token de atualização do Google Drive é sensível e deve ser mantido em segredo. Considere rotacionar esse token periodicamente.
## 📁 Estrutura do Projeto

```
📂 hikariBot
├── 📂 commands
│   ├── biblioteca.js      # Comando principal para interação com a biblioteca
│   └── lidos.js           # Comando removido do projeto
│   └── livroatual.js      # Comando removido do projeto
├── 📂 config
│   └── categories.js      # Configurações das categorias e autores
├── 📂 cache
│   └── sharedLinksCache.json  # Cache dos links compartilháveis gerados
├── 📂 .env                # Variáveis de ambiente (não incluído no repositório)
├── 📂 index.js            # inicialização do bot
├── 📂 interactionCreate.js # Arquivo principal para manipulação das interações do bot
├── 📂 package.json        # Dependências e scripts do projeto
└── 📂 README.md           # Documentação do projeto

```

## 📝 Licença

 
Licenciado sob a **[Licença MIT](https://github.com/weszzy/hikariBot/blob/main/LICENSE)**. 

Sinta-se livre para usá-lo e modificá-lo conforme necessário.



