export = applications;
declare class applications {
    /**
     *
     * @param {Array} questions - Questions array
     * @param {String} name - the application name
     * @param {String} emoji - the dropdown emoji ID or unicode
     * @param {String} channel - the channel ID of the channel which will recieve the answers
     * @param {String} description - the description of the dropdown
     * @param {String} label - The dropdown label
     * @param {Number} maxApps - The amount of responses
     */
    static addApplication({ guildID, questions, name, emoji, channel, description, label, maxApps, cooldown, responseChannelID }: any[]): Promise<any>;
    static deleteApplication({ guildID, name }: {
        guildID: any;
        name: any;
    }): Promise<boolean>;
    static getDropdownComponent({ guildID }: {
        guildID: any;
    }): Promise<MessageMenu>;
    static create({ guildID, content, client }: {
        guildID: any;
        content: any;
        client: any;
    }): Promise<void>;
    /**
     * @param {String} guildID
     * @returns {Document}
     */
    static getDataByGuild(guildID: string): Document;
    /**
     *
     * @param {Discord.Message} message - The discord message
     */
    static setup(message: any): Promise<void>;
}
import { MessageMenu } from "discord-buttons";
import { Document } from "mongoose";
