const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('./config.json')
const StandupHandler = require('./services/standupHandler');

var sh = new StandupHandler();

// Refresh standups in cache very so often
setInterval(() => sh.refreshStandups, config.storage_refresh_rate);

const client = new CommandoClient({
	commandPrefix: '!',
	owner: config.bot_owner,
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['main', 'Main commands group']
    ])
    // .registerDefaultGroups()
    // .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! ${client.user.id}`);
    client.user.setStatus("Tracking stand-ups!");
});

client.on('error', console.error);
client.login(config.bot_token);