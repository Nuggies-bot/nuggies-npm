# Nuggies

A utility package for Discord Bots!
<div align="center">
  <p>
    <a href="https://nodei.co/npm/nuggies
/"><img src="https://nodei.co/npm/nuggies.png?downloads=true&stars=true" alt="NPM Info" /></a>
  </p>
</div>

<div align="center">
 <p>
 For errors and questions you can join <a href="https://discord.gg/Z4ebH8PXeA">our support server</a></p>
</div>

# Installation <img src = "https://cdn.discordapp.com/emojis/763159009686585354.gif?v=1" alt="download" width=40>
# Table of content:
## - [installation](https://www.npmjs.com/package/nuggies#installation-)
## - [database connect](https://www.npmjs.com/package/nuggies#connect-to-database)
## - [Giveaways](https://www.npmjs.com/package/nuggies#giveaways)
## - [Button Roles](https://www.npmjs.com/package/nuggies#button-roles)
## - [Dropdown Roles](https://www.npmjs.com/package/nuggies#dropdown-roles)
## - [handle interactions](https://www.npmjs.com/package/nuggies#handle-interactions)
npm:
```powershell
npm i nuggies
 ```

yarn:
```powershell
yarn add nuggies
 ```

## connect to database
features like giveaways require a database connection, you can connect to database using 
```js
Nuggies.connect(mongodburi)
```
> ### params
uri - the mongoDB connection string

# __Giveaways__
## [click here](https://github.com/Nuggies-bot/giveaways-example) for giveaways bot code using nuggies package
# Preview <img src = "https://cdn.discordapp.com/emojis/546353169341349888.png?v=1" width = "40">
<img src="https://cdn.discordapp.com/attachments/788386910757584906/855532163091922985/dbPdcey4.gif">

 # Usage <img src = "https://cdn.discordapp.com/emojis/837910195450937384.png?v=1" alt = "hmmm" width=40>

## connect

You can connect to the mongoDB database

```js
const Nuggies = require('nuggies');
Nuggies.connect(mongURI);
```

> ### params
mongoURI: the mongo URI
## Create

You can create giveaways with `.create`
<br><br>
Example code can be found below
 ```js
        const Nuggies = require('nuggies')
        Nuggies.giveaways.create({
            message: message,
            prize: 'test',
            host: message.author.id,
            winners: 1,
            endAfter: '10s',
            requirements: { enabled: false },
            channel: message.channel.id,
        });
 ```

  > ### options
 message: Discord Message

 prize: String, prize of the giveaway

 host: the host of the giveaway

 winners: Number, the winners count

endAfter: String, The time after the giveaway will end

requirements: Object, the requirements for the giveaway. example: `requirements: {enabled: true, roles: ['role']}`

channel: the channel ID the embed will be sent to
  ## drop
  you can create drops with `.drop`, first to click the button gets the win!

  example:

  ```js
  Nuggies.giveaways.drop({
			message: message,
			prize: 'test',
			channel: message.channel.id,
			host: message.author.id,
		});
  ```
> ### options
 message: Discord Message

 prize: String, prize of the giveaway

 host: the host of the giveaway

 channel: The channel where the drop will be sent

  ## End

 End is a function which will help you end giveaways easily <br> <br>

You can end giveaways with `.end`
 ```js
    Nuggies.giveaways.end(message, data, giveawaymsg);
 ```
 > ### params
 message: Discord Message
 
 data: data from the database, can be obtained by using the `.getByMessageID` property

 giveawaymsg: fetched giveaway message
 
 
## Reroll

 You can reroll giveaways easily with `.reroll` <br> <br>


You can simply use this function by writing a line of code.

```js
    (async () => {   
    const win = await Nuggies.giveaways.reroll(client, messageID);
    }()

```

> ### params

client: The Discord Client

messageID: The message ID of the giveaway

## startTimer

you can start the timer again after restart, note that it automatically starts the timer when the giveaway start.

