const WebSocket = require('ws');
const ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');

global.$ = window.$ = window.jquery = require('jquery')

ws.on('open', function open() {
    console.log("connected")
    ws.send("PASS oauth:ax7ev0hvz4ui8ki8ru1m6dnoi1yfa6");
    ws.send("NICK hmvortex");
    ws.send("CAP REQ :twitch.tv/tags")
})

ws.on('message', function incoming(data) {
    appendChatMsg(parseIRC(data));
    if (data == "PING :tmi.twitch.tv") {
        ws.send("PONG :tmi.twitch.tv")
    }
});

function joinChat (channel) {
    ws.send(`JOIN #${channel}`);
}

function attachChat() {
    joinChat(document.getElementById("channelInput").value)
}

// :[user]![user]@[user].tmi.twitch.tv PRIVMSG #[channel] [message content]
function parseIRC(messageString) {
    if (messageString.split(" ")[2] == "PRIVMSG") {
        let messageContent = messageString.slice(messageString.search(" "), messageString.length)
        let metadata = collectTags(messageString)
        
        return {
            type: messageString.split(" ")[2],
            user: messageContent.slice(2, messageContent.search("!")),
            channel: messageContent.split("#")[1].slice(0, messageContent.split("#")[1].search(" ")),
            content: messageContent.split("#")[1].slice(messageContent.split("#")[1].search(" ")+2, messageContent.split("#")[1].length-1),
            metadata
        }
    } else {
        return null;
    }
}

function collectTags(messageString) {
    let metadata = {}
    messageString.split(" ")[0].split(";").map(i => {
        metadata[i.split("=")[0]] = i.split("=")[1]
    })
    return metadata;
}

const ejs = require("ejs");

function appendChatMsg(chatmsg) {
    let chatbox = document.getElementById("chatbox");
    ejs.renderFile('app/chatmsg.ejs', { chatmsg }, {}, function (err, str) {
        if (err) console.error(err)
        const parser = new DOMParser();
        let chatobj = parser.parseFromString(str, 'text/html');
        chatbox.append(chatobj.body)
    })  
}
