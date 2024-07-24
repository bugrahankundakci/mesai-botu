const { Events, EmbedBuilder } = require('discord.js');
const { JsonDatabase } = require('for.db');
const moment = require('moment');
const minik = require('../../minik.json');

const db = new JsonDatabase({
  databasePath: "./fordb.json"
});


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'mesai-olustur') {
            const selectedValue = interaction.values[0];

            switch (selectedValue) {
                case 'mesaigir':
                    const channel = await interaction.client.channels.fetch(minik.mesai.ekip.leaderboard);

                    if (!channel) {
                        console.error(`Kanal bulunamadı: ${channelId}`);
                        return;
                    }


                    const allData = db.all();
                    
                    const sortedByEntries = allData
                        .map(entry => ({ ID: entry.ID, count: Object.keys(entry.data.mesailer).length }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5);
                    
                    const topEntries = sortedByEntries.map(entry => `<@${entry.ID}> (${entry.count} giriş)`).join('\n');
                    const sortedByDuration = allData
                        .map(entry => {
                            const mesailer = entry.data.mesailer;
                            let totalDuration = 0;
                            for (const key in mesailer) {
                                const mesaiBilgisi = mesailer[key];
                                const giriş = moment(mesaiBilgisi.giriş);
                                const çıkış = moment(mesaiBilgisi.çıkış || moment());
                                totalDuration += çıkış.diff(giriş, 'minutes');
                            }
                            return { ID: entry.ID, duration: totalDuration };
                        })
                        .sort((a, b) => b.duration - a.duration)
                        .slice(0, 5);
                    
                    const longestEntries = sortedByDuration.map(entry => `<@${entry.ID}> (${entry.duration} dakika)`).join('\n');

                    const mostEntriesEmbed = new EmbedBuilder()
                        .setTitle('En Çok Mesaiye Giren İlk 5 Kişi')
                        .setDescription(topEntries || 'Veri yok');

                    const longestDurationEmbed = new EmbedBuilder()
                        .setTitle('En Uzun Mesai Süresine Sahip İlk 5 Kişi')
                        .setDescription(longestEntries || 'Veri yok');
                    const messages = await channel.messages.fetch({ limit: 1 });
                    const lastMessage = messages.first();

                    if (lastMessage) {
                        await lastMessage.edit({ embeds: [mostEntriesEmbed, longestDurationEmbed] });
                    } else {
                        await channel.send({ embeds: [mostEntriesEmbed, longestDurationEmbed] });
                    }

                    break;
            }
        }
    },
};
