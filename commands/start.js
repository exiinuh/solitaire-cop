const { SlashCommandBuilder } = require('@discordjs/builders');
const ui = require("../utils/ui");
const cop = require("../utils/cop-enforcement");

module.exports =
{
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('接啊你倒是')
    .addIntegerOption(option =>
      option
        .setName('length')
        .setDescription('设置游戏字数')
        .setRequired(true)),

  async execute(interaction) {
    const length = interaction.options.getInteger('length');

    await cop.SetLength(length, interaction.channel.name);
    await interaction.reply({ content: `*嗬!字数设定为* **${length}**`, components: [ui.CreateInteractionButtons('')] });
  },
};