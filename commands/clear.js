const { SlashCommandBuilder } = require('@discordjs/builders');
const database = require("../data/database");

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('清除历史记录'),
  
  async execute(interaction) 
  {
    database.SetKey(interaction.channel.name, []);
    
    await interaction.reply({ content: `*历史记录已清除！*` });
	},
};