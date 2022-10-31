const extension = require("../utils/extention")
const functions = require("../functions/fileManagerFunctions")
const userRollModel = require("../models/userRoleModel")
const usersModel = require("../models/userModel")

/// Add New User Roll
exports.addNewOrUpdateUserRoll = async (req, res) =>
{
    if (extension.isNotEmpty(req.body))
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


/// Add New User
exports.addNewUser = async (req, res) =>
{
    if (extension.isNotEmpty(req.body))
    {
        const userExisted = await usersModel.findOne(req.body);
        console.log(userExisted)
        if (!userExisted)
        {
            await usersModel({
                UserToken: functions.makeToken(),
                UserName: req.body.UserName,
                Password: req.body.Password,
                Email: req.body.Email,
                Status: req.body.Status,
                //  UserRoles: userRolesSchema(req.body.UserRoles)
            }).save().then(data =>
            {
                res.status(200).send({ data: data.body, message: "پروفایل کاربری با موفقیت ثبت شد", success: true })
            }).catch(err =>
            {
                res.status(500).send({ message: err.message || "خطا در ثبت پروفایل کاربری از سمت سرور" })
            })
        }
        else
        {
            //console.log(userExisted)
            await userExisted.updateOne({
                UserToken: userExisted.UserToken,
                UserName: req.body.UserName,
                Password: userExisted.Password,
                Email: req.body.Email,
                Status: req.body.Status
            }

            ).then(data =>
            {
                console.log(data)
                res.status(200).send({ data: "", message: "پروفایل کاربر با موفقیت به روزرسانی شد", success: true })
            }).catch(err =>
            {
                res.status(500).send({ message: err.message || "خطا در به روز رسانی پروفایل کاربر از سمت سرور" })
            })



        }

    } else
    {
        res.status(400).send({ message: "نمی توانید بدون داده کاربری بسازید !" })
    }
}