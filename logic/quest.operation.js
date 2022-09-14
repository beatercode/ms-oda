const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const Quests = require("../models/Quest")
const logger = require("../utils/logger.util")
require("dotenv").config()

module.exports = {

    async execute(id) {

        try {
            let embed = rows = output = null

            // MODE
            // 0 : QUEST
            // 1 : TEXTNOVEL
            // 2 : VISUALNOVEL

            const mode = id.toUpperCase().includes('QUIZ')
                ? 'QUIZ' : id.toUpperCase().includes('TEXTNOVEL')
                    ? 'TEXTNOVEL' : id.toUpperCase().includes('VISUALNOVEL')
                        ? 'VISUALNOVEL' : null
            const first = mode ? true : false

            let record = null
            if (first) {
                console.log('diocane')
                const records = await Quests.find({ questId: id })
                record = records.reduce((max, r) =>
                    max.customId.substring(mode.length, r.customId.length) < r.customId.substring(mode.length, r.customId.length) ? max : r);
            } else {
                record = await Quests.findOne({ customId: id })
            }

            if (record == null) { return { "status": 500 } }
            let customId = record.customId

            if (customId.toUpperCase().includes('Q')) {
                logger.info(`Ready to send a Quest - path [${record.path}]`)
                output = await this.prepareEmbedForQuest(record, 0)
                await Quests.updateOne({ customId: customId }, { $set: { wasPublished: true } })
                embed = output.embed
                rows = output.rows
            } else if (customId.toUpperCase().includes('T')) {
                logger.info(`Ready to send a TexNovel - path [${record.path}]`)
            } else if (customId.toUpperCase().includes('V')) {
                logger.info(`Ready to send a VisualNovel - path [${record.path}]`)
            }

            return { "embed": embed, "rows": rows }

        } catch (err) {
            console.log(err)
        }
    },

    // UTIL

    async prepareEmbedForQuest(record, mode) {
        // MODE S : survey
        // MODE Q : quiz

        const type = mode == 0 ? "Quest" : mdoe == 1 ? "TextNovel" : "VisualNovel"

        const isParentFirst = record.path == 1
        const qOptions = record.options
        const qOptionsLen = qOptions.length
        const howManyRows = Math.floor(qOptionsLen / 5)
        const rowReminder = qOptionsLen % 5

        let r = ''
        qOptions.forEach((q, index) => r += `**Option ${(index + 1)}**: ${q.value}\n`)

        const questDescription = record.question
            + "\n\n" + r

        const embed = new EmbedBuilder()
            .setColor("#ffffff")
            // .setTitle("ODA Clan Survey")
            .setTitle(record.name)
            .setDescription(questDescription)

        let rows = []
        let responseIdPrefix = `quest_choose_${record.customId}_${record.questId}`

        // FOR EVERY ROW
        for (let i = 0; i < howManyRows; i++) {
            rows.push(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 5 + 0].path + "_" + isParentFirst + "_" + (i * 5 + 0))
                            .setLabel(`${(i * 3 + 1)}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 5 + 1].path + "_" + isParentFirst + "_" + (i * 5 + 1))
                            .setLabel(`${(i * 3 + 2)}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 5 + 2].path + "_" + isParentFirst + "_" + (i * 5 + 2))
                            .setLabel(`${(i * 3 + 3)}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 5 + 3].path + "_" + isParentFirst + "_" + (i * 5 + 3))
                            .setLabel(`${(i * 3 + 4)}`).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[i * 5 + 4].path + "_" + isParentFirst + "_" + (i * 5 + 4))
                            .setLabel(`${(i * 3 + 5)}`).setStyle(ButtonStyle.Primary),
                    )
            )
        }

        // REMINDERS
        if (rowReminder > 0) {
            let reminderRow = new ActionRowBuilder()
            for (let i = 0; i < rowReminder; i++) {
                reminderRow.addComponents(
                    new ButtonBuilder().setCustomId(responseIdPrefix + "_" + qOptions[howManyRows * 5 + i].path + "_" + isParentFirst + "_" + (howManyRows * 5 + i))
                        .setLabel(`${(howManyRows * 5 + i + 1)}`).setStyle(ButtonStyle.Primary),
                )
            }
            rows.push(reminderRow)
        }

        return { "status": 200, "embed": embed, "rows": rows }
    },

}