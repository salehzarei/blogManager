//import { UserRoles } from './userRoleModel'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userModelSchema = new Schema({

    UserToken: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Email: {
        type: String,

    },
    Status: {
        type: Boolean,
        required: true
    },
    UserRoles: {
        type: Schema.Types.ObjectId,
        ref: 'UserRoles'
    }
});

const userModel = mongoose.model('users', userModelSchema);

module.exports = userModel;