module.exports = {
    execute: async (interaction) => {
        const booksRead = [
            { title: "Amor de Redenção", link: "<https://drive.google.com/file/d/1Dl1d01CP-juG4IFV9xHqdxqWRNOVjmCs/view?usp=drive_link>" },
            { title: "Caminho a Cristo", link: "<https://drive.google.com/file/d/1Wl2Ea_Ys5UXXhnX0IKJ65PhFXJhMAn5E/view?usp=drive_link>" },
            { title: "A Verdade sobre os Anjos", link: "<https://drive.google.com/file/d/17JeXRYZ8x0lZHMyFH-0mhXx7fyXsKcim/view?usp=drive_link>" },
        ];

        let response = "**📚 Nós já lemos estes livros:**\n";
        booksRead.forEach((book, index) => {
            response += `${index + 1}. [${book.title}](${book.link})\n`;
        });
        await interaction.reply(response);
    }
};
