const { Command } = require('discord.js-commando');
const Occurrence = require('../../constants/occurrence');

module.exports = class NewCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'new',
			aliases: [],
			group: 'main',
			memberName: 'new',
			description: 'Starts a new stand-up event setup',
		});
    }
    
    run(message) {
        message.say(`Got it ${message.author}! Check your DMs for more setup details.`);
        message.author.createDM().then((dm) => {
            dm.send("Let's create a new stand-up!\n\nHow often do you want it to occur?\n\n**1)** Daily\n**2)** Weekly\n**3)** Monthly\n\nRespond with the number of your choice!");
            const optionRegex = new RegExp('^[123]');
            const filter = m => {
                return optionRegex.test(m.content);
            };
            dm.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
                .then(collected => {
                    var value = parseInt(collected.first().content, 10);
                    switch(value){
                        case Occurrence.DAILY:
                            dm.send("Daily, okay!");
                            break;
                        case Occurrence.WEEKLY:
                            dm.send("Weekly, okay!");
                            break;
                        case Occurrence.MONTHLY:
                            dm.send("Monthly, okay!");
                            break;
                        default:
                            dm.send("I didn't understand that, cancelling setup!");
                    }
                })
                .catch(collected => {
                    dm.send("No valid option found, cancelling setup!");
                });
        });   
    }
};