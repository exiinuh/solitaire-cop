const { SlashCommandBuilder } = require('@discordjs/builders');

const cop = require("../utils/cop-enforcement");

module.exports =
{
  data: new SlashCommandBuilder()
    .setName('set-length')
    .setDescription('设定游戏字数')
    .addIntegerOption(option => option.setName('length').setDescription('设置游戏字数')),

  async execute(interaction) {
    const length = interaction.options.getInteger('length');
    if (!length) {
      await interaction.reply({ content: `*退!字数无效!*` });
    }
    else {
      await cop.SetLength(length, interaction.channel.name);
      await interaction.reply({ content: `*嗬!字数设定为* **${length}**` });
    }
  },
};