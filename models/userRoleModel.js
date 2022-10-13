var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userRolesSchema = new Schema({
    RoleTitle: {
        type: String,
        required: true
    },
    RoleDes: {
        type: String,
        required: true
    },
    RoleLevel: {
        type: String,
        required: true
    },
    RoleStatus: {
        type: Boolean,
        required: true
    }
});

const userRoles = mongoose.model('UserRoles', userRolesSchema);

module.exports = userRoles;