const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox'); // Importa o SDK do Dropbox
const fetch = require('node-fetch'); // Adiciona node-fetch como required para o Dropbox SDK

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch }); // Inicializa o Dropbox com o token

// Exporta a instância do Dropbox para ser usada em outros arquivos
module.exports = { client, dbx };

// Carregar eventos
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
}

client.login(process.env.DISCORD_BOT_TOKEN);