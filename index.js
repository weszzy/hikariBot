const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const discordChannelId = process.env.DISCORD_CHANNEL_ID;

const coordinates = {
    "Fortaleza": { lat: -3.7172, lon: -38.5433 },
    "São Paulo": { lat: -23.5505, lon: -46.6333 },
    "Rio de Janeiro": { lat: -22.9068, lon: -43.1729 },
    "Brasília": { lat: -15.7801, lon: -47.9292 }
}

const biblicalQuotes = [
    '“Porque eu bem sei os pensamentos que penso de vós, diz o Senhor; pensamentos de paz, e não de mal, para vos dar um futuro e uma esperança.” - Jeremias 29: 11',
    '“Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.” - João 3: 16',
    '“O Senhor é o meu pastor, nada me faltará.” - Salmos 23: 1',
    '“Posso todas as coisas naquele que me fortalece.” - Filipenses 4: 13',
    '“E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.” - Romanos 8: 28',
    '“Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.Reconhece - o em todos os teus caminhos, e ele endireitará as tuas veredas.” - Provérbios 3: 5 - 6',
    '“Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te esforço, e te ajudo, e te sustento com a destra da minha justiça.” - Isaías 41: 10',
    '“Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.” - Mateus 11: 28',
    '“Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.” - Salmos 46: 1',
    '“Não to mandei eu ? Esforça - te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.” - Josué 1: 9',
    '“E não sede conformados com este mundo, mas sede transformados pela renovação do vosso entendimento, para que experimenteis qual seja a boa, agradável, e perfeita vontade de Deus.” - Romanos 12: 2',
    '“O Senhor é a minha luz e a minha salvação; a quem temerei ? O Senhor é a força da minha vida; de quem me recearei ?” - Salmos 27: 1',
    '“Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus.Não vem das obras, para que ninguém se glorie.” - Efésios 2: 8 - 9',
    '“O amor é paciente, o amor é bondoso.Não inveja, não se vangloria, não se orgulha.Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.O amor não se alegra com a injustiça, mas se alegra com a verdade.Tudo sofre, tudo crê, tudo espera, tudo suporta.” - 1 Coríntios 13: 4 - 7',
    '“Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não vêem.” - Hebreus 11: 1',
    '“Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.” - Salmos 119: 105',
    '“Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica com ação de graças.E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.” - Filipenses 4: 6 - 7',
    '“Mas os que esperam no Senhor renovarão as forças; subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.” - Isaías 40: 31',
    '“Mas buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.” - Mateus 6: 33',
    '“Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.” - Salmos 91: 1',
    '“Ora, o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança pela virtude do Espírito Santo.” - Romanos 15: 13',
    '“Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.” - 2 Coríntios 5: 17',
    '“Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.” - 1 Pedro 5: 7',
    '“Vós sois a luz do mundo; uma cidade edificada sobre um monte não pode esconder - se.” - Mateus 5: 14',
    '“Provai, e vede que o Senhor é bom; bem - aventurado o homem que nele confia.” - Salmos 34: 8',
    '“Bendito o homem que confia no Senhor, e cuja confiança é o Senhor.” - Jeremias 17: 7',
    '“A saber: Se com a tua boca confessares ao Senhor Jesus, e em teu coração creres que Deus o ressuscitou dos mortos, serás salvo.” - Romanos 10: 9',
    '“Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança.” - Gálatas 5: 22 - 23',
    '“Não veio sobre vós tentação, senão humana; mas fiel é Deus, que não vos deixará tentar acima do que podeis, antes com a tentação dará também o escape, para que a possais suportar.” - 1 Coríntios 10: 13',
    '“Levantarei os meus olhos para os montes, de onde vem o meu socorro.O meu socorro vem do Senhor, que fez o céu e a terra.” - Salmos 121: 1 - 2',
    '“Meus irmãos, tende grande gozo quando cairdes em várias tentações; Sabendo que a prova da vossa fé opera a paciência.” - Tiago 1: 2 - 3',
    '“O nome do Senhor é uma torre forte; o justo corre para ela e está seguro.” - Provérbios 18: 10',
    '“Que diremos, pois, a estas coisas ? Se Deus é por nós, quem será contra nós ?” - Romanos 8: 31',
    '“Deixo - vos a paz, a minha paz vos dou; não vo - la dou como o mundo a dá.Não se turbe o vosso coração, nem se atemorize.” - João 14: 27',
    '“Deleita - te também no Senhor, e te concederá os desejos do teu coração.” - Salmos 37: 4',
    '“Jesus Cristo é o mesmo ontem, e hoje, e eternamente.” - Hebreus 13: 8',
    '“Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.” - Provérbios 16: 3',
    '“Lança o teu cuidado sobre o Senhor, e ele te susterá; não permitirá jamais que o justo seja abalado.” - Salmos 55: 22',
    '“E tudo quanto fizerdes, fazei - o de todo o coração, como ao Senhor e não aos homens.” - Colossenses 3: 23',
    '“Este é o dia que fez o Senhor; regozijemo - nos, e alegremo - nos nele.” - Salmos 118: 24',
    '“Revesti - vos de toda a armadura de Deus, para que possais estar firmes contra as astutas ciladas do diabo.” - Efésios 6: 11',
    '“Pedi, e dar - se - vos - á; buscai, e encontrareis; batei, e abrir - se - vos - á.” - Mateus 7: 7',
    '“E conhecereis a verdade, e a verdade vos libertará.” - João 8: 32',
    '“Em qualquer tempo em que eu temer, confiarei em ti.” - Salmos 56: 3',
    '“No amor não há medo; ao contrário o perfeito amor expulsa o medo, porque o medo supõe castigo.Aquele que tem medo não está aperfeiçoado no amor.” - 1 João 4: 18',
    '“Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus, que não andam segundo a carne, mas segundo o Espírito.” - Romanos 8: 1',
    '“Porque a palavra de Deus é viva e eficaz, e mais penetrante do que espada alguma de dois gumes, e penetra até à divisão da alma e do espírito, e das juntas e medulas, e é apta para discernir os pensamentos e intenções do coração.” - Hebreus 4: 12',
    '“A minha carne e o meu coração desfalecem; mas Deus é a fortaleza do meu coração, e a minha porção para sempre.” - Salmos 73: 26',
    '“Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.” - Provérbios 4: 23',
];

