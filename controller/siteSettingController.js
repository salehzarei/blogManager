const siteSetting = require("../models/siteSettingModel")
const functions = require("../utils/extention")

/// Add New Sit Setting For First Time or Update
exports.addNewSiteSetting = async (req, res) =>
{
    if (functions.isNotEmpty(req.body))
    // if (isNotEmpty(req.body))
    {
        const settingExisted = await siteSetting.findOne();
        if (settingExisted)
        {
            /// update setting

            await siteSetting.findByIdAndUpdate(
                settingExisted.id
                ,
                req.body
            ).then(data =>
            {
                console.log(data)
                res.status(200).send({ data: siteSetting(data.body), message: "تنظیمات با موفقیت به روزرسانی شد", success: true })
            }).catch(err =>
            {
                res.status(500).send({ message: err.message || "خطا در به روز رسانی تنظیمات از سمت سرور" })
            })

        } else
        {
            /// add new setting
            await siteSetting(req.body).save().then(data =>
            {
                res.status(200).send({ data: data.body, message: "تنظیمات با موفقیت ثبت شد", success: true })
            }).catch(err =>
            {
                res.status(500).send({ message: err.message || "خطا در ثبت تنظیمات از سمت سرور" })
            })
        }

    } else
    {
        res.status(400).send({ message: "نمی توانید بدون داده تظیمات ثبت کنید که !" })
    }
}


/// Get Site Setting
exports.getSitSetting = async (req, res) =>
{
    const currentSettings = await siteSetting.findOne()
    if (currentSettings)
    {
        return res.status(200).send({
            data: {
                LogoUrl: currentSettings.LogoUrl,
                LogoAlt: currentSettings.LogoAlt,
                WhatsAppUrl: currentSettings.WhatsAppUrl,
                TelegramUrl: currentSettings.TelegramUrl,
                InstragramUrl: currentSettings.InstragramUrl,
                FacebookUrl: currentSettings.FacebookUrl,
                PintrestUrl: currentSettings.PintrestUrl,
                EmailUrl: currentSettings.EmailUrl
            }
            , success: true
        });
    }
    res.status(200).send({
        data: {}, message: "هیچ تنظیماتی پیدا نشد ", success: false
    })
}



/// Remove Sit Setting
exports.removeSitSetting = async (req, res) =>
{
    const currentSettings = await siteSetting.findOne()


    siteSetting.findByIdAndDelete(currentSettings).then(data =>
    {
        if (data)
        {
            res.status(200).send({ message: "تنظیمات با موفقیت حذف شد", success: true })
        } else
        {
            res.status(404).send({ message: " تنظیماتی جهت حذف وجود ندارد دوست عزیز!", success: false })
        }
    }).catch(err =>
    {
        res.status(500).send({ message: "خطایی از سمت سرور رخ داده است", err })
    })
}

