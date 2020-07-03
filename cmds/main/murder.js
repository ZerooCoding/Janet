import Util from '../../Util.js';

/**
 * @param {Discord.Message} message
 */
export async function run(message) {
    const clip = 'https://cdn.discordapp.com/attachments/728741002973675602/728742411995447406/Attention_I_have_been_murdered.mp4';
    message.channel.send(clip);
}

export const help = {
    name: ['murder', 'reboot'],
    type: 'main',
    help_text: 'murder',
    help_desc: '"Reboot" Janet',
    owner: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
};