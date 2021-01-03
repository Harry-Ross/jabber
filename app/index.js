const WebSocket = require('ws');
const ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');

window.$ = window.jquery = require('jquery')

ws.on('open', function open() {
    console.log("connected")
    ws.send("PASS oauth:ax7ev0hvz4ui8ki8ru1m6dnoi1yfa6");
    ws.send("NICK hmvortex");
    joinChat("hasanabi")
})

ws.on('message', function incoming(data) {
    console.log(data);
    $("p").append(`<p>${data}</p>`);
    if (data == "PING :tmi.twitch.tv") {
        ws.send("PONG :tmi.twitch.tv")
    }
});

function joinChat (channel) {
    ws.send(`JOIN #${channel}`);
}

// [user]![user]@[user].tmi.twitch.tv PRIVMSG #[channel] [message content]
function parseIRC(messageString) {
    messageString.search(":")
}