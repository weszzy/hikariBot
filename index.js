const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

// Carregar os versículos bíblicos do arquivo JSON
const biblicalQuotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'biblicalQuotes.json'), 'utf-8')).quotes;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const discordChannelId = process.env.DISCORD_CHANNEL_ID;

const coordinates = {
    "Fortaleza": { lat: -3.7172, lon: -38.5433 },
    "São Paulo": { lat: -23.5505, lon: -46.6333 },
    "Rio de Janeiro": { lat: -22.9068, lon: -43.1729 },
    "Brasília": { lat: -15.7801, lon: -47.9292 }
}

const commands = [
    {
        name: 'lidos',
        description: 'Mostra os livros já lidos.'
    },
    {
        name: 'trecho',
        description: 'Envia um trecho bíblico aleatório.'
    },
    {
        name: 'livroatual',
        description: 'Envia um resumo do livro que estamos lendo.'
    },
    {
        name: 'biblioteca',
        description: 'Mostra uma lista de autores com livros disponíveis'
    }
];

const authors = {
    "Ellen G. White": "https://drive.google.com/drive/folders/1-iQzjDK3Acv4DuBeEJc0DMWrbCM0Vgd3?usp=drive_link",
    "C. S. Lewis": "https://drive.google.com/drive/folders/1-4Nd3TmNOC-dPYY0YVm0AZL4rEKDOiAo?usp=drive_link"
};

client.once('ready', async () => {
    console.log('Bot is online!');
    scheduleDailyMessage(); // Agendar a mensagem diária

    // Registrar comandos de barra
    const CLIENT_ID = client.user.id;
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

    try {
        console.log('Comandos...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('Comandos registrados com sucesso.');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'lidos') {
        const booksRead = [
            { title: "Amor de Redenção", link: "<https://drive.google.com/file/d/1kCLdC9F28IT6C9DOps3gjC9mYJiyuPwG/view?usp=drive_link>" },
            { title: "Caminho a Cristo", link: "<https://drive.google.com/file/d/1dUQQfDSOIAozlQFum3WNRE6RmyIH-eLs/view?usp=drive_link>" },
            { title: "A Verdade sobre os Anjos", link: "<https://drive.google.com/file/d/1TwJZi1cp46V1h9QnRRUpGO8gnAJppC7y/view?usp=drive_link>" },
        ];

        let response = "**Nós já lemos estes livros:**\n";
        booksRead.forEach((book, index) => {
            response += `${index + 1}. [${book.title}](${book.link})\n`;
        });
        await interaction.reply(response);
    }

    if (commandName === 'livroatual') {
        const response = `
    **Estamos lendo este livro:**\n
    **📖 Título**: Cartas de um Diabo a seu Aprendiz
    **👨🏻 Autor**: C.S. Lewis
    **📅 Publicação**: Publicado originalmente em 1942
    **📄 Páginas**: 208
    **📁 [Baixar](<https://drive.google.com/file/d/18isNNkp1qRkm2SABcm5U1mgCjgu3jt8X/view?usp=drive_link>)**
    
    **Contexto Histórico**: 
    • Escrito durante a Segunda Guerra Mundial, o livro reflete as ansiedades e desafios espirituais daquela época.
    • C.S. Lewis, um renomado acadêmico e apologista cristão, utilizou sua experiência pessoal e seu vasto conhecimento teológico para dar profundidade às suas personagens e aos temas abordados.
    
    **Temas Principais**:
    • **Tentações e Pecados**: Através das cartas, Lewis explora como pequenos deslizes podem levar a grandes pecados, destacando a sutileza das tentações.
    • **Natureza Humana**: A obra oferece uma visão profunda sobre a fraqueza e a resiliência da natureza humana.
    • **Perspectiva Diabólica**: Ao adotar a perspectiva dos demônios, Lewis inverte a moralidade convencional, criando uma narrativa única e provocativa.
    • **Cristianismo e Fé**: O livro é um exame profundo da fé cristã, suas provações e como a fé pode ser uma arma contra as tentações.
    
    **Curiosidades**:
    • C.S. Lewis dedicou o livro a seu amigo e colega escritor J.R.R. Tolkien.
    • O livro é frequentemente utilizado em estudos religiosos e em discussões sobre ética e moralidade.`;

        await interaction.reply(response);
    }

    if (commandName === 'biblioteca') {
        const menu = new StringSelectMenuBuilder()
            .setCustomId('select-author')
            .setPlaceholder('Escolha um autor')
            .addOptions(
                Object.keys(authors).map(author => ({
                    label: `Livros de ${author}`,
                    value: author
                }))
            );

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            content: 'Escolha um autor para ver os livros disponíveis:',
            components: [row]
        });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isStringSelectMenu()) {
        const selectedAuthor = interaction.values[0];
        const link = authors[selectedAuthor];

        // Responde com o nome do autor e o link para a pasta
        await interaction.update({
            content: `Aqui estão os livros de [${selectedAuthor}](${link})`,
            components: [] // Remove o menu suspenso após a seleção
        });
    }
});

let lastQuoteIndex = -1; // Evita que a mesma citação seja repetida em dias consecutivos

function getRandomQuote() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * biblicalQuotes.length);
    } while (newIndex === lastQuoteIndex);
    lastQuoteIndex = newIndex;
    return biblicalQuotes[newIndex];
}

async function getTemperature(city) {
    try {
        // Verifique se o objeto 'coordinates' está definido e tem as coordenadas
        if (!coordinates[city]) {
            throw new Error(`Coordenadas para a cidade ${city} não encontradas.`);
        }

        const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude: coordinates[city].lat,
                longitude: coordinates[city].lon,
                current_weather: true
            }
        });
        return response.data.current_weather.temperature;
    } catch (error) {
        console.error('Erro ao obter a temperatura:', error);
        return 'Não disponível';
    }
}

async function sendDailyMessage() {
    const channel = await client.channels.fetch(discordChannelId);
    if (!channel) return console.error('Canal não encontrado.');

    const temperature = await getTemperature('Fortaleza');
    const randomQuote = getRandomQuote();

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Mensagem Diária')
        .setDescription(`**Temperatura atual em Fortaleza:** ${temperature}°C\n\n**Trecho Bíblico:**\n${randomQuote}`)
        .setTimestamp()
        .setFooter({ text: 'Hikari' });

    await channel.send({ embeds: [embed] });
}

function scheduleDailyMessage() {
    cron.schedule('0 8 * * *', sendDailyMessage, {
        timezone: 'America/Fortaleza',
    });
}

client.login(process.env.DISCORD_BOT_TOKEN);
