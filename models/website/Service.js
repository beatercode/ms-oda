const mongoose = require("mongoose")

const ServiceSchema = new mongoose.Schema({
    serviceId: { type: String, default: "" },
    serviceName: { type: String, default: "" },
    serviceCategory: { type: String, default: "" },
    serviceDesc: { type: String, default: "" },
    serviceBanner: { type: String, default: "" },
    macroCategory: { type: String, default: "" },
    firstImage: { type: String, default: "" },
    secondImage: { type: String, default: "" },
    firstSubtitle: { type: String, default: "" },
    secondSubtitle: { type: String, default: "" },
    blocks: { type: Array, default: [] },
    home: { type: Boolean, default: false },


})

module.exports = mongoose.model("Service", ServiceSchema)