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

npm:
```powershell
npm i nuggies
 ```

yarn:
```powershell
yarn add nuggies
 ```

# Giveaways
## [click here](https://github.com/Nuggies-bot/giveaways-example) for giveaways bot code using nuggies package
# Preview <img src = "https://cdn.discordapp.com/emojis/546353169341349888.png?v=1" width = "40">
<img src="https://cdn.discordapp.com/attachments/788386910757584906/855532163091922985/dbPdcey4.gif">

 # Usage <img src = "https://cdn.discordapp.com/emojis/837910195450937384.png?v=1" alt = "hmmm" width=40>

## connect

You can connect to the mongoDB database

```js
const Nuggies = require('nuggies');
Nuggies.giveaways.connect(mongURI);
```

### params
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

  ## buttonclick
   <span style="color: red;">IMPORTANT. THIS HANDLES THE BUTTONS IN YOUR GIVEAWAY, WITHOUT THIS THE BUTTONS WONT WORK!</span>

   handles the buttons in your code, can be put in ` clickButton ` event
   ```js
    client.on('clickButton', button => {
    Nuggies.giveaways.buttonclick(client, button);
});
   ```
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
### params:
data: mongoose document, can be obtained by using `.getByMessageID`

## getByMessageID
This gets the mongoose document for the giveaway
 ```js
    (async () => {   
    const doc = await Nuggies.giveaways.getByMessageID(messageID);
    }()
 ```
 ### params
 messageID: the message ID of the giveaway

 ## startAgain

starts the giveaway again after restart, put this in ready event to start All the giveaways again.
 ```js
 Nuggies.giveaways.startAgain(client)
 ```
 ### params
 client: Discord Client