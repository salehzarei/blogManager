var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fileCategorySchema = new Schema({
    CategoryId: {
        type: String,
    },
    CategoryTitle: {
        type: String,
        required: true
    },
    CategoryDes: {
        type: String
    }
});

const fileCategoryModel = mongoose.model('fileCategory', fileCategorySchema);

module.exports = fileCategoryModel;