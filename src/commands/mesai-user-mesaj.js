const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mesai-mesaj')
        .setDescription('Kullanıcıların mesai girmesi için mesai menüsü gönderir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {



        const militanembed = new EmbedBuilder()
            .setTitle('Mesai Menüsü')
            .setColor('ff0400')
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setImage(minik.mesai.ekip.photograph)
            .setDescription(minik.mesai.menuayarlari.mesaj);

        const militaninmenusu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('mesai-olustur')
                    .setPlaceholder(minik.mesai.menuayarlari.menuplaceholder)
                    .addOptions([
                        {
                            label: minik.mesai.menuayarlari.birseceneklabel,
                            emoji: minik.mesai.menuayarlari.birsecenekemoji,
                            description: minik.mesai.menuayarlari.birsecenekaciklama,
                            value: 'mesaigir',
                        },
                        {
                            label: minik.mesai.menuayarlari.ikiseceneklabel,
                            emoji: minik.mesai.menuayarlari.ikisecenekemoji,
                            description: minik.mesai.menuayarlari.ikisecenekaciklama,
                            value: 'mesaicheck',
                        },
                        {
                            label: minik.mesai.menuayarlari.ucseceneklabel,
                            emoji: minik.mesai.menuayarlari.ucsecenekemoji,
                            description: minik.mesai.menuayarlari.ucsecenekaciklama,
                            value: 'mesaicik',
                        },
                        {
                            label: minik.mesai.menuayarlari.dortseceneklabel,
                            emoji: minik.mesai.menuayarlari.dortsecenekemoji,
                            description: minik.mesai.menuayarlari.dortsecenekaciklama,
                            value: 'mesailerim',
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
