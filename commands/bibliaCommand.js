const axios = require('axios');

const livroAbreviacoes = {
    "gênesis": "gn",
    "êxodo": "ex",
    "levítico": "lv",
    "números": "nm",
    "deuteronômio": "dt",
    "josué": "js",
    "juízes": "jz",
    "rute": "rt",
    "1 samuel": "1sm",
    "2 samuel": "2sm",
    "1 reis": "1rs",
    "2 reis": "2rs",
    "1 crônicas": "1cr",
    "2 crônicas": "2cr",
    "esdras": "ed",
    "neemias": "ne",
    "ester": "et",
    "jó": "jó",
    "salmos": "sl",
    "provérbios": "pv",
    "eclesiastes": "ec",
    "cânticos": "ct",
    "isaías": "is",
    "jeremias": "jr",
    "lamentações": "lm",
    "ezequiel": "ez",
    "daniel": "dn",
    "oseias": "os",
    "joel": "jl",
    "amós": "am",
    "obadias": "ob",
    "jonas": "jn",
    "miquéias": "mq",
    "naum": "na",
    "habacuque": "hc",
    "sofônias": "sf",
    "ageu": "ag",
    "zacarias": "zc",
    "malaquias": "ml",
    "mateus": "mt",
    "marcos": "mc",
    "lucas": "lc",
    "joão": "jo",
    "atos": "at",
    "romanos": "rm",
    "1 coríntios": "1co",
    "2 coríntios": "2co",
    "gálatas": "gl",
    "efésios": "ef",
    "filipenses": "fp",
    "colossenses": "cl",
    "1 tessalonicenses": "1ts",
    "2 tessalonicenses": "2ts",
    "1 timóteo": "1tm",
    "2 timóteo": "2tm",
    "tito": "tt",
    "filemom": "fm",
    "hebreus": "hb",
    "tiago": "tg",
    "1 pedro": "1pe",
    "2 pedro": "2pe",
    "1 joão": "1jo",
    "2 joão": "2jo",
    "3 joão": "3jo",
    "judas": "jd",
    "apocalipse": "ap"
};

async function execute(interaction) {
    try {
        let livro = interaction.options.getString('livro').toLowerCase();
        const capitulo = interaction.options.getInteger('capitulo');
        const versiculo = interaction.options.getInteger('versiculo');

        // Converte o nome do livro para a abreviação correta
        livro = livroAbreviacoes[livro];

        if (!livro || !capitulo || !versiculo) {
            return interaction.editReply('Por favor, forneça o livro, capítulo e versículo corretamente.');
        }

        const url = `https://www.abibliadigital.com.br/api/verses/nvi/${livro}/${capitulo}/${versiculo}`;
        
        const response = await axios.get(url);

        const versiculoTexto = response.data.text;
        await interaction.editReply(`"${versiculoTexto}" (${livro.toUpperCase()} ${capitulo}:${versiculo})`);
    } catch (error) {
        console.error('Erro ao lidar com a interação:', error);
        await interaction.editReply('Desculpe, houve um erro ao buscar o versículo. Por favor, tente novamente mais tarde.');
    }
}

module.exports = { execute };
