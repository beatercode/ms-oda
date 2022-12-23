const mongoose = require("mongoose")

const BlogArticleSchema = new mongoose.Schema({
    id: { type: String, default: "" },
    category: { type: String, default: "" },
    title: { type: String, default: "" },
    categoryId: { type: String, default: "" },
    blocks: { type: Array, default: [] },
    titles: { type: Array, default: [] },
    images: { type: Array, default: [] },
    date: { type: Date, default: new Date() },
    readingTime: { type: Number, default: "" },



})

module.exports = mongoose.model("BlogArticle", BlogArticleSchema)