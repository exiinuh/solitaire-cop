const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const command = require("./utils/command");
const cop = require("./utils/cop-enforcement");
const ui = require("./utils/ui");
const server = require("./utils/server");
const database = require("./data/database");

// set commands
client.commands = command.Initialize();

// main
client.once(
  'ready', 
  () => 
  {    
    console.log('Connected.');
        
    // show history
    database.Show();
    //database.Load('history.json');
    //database.Dump('history.json');
  });

client.on(
  'interactionCreate', 
  async interaction => 
  {  
    if (interaction.isButton())
    {
      if (interaction.customId === `hetui`)
      {
        //Show the modal to the user
		    const modal = ui.CreateModal('tuiModal', `退！`, `嗬！`, 'SHORT');
		    await interaction.showModal(modal);
      }
      else
      if (interaction.customId === `alarm`)
      {
        console.log(interaction);
        return interaction.reply({ content: `<@${interaction.user.id}>: <@${process.env.ADMIN_ID}>*快点干活啦！*` });
      }
      else
      if (interaction.customId === 'nope')
      {
        const modal = ui.CreateModal('nopeModal', `回溯进程`, `你的行为可能会摧毁友谊，确认请输入YES.`, 'SHORT');
		    await interaction.showModal(modal);
      }
    }
    else
    if (interaction.isModalSubmit())
    {
      if (interaction.customId === 'tuiModal')
      {
        const answer = interaction.fields.getTextInputValue('tuiModalInput');

        // empty answer is not acceptable
        if(!answer)
        {
          return interaction.reply( `${interaction.user}: *退!* *捣乱警告!*`);
        }

        // validate the answer
        cop.Check(answer, interaction.channel.name).then(
          result =>
          {
            console.log(result);
            
            switch(result) 
            {
              case cop.CheckResult.SUCCESS:
                interaction.message.edit({components: []});
                return interaction.reply({ content: `${interaction.user}: *嗬!* **【${answer}】**`, components: [ui.CreateButtonRow()] });
                
              case cop.CheckResult.DUPLICATE:
                return interaction.reply( `${interaction.user}: *退!* **【${answer}】** *重复警告!*`);
                
              case cop.CheckResult.INVALID_LENGTH:
                // code block
                break;
                
              case cop.CheckResult.INVALID_CONTEXT:
                return interaction.reply( `${interaction.user}: *退!* **【${answer}】** *首尾不相连!*`);
                
              default:
                // code block
                console.log("???");
                break;
            }
          });
        
        // // fetch message history
        // interaction.channel.messages.fetch({ limit: 100 }).then(
        //   async messages => 
        //   {
        //   });
      }
      else
      if (interaction.customId === 'nopeModal')
      {  
        const isNope = interaction.fields.getTextInputValue('nopeModalInput');
        if(!isNope || isNope != 'YES')
        {
          return;
        }

        const answer = ui.ParseWord(interaction.message.content);
        cop.Revert(answer, interaction.channel.name).then(
          result =>
          {
            if (result != "")
            {
              interaction.message
                .react('❌')
                .then(
                  () => interaction.message.edit({components: []})
                  );
              return interaction.reply({ content: `回溯: *嗬!* **【${result}】**`, components: [ui.CreateButtonRow()] });          
            }
            else
            {
              return interaction.reply(`*重新开始！*`);
            }            
          });
      }
    }
    else
    if (interaction.isCommand())
    {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try 
      {
        await command.execute(interaction);
      } 
      catch (error) 
      {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  });

server.KeepAlive();

client.login(process.env.DISCORD_TOKEN)
  .catch(
    err => 
    {
      console.error(err);
      process.exit();
    });