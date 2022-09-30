const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const Surveys = require("../models/Survey")
const logger = require("../utils/logger.util")
require("dotenv").config()

module.exports = {

    async execute(surveyId) {

        let record = await Surveys.findOne({ customId: surveyId })
        if (record == null) { return { "status": 500 } }

        let embed = rows = output = null

        switch (surveyId.toUpperCase().substring(0, 1)) {
            case "S":
                logger.info("Ready to send a Survey")
                output = await this.prepareEmbedForSurveyOrQuiz(record, "S")
                await Surveys.updateOne({ customId: surveyId }, { $set: { wasPublished: true } })
                embed = output.embed
                rows = output.rows
                break
            case "Q":
                logger.info("Ready to send a Quiz")
                output = await this.prepareEmbedForSurveyOrQuiz(record, "Q")
                await Surveys.updateOne({ customId: surveyId }, { $set: { wasPublished: true } })
                embed = output.embed
                rows = output.rows
                break
        }

        return { "embed": embed, "rows": rows }
    },

    // UTIL

    async prepareEmbedForSurveyOrQuiz(record, mode) {
        // MODE S : survey
        // MODE Q : quiz

        let type = mode == "S" ? "Survey" : "Quiz"

        const embed = new EmbedBuilder()
            .setColor("#ffffff")
            // .setTitle("ODA Clan Survey")
            .setTitle(record.name)
            .setDescription(record.question)

        let qOptions = record.options
        let qOptionsLen = qOptions.length
        let howManyRows = Math.floor(qOptionsLen / 3)
        let rowReminder = qOptionsLen % 3

        let rows = []
        let responseIdPrefix = "survey_choose_" + record.customId

        // FOR EVERY ROW
        for (let i = 0; i < howManyRows; i++) {
            rows.push(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 3 + 0].value)
                            .setLabel(qOptions[i * 3 + 0].value).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 3 + 1].value)
                            .setLabel(qOptions[i * 3 + 1].value).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 3 + 2].value)
                            .setLabel(qOptions[i * 3 + 2].value).setStyle(ButtonStyle.Primary),
                    )
            )
        }

        // REMINDERS
        if (rowReminder > 1) {
            rows.push(
                new ActionRowBuilder()
                    .addComponents(
                        rowReminder > 0 ? new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[howManyRows * 3 + 0].value)
                            .setLabel(qOptions[howManyRows * 3 + 0].value).setStyle(ButtonStyle.Primary) : null,
                        rowReminder > 1 ? new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[howManyRows * 3 + 1].value)
                            .setLabel(qOptions[howManyRows * 3 + 1].value).setStyle(ButtonStyle.Primary) : null
                    )
            )
        } else if (rowReminder > 0) {
            rows.push(
                new ActionRowBuilder()
                    .addComponents(
                        rowReminder > 0 ? new ButtonBuilder().setCustomId(record.customId + "_" + qOptions[howManyRows * 3 + 0].value)
                            .setLabel(qOptions[howManyRows * 3 + 0].value).setStyle(ButtonStyle.Primary) : null
                    )
            )
        }

        // ADD OPEN BOX IF NEEDED
        if (mode.toUpperCase() == "S") {
            rows.push(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_OPEN")
                            .setLabel("INSERT TEXT").setStyle(ButtonStyle.Success)
                    )
            )
        }

        if (rows[0].components.length == 1) {
            rows[0]
                .addComponents(
                    new ButtonBuilder().setCustomId(responseIdPrefix + "_OPEN_COUNTER").setDisabled(true)
                        .setLabel("COUNTER: 0").setStyle(ButtonStyle.Secondary)
                )
        }

        return { "status": 200, "embed": embed, "rows": rows }
    },

}