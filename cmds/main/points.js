import Util from '../../Util.js';
import RandomEnsure from 'random-array-ensure';
import table from '../../data/constants/pointtable.js';

/**
 * @param {Discord.Message} message
 */
export async function run(message) {
    
    const random = RandomEnsure.RandomEnsure; //module import destructuring seems broken, this is a lil workaround
    const score = new random(table.points);

    const embed = Util.Embed()
    .setTitle(score.next())
    if (score.next().includes('-')) embed.setColor('#D7342A')

    message.channel.send(embed);
}

export const help = {
    name: ['points', 'score'],
    type: 'main',
    help_text: 'points',
    help_desc: 'Obtain your latest score',
    owner: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
};