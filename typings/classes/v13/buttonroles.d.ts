export = ButtonRoles;
declare class ButtonRoles {
    /**
     * @param {Message} message - The Discord Message
     * @param {MessageEmbed} embed - The Discord Embed/Content
     * @param {buttonroles} role - The created object using .buttonroles().addrole()
     * @param {String} channelID - the id of the channel you want to send the message to.
     * @returns {Message} - The message sent
     */
    static create({ message, content, role, channelID }: Message): Message;
    /**
     * @param {Message} message - The Discord Message
     * @param {MessageEmbed} embed - The Discord Embed/Content
     * @param {buttonroles} role - The created object using .buttonroles().addrole()
     * @returns {Message} - The message edited
     */
    static edit({ message, content, role }: Message): Message;
    /**
     * @param {Message} message - The buttonroles message sent by bot
     */
    static delete(message: Message): void;
    roles: any[];
    /**
     *
     * @param {String} color - Button Color [optional]
     * @param {String} label - Button label
     * @param {String} emoji - The emoji id [optional]
     * @param {String} role - The role id
     */
    addrole({ color, label, emoji, role }: string): ButtonRoles;
    toJSON(): {
        roles: any[];
    };
}
import { Message } from "discord.js";
