const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'progresso',
    description: 'Registra o progresso de leitura do membro',
    options: [
        {
            name: 'pagina',
            type: 4, // INTEGER
            description: 'Número da página atual',
            required: true,
        }
    ],
    async execute(interaction) {
        const userId = interaction.user.id;
        const page = interaction.options.getInteger('pagina');

        // Caminho para o arquivo JSON na nova pasta 'database'
        const jsonPath = path.resolve(__dirname, '../database/readingProgress.json');

        // Verifica se o arquivo existe, se não, cria uma estrutura inicial
        if (!fs.existsSync(jsonPath)) {
            fs.writeFileSync(jsonPath, JSON.stringify({ users: [] }, null, 2));
        }

        // Lê o arquivo JSON e faz o parsing do conteúdo
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const userIndex = data.users.findIndex(user => user.userId === userId);

        if (userIndex !== -1) {
            data.users[userIndex].currentPage = page;
            data.users[userIndex].lastUpdated = new Date();
        } else {
            data.users.push({
                userId: userId,
                bookTitle: 'Livro Atual', // Substitua pelo título do livro atual
                totalPages: 300, // Substitua pelo número total de páginas
                currentPage: page,
                lastUpdated: new Date(),
            });
        }

        // Escreve as mudanças de volta no arquivo JSON
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

        const progressPercent = Math.min((page / 300) * 100, 100).toFixed(2); // Substitua 300 pelo número total de páginas
        const progressBar = `[${'#'.repeat(Math.floor(progressPercent / 10))}${'-'.repeat(10 - Math.floor(progressPercent / 10))}] ${progressPercent}%`;

        await interaction.reply(`Seu progresso de leitura foi atualizado!\n${progressBar}`);
    }
};
