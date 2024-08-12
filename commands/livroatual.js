module.exports = {
    execute: async (interaction) => {
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
};
