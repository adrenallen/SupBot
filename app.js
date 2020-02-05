const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('./config.json')
const StandupHandler = require('./services/standupHandler');
const QuestionQueueService = require('./services/questionQueueService');

// Init the bot! 
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


var qqs = new QuestionQueueService(client);


// Handle standup data etc
var sh = new StandupHandler();

// Refresh standups in cache very so often
setInterval(() => sh.refreshStandups, config.storage_refresh_rate);

// Check for new standups due for asking or reporting
setInterval(
    () => {
        handleDueStandups();
    }, 
    config.standup_check_frequency
);

setTimeout(handleDueStandups, 3000);

//TODO - put this in the standup handler and pass client to it
function handleDueStandups(){
    var dueStandups = sh.findDueStandups();
    console.log(dueStandups);
}