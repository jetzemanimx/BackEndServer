var moongoose = require("mongoose");
var crypto = require("crypto");
var decipher = crypto.createDecipher('aes192', 'a password');
var ObjectID = require('mongodb').ObjectId;
var uniqueValidator = require('mongoose-unique-validator');


var roleValidate = {
    values : ['ADMIN_ROLE', 'USER_ROLE'],
    message : "No es un rol permitido"
}

var usuarioSchema = new moongoose.Schema({
    _id : {
        type : moongoose.Schema.Types.ObjectId,
        default : ObjectID
    },
    personalData : {
        Name : {
            type : String,
            required : [true, "El Name es necesario"]
        },
        lastName: {
            type: String,
            required: [true, "El lastName es necesario"]
        },
        Email: {
            type: String,
            required: [true, "El Email es necesario"],
            unique:true
        },
        Password : {
            type : String,
            required : [true, "El Password es necesario"]
        },
        Image : {
            type : String,
            required : false
        }
    },
    Role :  {
        type : String,
        required : [true, "El Role es necesario"],
        default : "USER_ROLE",
        enum : roleValidate
    },
    Google : {
        type : Boolean,
        required : false,
        default : false
    },
    Date:{
        type: Date, 
        default: Date.now()
    },
    isActive: {
        type: Boolean,
        required : false,
        default: true
    },
    JWT : String
});

usuarioSchema.plugin(uniqueValidator, { message : "El {PATH} debe ser unico"});

module.exports = moongoose.model('Usuario',usuarioSchema);