const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function handleAutorCommand(interaction) {
    const autor = interaction.options.getString('nome');

    try {
        const response = await axios.get(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(autor)}`);
        const { extract, content_urls, title, thumbnail } = response.data;

        if (extract) {
            const embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle(title)
                .setDescription(extract)
                .setURL(content_urls.desktop.page)
                .setFooter({ text: 'Informações extraídas da Wikipédia' })
                .setTimestamp(); // Adiciona a data e hora no rodapé

            // Adiciona uma imagem do autor, se disponível
            if (thumbnail && thumbnail.source) {
                embed.setThumbnail(thumbnail.source);
            }

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply(`Não foi possível encontrar informações sobre o autor **${autor}**.`);
        }
    } catch (error) {
        console.error('Erro ao buscar informações do autor:', error);
        await interaction.editReply('Ocorreu um erro ao tentar buscar informações sobre esse autor.');
    }
}

module.exports = { handleAutorCommand };
