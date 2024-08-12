const { REST, Routes } = require('discord.js');
require('dotenv').config();
const { commands } = require('./config/commands');

const CLIENT_ID = process.env.CLIENT_ID;
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Registrando comandos...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('Comandos registrados com sucesso.');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
})();
