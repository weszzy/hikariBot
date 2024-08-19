const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Caminho do arquivo de cache
const cacheFilePath = path.resolve(__dirname, '../cache/recommendedBooksCache.json');

// Inicializa o cache de livros recomendados
let recommendedBooksCache = new Set();
try {
    if (fs.existsSync(cacheFilePath)) {
        const cacheData = fs.readFileSync(cacheFilePath, 'utf-8');
        const parsedData = JSON.parse(cacheData);
        if (Array.isArray(parsedData)) {
            recommendedBooksCache = new Set(parsedData);
        }
    }
} catch (err) {
    console.error('Erro ao carregar o cache de livros recomendados:', err);
    recommendedBooksCache = new Set();
}

// Função para salvar o cache
function saveCacheRecom() {
    fs.writeFileSync(cacheFilePath, JSON.stringify([...recommendedBooksCache]), 'utf-8');
}

async function getBookRecommendation(interaction) {
    const books = google.books({ version: 'v1', auth: process.env.GOOGLE_API_KEY });

    const includeKeywords = '';
    const excludeKeywords = '-ateu -católico -Bittencourt -homoafetivo';

    try {
        const res = await books.volumes.list({
            q: `${includeKeywords} ${excludeKeywords}`,
            maxResults: 40,
            orderBy: 'relevance',
            printType: 'books',
            langRestrict: 'pt'
        });

        if (!res.data.items || res.data.items.length === 0) {
            throw new Error('Nenhum livro encontrado');
        }

        const booksFiltered = res.data.items.filter(book => !recommendedBooksCache.has(book.id));

        if (booksFiltered.length === 0) {
            recommendedBooksCache.clear();
            saveCacheRecom();
            return await interaction.editReply({ content: 'Todos os livros já foram recomendados. Reiniciando a lista!' });
        }

        const randomBook = booksFiltered[Math.floor(Math.random() * booksFiltered.length)];
        recommendedBooksCache.add(randomBook.id);

        if (recommendedBooksCache.size > 100) {
            const oldestBook = recommendedBooksCache.values().next().value;
            recommendedBooksCache.delete(oldestBook);
        }

        saveCacheRecom();

        const bookInfo = formatBookInfo(randomBook.volumeInfo);
        await interaction.editReply({ content: `📚 Recomendação da semana:\n\n${bookInfo}` });

    } catch (error) {
        console.error('Erro ao buscar recomendação:', error);
        await interaction.editReply({ content: 'Desculpe, não foi possível encontrar uma recomendação de livro no momento. Por favor, tente novamente mais tarde.' });
    }
}

function formatBookInfo(volumeInfo) {
    const title = volumeInfo.title;
    const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Desconhecido';
    const description = volumeInfo.description ? volumeInfo.description.substring(0, 150) + '...' : 'Descrição não disponível';
    const link = volumeInfo.infoLink;

    return `**${title}**\n👥 Autores: ${authors}\n📖 ${description}\n🔗 Mais informações`;
}

module.exports = { getBookRecommendation };
