const { SlashCommandBuilder } = require('@discordjs/builders');
const ui = require("../utils/ui");

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('接啊你倒是'),
  
  async execute(interaction) 
  {
    await interaction.reply({ content: `*嗬！*`, components: [ui.CreateButtonRow()] });
	},
};