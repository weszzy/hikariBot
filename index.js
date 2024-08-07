require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const cron = require('node-cron');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const discordChannelId = '1268315269005181018';

const biblicalQuotes = [
    '“Vinde a mim, todos os que estão cansados e oprimidos, e eu vos aliviarei. - Mateus 11:28”',
    '“O Senhor é meu pastor, nada me faltará.” - Salmo 23:1',
    '“Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.” - João 3:16',
    '“O Senhor é a minha força, e o meu cântico; ele me foi por salvação; ele é o meu Deus, e eu lhe farei uma habitação; ele é o Deus de meu pai, e eu o exaltarei.” - Êxodo 15:2',
    '“Não temas, porque eu estou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.” - Isaías 41:10',
    // Adicionar mais frases
];

client.once('ready', () => {
    console.log('Bot is online!');
    scheduleDailyMessage(); // agendar a mensagem diária
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content === '/lidos') {
        const response = `
**Nós já lemos estes livros:**
1. [Amor de Redenção](<https://drive.google.com/file/d/1kCLdC9F28IT6C9DOps3gjC9mYJiyuPwG/view?usp=drive_link>)
2. [Caminho a Cristo](<https://drive.google.com/file/d/1dUQQfDSOIAozlQFum3WNRE6RmyIH-eLs/view?usp=drive_link>)
3. [A Verdade sobre os Anjos](<https://drive.google.com/file/d/1TwJZi1cp46V1h9QnRRUpGO8gnAJppC7y/view?usp=drive_link>)
        `;
        message.channel.send(response);
    }

    if (message.content.startsWith('/clima')) {
        const city = message.content.replace('/clima', '').trim();
        if (!city) {
            message.channel.send('Por favor, forneça o nome de uma cidade.');
            return;
        }

        try {
            const temperature = await getTemperature(city);
            const randomQuote = biblicalQuotes[Math.floor(Math.random() * biblicalQuotes.length)];
            const dayOfWeek = format(new Date(), 'eeee', { locale: ptBR }); // dia da semana em português

            const response = `\`\`\`Bom dia!🌞\n\nHoje é ${dayOfWeek} e faz ${temperature}ºC em ${city}.\n\n📖 ${randomQuote}\`\`\``;
            message.channel.send(response);
        } catch (error) {
            console.error(error);
            message.channel.send('Desculpe, não consegui obter as informações do clima. Verifique se o nome da cidade está correto.');
        }
    }
});

async function getTemperature(city) {
    // Coordenadas de Fortaleza
    const coordinates = {
        Fortaleza: { lat: -3.71722, lon: -38.54337 }
    };

    if (!coordinates[city]) {
        throw new Error('Cidade não encontrada');
    }

    const { lat, lon } = coordinates[city];
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    return response.data.current_weather.temperature;
}

function scheduleDailyMessage() {
    cron.schedule('0 8 * * *', async () => {
        try {
            const city = 'Fortaleza'; // Cidade fixa
            const temperature = await getTemperature(city);
            const randomQuote = biblicalQuotes[Math.floor(Math.random() * biblicalQuotes.length)];
            const dayOfWeek = format(new Date(), 'eeee', { locale: ptBR }); // Obtém o dia da semana em português

            const response = `\`\`\`Bom dia!🌞\n\nHoje é ${dayOfWeek} e faz ${temperature}ºC em ${city}.\n\n📖 ${randomQuote}\`\`\``;
            const channel = await client.channels.fetch(discordChannelId);
            channel.send(response);
        } catch (error) {
            console.error('Erro ao enviar mensagem diária:', error);
        }
    }, {
        timezone: "America/Fortaleza" // Define o fuso horário para Fortaleza
    });
}
client.login(process.env.DISCORD_BOT_TOKEN);