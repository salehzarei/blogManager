const AWSClient = require('../config/awsConfig');
const fileFunctions = require('../functions/fileManagerFunctions')
const fs = require('fs');


/// Creat New Album
exports.createAlbum = async (req, res) =>
{
    if (!req.body.AlbumName)
    {

        res.status(400).send({
            status: false,
            message: 'ورود نام برای آلبوم الزامی است',
        });
    } else
    {
        albumName = req.body.AlbumName.trim()
        var albumKey = encodeURIComponent(albumName)
        try
        {
            await fileFunctions.checkCategory(albumKey, async (err, result) =>
            {
                /// اگر دسته بندی قبلا ساخته نشده باشد
                if (!result)
                {
                    /// ابتدا در سرور ابری دسته بندی را بساز
                    await AWSClient.s3.putObject({ Key: albumKey }, async (err, data) =>
                    {
                        if (err)
                        {
                            res.status(400).send({
                                status: false,
                                message: `در ساخت البوم خطا وجود دارد ${err.message}`,
                            });
                        } else
                        {
                            /// در صورت موفق بود ساخت در سرور ابری در دیتابیس ذخیره کن
                            await fileFunctions.addNewCategory({ CategoryTitle: albumKey, CategoryDes: req.body.CategoryDes }, (err, result) =>
                            {
                                if (err)
                                {
                                    res.status(400).send({
                                        status: false,
                                        message: `در ساخت البوم خطا وجود دارد ${err.message}`,
                                    });
                                } else
                                {
                                    res.status(200).send({
                                        status: true,
                                        message: 'آلبوم با موفقیت ایجاد شد',
                                        data: { CategoryTitle: decodeURIComponent(albumKey), CategoryDes: req.body.CategoryDes }
                                    });
                                }
                            })


                        }

                    })

                } else
                {
                    res.status(200).send({
                        status: false,
                        message: 'دسته بندی قبلا با این عنوان ثبت شده است',
                        data: decodeURIComponent(albumKey)
                    });
                }
            })
        } catch (error)
        {
            console.log("Error", error)
            res.status(500).send({
                status: false,
                message: 'خطا در ارتباط با سرور',
                error: err
            });

        }

    }

}

/// دریافت لیست همه دسته بندی ها
exports.getAllCategory = async (req, res) =>
{
    //    var getParams = {}
    //     if (req.params.AlbumKey != 0)
    //         var albumFileKey = encodeURIComponent(req.params.AlbumKey) + "/";

    //     getParams = { Prefix: albumFileKey }
    try
    {
        //   await AWSClient.s3.listObjects(getParams, (err, data) =>
        await fileFunctions.getAllCategory((err, result) =>
        {
            if (err)
            {
                // console.log("Error", err)
                res.status(400).send({
                    status: false,
                    message: 'خطا در دریافت لیست دسته بندی ها',
                    error: err
                });
            } else
            {
                //   console.log("Success", data);
                res.status(200).send({
                    status: true,
                    data: result
                });
            }
        })

    } catch (error)
    {
        console.log("Error", error)
        res.status(500).send({
            status: false,
            message: 'خطا در ارتباط با سرور',
            error: err
        });
    }
}

/// Get all File form Album
exports.getFileList = async (req, res) =>
{

    // var getParams = {}
    // if (req.params.AlbumKey != 0)
    //     var albumFileKey = encodeURIComponent(req.params.AlbumKey) + "/";

    // getParams = { Prefix: albumFileKey }
    try
    {
        const filter = req.body
        // await AWSClient.s3.listObjects(getParams, (err, data) =>
        await fileFunctions.getFileList(filter, (err, result) =>
        {
            if (err)
            {
                // console.log("Error", err)
                res.status(400).send({
                    status: false,
                    message: 'خطا در دریافت لیست فایل ها',
                    error: err
                });
            } else
            {
                //   console.log("Success", data);
                res.status(200).send({
                    status: true,
                    data: result
                });
            }
        })

    } catch (error)
    {
        console.log("Error", error)
        res.status(500).send({
            status: false,
            message: 'خطا در ارتباط با سرور',
            error: err
        });
    }
}

