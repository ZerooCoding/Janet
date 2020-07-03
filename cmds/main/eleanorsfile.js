import Util from '../../Util.js';
import RandomEnsure from 'random-array-ensure';

/**
 * @param {Discord.Message} message
 */
export async function run(message, args) {
    if (args.join(' ').match(/(?:file)/i) && args.join(' ').match(/(?:eleanor)/i)) {
        const clips = [
        'https://cdn.discordapp.com/attachments/728741002973675602/728747581794156654/Eleanors_File.mp4',
        'https://cdn.discordapp.com/attachments/728741002973675602/728747973135302716/Definately_not_a_cactus.mp4', 
        'https://cdn.discordapp.com/attachments/728741002973675602/728748804303749170/Third_times_the_charm.mp4']
        
        const random = RandomEnsure.RandomEnsure; //module import destructuring seems broken, this is a lil workaround
        let file = new random(clips);
    
        message.channel.send(file.next());
    }
}

export const help = {
    name: ['can', 'get', 'bring', 'give', 'I'],
    type: 'main',
    help_text: 'Janet I need Eleanor Shellstrop\'s file',
    help_desc: 'Maybe obtain Eleanor\'s file',
    owner: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
};