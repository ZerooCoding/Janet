import Discord from "discord.js";
import MsgHandler from './Util/MessageHandler'

export const config: Config;
export const MsgHandler: Handler;
export function delay(num: number): Promise<void>;
export function log(message: string, files: string[]): boolean;
export function LoadCommands(): Promise<void>;
export function fetchJSON(url: string): Promise<object>;
export function InitStatus(): void;
export function Embed(): Discord.MessageEmbed;
export function normalize(num: number): string;
export function secondsToDifferenceString(seconds: number, settings: secondsToDifferenceSettings): string;
export function parseSeriesEpisodeString(str: string): SeasonAndEpisodeInfo;
export function getIdFromString(str: string): string;

declare module "discord.js" {
    interface Client {
        commands: Discord.Collection<string, Command>;
        owner: string;
    }
}

declare global {
    declare namespace NodeJS {
        export interface Process {
            janet: Discord.Client;
        }
    }
}

interface Handler {
    Handle(message: Discord.Message, Util: Util, connection: Discord.VoiceConnection): Promise<void>;
}

interface Config {
    prefixes: string[];
    footer: string;
    avatar: string;
}

interface SeasonAndEpisodeInfo {
    season: number;
    episode: number;
}

interface Command {
    help: {
        name: string | string[];
        type: string;
        help_text: string;
        help_desc: string;
        owner: boolean;
        nsfw: boolean;
        args: {force: boolean, amount?: Number, type?: string};
        roles: string[];
        user_perms: string[];
        bot_perms: string[];
    },
    run: (message: Discord.Message, args: string[], connection?: Discord.VoiceConnection) => void;
}