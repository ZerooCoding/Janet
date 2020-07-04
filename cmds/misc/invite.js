/**
 * @param {Discord.Message} message
 */
export async function run(message) {
    message.channel.send('https://discord.gg/2t2w2kZ');
}

export const help = {
    name: ['invite', 'join'],
    type: 'misc',
    help_text: 'invite',
    help_desc: 'Join the Soul Squad',
    owner: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
};