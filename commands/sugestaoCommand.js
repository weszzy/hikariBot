const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON que armazenará as sugestões
const jsonPath = path.resolve(__dirname, '../database/sugestoes.json');

function lerSugestoes() {
    if (!fs.existsSync(jsonPath)) {
        fs.writeFileSync(jsonPath, JSON.stringify({ sugestoes: [] }, null, 2));
    }

    try {
        const data = fs.readFileSync(jsonPath, 'utf-8');
        return data ? JSON.parse(data) : { sugestoes: [] };
    } catch (error) {
        console.error('Erro ao ler o arquivo de sugestões:', error);
        return { sugestoes: [] };
    }
}

function salvarSugestoes(data) {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: 'addsugestao',
    description: 'Adiciona uma sugestão de livro',
    options: [
        {
            name: 'livro',
            type: 3, // STRING
            description: 'Título do livro',
            required: true,
        }
    ],
    async execute(interaction) {
        try {
            // Adia a resposta para garantir que só seja feita uma vez
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply();
            }

            const userId = interaction.user.id;
            const member = interaction.guild.members.cache.get(userId);
            const userName = member.nickname || interaction.user.username; // Captura o apelido ou nome de usuário
            const titulo = interaction.options.getString('livro');

            const data = lerSugestoes();
            data.sugestoes.push({ userId, userName, titulo });

            salvarSugestoes(data);

            // Responder à interação
            await interaction.editReply(`Sua sugestão de livro "${titulo}" foi registrada com sucesso!`);

        } catch (error) {
            console.error('Erro ao lidar com a interação:', error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply('Ocorreu um erro ao processar sua solicitação.');
            } else {
                await interaction.reply('Ocorreu um erro ao processar sua solicitação.');
            }
        }
    },
};
