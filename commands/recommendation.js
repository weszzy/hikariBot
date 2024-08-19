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

async function fetchBookRecommendation(keywords, minRating, excludeKeywords) {
    const books = google.books({ version: 'v1', auth: process.env.GOOGLE_API_KEY });

    try {
        const res = await books.volumes.list({
            q: `${keywords.join(' ')} ${excludeKeywords}`,
            maxResults: 40,
            orderBy: 'relevance',
            printType: 'books',
            langRestrict: 'pt'
        });

        if (!res.data.items || res.data.items.length === 0) {
            throw new Error('Nenhum livro encontrado');
        }

        const booksFiltered = res.data.items.filter(book => {
            const rating = book.volumeInfo.averageRating || 0;
            return rating >= minRating && !recommendedBooksCache.has(book.id);
        });

        if (booksFiltered.length === 0) {
            recommendedBooksCache.clear();
            saveCacheRecom();
            return null;
        }

        const randomBook = booksFiltered[Math.floor(Math.random() * booksFiltered.length)];
        recommendedBooksCache.add(randomBook.id);

        if (recommendedBooksCache.size > 100) {
            const oldestBook = recommendedBooksCache.values().next().value;
            recommendedBooksCache.delete(oldestBook);
        }

        saveCacheRecom();

        return formatBookInfo(randomBook.volumeInfo);

    } catch (error) {
        console.error('Erro ao buscar recomendação:', error);
        return null;
    }
}

function formatBookInfo(volumeInfo) {
    return {
        title: volumeInfo.title || 'Título não disponível',
        authors: volumeInfo.authors || ['Autor(es) não disponível'],
        description: volumeInfo.description ? volumeInfo.description.substring(0, 300) + '...' : 'Descrição não disponível',
        infoLink: volumeInfo.infoLink || 'Link não disponível',
        averageRating: volumeInfo.averageRating || 'Avaliação não disponível',
        categories: volumeInfo.categories || ['Categoria(s) não disponível'],
        publisher: volumeInfo.publisher || 'Editora não disponível',
        publishedDate: volumeInfo.publishedDate || 'Data de publicação não disponível'
    };
}

module.exports = { fetchBookRecommendation };
