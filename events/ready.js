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
            await channel.send(`Recomendação da semana: **${book.title}** por ${book.authors.join(', ')}\nAvaliação: ${book.averageRating}/5\n[Mais detalhes](${book.infoLink})`);
        }
    });
};
