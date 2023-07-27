const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ui = require("../utils/ui");

const ruleEmbed = {
  "title": "",
  "description": "",
  "color": 0x00FFFF,
  "fields": [
    {
      "name": `“嗬！”：进行接龙。玩家需要以上一位玩家答案的最后一个字作为开头给出一个n字词语（n可以设定）。`,
      "value": `\`- 以**简体中文**进行游戏；\`\n\`- 难度较高时，**同音不同字**和**同音不同调**可以接受；\`\n\`- 不得重复使用已经出现过的词语；\`\n\`- 同一玩家不得**连续两次或多次**接龙，即自己接自己。\`\n`
    },
    {
      "name": `“退！”：废除违规答案，从上一个合理答案继续游戏。以下词语视为违规:`,
      "value": `\`- 过于宽泛：喝可乐，喝雪碧，喝汽水；\`\n\`- 槽点过多：紫内线，士兵长；\`\n\`- 具有**攻击性或引起他人不适**的词语。\``
    },
    {
      "name": `“嗖！”：一键Google当前词语，检验合理性。`,
      "value": "\u200B"
    },
    {
      "name": `“报警”：召唤神兽进行仲裁。`,
      "value": "\u200B"
    }
  ]
};

module.exports =
{
  data: new SlashCommandBuilder()
    .setName('rule')
    .setDescription(`词语接龙规则书 v2.0`),

  async execute(interaction) {
    await interaction.reply({ content: `词语接龙规则书 v2.0`, embeds: [ruleEmbed] });
  },
};