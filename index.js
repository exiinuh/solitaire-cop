const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const command = require("./utils/command");
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
        if(!answer)
        {
          return interaction.reply( `${interaction.user}: *退!* *捣乱警告!*`);
        }
        
        // check database
        database.GetKeyValue(interaction.channel.name)
          .then(
            history =>
            {
              if (history === null)
              {
                history = [];
              }
              
              if (history.includes(answer))
              {
                console.log("duplicate");
                return interaction.reply( `${interaction.user}: *退!* **【${answer}】** *重复警告!*`);
              }
              else
              {          
                console.log("not duplicate");
                
                history.push(answer);
                database.SetKey(interaction.channel.name, history);
                
                interaction.message.edit({components: []});
                return interaction.reply({ content: `${interaction.user}: *嗬!* **【${answer}】**`, components: [ui.CreateButtonRow()] });
              }
            });
        
        // // fetch message history
        // interaction.channel.messages.fetch({ limit: 100 }).then(
        //   async messages => 
        //   {
        //     var latestMsg = null;
        //     messages.forEach(
        //       msg => 
        //       {
        //         const content = ui.ParseWord(msg.content);

        //         if (latestMsg === null && msg.components.length != 0)
        //         {
        //           latestMsg = msg;
        //         }

        //         //console.log(`${answer}`+ ' ' + `${content}`);
        //         if (`${answer}` === content)
        //         {
        //           latestMsg = null;
        //           return interaction.reply( `${interaction.user}: *退!* **【${answer}】** *重复警告!*`);
        //         }
        //       })

        //     if (latestMsg != null)
        //     {
        //       latestMsg.edit({components: []});
        //     }

        //     return interaction.reply({ content: `${interaction.user}: *嗬!* **【${answer}】**`, components: [ui.CreateButtonRow()] });
        //   });
      }
      else
      if (interaction.customId === 'nopeModal')
      {  
        const answer = interaction.fields.getTextInputValue('nopeModalInput');
        if(!answer || answer != 'YES')
        {
          return;
        }

        // check database
        database.GetKeyValue(interaction.channel.name)
          .then(
            history =>
            {
              // remove from database
              const content = ui.ParseWord(interaction.message.content);
              const index = history.indexOf(content);
              history.splice(index, 1);
              database.SetKey(interaction.channel.name, history);

              if (history.length > 0)
              {
                const lastContent = history[history.length - 1];
                              
                interaction.message
                  .react('❌')
                  .then(
                    () => interaction.message.edit({components: []})
                    );
                return interaction.reply({ content: `回溯: *嗬!* **【${lastContent}】**`, components: [ui.CreateButtonRow()] });
              }
              else
              {
                return interaction.reply(`*重新开始！*`);
              }
            });
        
        // // fetch message history
        // interaction.channel.messages.fetch({ limit: 10 }).then(
        //   async messages => 
        //   {
        //     var lastMsg = null;
        //     const content = ui.ParseWord(interaction.message.content);
        //     messages.every(
        //       msg => 
        //       {       
        //         const currentContent = ui.ParseWord(msg.content);
        //         if (currentContent && content != currentContent && msg.content.includes('嗬'))
        //         {
        //           lastMsg = msg;
        //           return false;
        //         }
                
        //         return true;
        //       });
            
        //     if (lastMsg != null)
        //     {
        //       interaction.message
        //         .react('❌')
        //         .then(
        //           () => interaction.message.edit({components: []})
        //           );
        //       return interaction.reply({ content: `${lastMsg.content}`, components: [ui.CreateButtonRow()] });
        //     }
        //     else
        //     {
        //       return interaction.reply(`*重新开始！*`);
        //     }       
        //   });
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