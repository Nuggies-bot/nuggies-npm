export function giveawayButtons(host: Discord.Snowflake, emojiid: Discord.Snowflake): Discord.MessageActionRow;
export function getButtons(host: Discord.Snowflake): Discord.MessageButton[];
export function choose(winners: number, msgid: Discord.Snowflake): Promise<Discord.Snowflake | []>;
export function checkRole(userID: Discord.Snowflake, roleIDs: Discord.Snowflake[], message: Discord.Message): boolean;
export function editButtons(client: Discord.Client, data: mongoose.Document): Promise<void>;
export function giveawayEmbed(client: Discord.Client, { host, prize, endAfter, winners, requirements }: {
    host: Discord.Snowflake;
    prize: string;
    endAfter: number;
    winners: number;
    requirements: number;
}): Promise<Discord.MessageEmbed>;
export function dropEmbed(client: Discord.Client, { prize, host }: {
    prize: string;
    host: Discord.Snowflake;
}): Promise<Discord.MessageEmbed>;
export function getByMessageID(messageID: Discord.Snowflake): Promise<mongoose.Document>;
export function editDropButtons(client: Discord.Client, button: Discord.ButtonInteraction): Promise<void>;
export function dropButtons(prize: string): Promise<Discord.MessageActionRow>;
export function _dropButtons(): Promise<Discord.MessageButton>;

import Discord = require("discord.js");
import mongoose = require("mongoose");