/// Add New ServicePage
exports.uploadFile = async (req, res,) =>
{
    // console.log(req.body);

    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).send({
            status: false,
            message: 'مسلمون هیچ فایلی جهت ذخیره سازی ارسال نشده',

        });

    let file = req.files.FileSource;
    /// بررسی وجود فایل در سرور محلی
    await fileFunctions.checkFile(file.name, async (err, result) =>
    {
        if (err)
        {
            res.status(400).send({
                status: false,
                message: 'خطا در بررسی فایل در سرور محلی',
                error: err
            });
        } else
        {
            if (result)
            {
                res.status(200).send({
                    status: false,
                    message: 'فایل مورد نظر قبلا در سرور محلی ذخیره شده است',
                    data: result
                });
            } else
            {
                /// ذخیره در سرور محلی و آماده سازی برای ارسال به سرور ابری
                await file.mv(process.env.FILETMPFOLDER + file.name);
                var fileStream = fs.createReadStream(process.env.FILETMPFOLDER + file.name)
                fileStream.on('error', function (err)
                {
                    console.log('خطا در آماده سازی فایل', err)
                })
                var fileName = file.name
                var fileCategory = {}
                /// اگر دسته بندی خالی نبود
                if (req.body.Category)
                {
                    /// در صورت خالی نبودن داخل دیتابیس بگرد    
                    await fileFunctions.checkCategory(encodeURIComponent(req.body.Category), async (err, result) =>
                    {
                        if (err)
                        {
                            res.status(400).send({
                                status: false,
                                message: 'خطا در بررسی دسته بندی در دیتابیس',
                                error: err
                            });
                        } else
                        {
                            /// درصورتی که دسته بندی قبلا در دیتابیس وجود داشت     
                            if (result)
                            {
                                fileCategory = {
                                    CategoryTitle: result.CategoryTitle,
                                    CategoryDes: result.CategoryDes
                                }
                                fileName = result.CategoryTitle + "/" + fileName
                            }

                        }
                    })
                }
                /// پارامتر های ذخیره سازی فایل در سرور ابری را بساز
                const uploadParams = {
                    Key: fileName,
                    Body: fileStream,
                    ContentType: file.mimetype

                };
                /// آپلود فایل در سرور ابری
                await AWSClient.s3.upload(uploadParams, async function (err, data)
                {
                    if (err)
                    {
                        console.log("Error", err)
                        res.status(400).send({
                            status: false,
                            message: 'خطا در ذخیره سازی فایل در سرور ابری',
                            error: err
                        });

                    } else
                    {
                        if (data)
                        {
                            var newfile = {
                                FileName: file.name,
                                FileDescription: req.body.FileDescription,
                                FileLocalPath: process.env.FILETMPFOLDER + file.name,
                                FileCloudPath: data.Location,
                                FileType: file.mimetype,
                                FileSize: file.size,
                                FileCategory: fileCategory
                            }
                            await fileFunctions.addNewFile(newfile, (err, result) =>
                            {
                                if (err)
                                {
                                    res.status(400).send({
                                        status: false,
                                        message: 'خطا در ذخیره سازی فایل در دیتابیس',
                                        error: err
                                    });
                                } else
                                {
                                    if (result)
                                    {
                                        res.status(200).send({
                                            status: true,
                                            message: 'فایل با موفقیت ذخیره شد',
                                            data: {
                                                FileName: result.FileName,
                                                FileDescription: result.FileDescription,
                                                FileLocalPath: result.FileLocalPath,
                                                FileCloudPath: result.FileCloudPath,
                                                FileType: result.FileType,
                                                FileSize: result.FileSize,
                                                FileCategory: result.FileCategory
                                            }
                                        });
                                    }
                                }
                            })
                        }
                    }
                })



            }
        }
    })
}





