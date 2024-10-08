const { InteractionType, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { handleRecomendacaoCommand } = require('../commands/recomendacaoCommand');
const { handleAutorCommand } = require('../commands/autorCommand');
const { execute: handleProgressoCommand } = require('../commands/progressoCommand');
const { execute: handleRankCommand } = require('../commands/rankCommand');
const { execute: handleBibliaCommand } = require('../commands/bibliaCommand');
const { execute: handleSugestaoCommand } = require('../commands/sugestaoCommand');
const { execute: handleListarSugestoesCommand } = require('../commands/listarsugestoesCommand');
const { execute: handleSortearLivrosCommand } = require('../commands/sortearlivrosCommand');
const biblioteca = require('../commands/biblioteca');
const categories = require('../config/categories');
const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config();
const { oauth2Client } = require('../index');

// Inicializa o cache de links compartilhados
const cacheFilePath = './cache/sharedLinksCache.json';
let sharedLinksCache = {};
if (fs.existsSync(cacheFilePath)) {
    try {
        const cacheData = fs.readFileSync(cacheFilePath, 'utf-8');
        sharedLinksCache = cacheData ? JSON.parse(cacheData) : {};
    } catch (err) {
        console.error('Erro ao carregar o cache de links compartilhados:', err);
        sharedLinksCache = {};
        fs.writeFileSync(cacheFilePath, JSON.stringify(sharedLinksCache, null, 2), 'utf-8');
    }
}

// Função para salvar o cache
async function saveCache() {
    fs.writeFileSync(cacheFilePath, JSON.stringify(sharedLinksCache, null, 2), 'utf-8');
}

// Função para obter o link compartilhável do Google Drive
async function getSharedLink(fileId) {
    if (sharedLinksCache[fileId]) {
        return sharedLinksCache[fileId];
    }

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    try {
        // Define as permissões para que o link seja acessível publicamente
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        // Obtém o link compartilhável
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink'
        });

        const newSharedLink = result.data.webViewLink;
        sharedLinksCache[fileId] = newSharedLink;

        // Salva o cache atualizado
        await saveCache();

        return newSharedLink;
    } catch (error) {
        console.error('Erro ao gerar link compartilhável:', error);
        throw error;
    }
}

module.exports = async (client, interaction) => {
    try {
        if (interaction.type === InteractionType.ApplicationCommand) {
            // Adia a resposta para o comando, garantindo que só será feito uma vez
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply();
            }

            switch (interaction.commandName) {
                case 'biblioteca':
                    await biblioteca.execute(interaction);
                    break;
                case 'recomendacao':
                    await handleRecomendacaoCommand(interaction);
                    break;
                case 'autor':
                    await handleAutorCommand(interaction);
                    break;
                case 'biblia':
                    await handleBibliaCommand(interaction);
                    break;
                case 'progresso':
                    await handleProgressoCommand(interaction);
                    break;
                case 'rank':
                    await handleRankCommand(interaction);
                    break;
                case 'addsugestao':
                    await handleSugestaoCommand(interaction);
                    break;
                case 'listarsugestoes':
                    await handleListarSugestoesCommand(interaction);
                    break;
                case 'sortearlivros':
                    await handleSortearLivrosCommand(interaction);
                    break;
                default:
                    await interaction.editReply('Comando não reconhecido.');
            }
        } else if (interaction.isStringSelectMenu()) {
            // Adia a resposta para a interação do menu
            if (!interaction.deferred) await interaction.deferUpdate();

            if (interaction.customId === 'select-category') {
                const selectedCategory = interaction.values[0];
                console.log(`Categoria selecionada: ${selectedCategory}`);
                const selectedAuthors = categories[selectedCategory];

                const authorMenu = new StringSelectMenuBuilder()
                    .setCustomId('select-author')
                    .setPlaceholder(`Escolha um autor de ${selectedCategory}`)
                    .addOptions(
                        Object.keys(selectedAuthors).map(author => ({
                            label: `Livros de ${author}`,
                            value: author
                        }))
                    );

                const row = new ActionRowBuilder().addComponents(authorMenu);

                await interaction.editReply({
                    content: 'Escolha um autor para ver os livros disponíveis:',
                    components: [row]
                });
            } else if (interaction.customId === 'select-author') {
                const selectedAuthor = interaction.values[0];
                console.log(`Autor selecionado: ${selectedAuthor}`);
                const drive = google.drive({ version: 'v3', auth: oauth2Client });

                try {
                    // Busca pela pasta do autor
                    const folderResponse = await drive.files.list({
                        q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${selectedAuthor}'`,
                        fields: 'files(id, name)',
                    });

                    if (folderResponse.data.files.length === 0) {
                        await interaction.editReply({
                            content: `Nenhuma pasta encontrada para o autor ${selectedAuthor}.`,
                            components: []
                        });
                        return;
                    }

                    const authorFolderId = folderResponse.data.files[0].id;

                    // Busca pelos arquivos dentro da pasta do autor
                    const response = await drive.files.list({
                        q: `'${authorFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
                        fields: 'files(id, name)',
                    });

                    console.log(`Arquivos encontrados: ${response.data.files.length}`);

                    if (response.data.files.length === 0) {
                        await interaction.editReply({
                            content: `Nenhum livro encontrado para o autor ${selectedAuthor}.`,
                            components: []
                        });
                        return;
                    }

                    // Gerar links compartilháveis para os arquivos encontrados
                    const files = await Promise.all(response.data.files
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(async (file) => {
                            try {
                                const sharedLink = await getSharedLink(file.id);
                                console.log(`Link gerado para o arquivo ${file.name}: ${sharedLink}`);
                                return `[${file.name}](<${sharedLink}>)`;
                            } catch (error) {
                                console.error('Erro ao gerar link compartilhável:', error);
                                return `Erro ao gerar link para ${file.name}`;
                            }
                        })
                    );

                    // Dividir os arquivos em mensagens menores se necessário
                    const messages = [];
                    let currentMessage = `Aqui estão os livros de **${selectedAuthor}**:\n\n`;

                    for (const file of files) {
                        if (currentMessage.length + file.length + 1 > 2000) {
                            messages.push(currentMessage);
                            currentMessage = '';
                        }
                        currentMessage += `• ${file}\n`;
                    }

                    if (currentMessage.length > 0) {
                        messages.push(currentMessage);
                    }

                    // Enviar as mensagens
                    for (const message of messages) {
                        await interaction.followUp({ content: message });
                    }

                    // Edita a resposta original após todos os follow-ups
                    await interaction.editReply({
                        content: 'Lista de livros carregada com sucesso!',
                        components: []
                    });
                } catch (error) {
                    console.error('Erro ao acessar o Google Drive:', error);

                    await interaction.editReply({
                        content: `Ocorreu um erro ao tentar acessar os livros de ${selectedAuthor}.`,
                        components: []
                    });
                }
            }
        }
    } catch (error) {
        console.error('Erro ao lidar com a interação:', error);

        if (interaction.deferred || interaction.replied) {
            await interaction.editReply('Ocorreu um erro ao processar sua solicitação.');
        } else {
            await interaction.reply('Ocorreu um erro ao processar sua solicitação.');
        }
    }
};
