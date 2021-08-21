export = dropdownroles;
declare class dropdownroles {
    /**
 *
 * @param {Message} message - The Discord Message
 * @param {String} content - The Discord send data, can be an embed or string
 * @param {String} role - The role ID of the role
 * @param {String} channelID - The channel ID that will be recieving the dropdown
 */
    static create({ message, content, role, channelID }: any): Promise<void>;
    roles: any[];
    /**
     *
     * @param {String} label - dropdown label
     * @param {String} emoji - The emoji id [optional]
     * @param {String} role - The role id
     */
    addrole({ label, emoji, role }: string): dropdownroles;
    toJSON(): {
        roles: any[];
    };
}
