const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const categories = require('../config/categories');

module.exports = {
    execute: async (interaction) => {
        const menu = new StringSelectMenuBuilder()
            .setCustomId('select-category')
            .setPlaceholder('Escolha uma categoria')
            .addOptions(
                Object.keys(categories).map(category => ({
                    label: `Categoria: ${category}`,
                    value: category
                }))
            );

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            content: 'Escolha uma categoria para ver os autores disponíveis:',
            components: [row]
        });
    }
};
