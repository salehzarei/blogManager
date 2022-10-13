const { ErrorHandler } = require('../utils/errorHandler')
const functions = require("../utils/extention")
const servicePage = require("../models/servicePage")

/// Add New ServicePage
exports.addNewServicePage = async (req, res) =>
{
    if (functions.isNotEmpty(req.body))
    {
        /// add new setting
        await servicePage(req.body).save().then(data =>
        {
            res.status(200).send({ data: data.body, message: "ثبت صفحه جدید با موفقیت انجام شد", success: true })
        }).catch(err =>
        {
            res.status(500).send({ message: err.message || "خطا در ثبت صفحه جدید از سمت سرور" })
            next(new ErrorHandler(err.statusCode || 500, err.message))
        })

    } else
    {
        // var re = servicePage.find().lean().exec(function (err, users)
        // {
        //     console.log(JSON.stringify(servicePage(), null, '\t'))
        //     return res.end(JSON.stringify(users));
        // })
        console.log(JSON.stringify(servicePage(), null, '\t'))
        res.status(400).send({ message: "نمی توانید بدون داده صفحه ای ثبت کنید که !", data: servicePage() })
    }
}

/// Update Service Page
exports.updateServicePage = async (req, res) =>
{

    if (!req.body._id)

        res.status(400).send({ message: "شناسه صفحه سرویس را وارد کنید" })

    const currnetID = req.body._id.toString()

    if (currnetID.match(/^[0-9a-fA-F]{24}$/))
    {
        const result = await servicePage.findByIdAndUpdate(currnetID, req.body)
        if (!result)
            res.status(400).send({ message: "صفحه ای با شناسه ارسال شده پیدا نشد" })

        res.status(200).send({ data: result, message: "صفحه سرویس تغییر داده شد", success: true })

    } else
    {
        res.status(400).send({ message: "فرمت شناسه صفحه سرویس صحیح نیست!" })
    }

}

/// Get All Service Page
exports.getAllServicePage = async (req, res) =>
{
    await servicePage.find().then(data =>
    {
        console.log(data)
        res.status(200).send({ data: data, message: "صفحات سرویس با موفقیت خوانده شده", success: true })
    })
}

/// Get Service Page Detail
exports.getServicePageDetail = async (req, res) =>
{

    if (functions.isNotEmpty(req.body) || functions.isNotEmpty(req.params.catid))
    {
        const categoryType = req.params.catid

        const result = await servicePage.find({
            'ServicePageCategory.CategoryType': categoryType,
            'ServicePageStatus': req.body.ServicePageStatus

        })
        res.status(200).send({ data: result, message: "صفحات سرویس با موفقیت خوانده شده", success: true })

    } else
    {
        res.status(400).send({ message: "نمی توانید بدون داده صفحه ای جستجو کنید کنید !" })
    }
}

/// delete Service page
exports.deleteServicePage = async (req, res) =>
{

    const id = req.params.serviceId
    if (id.match(/^[0-9a-fA-F]{24}$/))
    {
        const servicePageId = await servicePage.findById(id);

        if (functions.isNotEmpty(servicePageId))
        {
            servicePage.findByIdAndDelete(servicePageId.id).then(data =>
            {
                if (data)
                {
                    res.status(200).send({ message: "صفحه با موفقیت حذف شد", success: true })
                } else
                {
                    res.status(404).send({ message: " صفحه ای جهت حذف وجود ندارد دوست عزیز!", success: false })
                }
            }).catch(err =>
            {
                res.status(500).send({ message: "خطایی از سمت سرور رخ داده است", err })
            })
        }
        else
        {
            res.status(404).send({ message: " صفحه ای با شناسه وارد شده وجود ندارد", success: false })
        }

    } else
    {
        res.status(404).send({ message: "شناسه وارد شده معتبر نیست", success: false })
    }



}