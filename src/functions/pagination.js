const {
    MessageButton
} = require('discord-buttons')
const validStyles = [
    "gray",
    "red",
    "green",
    "blurple"
]

/**
 * button pagination
 * @param {options} 
 */
module.exports = async function Pagination(options) {

    if (!options.message) {
        throw new Error("[Nuggies-error] Please provide a message for the button pagination!")
    }
    if (!options.embeds) {
        throw new Error("[Nuggies-error] Please provide an array of embeds to paginate!")
    }

    if(options.embeds.length == 1) {
        throw new Error("[Nuggies-error] Cannot paginate 1 embed!")
    }

    if (!options.button1) options.button1 = {};
    if (typeof options.button1 !== 'object') {
        throw new Error("[Nuggies-error] Button1 must be an object");
    }

    if (!options.button1.label) {
        throw new Error("[Nuggies-error] Missing field Label for Button1")
    }

    if (!options.button1.style) {
        throw new Error("[Nuggies-error] Missing field style for Button1")
    }

    if (!validStyles.includes(options.button1.style)) {
        throw new Error(`[Nuggies-error] invalid style field for button1, must be ${validStyles}`)
    }
    // button2 

    if (!options.button2) options.button2 = {};
    if (typeof options.button2 !== 'object') {
        throw new Error("[Nuggies-error] Button2 must be an object");
    }

    if (!options.button2.label) {
        throw new Error("[Nuggies-error] Missing field Label for Button2")
    }

    if (!options.button2.style) {
        throw new Error("[Nuggies-error] Missing field style for Button2")
    }

    if (!validStyles.includes(options.button2.style)) {
        throw new Error(`[Nuggies-error] invalid style field for button2, must be ${validStyles}`)
    }

    if (!options.timeActive) {
        throw new Error("[Nuggies-error] missing field timeActive")
    }

    if (typeof options.timeActive !== "number") {
        throw new Error("[Nuggies-error] timeActive must be a number!")
    }

    if (!options.setDisabled) {
        throw new Error("[Nuggies-error] missing field setDisabled")
    }

    if (typeof options.setDisabled !== "boolean") {
        throw new Error("[Nuggies-error] setDisbaled must be a boolean")
    }

    if (!options.invalidUser) {
        throw new Error("[Nuggies-error] missing field invalidUser")
    }
    if (!options.invalidUser) options.invalidUser = {};
    if (typeof options.invalidUser !== 'object') {
        throw new Error("[Nuggies-error] invalidUser must be an object");
    }
    if(!options.invalidUser.ephemeralReply) {
        throw new Error("[Nuggies-error] missing field ephemeralReply")
    }
    
    if (typeof options.invalidUser.ephemeralReply !== "boolean") {
        throw new Error("[Nuggies-error] ephemeralReply message must be a boolean")
    }

    if(!options.invalidUser.message) {
        throw new Error("[Nuggies-error] missing field invalidUser message")
    }

    if (typeof options.invalidUser.message !== "string") {
        throw new Error("[Nuggies-error] invalidUser message must be a string")
    }

    let button1 = new MessageButton()
        .setLabel(options.button1.label)
        .setStyle(options.button1.style)
        .setID('forward')

    let button2 = new MessageButton()
        .setLabel(options.button2.label)
        .setStyle(options.button2.style)
        .setID('back')
    
    let currentPage = 0;

    const embeds = options.embeds

    const message = options.message

    let sussyEmbed = await message.channel.send({
        buttons: [button1, button2],
        embed: embeds[currentPage]
      })

      
    const filter = (button) => button.clicker.user.id === message.author.id;
    const collector = sussyEmbed.createButtonCollector(filter, {
      time: options.timeActive
    });

    collector.on('collect', async b => {
        await b.reply.defer()
        if(b.clicker.user.id !== message.author.id) {
            if(options.invalidUser.ephemeralReply == true) {
                b.reply.send(options.invalidUser.message, true)
            } else {
                message.channel.send(options.invalidUser.message)
            }
        }
        if (b.id === 'back') {
          if (currentPage < embeds.length - 1) {
            currentPage += 1;
            sussyEmbed.edit({
              buttons: [button1, button2],
              embed: embeds[currentPage]
            })
  
          }
        } else if (b.id === 'forward') {
          if (currentPage !== 0) {
            currentPage -= 1;
            sussyEmbed.edit({
              buttons: [button1, button2],
              embed: embeds[currentPage]
            })
          }
        }
    })

    if(options.setDisabled == true) {
        setTimeout(() => {
            let b1 = button1.setDisabled()
            let b2 = button2.setDisabled()
            sussyEmbed.edit({
              embed: embeds[currentPage],
              buttons: [b1, b2],
            })
          }, options.timeActive)
    }
 }
