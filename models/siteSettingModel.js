const { default: mongoose, model } = require("mongoose")

const siteSettingSchema = new mongoose.Schema({
    LogoUrl: {
        type: String,
        require: true
    },
    LogoAlt: {
        type: String,
    },
    WhatsAppUrl: {
        type: String,
    },
    TelegramUrl: {
        type: String,
    },
    InstragramUrl: {
        type: String,
    },
    FacebookUrl: {
        type: String,
    },
    PintrestUrl: {
        type: String,
    },
    EmailUrl: {
        type: String,
    },


}, { timeseries: true })

const siteSettingModel = mongoose.model('sitSetting', siteSettingSchema);

module.exports = siteSettingModel;