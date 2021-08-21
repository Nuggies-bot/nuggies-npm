export function giveawayButtons(host: any, emojiid: any): any;
export function getButtons(host: any): any[];
export function choose(winners: any, msgid: any): Promise<number | any[]>;
export function checkRole(userID: any, roleIDs: any, message: any): boolean;
export function editButtons(client: any, data: any): Promise<void>;
export function giveawayEmbed(client: any, { host, prize, endAfter, winners, requirements }: {
    host: any;
    prize: any;
    endAfter: any;
    winners: any;
    requirements: any;
}): Promise<Discord.MessageEmbed>;
export function dropEmbed(client: any, { prize, host }: {
    prize: any;
    host: any;
}): Promise<Discord.MessageEmbed>;
export function getByMessageID(messageID: any): Promise<any>;
export function editDropButtons(client: any, button: any): Promise<void>;
export function dropButtons(prize: any): Promise<any>;
export function _dropButtons(): Promise<any>;
import Discord = require("discord.js");
