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

module.exports = {
    lerSugestoes,  // Exportando a função para uso em outros arquivos
    name: 'listarsugestoes',
    description: 'Lista todas as sugestões de livros',
    async execute(interaction) {
        try {
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply();
            }

            const data = lerSugestoes();
            const sugestoes = data.sugestoes || [];

            if (sugestoes.length === 0) {
                await interaction.editReply('Não há sugestões de livros no momento.');
                return;
            }

            // Sorteia um índice aleatório para escolher uma sugestão
            const indiceAleatorio = Math.floor(Math.random() * sugestoes.length);
            const livroSorteado = sugestoes[indiceAleatorio];

            await interaction.editReply(`O livro sorteado para este mês é: **${livroSorteado.titulo}**, sugerido por ${livroSorteado.userName}!`);
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
