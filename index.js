require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const cron = require('node-cron');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const discordChannelId = '1268315269005181018';

const biblicalQuotes = [
    "Jeremias 29:11 - 'Porque eu bem sei os pensamentos que penso de vós, diz o Senhor; pensamentos de paz, e não de mal, para vos dar um futuro e uma esperança.'",
    "João 3:16 - 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.'",
    "Salmos 23:1 - 'O Senhor é o meu pastor, nada me faltará.'",
    "Filipenses 4:13 - 'Posso todas as coisas naquele que me fortalece.'",
    "Romanos 8:28 - 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.'",
    "Provérbios 3:5-6 - 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.'",
    "Isaías 41:10 - 'Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te esforço, e te ajudo, e te sustento com a destra da minha justiça.'",
    "Mateus 11:28 - 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.'",
    "Salmos 46:1 - 'Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.'",
    "Josué 1:9 - 'Não to mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.'",
    "Romanos 12:2 - 'E não sede conformados com este mundo, mas sede transformados pela renovação do vosso entendimento, para que experimenteis qual seja a boa, agradável, e perfeita vontade de Deus.'",
    "Salmos 27:1 - 'O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?'",
    "Efésios 2:8-9 - 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus. Não vem das obras, para que ninguém se glorie.'",
    "1 Coríntios 13:4-7 - 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor. O amor não se alegra com a injustiça, mas se alegra com a verdade. Tudo sofre, tudo crê, tudo espera, tudo suporta.'",
    "Hebreus 11:1 - 'Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não vêem.'",
    "Salmos 119:105 - 'Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.'",
    "Filipenses 4:6-7 - 'Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica com ação de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.'",
    "Isaías 40:31 - 'Mas os que esperam no Senhor renovarão as forças; subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.'",
    "Mateus 6:33 - 'Mas buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.'",
    "Salmos 91:1 - 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.'",
    "Romanos 15:13 - 'Ora, o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança pela virtude do Espírito Santo.'",
    "2 Coríntios 5:17 - 'Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.'",
    "1 Pedro 5:7 - 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.'",
    "Mateus 5:14 - 'Vós sois a luz do mundo; uma cidade edificada sobre um monte não pode esconder-se.'",
    "Salmos 34:8 - 'Provai, e vede que o Senhor é bom; bem-aventurado o homem que nele confia.'",
    "Jeremias 17:7 - 'Bendito o homem que confia no Senhor, e cuja confiança é o Senhor.'",
    "Romanos 10:9 - 'A saber: Se com a tua boca confessares ao Senhor Jesus, e em teu coração creres que Deus o ressuscitou dos mortos, serás salvo.'",
    "Gálatas 5:22-23 - 'Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança.'",
    "1 Coríntios 10:13 - 'Não veio sobre vós tentação, senão humana; mas fiel é Deus, que não vos deixará tentar acima do que podeis, antes com a tentação dará também o escape, para que a possais suportar.'",
    "Salmos 121:1-2 - 'Levantarei os meus olhos para os montes, de onde vem o meu socorro. O meu socorro vem do Senhor, que fez o céu e a terra.'",
    "Tiago 1:2-3 - 'Meus irmãos, tende grande gozo quando cairdes em várias tentações; Sabendo que a prova da vossa fé opera a paciência.'",
    "Provérbios 18:10 - 'O nome do Senhor é uma torre forte; o justo corre para ela e está seguro.'",
    "Romanos 8:31 - 'Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?'",
    "João 14:27 - 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.'",
    "Salmos 37:4 - 'Deleita-te também no Senhor, e te concederá os desejos do teu coração.'",
    "Hebreus 13:8 - 'Jesus Cristo é o mesmo ontem, e hoje, e eternamente.'",
    "Provérbios 16:3 - 'Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.'",
    "Salmos 55:22 - 'Lança o teu cuidado sobre o Senhor, e ele te susterá; não permitirá jamais que o justo seja abalado.'",
    "Colossenses 3:23 - 'E tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor e não aos homens.'",
    "Salmos 118:24 - 'Este é o dia que fez o Senhor; regozijemo-nos, e alegremo-nos nele.'",
    "Efésios 6:11 - 'Revesti-vos de toda a armadura de Deus, para que possais estar firmes contra as astutas ciladas do diabo.'",
    "Mateus 7:7 - 'Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.'",
    "João 8:32 - 'E conhecereis a verdade, e a verdade vos libertará.'",
    "Salmos 56:3 - 'Em qualquer tempo em que eu temer, confiarei em ti.'",
    "1 João 4:18 - 'No amor não há medo; ao contrário o perfeito amor expulsa o medo, porque o medo supõe castigo. Aquele que tem medo não está aperfeiçoado no amor.'",
    "Romanos 8:1 - 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus, que não andam segundo a carne, mas segundo o Espírito.'",
    "Hebreus 4:12 - 'Porque a palavra de Deus é viva e eficaz, e mais penetrante do que espada alguma de dois gumes, e penetra até à divisão da alma e do espírito, e das juntas e medulas, e é apta para discernir os pensamentos e intenções do coração.'",
    "Salmos 73:26 - 'A minha carne e o meu coração desfalecem; mas Deus é a fortaleza do meu coração, e a minha porção para sempre.'",
    "Provérbios 4:23 - 'Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.'",
    "1 Coríntios 15:58 - 'Portanto, meus amados irmãos, sede firmes e constantes, sempre abundantes na obra do Senhor, sabendo que o vosso trabalho não é vão no Senhor.'",
    "Salmos 31:24 - 'Esforçai-vos, e ele fortalecerá o vosso coração, vós todos que esperais no Senhor.'",
    "Isaías 26:3 - 'Tu conservarás em paz aquele cuja mente está firme em ti; porque ele confia em ti.'",
    "Efésios 4:32 - 'Antes sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.'",
    "Salmos 62:1 - 'A minha alma espera somente em Deus; dele vem a minha salvação.'",
    "Hebreus 13:5 - 'Seja a vossa vida sem avareza. Contentai-vos com o que tendes; porque ele disse: Não te deixarei, nem te desampararei.'",
    "João 15:5 - 'Eu sou a videira, vós as varas; quem está em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer.'",
    "Salmos 42:11 - 'Por que estás abatida, ó minha alma, e por que te perturbas dentro de mim? Espera em Deus, pois ainda o louvarei, a ele meu auxílio e Deus meu.'",
    "1 João 4:4 - 'Filhinhos, sois de Deus, e já os tendes vencido; porque maior é o que está em vós do que o que está no mundo.'",
    "Salmos 19:14 - 'Sejam agradáveis as palavras da minha boca e a meditação do meu coração perante a tua face, Senhor, rocha minha e redentor meu.'",
    "Isaías 55:8-9 - 'Porque os meus pensamentos não são os vossos pensamentos, nem os vossos caminhos os meus caminhos, diz o Senhor. Porque assim como os céus são mais altos do que a terra, assim são os meus caminhos mais altos do que os vossos caminhos, e os meus pensamentos mais altos do que os vossos pensamentos.'",
    "Salmos 119:11 - 'Escondi a tua palavra no meu coração, para eu não pecar contra ti.'",
    "Romanos 5:8 - 'Mas Deus prova o seu amor para conosco, em que Cristo morreu por nós, sendo nós ainda pecadores.'",
    "Isaías 40:8 - 'Seca-se a erva, e caem as flores, mas a palavra de nosso Deus subsiste eternamente.'",
    "Tiago 1:5 - 'E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, e o não lança em rosto, e ser-lhe-á dada.'",
    "Salmos 139:14 - 'Eu te louvarei, porque de um modo assombroso, e tão maravilhoso fui feito; maravilhosas são as tuas obras, e a minha alma o sabe muito bem.'",
    "Filipenses 1:6 - 'Tendo por certo isto mesmo, que aquele que em vós começou a boa obra a aperfeiçoará até ao dia de Jesus Cristo.'",
    "Romanos 15:4 - 'Porque tudo o que dantes foi escrito para nosso ensino foi escrito, para que, pela paciência e consolação das Escrituras, tenhamos esperança.'",
    "Salmos 119:50 - 'Isto é a minha consolação na minha aflição, porque a tua palavra me vivificou.'",
    "Mateus 28:20 - 'Ensinando-os a guardar todas as coisas que eu vos tenho mandado; e eis que eu estou convosco todos os dias, até a consumação dos séculos. Amém.'",
    "Salmos 37:5 - 'Entrega o teu caminho ao Senhor; confia nele, e ele o fará.'",
    "Romanos 12:12 - 'Alegrai-vos na esperança, sede pacientes na tribulação, perseverai na oração;'",
    "Mateus 5:16 - 'Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai, que está nos céus.'",
    "Salmos 16:11 - 'Tu me farás ver a vereda da vida; na tua presença há fartura de alegrias; à tua mão direita há delícias perpetuamente.'",
    "Isaías 43:2 - 'Quando passares pelas águas estarei contigo, e quando pelos rios, eles não te submergirão; quando passares pelo fogo, não te queimarás, nem a chama arderá em ti.'",
    "Salmos 118:6 - 'O Senhor está comigo; não temerei o que me pode fazer o homem.'",
    "1 Tessalonicenses 5:16-18 - 'Regozijai-vos sempre. Orai sem cessar. Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.'",
    "2 Timóteo 1:7 - 'Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.'",
    "Salmos 27:14 - 'Espera no Senhor, anima-te, e ele fortalecerá o teu coração; espera, pois, no Senhor.'",
    "Hebreus 10:23 - 'Retenhamos firmes a confissão da nossa esperança; porque fiel é o que prometeu.'",
    "João 14:6 - 'Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim.'",
    "Romanos 8:37 - 'Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.'",
    "Salmos 18:2 - 'O Senhor é o meu rochedo, e o meu lugar forte, e o meu libertador; o meu Deus, a minha fortaleza, em quem confio; o meu escudo, a força da minha salvação, e o meu alto refúgio.'",
    "Tiago 4:7 - 'Sujeitai-vos, pois, a Deus; resisti ao diabo, e ele fugirá de vós.'",
    "Salmos 119:114 - 'Tu és o meu refúgio e o meu escudo; espero na tua palavra.'",
    "João 10:10 - 'O ladrão não vem senão a roubar, a matar, e a destruir; eu vim para que tenham vida, e a tenham com abundância.'",
    "Romanos 12:9 - 'O amor seja não fingido. Aborrecei o mal e apegai-vos ao bem.'",
    "Salmos 119:165 - 'Muita paz têm os que amam a tua lei, e para eles não há tropeço.'",
    "1 Coríntios 16:14 - 'Todas as vossas coisas sejam feitas com amor.'",
    "Romanos 5:3-4 - 'E não somente isto, mas também nos gloriamos nas tribulações; sabendo que a tribulação produz a paciência, e a paciência a experiência, e a experiência a esperança.'",
    "Salmos 33:4 - 'Porque a palavra do Senhor é reta, e todas as suas obras são fiéis.'",
    "Mateus 7:12 - 'Portanto, tudo o que vós quereis que os homens vos façam, fazei-lho também vós, porque esta é a lei e os profetas.'",
    "Salmos 91:2 - 'Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.'",
    "Isaías 53:5 - 'Mas ele foi ferido pelas nossas transgressões, e moído pelas nossas iniquidades; o castigo que nos traz a paz estava sobre ele, e pelas suas pisaduras fomos sarados.'",
    "1 Pedro 5:7 - 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.'",
    "Salmos 27:1 - 'O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?'",
    "Romanos 8:31 - 'Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?'",
    "Salmos 23:1 - 'O Senhor é o meu pastor; nada me faltará.'",
    "Mateus 11:28 - 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.'",
    "Salmos 34:17 - 'Os justos clamam, e o Senhor os ouve, e os livra de todas as suas angústias.'",
    "Romanos 8:28 - 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.'"
];


