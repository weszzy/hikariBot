const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rank',
    description: 'Exibe o ranking de progresso de leitura',
    async execute(interaction) {
        try {
            const jsonPath = path.resolve(__dirname, '..', 'database', 'readingProgress.json');
            
            if (!fs.existsSync(jsonPath)) {
                return await interaction.editReply('Não há dados de progresso de leitura disponíveis.');
            }
            
            const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            
            if (!data.users || data.users.length === 0) {
                return await interaction.editReply('Não há dados de progresso de leitura disponíveis.');
            }
            
            const userProgress = data.users.sort((a, b) => b.currentPage - a.currentPage).slice(0, 3);
            
            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('🏆 Ranking de Progresso de Leitura 🏆')
                .setDescription('Os 3 leitores mais dedicados:')
                .setTimestamp()
                .setFooter({ text: 'Atualize seu progresso para aparecer no ranking!' });
            
            for (let index = 0; index < userProgress.length; index++) {
                const user = userProgress[index];
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                const progressPercentage = Math.round((user.currentPage / user.totalPages) * 100);
                const progressBar = createProgressBar(progressPercentage);
                
                // Busca o membro no servidor
                const member = await interaction.guild.members.fetch(user.userId).catch(() => null);
                const displayName = member ? member.displayName : 'Usuário Desconhecido';
                
                embed.addFields({
                    name: `${medal} ${displayName}\n\n\n`, 
                    value: `📖 **${user.bookTitle}**\n` +
                           `📊 Progresso: \`${user.currentPage}/${user.totalPages}\` páginas (${progressPercentage}%)\n` +
                           `${progressBar}\n`,
                    inline: false
                });
            }
            
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao executar o comando rank:', error);
            await interaction.editReply('Ocorreu um erro ao processar o comando de ranking.');
        }
    }
};

function createProgressBar(percentage) {
    const filledChar = '🟩';
    const emptyChar = '⬜';
    const totalChars = 10;
    const filledChars = Math.round((percentage / 100) * totalChars);
    const emptyChars = totalChars - filledChars;
    return filledChar.repeat(filledChars) + emptyChar.repeat(emptyChars);
}