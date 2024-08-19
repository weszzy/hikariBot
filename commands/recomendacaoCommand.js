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

    const keywords = [''];
    const minRating = 5; // Definindo uma avaliação mínima de 5 estrelas
    const excludeKeywords = ['-Ateu', '-Católico']; // Palavras-chave a serem excluídas

    try {
        const res = await books.volumes.list({
            q: keywords.join(' '),
            orderBy: 'relevance',
            maxResults: 40
        });

        const booksData = res.data.items;
        if (!booksData) {
            throw new Error('Nenhum livro encontrado');
        }

        // Filtrar os livros que possuem uma avaliação mínima e que ainda não foram recomendados
        const recommendedBooks = booksData.filter(book => {
            const rating = book.volumeInfo.averageRating || 0;
            return rating >= minRating && !recommendedBooksCache.has(book.id);
        });

        if (recommendedBooks.length === 0) {
            // Limpa o cache e reinicia se todos os livros foram recomendados
            recommendedBooksCache.clear();
            saveCacheRecom();
            await interaction.editReply('Todos os livros já foram recomendados. Reiniciando a lista!');
            return;
        }

        // Selecionar um livro aleatório dentre os que passaram no filtro
        const randomBook = recommendedBooks[Math.floor(Math.random() * recommendedBooks.length)];
        recommendedBooksCache.add(randomBook.id); // Adiciona o livro ao cache
        saveCacheRecom(); // Salva o cache atualizado

        const bookInfo = formatBookInfo(randomBook.volumeInfo);
        await interaction.editReply({ content: `📚 Recomendação do hikariBot:\n\n${bookInfo}` });

    } catch (error) {
        console.error('Erro ao buscar recomendação de livro:', error);
        await interaction.editReply({ content: 'Desculpe, não foi possível encontrar uma recomendação de livro no momento. Por favor, tente novamente mais tarde.' });
    }
}

function formatBookInfo(volumeInfo) {
    const title = volumeInfo.title;
    const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Desconhecido';
    const description = volumeInfo.description ? volumeInfo.description.substring(0, 150) + '...' : 'Descrição não disponível';
    const link = volumeInfo.infoLink;

    return `**${title}**\n👥 Autores: ${authors}\n📖 ${description}\n🔗 Mais informações: [Link](${link})`;
}

module.exports = { handleRecomendacaoCommand };
