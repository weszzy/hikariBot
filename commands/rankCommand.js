const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'rank',
    description: 'Exibe o ranking de progresso de leitura',
    async execute(interaction) {
        const jsonPath = path.resolve(__dirname, '../cache/readingProgress.json');
        
        if (!fs.existsSync(jsonPath)) {
            return interaction.reply('Não há dados de progresso de leitura disponíveis.');
        }

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const userProgress = data.users.sort((a, b) => b.currentPage - a.currentPage).slice(0, 10);

        let rankMessage = '🏆 **Ranking de Progresso de Leitura** 🏆\n\n';

        userProgress.forEach((user, index) => {
            rankMessage += `**${index + 1}.** <@${user.userId}> - Página ${user.currentPage}/${user.totalPages}\n`;
        });

        await interaction.reply(rankMessage);
    }
};
