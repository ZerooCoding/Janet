import Pagination from 'discord-paginationembed';
import Util from '../../Util.js';

/**
 * @param {Discord.Message} message
 * @param {string[]} args
 */
export async function run(message, args) {
    const _prefixes = Util.config.prefixes.filter((x, i) => i < Util.config.prefixes.length - 1); //we remove the last prefix (.pop modifies the original array - BAD!)
    const prefixes = _prefixes.map(x => (Util.getIdFromString(x) == process.janet.user.id ? '' : '`') + x + (Util.getIdFromString(x) == process.janet.user.id ? '' : '`')).join(' | ');
    const cmdamount = Array.from(new Set(process.janet.commands.map(x=>JSON.stringify(x)))).map(x=>JSON.parse(x));

    if (!args[0]) {
        const help = Util.Embed()
            .setTitle('__Use -help <module> to get a list of commands__')
            .setDescription('Use `-help syntax` for command syntax explanations\nJanet\'s prefixes are: ' + prefixes)
            .addField('main (`'+ cmdamount.filter(x => x.help.type === 'main').length + ' available`)', 'Janet\'s main features')  
            .addField('owner (`'+ cmdamount.filter(x => x.help.type === 'owner').length + ' available`)', 'Application owner only commands')    
            .addField('misc (`'+ cmdamount.filter(x => x.help.type === 'misc').length + ' available`)', 'Miscellaneous commands')    
            .addField('Total amount:', `\`${cmdamount.length}\` commands available`)   

        return message.channel.send(help);
    }
    
    if (args[0].match(/(?:syntax)/i)) {
        const help = Util.Embed()
        .setTitle('__Command Syntax:__')
        .setDescription('Janet\'s prefixes are: ' + prefixes + '\nArguments wrapped in `<>` are variables. _do not actually add brackets_\nArguments seperated by `/` mean `this or(/) this`.\nArguments wrapped in `[]` are optional arguments.\nCommands marked with :warning: are potentially dangerous.\nCommands marked with <:perms:686681300156940349> require certain permissions.\nCommands marked with `@role` require the mentioned role.')

        return message.channel.send(help);
    }


    let type = '';
    if (args[0].match(/(?:main)/i)) type = 'main';
    else if (args[0].match(/(?:owner)/i)) type = 'owner';
    else if (args[0].match(/(?:misc)/i)) type = 'misc';
    else return message.channel.send(Util.Embed().setTitle(`${args[0]} is not a valid argument!`));

    let commands = {};
    let marks = {};

    for (let filename of process.janet.commands.keys()) {
        let cmd = process.janet.commands.get(filename);
        if (!cmd.help || !cmd.help.help_text || !cmd.help.help_desc) {
            Util.log(filename + ' is missing help properties, please fix');
        }

        if (cmd.help.type == type) commands[cmd.help.help_text] = cmd.help;
    }

    const helpemotes = ['<:perms:686681300156940349>'];

    if (Object.keys(commands).length > 10) {
        const arrs = Util.Split(Object.keys(commands), 10);
        let pages = [];
        
        for (let i = 0; i < arrs.length; i++) {
            const embed = Util.Embed()
            .setTitle('__List of available "' + type + '" commands below:__')
            .setDescription('Use `-help syntax` for command syntax explanations\nJanet\'s prefixes are: ' + prefixes)

            for (let item of arrs[i]) {
                let mo = { emotes: [], roles: [] };
                if (commands[item].owner) mo.emotes.push(helpemotes[0]);
                if (commands[item].user_perms && commands[item].user_perms.length > 0) mo.emotes.push(helpemotes[0]);

                if (commands[item].roles && commands[item].roles.length > 0) {
                    for (let role of commands[item].roles) {
                    
                        const rolename = await process.janet.shard.broadcastEval(`
                            (async () => {
                                let rolename;
                                const guilds = this.guilds.cache;
                                
                                guilds.forEach(guild => {
                                    if (guild.roles.cache.get('${role}')) {
                                    rolename = guild.roles.cache.get('${role}').name;
                                    }
                                });
                                
                                if (rolename) return rolename;
                            })();
                        `);
                        mo.roles.push('@' + rolename.toString());
                    }
                }

                marks[item] = mo;
                
                embed.addField(commands[item].help_text.toLowerCase().startsWith('janet') || commands[item].help_text.toLowerCase().startsWith('hey janet') ? item + ` ${marks[item].emotes.join('')}${marks[item].roles.length > 0 ? '`' + marks[item].roles.join(' ') + '`' : ''}` : '-' + item + ` ${marks[item].emotes.join('')}${marks[item].roles.length > 0 ? '`' + marks[item].roles.join(' ') + '`' : ''}`, commands[item].help_desc);
            }
            pages.push(embed);
        }
        
        new Pagination.Embeds()
            .setArray(pages)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setPageIndicator(true)
            .setPage(1)
            .build();
    }

    else {
        const embed = Util.Embed()
        .setTitle('__List of available "' + type + '" commands below:__')
        .setDescription('Use `-help syntax` for command syntax explanations\nJanet\'s prefixes are: ' + prefixes)
        
        for (let item in commands) {

            let mo = { emotes: [], roles: [] };
            if (commands[item].owner) mo.emotes.push(helpemotes[0]);
            if (commands[item].user_perms && commands[item].user_perms.length > 0) mo.emotes.push(helpemotes[0]);

            if (commands[item].roles && commands[item].roles.length > 0) {
                for (let role of commands[item].roles) {
                
                    const rolename = await process.janet.shard.broadcastEval(`
                        (async () => {
                            let rolename;
                            const guilds = this.guilds.cache;
                            
                            guilds.forEach(guild => {
                                if (guild.roles.cache.get('${role}')) {
                                rolename = guild.roles.cache.get('${role}').name;
                                }
                            });
                            
                            if (rolename) return rolename;
                        })();
                    `);
                    mo.roles.push('@' + rolename.toString());
                }
            }

            marks[item] = mo;

            embed.addField(commands[item].help_text.toLowerCase().startsWith('janet') || commands[item].help_text.toLowerCase().startsWith('hey janet') ? item + ` ${marks[item].emotes.join('')}${marks[item].roles.length > 0 ? '`' + marks[item].roles.join(' ') + '`' : ''}` : '-' + item + ` ${marks[item].emotes.join('')}${marks[item].roles.length > 0 ? '`' + marks[item].roles.join(' ') + '`' : ''}`, commands[item].help_desc);
        }
        message.channel.send(embed);
    }
}   

export const help = {
    name: 'help',
    type: 'misc',
    help_text: 'help [syntax]',
    help_desc: 'Provides you help with commands',
    owner: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: ['MANAGE_MESSAGES', 'ADD_REACTIONS']
};
