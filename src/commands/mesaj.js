const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mesaj')
    .setDescription('istediğiniz kanala bot tarafından mesaj atmanızı sağlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Başvuru embedi hangi odaya atılacak?')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Embedin içindeki en üste yazılacak olan mesaj.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('embedin içerisine yazılıcak olan mesaj')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('image')
        .setDescription('Embed içerisine atılacak olan fotoğraf (sadece link).')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('content')
        .setDescription('Embed Üstüne ne yazalım? (tercihen everyone yada here yada aktif rol etiketi.)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('mesaimenusu')
        .setDescription('Tüm memurların kullanabileceği Mesai Menüsü')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('yetkilimesaimenusu')
        .setDescription('yetkilerin kontrol ettiği mesai menüsü.')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('color')
        .setDescription('Embed hangi renk olacak?')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('footer')
        .setDescription('Embedin altına yazılıcak olan mesaj.')
        .setRequired(false)
    ),

  async execute(interaction) {
    const { guild, options } = interaction;
    try {
      const channel = options.getChannel('channel');
      const title = options.getString('title');
      const description = options.getString('description');
      const image = options.getString('image');
      const color = options.getString('color') || '#FFFFFF';
      const mesaimenusu = options.getString('mesaimenusu');
      const embedfooter = options.getString('footer');
      const content = options.getString('content');
      const yetkilimesaimenusu = options.getString('yetkilimesaimenusu');

      const embed = new EmbedBuilder()
        .setDescription(description)
        .setImage(image)
        .setTitle(title)
        .setColor(color)
        .setFooter({ text: embedfooter })
        .setTimestamp();

      const components = [];

      if (mesaimenusu) {
        const mesaiMenu = new StringSelectMenuBuilder()
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
          ]);

        const mesaiMenuRow = new ActionRowBuilder()
          .addComponents(mesaiMenu);

        components.push(mesaiMenuRow);
      }

      if (yetkilimesaimenusu) {
        const yetkiliMesaiMenu = new StringSelectMenuBuilder()
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
          ]);

        const yetkiliMesaiMenuRow = new ActionRowBuilder()
          .addComponents(yetkiliMesaiMenu);

        components.push(yetkiliMesaiMenuRow);
      }

      await guild.channels.cache.get(channel.id).send({
        content: `${content}`,
        embeds: [embed],
        components: components,
      });

      await interaction.reply({
        content: 'Başvuru başarıyla oluşturuldu!',
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.',
        ephemeral: true
      });
    }
  },
};
