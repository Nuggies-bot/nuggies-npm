class giveaways {
    constructor(options) {
            if(!options.message) throw new Error('message was not provided');
            if(!options.prize) throw new Error('prize was not provided');
            if(!options.time) throw new Error('time was not provided');
            if(!options.winners) throw new Error('winners were not provided');
            if(!options.requirements) throw new Error('requirements object was not provided');
            if(!options.emojiID) throw new Error('emoji id was not provided');
            if(!options.embed) throw new Error('embed was not provided')
            this.message = options.message;
            this.prize = options.prize;
            this.time = options.time;
            this.winners = options.winners;
            this.embed = options.embed;
    }
}