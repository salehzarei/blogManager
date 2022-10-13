const functions = require("../utils/extention")
const userRollModel = require("../models/userRoleModel")

/// Add New User Roll
exports.addNewOrUpdateUserRoll = async (req, res) =>
{
    if (functions.isNotEmpty(req.body))
    {
        const userRollExisted = await userRollModel.findById(req.body.Id);
        if (userRollExisted)
        {
            await userRollExisted.updateOne(
                req.body
            ).then(data =>
            {
                console.log(data)
                res.status(200).send({ data: userRollModel(data.body), message: "نقش کاربر با موفقیت به روزرسانی شد", success: true })
            }).catch(err =>
            {
                res.status(500).send({ message: err.message || "خطا در به روز رسانی نقش کاربر از سمت سرور" })
            })

        } else
        {
            /// add new setting
            await userRollModel(req.body).save().then(data =>
            {
                res.status(200).send({ data: data.body, message: "نقش کاربری با موفقیت ثبت شد", success: true })
            }).catch(err =>
            {
                res.status(500).send({ message: err.message || "خطا در ثبت نقش کاربری از سمت سرور" })
            })
        }

    } else
    {
        res.status(400).send({ message: "نمی توانید بدون داده نقش کاربری ثبت کنید که !" })
    }
}

/// Get User Roll
exports.getUserRoll = async (req, res) =>
{

    await userRollModel.find(
        req.body
    ).then(data =>
    {
        console.log(data)
        res.status(200).send({ data: data, success: true })
    }).catch(err =>
    {
        res.status(500).send({ message: err.message || "خطا در به روز رسانی نقش کاربر از سمت سرور" })
    })


}


/// Remove User Roll
exports.removeUserRoll = async (req, res) =>
{

    await userRollModel.findByIdAndRemove(
        req.body.Id
    ).then(data =>
    {
        console.log(data)
        if (!data)
        {
            res.status(200).send({ message: "نقش کاربری با شناسه مورد نظر پیدا نشد!", success: false })
        } else
        {
            res.status(200).send({ data: data, message: "نقش کاربری با موفقیت حذف شد", success: true })
        }
    }).catch(err =>
    {
        res.status(500).send({ message: err.message || "خطا در حذف نقش کاربر از سمت سرور" })
    })


}