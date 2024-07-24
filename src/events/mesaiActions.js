const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { JsonDatabase } = require('for.db');
const moment = require('moment');
const fs = require('fs');

// Veritabanı yapılandırması
const db = new JsonDatabase({
  databasePath: "./fordb.json" 
});

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'mesai-yetkili') {
            const selectedValue = interaction.values[0];

            switch (selectedValue) {
                case 'forcemesaigir':
                    const forcemesaigirModal = new ModalBuilder()
                        .setCustomId('forcemesaigirModal')
                        .setTitle('Mesaiye Gir');

                    const forcemesaigirInput = new TextInputBuilder()
                        .setCustomId('forcemesaigirInput')
                        .setLabel('Mesaiye girecek kişi.')
                        .setPlaceholder('Mesaiye girecek kişinin DC ID\'sini gir..')
                        .setStyle(TextInputStyle.Short);

                    const forcemesaigirActionRow = new ActionRowBuilder()
                        .addComponents(forcemesaigirInput);

                    forcemesaigirModal.addComponents(forcemesaigirActionRow);
                    await interaction.showModal(forcemesaigirModal);
                    break;

                case 'forcemesaicheck':
                    const forcemesaicheckModal = new ModalBuilder()
                        .setCustomId('forcemesaicheckModal')
                        .setTitle('Mesai Kontrol');

                    const forcemesaicheckInput = new TextInputBuilder()
                        .setCustomId('forcemesaicheckInput')
                        .setLabel('Mesaisi kontrol edilecek kişi.')
                        .setPlaceholder('Mesaisi kontrol edilecek kişinin DC ID\'sini gir..')
                        .setStyle(TextInputStyle.Short);

                    const forcemesaicheckActionRow = new ActionRowBuilder()
                        .addComponents(forcemesaicheckInput);

                    forcemesaicheckModal.addComponents(forcemesaicheckActionRow);
                    await interaction.showModal(forcemesaicheckModal);
                    break;

                case 'forcemesaicik':
                    const forcemesaicikModal = new ModalBuilder()
                        .setCustomId('forcemesaicikModal')
                        .setTitle('Mesaiden Çık');

                    const forcemesaicikInput = new TextInputBuilder()
                        .setCustomId('forcemesaicikInput')
                        .setLabel('Mesaiden çıkacak kişi.')
                        .setPlaceholder('Mesaiden çıkacak kişinin DC ID\'sini gir..')
                        .setStyle(TextInputStyle.Short);

                    const forcemesaicikActionRow = new ActionRowBuilder()
                        .addComponents(forcemesaicikInput);

                    forcemesaicikModal.addComponents(forcemesaicikActionRow);
                    await interaction.showModal(forcemesaicikModal);
                    break;

                case 'forcemesaidekiler':
                    const allData = db.all();
                    let aktifMesai = 'Aktif mesai yapan kullanıcılar:\n';

                    for (const entry of allData) {
                        const { ID, data } = entry;

                        if (data.status === 'in') {
                            const mesaiBilgisi = data.mesailer[Object.keys(data.mesailer).length];
                            aktifMesai += `<@${ID}> - Giriş: <t:${Math.floor(new Date(mesaiBilgisi.giriş).getTime() / 1000)}:R>\n`;
                        }
                    }

                    if (aktifMesai === 'Aktif mesai yapan kullanıcılar:\n') {
                        aktifMesai = 'Şu anda aktif mesai yapan kullanıcı yok.';
                    }

                    await interaction.reply({ content: aktifMesai, ephemeral: true });
                    break;

                    case 'forcemesailer':
                        const forcemesailerModal = new ModalBuilder()
                            .setCustomId('forcemesailerModal')
                            .setTitle('Mesai Verisi Al');
    
                        const forcemesailerInput = new TextInputBuilder()
                            .setCustomId('forcemesailerInput')
                            .setLabel('Mesai kontrol edilicek kişi')
                            .setPlaceholder('Mesai bilgileri alınıcak kişinin Discord ID\'sini girin...')
                            .setStyle(TextInputStyle.Short);
    
                        const forcemesailerActionRow = new ActionRowBuilder()
                            .addComponents(forcemesailerInput);
    
                        forcemesailerModal.addComponents(forcemesailerActionRow);
                        await interaction.showModal(forcemesailerModal);
                        break;
                case 'sifirla':
                    await interaction.reply({ content: `<@${interaction.user.id}> Başarılı bir şekilde seçenek sıfırlandı.`, ephemeral: true });
                    break;

                default:
                    await interaction.reply({ content: 'Geçersiz seçenek!', ephemeral: true });
                    break;
            }
        } else if (interaction.isModalSubmit()) {
            const modalId = interaction.customId;

            switch (modalId) {
                case 'forcemesaigirModal':
                    const forcemesaigirInputValue = interaction.fields.getTextInputValue('forcemesaigirInput');
                    const userForceGirisData = db.get(forcemesaigirInputValue) || { mesailer: {}, status: 'none' };
                    const newForceGirisIndex = Object.keys(userForceGirisData.mesailer).length + 1;

                    userForceGirisData.mesailer[newForceGirisIndex] = {
                        giriş: moment().format('YYYY-MM-DD HH:mm:ss'),
                        çıkış: null
                    };
                    userForceGirisData.status = 'in';

                    db.set(forcemesaigirInputValue, userForceGirisData);
                    await interaction.reply({ content: `Mesaiye girecek kişi: <@${forcemesaigirInputValue}> mesaiye başarıyla girdi.`, ephemeral: true });
                    break;

                    case 'forcemesailerModal':
                        const forcemesailerInputValue = interaction.fields.getTextInputValue('forcemesailerInput');
                        const userForceData = db.get(forcemesailerInputValue);
    
                        if (!userForceData) {
                            await interaction.reply({ content: `<@${forcemesailerInputValue}> kullanıcısı için mesai verisi bulunamadı.`, ephemeral: true });
                            return;
                        }

                        let fileContent = 'Mesai Verileri:\n';
                        for (const [key, value] of Object.entries(userForceData.mesailer)) {
                            fileContent += `**${key}. Mesai**\nGiriş: ${moment(value.giriş).format('YYYY-MM-DD HH:mm:ss')}\nÇıkış: ${value.çıkış ? moment(value.çıkış).format('YYYY-MM-DD HH:mm:ss') : 'Henüz çıkış yapılmamış'}\n\n`;
                        }
    
                        const filePath = `./mesai_verileri_${forcemesailerInputValue}.txt`;
                        fs.writeFileSync(filePath, fileContent);
    
                        await interaction.reply({ content: `Mesai verileri <@${forcemesailerInputValue}> kullanıcısı için oluşturuldu. Dosyayı buradan indirebilirsiniz:`, files: [filePath], ephemeral: true });
                        fs.unlinkSync(filePath);
    
                        break;

                case 'forcemesaicheckModal':
                    const forcemesaicheckInputValue = interaction.fields.getTextInputValue('forcemesaicheckInput');
                    const userForceCheckData = db.get(forcemesaicheckInputValue);

                    if (!userForceCheckData) {
                        await interaction.reply({ content: `<@${forcemesaicheckInputValue}> kullanıcısı için mesai verisi bulunamadı.`, ephemeral: true });
                        return;
                    }

                    const mesailer = userForceCheckData.mesailer;
                    let checkMessage = `Mesai bilgileri:\n`;

                    for (const [key, value] of Object.entries(mesailer)) {
                        checkMessage += `**${key}. Mesai**\nGiriş: <t:${Math.floor(new Date(value.giriş).getTime() / 1000)}:R>\nÇıkış: ${value.çıkış ? `<t:${Math.floor(new Date(value.çıkış).getTime() / 1000)}:R>` : 'Henüz çıkış yapılmamış'}\n`;
                    }

                    await interaction.reply({ content: checkMessage, ephemeral: true });
                    break;

                case 'forcemesaicikModal':
                    const forcemesaicikInputValue = interaction.fields.getTextInputValue('forcemesaicikInput');
                    const userForceCikisData = db.get(forcemesaicikInputValue);

                    if (!userForceCikisData) {
                        await interaction.reply({ content: `<@${forcemesaicikInputValue}> kullanıcısı için mesai verisi bulunamadı.`, ephemeral: true });
                        return;
                    }

                    const currentForceCikisIndex = Object.keys(userForceCikisData.mesailer).length;

                    if (userForceCikisData.status === 'out' || !userForceCikisData.mesailer[currentForceCikisIndex]) {
                        await interaction.reply({ content: `<@${forcemesaicikInputValue}> zaten mesaiden çıkmış veya henüz mesaiye girmemiş.`, ephemeral: true });
                        return;
                    }

                    userForceCikisData.mesailer[currentForceCikisIndex].çıkış = moment().format('YYYY-MM-DD HH:mm:ss');
                    userForceCikisData.status = 'out';

                    db.set(forcemesaicikInputValue, userForceCikisData);
                    await interaction.reply({ content: `Mesaiden çıkacak kişi: <@${forcemesaicikInputValue}> başarıyla mesaiden çıktı.`, ephemeral: true });
                    break;

                default:
                    await interaction.reply({ content: 'Geçersiz modal!', ephemeral: true });
                    break;
            }
        }
    },
};
