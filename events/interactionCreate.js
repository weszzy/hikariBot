const { InteractionType, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const dropboxV2Api = require('dropbox-v2-api');
require('dotenv').config();

// Importa as partes do código
const lidos = require('../commands/lidos');
const livroatual = require('../commands/livroatual');
const biblioteca = require('../commands/biblioteca');
const categories = require('../config/categories');

const dropbox = dropboxV2Api.authenticate({
    token: process.env.DROPBOX_ACCESS_TOKEN
});

// Cache para armazenar os links compartilhados
const sharedLinksCache = {};

async function getSharedLink(filePath) {
    if (sharedLinksCache[filePath]) {
        return sharedLinksCache[filePath];
    }

    try {
        // Tenta obter um link compartilhado existente
        const existingLinkResponse = await new Promise((resolve, reject) => {
            dropbox({
                resource: 'sharing/get_shared_link_metadata',
                parameters: {
                    url: filePath
                }
            }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        const existingLink = existingLinkResponse.url;
        sharedLinksCache[filePath] = existingLink;
        return existingLink;
    } catch (error) {
        if (error.error && error.error['.tag'] === 'shared_link_already_exists') {
            // Se o erro indica que o link já existe, usa o link existente
            const existingLink = error.error.shared_link_already_exists.metadata.url;
            sharedLinksCache[filePath] = existingLink;
            return existingLink;
        } else {
            // Cria um novo link compartilhável se não existir
            const sharedLinkResponse = await new Promise((resolve, reject) => {
                dropbox({
                    resource: 'sharing/create_shared_link_with_settings',
                    parameters: {
                        path: filePath
                    }
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });

            const newSharedLink = sharedLinkResponse.url;
            sharedLinksCache[filePath] = newSharedLink;
            return newSharedLink;
        }
    }
}

module.exports = async (client, interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.commandName === 'biblioteca') {
            await biblioteca.execute(interaction);
        } else if (interaction.commandName === 'lidos') {
            await lidos.execute(interaction);
        } else if (interaction.commandName === 'livroatual') {
            await livroatual.execute(interaction);
        }
    } else if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'select-category') {
            const selectedCategory = interaction.values[0];
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

            await interaction.update({
                content: 'Escolha um autor para ver os livros disponíveis:',
                components: [row]
            });
        } else if (interaction.customId === 'select-author') {
            const selectedAuthor = interaction.values[0];
            const path = `/Livros/${selectedAuthor}`;

            try {
                await interaction.deferUpdate(); // Adia a resposta para lidar com a interação

                const response = await new Promise((resolve, reject) => {
                    dropbox({
                        resource: 'files/list_folder',
                        parameters: {
                            path: path
                        }
                    }, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });

                // Processar os arquivos e gerar links compartilháveis
                const files = await Promise.all(response.entries
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(async (file) => {
                        try {
                            const sharedLink = await getSharedLink(file.path_lower);
                            return `[${file.name}](${sharedLink})`;
                        } catch (error) {
                            console.error('Erro ao gerar link compartilhável:', error);
                            return `Erro ao gerar link para ${file.name}`;
                        }
                    })
                );

                // Dividindo mensagens para não exceder o limite de 2000 caracteres
                const messages = [];
                let currentMessage = `Aqui estão os livros de **${selectedAuthor}**:\n\n`;

                for (const file of files) {
                    if (currentMessage.length + file.length + 1 > 2000) {
                        messages.push(currentMessage);
                        currentMessage = '';
                    }
                    currentMessage += file + '\n';
                }

                messages.push(currentMessage);

                for (const message of messages) {
                    await interaction.followUp({ content: message });
                }

                await interaction.editReply({
                    content: 'Lista de livros carregada com sucesso!',
                    components: [] // Remove o menu suspenso após a seleção
                });
            } catch (error) {
                console.error('Erro ao acessar o Dropbox:', error);

                let errorMessage = `Ocorreu um erro ao tentar acessar os livros de ${selectedAuthor}.`;

                if (error.statusCode === 500) {
                    errorMessage += " Isso parece ser um problema temporário no Dropbox. Por favor, tente novamente mais tarde.";
                }

                await interaction.editReply({
                    content: errorMessage,
                    components: [] // Remove o menu suspenso após a seleção
                });
            }
        }
    }
};