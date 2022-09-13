const mongoose = require("mongoose")

const QuestSchema = new mongoose.Schema({
    customId: { type: String, default: "" },
    questId: { type: String, default: "" },
    path: { type: String, default: "" },
    name: { type: String, default: "" },
    questionType: { type: String, default: "text" },
    question: { type: String, default: "" },
    republishable: { type: Boolean, default: false },
    wasPublished: { type: Boolean, default: false },
    mode: { type: String, default: "quiz" },
    options: { type: Array, default: [] },
    voters: { type: Array, default: [] }


})

module.exports = mongoose.model("Quests", QuestSchema)