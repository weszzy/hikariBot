const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates,  GatewayIntentBits.GuildMembers] });


const voiceChannelId = '1261384009913471108';
const presenterRoleId = '1268317622424830144';
const textChannelId = '1261384009913471107';


const discordChannelId = process.env.DISCORD_CHANNEL_ID;

const commands = [
    {
        name: 'lidos',
        description: 'Mostra os livros já lidos.'
    },
    {
        name: 'livroatual',
        description: 'Envia um resumo do livro que estamos lendo.'
    },
    {
        name: 'biblioteca',
        description: 'Mostra uma lista de categorias de livros disponíveis'
    }
];

const categories = {
    "Cristãos": {
        "Ellen G. White": "https://drive.google.com/drive/folders/1-iQzjDK3Acv4DuBeEJc0DMWrbCM0Vgd3?usp=drive_link",
        "C. S. Lewis": "https://drive.google.com/drive/folders/1-4Nd3TmNOC-dPYY0YVm0AZL4rEKDOiAo?usp=drive_link",
        "Augusto Cury": "https://drive.google.com/drive/folders/15xDrTy8u7mfEn9Rc-IrwsaewsfBUMZTw?usp=drive_link",
        "Rick Warren": "https://drive.google.com/drive/folders/17nABD8m3tRtM_Ob5pb6b1SGUWnm_U8cp?usp=drive_link"
    },
    "Brasileiros": {
        "Carla Madeira": "https://drive.google.com/drive/folders/1yISsfinXj8ZZc4l3sxZQMt6wIdp6fC02?usp=drive_link",
        "Jose de Alencar": "https://drive.google.com/drive/folders/1YCfkeGbGsTdBloYmufM2YZgenHZ768QE?usp=drive_link"
    },
    "Outros": {
        "Colleen Hoover": "https://drive.google.com/drive/folders/17PRzxNa4y5Hb9jB_YZ2m0tnhKd5EptwN?usp=drive_link",
        "John Green": "https://drive.google.com/drive/folders/1AKb3kkG_6D6gEi8T1YFqA7WZ9cmkogG6?usp=drive_link",
        "Sarah J. Maas": "https://drive.google.com/drive/folders/18nsKzDMePQ2GNSyHFwN7JXqeQhPpKF--?usp=drive_link"
    }
};

client.once('ready', async () => {
    console.log('Bot is online!');

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

client.on('voiceStateUpdate', (oldState, newState) => {
    // Verifica se o usuário entrou no canal de voz específico
    if (newState.channelId === voiceChannelId && !oldState.channelId) {
        const member = newState.member;

        // Verifica se o membro possui o cargo de apresentador
        if (member.roles.cache.has(presenterRoleId)) {
            const textChannel = client.channels.cache.get(textChannelId);
            if (textChannel) {
                textChannel.send('O apresentador está pronto! Já vamos começar, venham! ||@everyone||');
            }
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

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
});

client.on('interactionCreate', async interaction => {
    if (interaction.isStringSelectMenu() && interaction.customId === 'select-category') {
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
    } else if (interaction.isStringSelectMenu() && interaction.customId === 'select-author') {
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
});

client.login(process.env.DISCORD_BOT_TOKEN);