You can simply use this function by writing a line of code.

```js
    await Nuggies.giveaways.startTimer(message, data);
```
> ### params

message: Discord Message

data: mongoose document, can be obtained by using `.getByMessageID`

## GotoGiveaway

returns a url button leading to the giveaway.

```js
    (async () => {   
    const button = await Nuggies.giveaways.gotoGiveaway(data);
    }()

```
> ### params:
data: mongoose document, can be obtained by using `.getByMessageID`

## getByMessageID
This gets the mongoose document for the giveaway
 ```js
    (async () => {   
    const doc = await Nuggies.giveaways.getByMessageID(messageID);
    }()
 ```
 > ### params
 messageID: the message ID of the giveaway

 ## startAgain

starts the giveaway again after restart, put this in ready event to start All the giveaways again.
 ```js
 Nuggies.giveaways.startAgain(client)
 ```
 > ### params
 client: Discord Client
<br> <br>
 # __Button Roles__
  ### [click here for fully functional button-roles bot](https://github.com/Nuggies-bot/buttonroles-example)
<image src = 'https://cdn.discordapp.com/attachments/801132115755270164/857108297688285204/TBbPNb4S7a.gif'>

 ## __constructor__

 constructor. use .setrole() on it to create buttons
 ```js
 const something = new Nuggies.buttonroles().addrole({
   color: 'red', 
   label: 'test', 
   role: '781061040514269185',
   });
 ```

 > ### options

 color: the button color. Optional. Defaults to gray
 
 label: Button label

 role: role that would be added on click

 emoji: ID of the emoji on the button, optional.

 ## create

 creates the button roles

 ```js
 Nuggies.buttonroles.create({ 
   message: message, 
   role: something,  /*buttonroles constructor*/ 
   content: new Discord.MessageEmbed().setTitle('xd').setDescription('xdxd') });
 ```
 
 > ### options

 message: Discord Message

 role: The object recieved from the buttonroles constructor.

 content: content, can be a string or a Discord Embed

 # __dropdown roles__

<img src="https://cdn.discordapp.com/attachments/801132115755270164/860549628075835413/v3gHFgjz.gif">

 constructor. use .setrole() on it to create dropdown options
 ```js
 const something = new Nuggies.dropdownroles().addrole({ 
   label: 'test', 
   role: 'roleID',
   emoji: 'emojiID'
   });
 ```

 > ### options
 
 label: dropdown option label

 role: role that would be added on click

 emoji: ID of the emoji on the dropdown option, optional.

 ## create

 creates the dropdown roles

 ```js
 Nuggies.dropdownroles.create({ 
   message: message, 
   role: role, /*dropdownroles constructor*/ 
   content: new Discord.MessageEmbed().setTitle('xd').setDescription('xdxd') });
 ```

# __handle interactions__

### features including buttons and dropdown menus require certain functions to handle the interaction


## buttonclick
handles all the button interactions
```js
client.on('clickButton', button => {
	Nuggies.buttonclick(client, button);
});
```
> ### params
client: the discord client
button: the button callback from the clickButton event

## dropclick
handles all the dropdown interactions
```js
client.on('clickMenu', async (menu) => {
	Nuggies.dropclick(client, menu);
});
```
> ### params
client: the discord client
menu: the menu callback from the clickMenu event


### License
Nuggies npm licensed under the terms of [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://github.com/Nuggies-bot/nuggies-npm/blob/main/license) ("CC-BY-NC-SA-4.0"). Commercial use is not allowed under this license. This includes any kind of revenue made with or based upon the software, even donations.

The CC-BY-NC-SA-4.0 allows you to:
- [x] **Share** -- copy and redistribute the material in any medium or format
- [x] **Adapt** -- remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial** — You may not use the material for commercial purposes. 
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

More information can be found [here](https://creativecommons.org/licenses/by-nc-sa/4.0/).
