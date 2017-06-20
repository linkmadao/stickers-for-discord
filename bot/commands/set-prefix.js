const rp = require('request-promise');
const covert = require('../../covert.js');

module.exports = function(message, bot_auth, prefix, managerRole){

	let guild = message.channel.guild;
	let message_words = message.content.trim().split(/\s+/);

	if(message_words.length < 2){
		message.channel.send(`Invalid Syntax. Use \`${prefix}setprefix [NEW PREFIX]\`.`);
		return;
	}

	return rp({
		method: 'PATCH',
		uri: `${covert.app_url}/api/guilds/${guild.id}/prefix`,
		body: {
			commandPrefix: message_words[1]
		},
		headers: {
			Authorization: bot_auth,
			'Author-Id': message.author.id
		},
		json: true
	})
	.then(res => {
		message.channel.send(`Stickers for Discord commands now begin with \`${res.commandPrefix}\``);
	})
	.catch(err => {
		
		if(err.message.includes('Prefix must be less than 3 characters.')){
			message.channel.send(`Prefix must be less than 3 characters.`);
		}

		else if(err.message.includes('Unauthorized')){
			message.channel.send(`You must have the role \`${managerRole}\` to use this command.`);
		}

		else{
			message.channel.send('An unknown error occured.');
		}

	});

}