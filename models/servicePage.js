var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var servicePageSchema = new Schema({
    ServicePageCategory: {
        CategoryTitle: {
            type: String,
            required: true
        },
        CategoryDescription: {
            type: String
        },
        CategoryType: {
            type: Number,
            required: true
        }
    },
    ServicePageTitle: {
        type: String
    },
    ServicePageContent: {
        type: String
    },
    ServicePageStatus: {
        type: Boolean,
        required: true
    },
    ServicePageDes: {
        type: String
    },
    ServicePageKeyword: [{
        type: String
    }],
    ServicePageBasePic: {
        type: String,
        required: true
    },
    ServicePageBasePicALt: {
        type: String
    },
    ServicePageBanner: [{
        BannerTitle: {
            type: String,
            required: true
        },
        BannerUrl: {
            type: String,
            required: true
        },
        BannerAlt: {
            type: String
        },
        BannerStatus: {
            type: Boolean,
            required: true
        }
    }],
    CustomScript: {
        type: String
    }
});

const servicePageModel = mongoose.model('servicePage', servicePageSchema);

module.exports = servicePageModel;