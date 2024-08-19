const cron = require('node-cron');
const { fetchBookRecommendation } = require('../commands/recommendation');

module.exports = async (client) => {
    console.log('Estamos ON!');
    require('../app'); // Registra comandos ao ficar online

    const keywords = ['', '', ''];
    const excludeKeywords = '-ateu -católico -Bittencourt -homoafetivo';
    const minRating = 5;
    const channelId = process.env.CANAL_RECOMENDACOES;

    // Agendar o envio da recomendação semanal para o canal de recomendações
    cron.schedule('0 10 * * 1', async () => { // Agenda para enviar toda segunda-feira às 10h
        const channel = client.channels.cache.get(channelId);
        if (!channel) {
            console.error('Canal de recomendações não encontrado!');
            return;
        }

        const book = await fetchBookRecommendation(keywords, minRating, excludeKeywords);
        if (!book) {
            await channel.send('Não foi possível encontrar uma recomendação de livro nesta semana.');
        } else {
            await channel.send({
                embeds: [{
                    title: `📚 Recomendação da Semana: ${book.title}`,
                    description: book.description,
                    url: book.infoLink,
                    color: 0x3498db,
                    fields: [
                        { name: 'Autor(es)', value: book.authors.join(', '), inline: true },
                        { name: 'Avaliação', value: `${book.averageRating}/5`, inline: true },
                        { name: 'Categorias', value: book.categories ? book.categories.join(', ') : 'Não categorizado', inline: true },
                    ],
                    footer: {
                        text: `Publicado por ${book.publisher || 'Desconhecido'} em ${book.publishedDate || 'Data desconhecida'}`
                    }
                }]
            });
        }
    });
};
