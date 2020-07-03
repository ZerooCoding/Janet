import Util from '../../Util.js';

/**
 * @param {Discord.Message} message
 */
export async function run(message) {
    message.channel.send(Util.Embed().setTitle('Hi there!').setDescription(Util.secondsToDifferenceString(process.janet.uptime / 1000, { enableSeconds: true })));
}

export const help = {
    name: 'uptime',
    type: 'general',
    help_text: 'uptime',
    help_desc: 'Displays Janet\'s uptime',
    owner: false,
    nsfw: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
};