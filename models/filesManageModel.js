var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var filesManagment = new Schema({
    FileName: {
        type: String,
        required: true
    },
    FileDescription: {
        type: String
    },
    FileLocalPath: {
        type: String,
        required: true
    },
    FileCloudPath: {
        type: String,
        required: true
    },
    FileType: {
        type: String,
        required: true
    },
    FileSize: {
        type: String,
        required: true
    },
    FileCategory: {
        CategoryId: {
            type: String,
        },
        CategoryTitle: {
            type: String,

        },
        CategoryDes: {
            type: String
        }
    }
});

const filesManageModel = mongoose.model('fileManagment', filesManagment);

module.exports = filesManageModel;