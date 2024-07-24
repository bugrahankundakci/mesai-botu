const { Events } = require('discord.js');
const { JsonDatabase } = require('for.db');
const moment = require('moment');
const fs = require('fs');

const db = new JsonDatabase({
  databasePath: "./fordb.json"
});

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'mesai-olustur') {
            const selectedValue = interaction.values[0];
            const userId = interaction.user.id;

            if (!db.has(userId)) {
                db.set(userId, {
                    status: 'none',
                    mesailer: {}
                });
            }

            const userData = db.get(userId);


            if (!userData.mesailer) {
                userData.mesailer = {};
                db.set(userId, userData);
            }

            const mesaiNumarası = Object.keys(userData.mesailer).length;

            switch (selectedValue) {
                case 'mesaigir':
                    if (userData.status === 'in') {
                        await interaction.reply({ content: `<@${userId}> zaten mesaiye girmiş.`, ephemeral: true });
                        return;
                    }

                    db.set(`${userId}.status`, 'in');
                    db.set(`${userId}.mesailer.${mesaiNumarası + 1}`, {
                        giriş: moment().format('YYYY-MM-DD HH:mm:ss'),
                        çıkış: null
                    });
                    await interaction.reply({ content: `<@${userId}> mesaiye girildi.`, ephemeral: true });
                    break;

                case 'mesaicheck':
                    const currentStatus = db.get(`${userId}.status`);
                    const mesailer = db.get(`${userId}.mesailer`);
                    const sonMesaiNumarası = Object.keys(mesailer).length;

                    const message = currentStatus === 'in'
                        ? `<@${userId}> şu anda mesaiye girmiş durumda.\nSon Giriş Tarihi: <t:${Math.floor(new Date(mesailer[sonMesaiNumarası]?.giriş).getTime() / 1000)}:R>`
                        : `<@${userId}> mesaiye girmedi veya zaten çıkmış.\nSon Giriş Tarihi: <t:${Math.floor(new Date(mesailer[sonMesaiNumarası]?.giriş).getTime() / 1000)}:R>\nSon Çıkış Tarihi: <t:${Math.floor(new Date(mesailer[sonMesaiNumarası]?.çıkış).getTime() / 1000)}:R>`;
                    
                    await interaction.reply({ content: message, ephemeral: true });
                    break;

                case 'mesaicik':
                    if (userData.status === 'out') {
                        await interaction.reply({ content: `<@${userId}> zaten mesaiden çıkmış.`, ephemeral: true });
                        return;
                    }

                    db.set(`${userId}.status`, 'out');
                    db.set(`${userId}.mesailer.${mesaiNumarası}.çıkış`, moment().format('YYYY-MM-DD HH:mm:ss'));
                    await interaction.reply({ content: `<@${userId}> mesaiden çıkıldı.`, ephemeral: true });
                    break;

                case 'mesailerim':
                    const allMesailer = db.get(`${userId}.mesailer`);
                    if (Object.keys(allMesailer).length === 0) {
                        await interaction.reply({ content: `<@${userId}> için herhangi bir mesai kaydı bulunmamaktadır.`, ephemeral: true });
                        return;
                    }

                    let mesaiBilgisi = 'Geçmiş Mesai Kayıtları:\n';
                    for (const [key, value] of Object.entries(allMesailer)) {
                        mesaiBilgisi += `**${key}. Mesai**\nGiriş: ${value.giriş} \nÇıkış: ${value.çıkış ? moment(value.çıkış).format('YYYY-MM-DD HH:mm:ss') : 'Henüz çıkış yapılmamış'}\n\n`;

                    }

                    const filePath = `./mesai_kayitlari_${userId}.txt`;
                    fs.writeFileSync(filePath, mesaiBilgisi);

                    await interaction.reply({ content: 'Geçmiş mesai kayıtlarınız gönderildi.', files: [filePath], ephemeral: true });
                    fs.unlinkSync(filePath);
                    break;

                case 'sifirla':
                    await interaction.reply({ content: `Seçenek sıfırlandı.`, ephemeral: true });
                    break;

                default:
                    await interaction.reply({ content: 'Geçersiz seçenek!', ephemeral: true });
                    break;
            }
        }
    },
};
