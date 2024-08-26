const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

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

        // Caminho para o arquivo JSON
        const jsonPath = path.resolve(__dirname, '../database/readingProgress.json');

        // Verifica se o arquivo existe
        if (!fs.existsSync(jsonPath)) {
            fs.writeFileSync(jsonPath, JSON.stringify({ users: [] }, null, 2));
        }

        // Lê o arquivo JSON e faz o parsing do conteúdo
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const userIndex = data.users.findIndex(user => user.userId === userId);

        const bookTitle = 'Cartas de um Diabo a seu Aprendiz';
        const totalPages = 208;

        if (userIndex !== -1) {
            data.users[userIndex].currentPage = page;
            data.users[userIndex].lastUpdated = new Date();
        } else {
            data.users.push({
                userId: userId,
                bookTitle: bookTitle,
                totalPages: totalPages,
                currentPage: page,
                lastUpdated: new Date(),
            });
        }

        // Registra as mudanças de volta no arquivo JSON
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

        const progressPercent = Math.min((page / totalPages) * 100, 100).toFixed(2);
        const progressBar = createProgressBar(progressPercent);

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('📚 Progresso de Leitura Atualizado! 📚')
            .setDescription(`Seu progresso em "${bookTitle}" foi atualizado.`)
            .addFields(
                { name: 'Página Atual', value: `${page}/${totalPages}`, inline: true },
                { name: 'Progresso', value: `${progressPercent}%`, inline: true },
                { name: 'Barra de Progresso', value: progressBar },
                { name: 'Páginas Restantes', value: `${totalPages - page}`, inline: true },
                { name: 'Última Atualização', value: new Date().toLocaleString(), inline: true }
            )
            .setFooter({ text: 'Continue lendo! 🎉' })
            .setTimestamp();

        // Responde à interação
        await interaction.editReply({ embeds: [embed] });
    }
};

function createProgressBar (percentage) {
    const filledChar = '🟩';
    const emptyChar = '⬜';
    const totalChars = 10;
    const filledChars = Math.round((percentage / 100) * totalChars);
    const emptyChars = totalChars - filledChars;
    return filledChar.repeat(filledChars) + emptyChar.repeat(emptyChars);
}