const { SlashCommandBuilder } = require('@discordjs/builders');
const ui = require("../utils/ui");

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription(`Command helper`),
  
  async execute(interaction)
  {
    await interaction.reply(
      { content: 
          "``/start --length``\n"+ ` 开始一个新的游戏，并且设定游戏字数\n\n` + 
          "``/set-length --length``\n"+ ` 设定游戏字数\n\n` +
          "``/clear``\n"+ ` 清除当前频道游戏记录\n\n` +
          "``/rule``\n"+ ` 规则书\n\n`
      }
    );
	},
};