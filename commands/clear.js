const { SlashCommandBuilder } = require('@discordjs/builders');
const database = require("../data/database");
const cop = require("../utils/cop-enforcement");

module.exports =
{
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('清除历史记录'),

  async execute(interaction) {
    await cop.Clear(interaction.channel.name);
    await interaction.reply({ content: `*历史记录已清除!*` });
  },
};