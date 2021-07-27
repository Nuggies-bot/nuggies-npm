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
## - [applications](https://www.npmjs.com/package/nuggies#applications)
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

 ## Customize Messages
 customize the messages that users see
 ```js
 const Nuggies = require('nuggies');
  Nuggies.giveaways.Messages(client, {
    dmWinner: true,
    giveaway: '🎉🎉 **GIVEAWAY MOMENT** 🎉🎉',
    giveawayDescription: '🎁 Prize: **${prize}**\n🎊 Hosted by: ${hostedBy}\n⏲️ Winner(s): \`{winners}\`\n\nRequirements: {requirements}',
    endedGiveawayDescription : '🎁 Prize: **{prize}**\n🎊 Hosted by: ${hostedBy}\n⏲️ Winner(s): {winners}',
    giveawayFooterImage: 'https://cdn.discordapp.com/emojis/843076397345144863.png',
    winMessage: '{winners} you won {prize} Congratulations! Hosted by {hostedBy}',
	rerolledMessage: 'Rerolled! {winner} is the new winner of the giveaway!', // only {winner} placeholder
    toParticipate: '**Click the Enter button to enter the giveaway!**',
	newParticipant: 'You have successfully entered for this giveaway', // no placeholders | ephemeral
	alreadyParticipated: 'you already entered this giveaway!', // no placeholders | ephemeral
	nonoParticipants: 'There are not enough people in the giveaway!', // no placeholders
	nonoRole: 'You do not have the required role(s)\n{requiredRoles}\n for the giveaway!', // only {requiredRoles} | ephemeral
    dmMessage: 'You have won a giveaway in **{guildName}**!\nPrize: [{prize}]({giveawayURL})',
    noWinner: 'Not enough people participated in this giveaway.', // no {winner} placerholder
    alreadyEnded: 'The giveaway has already ended!', // no {winner} placeholder
    dropWin: '{winner} Won The Drop!!' // only {winner} placeholder
})
 ```
 > ### params
  dmWinner - Boolean - If bot should dm the winners of giveaway 

  giveaway - String - Title text of giveaway message

  giveawayDescription - String - Giveaway embed description

  endedGiveawayDescription - String - Ended giveaway embed description

  giveawayFooterImage - String - Image/Gif in embed footer

  winMessage - String - Message to send when winner is declared

  rerolledMessage - String - Message to send when giveaway is rerolled

  toParticipate - String - Instruction on how to participate the giveaway

  newParticipant - String - Ephemeral message that participant sees when they participate

  alreadyParticipated - String - Ephemeral message that participant sees if they have already participated

  nonoParticipants - String - Message when there are not enough participants for giveaway

  nonoRole - String - Ephemeral message when participants doesn't have required roles

  dmMessage - String - Message to send to winners of giveaway (only works in dmWinner is `true`)

  noWinner - String - Message when giveaway is ended/rerolled and there are not enough participants

  alreadyEnded - String - If giveaway is already ended

  dropWin - String -  Message sent when drop winner is declared

  <b>Placeholders - {guildName}, {prize}, {giveawayURL}, {hostedBy}, {winners}, {requiredRoles}(only works for nonoRole)</b>

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


## handleInteractions

```js
Nuggies.handleInteractions(client)
```
> ### params

client: Discord Client

# __Applications__

### Applications help you make your life easier with different types of applications you might have to handle! Here's how you can implement it <br> [click here](https://github.com/Nuggies-bot/applications-example) for a fully function applications bot

## setup
a pre made template for your bot.
```js
Nuggies.applications.setup(message)
```
> ### params

message: message callback from message event 

## addApplication
Creates a application for which anyone can make a response.
```js
Nuggies.applications.addApplication(
  { guildID, questions, name, emoji, channel, description, label, maxApps, cooldown, responseChannelID },
)
```
> ### params

  guildID: The ID of the guild in which the application is to be added
  questions: An array of questions to be asked in DM, Example:
    ```js
    ['How old are you?', 'How much time would you devote to it?'];
    ```
  name: The name of the application\

  emoji: The emoji to be put in the menu
  
  channel: The ID of the channel in which the message is to be sent
  
  description: The description of the application
  
  label: The label of the application in the menu
  
  maxApps: The maximum amount of application 1 can create before it gets accepted/declined
  
  cooldown: The cooldown before creating another response
  
  responseChannelID: The channel to send responses in

## deleteApplication
Deletes an application for the guild
```js
Nuggies.applications.deleteapplication({ guildID, name });
```

> ### params
  guildID: The ID of the guild
  name: The name of the application to remove

## create
Creates/Initializes the application system for the guild
```js
Nuggies.applications.create({ guildID, content, client })
```

> ### params

  guildID: The ID of the guild to be created in
  content: The content of message to be sent in the channel
  client: The discord.js client used

## getDataByGuild
Gets the data from database for you
```js
Nuggies.applications.getDataByGuild(guildID);
```

  ### params

  guildID: The ID of the guild
<!--

## getResponses
Fetches data and then filters the responses for you
```js
Nuggies.applications.getResponses(userID, guildID, max);
```

  ### params

  userID: The ID of the user who's responses are to be fetched
  guildID: The ID of the guild
  max: Amount of responses you want
## deleteResponses
Deletes response(s) from database
```js
Nuggies.applications.deleteResponses(userID, guildID, max);
```

  ### params
  userID: The ID of the user who's responses are to be deleted
  guildID: The ID of the guild
  max: Amount of responses you want

## acceptResponse
Accepts a response from a user
```js
Nuggies.applications.acceptResponse(data, userID);
```

  ### params

  data: The data provided by `getDataByGuild` function
  userID: The ID of the user who's response is to be accepted

## declineResponse
Declines a response from a user
```js
Nuggies.applications.declineResponse(data, userID, del);
```

  ### params

  data: The data provided by `getDataByGuild` function
  userID: The ID of the user who's response is to be declined
  del: Delete the data stored in database
-->
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
