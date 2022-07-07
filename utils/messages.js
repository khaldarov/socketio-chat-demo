const moment = require("moment");

class ChatMessage {

    constructor(text, username) {
        this.username = username;
        this.text = text;
        this.time = moment().format('h:mm a');
    }
}

module.exports = ChatMessage;