exports.deleteFile = async (req, res) =>
{
    if (!req.body.FileId)
    {
        res.status(400).send({
            status: false,
            message: `ورود شناسه فایل ضروری است`,

        });
    } else
    {
        try
        {

            /// بررسی و حذف فایل در صورت وجود از دیتابیس و فضای داخلی
            await fileFunctions.deleteFile(req.body.FileId, async (err, result) =>
            {
                if (err)
                {
                    res.status(400).send({
                        status: false,
                        message: `خطا در حذف فایل از دیتابیس`,
                        error: err.message
                    });
                } else
                {
                    if (result)
                    {
                        // حذف فایل از سرور ابری
                        var deleteParams = {
                            Key: result.FileName
                        };

                        if (result.FileCategory.CategoryTitle)
                        {
                            console.log("Have Category")
                            deleteParams = {
                                Key: result.FileCategory.CategoryTitle + "/" + result.FileName
                            };

                        }
                        // console.log(result.FileCategory)
                        // console.log(result)
                        // console.log(deleteParams)

                        await AWSClient.s3.deleteObject(deleteParams, async (err, data) =>
                        {
                            if (err)
                            {
                                res.status(400).send({
                                    status: false,
                                    message: `خطا در حذف فایل در سرور ابری`,
                                    error: err.message
                                });
                            } else
                            {
                                res.status(200).send({
                                    status: true,
                                    message: `حذف فایل در هر دو سرور با موفقیت انجام شد`,
                                    data: result
                                });
                            }
                        })
                    } else
                    {
                        res.status(200).send({
                            status: false,
                            message: `فایل با شناسه وارد شده در دیتابیس وجود ندارد`,

                        });
                    }
                }



            })


        } catch (error)
        {
            console.log("Error", error)
            res.status(500).send({
                status: false,
                message: 'خطا در ارتباط با سرور',
                error: err
            });
        }
    }

}



exports.deleteAlbum = async (req, res) =>
{
    if (!req.body.CategoryTitle)
    {
        res.status(400).send({
            status: false,
            message: `ورود عنوان آلبوم ضروری است`,
        });
    } else
    {
        var albumKey = encodeURIComponent(req.body.CategoryTitle) + "/";
        try
        {

            await AWSClient.s3.listObjects({ Prefix: albumKey }, async (err, data) =>
            {
                if (err)
                {
                    res.status(400).send({
                        status: false,
                        message: `خطا در شناسایی آلبوم در سرور ابری`,
                        error: err.message
                    });
                } else
                {

                    var objects = data.Contents.map((object) =>
                    {
                        return { Key: object.Key }
                    })

                    await AWSClient.s3.deleteObjects({
                        Delete: { Objects: objects, Quiet: true }
                    }, async (err, data) =>
                    {
                        if (err)
                        {
                            res.status(400).send({
                                status: false,
                                message: `خطا در حذف آلبوم در سرور ابری ، عدم وجود آلبوم در سرور`,
                                error: err.message
                            });
                        } else
                        {
                            await fileFunctions.deleteCategory(req.body.CategoryTitle, (err, result) =>
                            {

                                if (err)
                                {
                                    res.status(400).send({
                                        status: false,
                                        message: `خطا در حذف آلبوم در سرور محلی`,
                                        error: err.message
                                    });
                                } else
                                {
                                    res.status(200).send({
                                        status: true,
                                        message: `حذف آلبوم در سرور با موفقیت انجام شد`,
                                        data: result
                                    });
                                }

                            })
                        }
                    })
                }
            })

        } catch (error)
        {
            console.log("Error", error)
            res.status(500).send({
                status: false,
                message: 'خطا در ارتباط با سرور',
                error: err
            });
        }
    }


}



