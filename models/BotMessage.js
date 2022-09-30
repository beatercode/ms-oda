const mongoose = require("mongoose")

const QuestSchema = new mongoose.Schema({
    customId: { type: Number },
    channelId: { type: Number, default: 992242994164023377 },
    text: { type: String, default: 'dummy' },
    embed: { type: Object, default: null },
    wasPublished: { type: Boolean, default: false },
    date: { type: String, default: '' }
})

module.exports = mongoose.model("BotMessages", QuestSchema)