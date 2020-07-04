import Util from '../../Util.js';

/**
 * @param {Discord.Message} message
 */
export async function run(message) {

    try {
        const quote = await Util.fetchJSON('https://good-place-quotes.herokuapp.com/api/random');

        const embed = Util.Embed()
        .setTitle(quote.character + ':')
        .setDescription(quote.quote)

        let search_term = quote.character
        const search_api = encodeURI(`https://thegoodplace.fandom.com/api/v1/SearchSuggestions/List?query=${search_term}`);
        const search = await Util.fetchJSON(search_api);

        if (search && search.items && search.items.length === 1) search_term = search.items[0].title;

        const api = encodeURI(`https://thegoodplace.fandom.com/api/v1/Articles/Details?ids=50&titles=${search_term}&abstract=500&width=200&height=200`);
        const body = await Util.fetchJSON(api);

        //new wikis do some weird stuff, therefore the actual result is the 2nd element
        const article = Object.values(body.items)[1];
        if (article) embed.setThumbnail(article.thumbnail)

        message.channel.send(embed);
    }

    catch (ex) {
        Util.log('Error occurred while fetching data from wiki: ' + ex.stack);
        message.channel.send(Util.Embed().setTitle('Failed to fetch a quote!'));
    } 
}

export const help = {
    name: ['quote', 'cite'],
    type: 'main',
    help_text: 'quote',
    help_desc: 'Obtain a random quote',
    owner: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
};