const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mesai-mesaj-yetkili')
        .setDescription('Kişilerin mesailerini kontrol etmeniz için menü.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {


        const militanembed = new EmbedBuilder()
            .setTitle('Mesai Yönetim Menüsü')
            .setColor('ff0400')
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setImage(minik.mesai.ekip.photograph)
            .setDescription(minik.mesai.yetkilimenuayarlari.mesaj);

        const militaninmenusu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('mesai-yetkili')
                    .setPlaceholder(minik.mesai.yetkilimenuayarlari.menuplaceholder)
                    .addOptions([
                        {
                            label: minik.mesai.yetkilimenuayarlari.birseceneklabel,
                            emoji: minik.mesai.yetkilimenuayarlari.birsecenekemoji,
                            description: minik.mesai.yetkilimenuayarlari.birsecenekaciklama,
                            value: 'forcemesaigir',
                        },
                        {
                            label: minik.mesai.yetkilimenuayarlari.ikiseceneklabel,
                            emoji: minik.mesai.yetkilimenuayarlari.ikisecenekemoji,
                            description: minik.mesai.yetkilimenuayarlari.ikisecenekaciklama,
                            value: 'forcemesaicheck',
                        },
                        {
                            label: minik.mesai.yetkilimenuayarlari.ucseceneklabel,
                            emoji: minik.mesai.yetkilimenuayarlari.ucsecenekemoji,
                            description: minik.mesai.yetkilimenuayarlari.ucsecenekaciklama,
                            value: 'forcemesaicik',
                        },
                        {
                            label: minik.mesai.yetkilimenuayarlari.dortseceneklabel,
                            emoji: minik.mesai.yetkilimenuayarlari.dortsecenekemoji,
                            description: minik.mesai.yetkilimenuayarlari.dortsecenekaciklama,
                            value: 'forcemesaidekiler',
                        },
                        {
                            label: minik.mesai.yetkilimenuayarlari.besseceneklabel,
                            emoji: minik.mesai.yetkilimenuayarlari.bessecenekemoji,
                            description: minik.mesai.yetkilimenuayarlari.bessecenekaciklama,
                            value: 'forcemesailer',
                        },
                        {
                            label: 'Seçenek Sıfırla',
                            description: 'Menüdeki seçeneğinizi sıfırlarsınız.',
                            emoji: '1264482771049386014',
                            value: 'sifirla',
                        },
                    ])
            );
        await interaction.reply({ content: 'Mesai menüsü gönderiliyor...', ephemeral: true });

        await interaction.channel.send({
            content: `||@everyone|| & ||@here||`,
            embeds: [militanembed],
            components: [militaninmenusu]
        });

        await interaction.editReply({ content: 'Mesai menüsü gönderildi.' });
    }
};
