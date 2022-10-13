const fs = require('fs')
const fileCategoryModel = require('../models/fileCategoryModel')
const filesManageModel = require('../models/filesManageModel')






async function checkCategory(categoryTitle, callback)
{
    //    console.log(decodeURIComponent(categoryTitle))
    try
    {
        const result = await fileCategoryModel.findOne({ CategoryTitle: categoryTitle }).exec();
        callback(null, result)
    } catch (error)
    {
        callback(error, null)
    }

}

async function addNewCategory(newcategory, callback)
{
    //  console.log(newcategory)
    try
    {
        const result = await fileCategoryModel.create({ CategoryTitle: newcategory.CategoryTitle, CategoryDes: newcategory.CategoryDes });
        if (result)
        {
            callback(null, true)
        } else
        {
            callback(null, false)
        }

    } catch (error)
    {
        callback(error, null)
    }

}

async function getAllCategory(callback)
{
    try
    {
        const result = await fileCategoryModel.find();
        callback(null, result)

    } catch (error)
    {
        callback(error, null)
    }

}

async function deleteCategory(categoryTitle, callback)
{
    //  console.log(categoryTitle)

    try
    {
        const result = await fileCategoryModel.findOneAndRemove({ CategoryTitle: categoryTitle });
        callback(null, result)

    } catch (error)
    {
        callback(error, null)
    }
}

async function addNewFile(newFile, callback)
{
    //   console.log(newFile)
    try
    {
        const result = await filesManageModel.create(newFile);
        callback(null, result)

    } catch (error)
    {
        callback(error, null)
    }

}

async function checkFile(fileName, callback)
{
    try
    {
        const result = await filesManageModel.findOne({ FileName: fileName }).exec();
        callback(null, result)
    } catch (error)
    {
        callback(error, null)
    }

}

async function getFileList(filter, callback)
{

    try
    {
        if (!filter)
            filter = null

        if (filter.CategoryTitle)
            filter = {
                "FileCategory.CategoryTitle": filter.CategoryTitle,
                // FileName: filter.FileName ?? null, $exists: false

            }

        // console.log(filter)
        const result = await filesManageModel.find(filter).exec();;
        callback(null, result)

    } catch (error)
    {
        callback(error, null)
    }

}

async function deleteFile(fileID, callback) 
{

    try
    {
        const result = await filesManageModel.findByIdAndRemove(fileID)
        if (result)
        {
            fs.unlinkSync(process.env.FILETMPFOLDER + result.FileName, (err) =>
            {
                if (err)
                    callback(err, null)
            }

            )
            callback(null, result)

        } else { callback(null, null) }

    } catch (error)
    {
        //console.log(error.message);
        callback(error, null)
    }
}



module.exports = { deleteFile, checkCategory, addNewCategory, addNewFile, getAllCategory, getFileList, deleteCategory, checkFile }