const { SlashCommandBuilder } = require('@discordjs/builders');
const ui = require("../utils/ui");

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('rule')
		.setDescription(`词语接龙规则书 v1.1`),
  
  async execute(interaction) 
  {
    await interaction.reply(
      { content: 
          `1. 玩家需要以上一位玩家答案的最后一个字作为开头给出一个n字词语（n可以设定）\n`+
          `2. 以**简体中文**进行游戏\n`+
          `3. 不得重复使用已经出现过的词语\n`+
          `4. 同一玩家不得**连续两次或多次**接龙，即自己接自己\n`+
          `5. 一般情况下，可以使用**同音不同字**进行接龙\n`+
          `6. 特殊情况下（包括但不限于难度太高），可以使用**谐音字**、**多音字**进行接龙\n`+
          `7. 词语必须合理，不能生搬硬造。以下词语视为违规：\n`+
          `\t7.1 过于宽泛：喝可乐，喝雪碧，喝汽水\n`+
          `\t7.2 槽点过多：紫内线，士兵长\n`+
          `\t7.3 过于黄暴，反动，威胁dc群存在的词语\n`+
          `8. 一旦词语被违规，答案人会被记录在案，答案作废，从**上一个**合理答案继续游戏\n`+
          `9. 如果需要进行仲裁，请按**报警**按钮; 如被质疑词语合理性，可以贴出证据进行自证`
      }
    );
	},
};