const commands = [
    {
        name: 'lidos',
        description: 'Mostra os livros já lidos.'
    },
    {
        name: 'clima',
        description: 'Mostra a temperatura atual de uma cidade específica.',
        options: [
            {
                name: 'cidade',
                type: 3, // STRING type
                description: 'O nome da cidade para obter o clima',
                required: true
            }
        ]
    },
    {
        name: 'trecho',
        description: 'Envia um trecho bíblico aleatório.'
    },
    {
        name: 'livroatual',
        description: 'Envia um resumo do livro que estamos lendo.'
    }
];


client.once('ready', async () => {
    console.log('Bot is online!');
    scheduleDailyMessage(); // Agendar a mensagem diária

    // Registrar comandos de barra
    const CLIENT_ID = client.user.id;
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

    try {
        console.log('comandos...');
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
        let response = "**Estamos lendo este livro:**\n";
        livrotual.forEach((book, index) => {
            response += `${index}. [${book.title}](${book.link})\n \n
**📖 Título**: Cartas de um Diabo a seu Aprendiz
**👨🏻 Autor**: C.S. Lewis
**📅 Publicação**: Publicado originalmente em 1942
**📄 Páginas**: 208
**📁 [Baixar]**(<https://drive.google.com/file/d/18isNNkp1qRkm2SABcm5U1mgCjgu3jt8X/view?usp=drive_link>)

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
        });
        await interaction.reply(response);
    }


    if (commandName === 'clima') {
        const city = options.getString('cidade');

        try {
            const temperature = await getTemperature(city);
            const dayOfWeek = format(new Date(), 'eeee', { locale: ptBR }); // dia da semana em português

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setDescription(`Hoje é ${dayOfWeek} e faz ${temperature}ºC em ${city}.`)
                .setTimestamp()
                .setFooter({ text: 'Hikari' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Desculpe, não consegui obter as informações do clima. Verifique se o nome da cidade está correto.');
        }
    }

    if (commandName === 'trecho') {
        const randomQuote = biblicalQuotes[Math.floor(Math.random() * biblicalQuotes.length)];

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Trecho Bíblico')
            .setDescription(randomQuote)
            .setTimestamp()
            .setFooter({ text: 'Hikari' });

        await interaction.reply({ embeds: [embed] });
    }
});

let lastQuoteIndex = -1; //evita que a mesma citação seja repetida em dias consecutivos

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

        // Verifique o status da resposta
        if (response.status !== 200) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        return response.data.current_weather.temperature;
    } catch (error) {
        console.error('Erro ao buscar temperatura:', error.response ? error.response.data : error.message);
        throw new Error('Erro ao buscar temperatura para a cidade.');
    }
}

function scheduleDailyMessage() {
    cron.schedule('0 8 * * *', async () => {
        try {
            const city = 'Fortaleza'; // Cidade fixa
            const temperature = await getTemperature(city);
            const randomQuote = biblicalQuotes[Math.floor(Math.random() * biblicalQuotes.length)];
            const dayOfWeek = format(new Date(), 'eeee', { locale: ptBR }); // Obtém o dia da semana em português

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Bom dia!')
                .setDescription(`Hoje é ${dayOfWeek} e faz ${temperature}ºC em ${city}. \n /spoiler @everyone`)
                .addFields(
                    { name: 'Citação bíblica de hoje', value: randomQuote }
                )
                .setTimestamp()
                .setFooter({ text: 'Hikari' });

            const channel = await client.channels.fetch(discordChannelId);
            channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao enviar mensagem diária:', error);
        }
    }, {
        timezone: "America/Fortaleza" // Define o fuso horário para Fortaleza
    });
}
client.login(process.env.DISCORD_BOT_TOKEN);