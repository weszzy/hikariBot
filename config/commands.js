const commands = [
    {
        name: 'biblioteca',
        description: 'Mostra uma lista de categorias de livros disponíveis',
    },
    {
        name: 'recomendacao',
        description: 'Enviamos um livro aleatório',
    },
    {
        name: 'autor',
        description: 'Comando para obter informações sobre um autor',
        options: [
            {
                type: 3, // STRING
                name: 'nome',
                description: 'Nome do autor',
                required: true,
            },
        ],
    },
    {
        name: 'biblia',
        description: 'Busca um versículo da Bíblia',
        options: [
            {
                name: 'livro',
                type: 3, // STRING
                description: 'O livro da Bíblia (ex: joão)',
                required: true,
            },
            {
                name: 'capitulo',
                type: 4, // INTEGER
                description: 'O capítulo da Bíblia',
                required: true,
            },
            {
                name: 'versiculo',
                type: 4, // INTEGER
                description: 'O versículo da Bíblia',
                required: true,
            },
        ],
    }
];

module.exports = { commands };
