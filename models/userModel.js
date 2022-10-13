import { UserRoles } from './userRoleModel'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userModel = new Schema({

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
        required: true
    },
    UserRoles: {
        type: Schema.Types.ObjectId,
        required: true
    },
    Status: {
        type: Boolean,
        required: true
    },
    UserRoles: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'UserRoles'
    }
});

const userModel = mongoose.model('users', userModelSchema);

module.exports = userModel;