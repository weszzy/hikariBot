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

async function handleRecomendacaoCommand(interaction) {
    const books = google.books({ version: 'v1', auth: process.env.GOOGLE_API_KEY });

    const keywords = ['livros populares', 'mais vendido', 'evangélico', 'adventista', 'bestseller', 'intrinseca', 'sextante', 'Penguin Clássicos']; // Pode ajustar para incluir mais variações
    const minRating = 4; // Reduzido para ampliar o número de livros
    const excludeKeywords = '-Ateu -Católico'; // Palavras-chave a serem excluídas

    let startIndex = 0;
    const maxResults = 40;
    let booksData = [];

    try {
        while (booksData.length === 0 && startIndex < 200) { // Limite de 200 para evitar loops infinitos
            const query = keywords.length > 0 ? keywords.join(' ') : 'livros';
            const res = await books.volumes.list({
                q: `${query} ${excludeKeywords}`,
                orderBy: 'relevance',
                maxResults: maxResults,
                startIndex: startIndex,
                langRestrict: 'pt-BR', // Restrição para livros em português do Brasil
            });

            booksData = res.data.items ? res.data.items.filter(book => !recommendedBooksCache.has(book.id)) : [];
            startIndex += maxResults;
        }

        if (!booksData || booksData.length === 0) {
            recommendedBooksCache.clear();
            saveCacheRecom();
            await interaction.editReply('Todos os livros já foram recomendados. Reiniciando a lista!');
            return;
        }

        const randomBook = booksData[Math.floor(Math.random() * booksData.length)];
        recommendedBooksCache.add(randomBook.id);
        saveCacheRecom();

        const bookInfo = formatBookInfo(randomBook.volumeInfo);
        await interaction.editReply({ content: `📚 Recomendação aleatória:\n\n${bookInfo}` });

    } catch (error) {
        console.error('Erro ao buscar recomendação de livro:', error);
        await interaction.editReply({ content: 'Desculpe, não foi possível encontrar uma recomendação de livro no momento. Por favor, tente novamente mais tarde.' });
    }
}

function formatBookInfo(volumeInfo) {
    const title = volumeInfo.title || 'Título não disponível';
    const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor(es) não disponível';
    const description = volumeInfo.description ? volumeInfo.description.substring(0, 300) + '...' : 'Descrição não disponível';
    const link = volumeInfo.previewLink || volumeInfo.infoLink || 'Link não disponível';

    return `**${title}**\n👥 Autores: ${authors}\n📖 ${description}\n🔗 Mais informações: [Link](${link})`;
}





module.exports = { handleRecomendacaoCommand };
