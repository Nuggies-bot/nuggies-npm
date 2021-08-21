export = giveaways;
declare class giveaways {
    /**
     * @param {Discord.Client} client
     * @param {defaultManagerOptions} options
     */
    static Messages(client: Discord.Client, options?: {
        dmWinner: boolean;
        giveaway: string;
        giveawayDescription: string;
        endedGiveawayDescription: string;
        giveawayFooterImage: string;
        winMessage: string;
        rerolledMessage: string;
        toParticipate: string;
        newParticipant: string;
        alreadyParticipated: string;
        noParticipants: string;
        noRole: string;
        dmMessage: string;
        noWinner: string;
        alreadyEnded: string;
        dropWin: string;
    }): Promise<void>;
    static create({ message, prize, host, winners, endAfter, requirements, channel, }: {
        message: any;
        prize: any;
        host: any;
        winners: any;
        endAfter: any;
        requirements: any;
        channel: any;
    }): Promise<void>;
    /**
     * @param {Discord.Message} message
     * @param {mongoose.Document} data
     */
    static startTimer(message: Discord.Message, data: mongoose.Document, instant?: boolean): Promise<void>;
    static gotoGiveaway(data: any): MessageButton;
    static endByButton(client: any, messageID: any, button: any): Promise<void>;
    static end(message: any, data: any, giveawaymsg: any): Promise<"ENDED" | "NO_WINNERS">;
    static reroll(client: any, messageID: any): Promise<number | any[]>;
    static getByMessageID(messageID: any): Promise<any>;
    static startAgain(client: any): Promise<void>;
    static drop({ message, channel, prize, host }: {
        message: any;
        channel: any;
        prize: any;
        host: any;
    }): Promise<void>;
}
import Discord = require("discord.js");
import mongoose = require("mongoose");
import { MessageButton } from "discord-buttons";
