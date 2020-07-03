import Util from '../../Util.js';
import moment from 'moment';

/**
 * @param {Discord.Message} message
 * @param {string[]} args
 */
export async function run(message, args) {
    let info = Util.parseSeriesEpisodeString(args[0]);

    let show = {
        id: '2790',
        title: 'The Good Place',
        channel: 'NBC'
    };
    
    const api = `http://api.tvmaze.com/shows/${show.id}/episodebynumber?season=${info.season}&number=${info.episode}`;

    try {
        const body = await Util.fetchJSON(api);

        if (body.status === 404) return message.channel.send(Util.Embed().setTitle('There was no data for this episode!'));
        
        let airdate = new Date(body.airdate);
        let airtime = body.airtime;
        let desc = !body.summary ? 'No summary available' : body.summary.replace('<p>', '').replace('</p>', '');
        let img;
        if (body.image == null) img = '';
        else img = body.image.original;        
           
        let timeString = airtime;
        let H = timeString.split(':')[0];
        let h = H % 12 || 12;
        let am_pm = (H < 12 || H === 24) ? ' AM' : ' PM';
        timeString = h + ':' + timeString.split(':')[1] + am_pm;
    
        message.channel.send(Util.Embed().setTitle(`${show.title} ${body.season}x${Util.normalize(body.number)} - ${body.name}`)
          .setDescription(desc + `\n\nAirdate: \`${moment(airdate).isValid() ? airdate.toDateString() : 'No Airdate Available'}\`\nAirtime: \`${body.airtime === '' ? 'No Airtime Available' : timeString + ' ET'}\`\nRuntime: \`${body.runtime} Minutes\`\nChannel: \`${show.channel}\`\n\n**[Full recap & trailer](${body.url} '${body.url}')**`)
          .setImage(img));
    }
    
    catch (ex) {
        Util.log('Error occurred while fetching data from wiki: ' + ex.stack);
        message.channel.send(Util.Embed().setTitle('Failed to fetch episode info!'));    }
}
export const help = {
    name: ['ep', 'episode'],
    type: 'main',
    help_text: 'ep <NxNN|SNENN> ~ N -> number',
    help_desc: 'Fetches episode info',
    owner: false,
    voice: false,
    timevault: false,
    args: {force: true, amount: 1, type: 'episode'},
    roles: [],
    user_perms: [],
    bot_perms: []
};