client.once('ready', () => {
    console.log('Bot is online!');
    scheduleDailyMessage(); // agendar a mensagem diária
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content === '/lidos') {
        const response = `
    ** Nós já lemos estes livros:**
    1.[Amor de Redenção](<https://drive.google.com/file/d/1kCLdC9F28IT6C9DOps3gjC9mYJiyuPwG/view?usp=drive_link>)
2.[Caminho a Cristo](<https://drive.google.com/file/d/1dUQQfDSOIAozlQFum3WNRE6RmyIH-eLs/view?usp=drive_link>)
3.[A Verdade sobre os Anjos](<https://drive.google.com/file/d/1TwJZi1cp46V1h9QnRRUpGO8gnAJppC7y/view?usp=drive_link>)
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

            const response = `\`\`\`Oi! \n\nHoje é ${dayOfWeek} e faz ${temperature}ºC em ${city}.\n\n📖 ${randomQuote}\`\`\``;
            message.channel.send(response);
        } catch (error) {
            console.error(error);
            message.channel.send('Desculpe, não consegui obter as informações do clima. Verifique se o nome da cidade está correto.');
        }
    }
});

if (message.channel.startsWith('/trecho')) {
    const randomQuote = biblicalQuotes[Math.floor(Math.random() * biblicalQuotes.length)];
    message.channel.send(randomQuote);
}

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