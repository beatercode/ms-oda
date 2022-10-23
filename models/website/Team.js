const mongoose = require("mongoose")

const TeamSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    role: { type: String, default: "" },
    url: { type: String, default: "" },
})

module.exports = mongoose.model("Team", TeamSchema)