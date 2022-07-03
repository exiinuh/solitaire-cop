const file = require("./file");

const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

function Initialize()
{
  const commandFiles = file.GetList('commands', '.js');

  var commands = new Collection();
  for (const file of commandFiles) 
  {
  	const command = require(file);
    
  	// Set a new item in the Collection
  	// With the key as the command name and the value as the exported module
  	commands.set(command.data.name, command);
  }
  return commands;
}

function Deploy()
{
  var commands = [];
  const commandFiles = file.GetList('commands', '.js');
  for (const file of commandFiles) 
  {
  	const command = require(file);
  	commands.push(command.data.toJSON());
  }
  
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
  
  rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID), { body: commands })
  	.then(() => console.log('Successfully registered application commands.'))
  	.catch(console.error);
}

module.exports = { Initialize, Deploy };