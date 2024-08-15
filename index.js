// index.js
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis'); // Para interagir com Google Drive

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

// Configuração do OAuth2 para Google Drive
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Define o token de atualização
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

// Exporta a instância do cliente e o cliente OAuth2
module.exports = { client, oauth2Client };

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
