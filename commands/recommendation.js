const { google } = require('googleapis');

async function getBookRecommendation(interaction) {
    const books = google.books({ version: 'v1', auth: process.env.GOOGLE_API_KEY });

    // Palavras-chave para incluir e excluir
    const includeKeywords = 'Cristão OR Evangélico OR Adventista';
    const excludeKeywords = 'ateu OR católico';

    try {
        // Pesquisa por livros com palavras-chave inclusivas e exclusivas
        const res = await books.volumes.list({
            q: `${includeKeywords} -${excludeKeywords}`,
            maxResults: 10,
            orderBy: 'relevance'
        });

        if (res.data.items && res.data.items.length > 0) {
            // Seleciona um livro aleatório
            const booksList = res.data.items;
            let randomBook;

            // Cache de IDs de livros recomendados (para evitar repetição)
            const recommendedBooksCache = new Set();
            const booksFiltered = booksList.filter(book => !recommendedBooksCache.has(book.id));

            if (booksFiltered.length === 0) {
                recommendedBooksCache.clear(); // Limpa o cache se todos os livros foram recomendados
                return await interaction.editReply({ content: 'Não foi possível encontrar uma recomendação de livro novo.' });
            }

            randomBook = booksFiltered[Math.floor(Math.random() * booksFiltered.length)];
            recommendedBooksCache.add(randomBook.id);

            // Monta a resposta com título, autores e link
            const bookInfo = `**${randomBook.volumeInfo.title}**\nAutores: ${randomBook.volumeInfo.authors.join(', ')}\n**[Link:]** (${randomBook.volumeInfo.infoLink})`;

            await interaction.editReply({ content: `Recomendação da semana:\n${bookInfo}` });
        } else {
            await interaction.editReply({ content: 'Não foi possível encontrar uma recomendação de livro no momento.' });
        }
    } catch (error) {
        console.error('Erro ao buscar recomendação:', error);
        await interaction.editReply({ content: 'Ocorreu um erro ao tentar buscar uma recomendação.' });
    }
}

module.exports = { getBookRecommendation };
