const { InteractionType, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const lidos = require('../commands/lidos');
const livroatual = require('../commands/livroatual');
const biblioteca = require('../commands/biblioteca');
const categories = require('../config/categories');

module.exports = async (client, interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.commandName === 'lidos') await lidos.execute(interaction);
        if (interaction.commandName === 'livroatual') await livroatual.execute(interaction);
        if (interaction.commandName === 'biblioteca') await biblioteca.execute(interaction);
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
            const link = Object.entries(categories)
                .flatMap(([categoryName, authors]) => Object.entries(authors))
                .find(([author]) => author === selectedAuthor)?.[1]; // Corrigido aqui

            if (link) {
                await interaction.update({
                    content: `Aqui estão os livros de [${selectedAuthor}](${link})`,
                    components: [] // Remove o menu suspenso após a seleção
                });
            } else {
                await interaction.update({
                    content: `Não foi possível encontrar livros para o autor ${selectedAuthor}.`,
                    components: [] // Remove o menu suspenso após a seleção
                });
            }
        }
    }
};
