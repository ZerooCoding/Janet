import 'dotenv/config.js';
import PrettyError from 'pretty-error';
PrettyError.start().withoutColors();
import Discord from 'discord.js';
import Util from './Util.js';

const janet = new Discord.Client({
    ws: {
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
    },
    allowedMentions: { parse: ['users', 'roles'] },
    restRequestTimeout: 25000
});

process.janet = janet;

janet.commands = new Discord.Collection();

if (process.env.CLIENT_TOKEN) janet.login(process.env.CLIENT_TOKEN);
else {
    console.log('No client token!');
    process.exit(1);
}

janet.once('ready', async () => {
    const app = await janet.fetchApplication().catch(ex => Util.log(ex));

    if (app && app.owner) janet.owner = app.owner.ownerID ? app.owner.ownerID : app.owner.id;

    Util.InitStatus();
    await Util.LoadCommands();

    Util.config.prefixes.push(`<@!${janet.user.id}>`, `<@${janet.user.id}>`);
    
    console.log('Ready!');
});

process.on('uncaughtException', err => {
    Util.log('Uncaught Exception: ' + `\`\`\`\n${err.stack}\n\`\`\``);
});

process.on('unhandledRejection', err => {
    const ignore = [
        Discord.Constants.APIErrors.MISSING_PERMISSIONS,
        Discord.Constants.APIErrors.UNKNOWN_MESSAGE,
        Discord.Constants.APIErrors.MISSING_ACCESS,
        Discord.Constants.APIErrors.CANNOT_MESSAGE_USER,
        Discord.Constants.APIErrors.UNKNOWN_CHANNEL
    ];

    if (ignore.includes(err.code)) return;

    Util.log('Unhandled Rejection: ' + `\`\`\`\n${err.stack + '\n\nJSON: ' + JSON.stringify(err, null, 2)}\n\`\`\``);
});

janet.on('error', err => {
    Util.log('Bot error: ' + `\`\`\`\n${err.stack}\n\`\`\``);
});

janet.on('message', message => {
    const bitches = ['414712593941397504', '610235145693167811', '670834803989544992'];
    if (bitches.includes(message.author.id)) return;
    Util.MsgHandler.Handle(message, Util);
});

janet.on('shardReady', async (id, unavailableGuilds) => {
    if (janet.guilds.cache.get('595318490240385037')) await janet.guilds.cache.get('595318490240385037').members.fetch(); //fetch guild members on shardready
    if (!unavailableGuilds) Util.log(`Shard \`${id}\` is connected!`);
    else Util.log(`Shard \`${id}\` is connected!\n\nThe following guilds are unavailable due to a server outage:\n${Array.from(unavailableGuilds).join('\n')}`);
});

janet.on('shardError', (error, shardID) => {
    Util.log(`Shard \`${shardID}\` has encountered a connection error:\n\n\`\`\`\n${error}\n\`\`\``);
});

janet.on('shardDisconnect', (event, id) => {
    Util.log(`Shard \`${id}\` has lost its WebSocket connection:\n\n\`\`\`\nCode: ${event.code}\nReason: ${event.reason}\n\`\`\``);
});

janet.on('guildUnavailable', guild => {
    Util.log('The following guild turned unavailable due to a server outage:\n' + guild.id + ' - `' + guild.name + '`');
});
