const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

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

// Função principal para lidar com o comando de recomendação
async function handleRecomendacaoCommand(interaction) {
    const books = google.books({ version: 'v1', auth: process.env.GOOGLE_API_KEY });

    const keywords = [
        'livros populares',
        'evangélico',
        'adventista',
        'cristão',
        'jesus',
        'cristo',
    ];
    const excludeKeywords = [
        '-Ateu', 
        '-Católico' 
    ];

    let startIndex = 0;
    const maxResults = 40;
    let booksData = [];

    try {
        while (booksData.length === 0 && startIndex < 200) {
            // Construir a consulta com OR entre as palavras-chave
            const query = keywords.map(keyword => `title:${keyword}`).join(' OR ') + ` ${excludeKeywords}`;
            const res = await books.volumes.list({
                q: query,
                orderBy: 'relevance',
                maxResults: maxResults,
                startIndex: startIndex,
                langRestrict: 'pt-BR',
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

module.exports = {
    handleRecomendacaoCommand,
    data: new SlashCommandBuilder()
        .setName('recomendacao')
        .setDescription('Enviamos um livro aleatório'),

    async execute(interaction) {
        await handleRecomendacaoCommand(interaction);
    }
};