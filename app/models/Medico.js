var moongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectId;

var medicoSchema = new moongoose.Schema({
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
            required : [true, "El lastName es necesario"]
        },
        Image : {
            type : String,
            required : false
        },
    },
    Date:{
        type: Date, 
        default: Date.now()
    },
    isActive: {
        type: Boolean,
        default: true
    },
    Usuario : {
        required : [true, "El ID Usuario es necesario"],
        type : moongoose.Schema.Types.ObjectId,
        ref : 'Usuario'
    },
    Hospital : {
        required : [true, "El Id Hospital es necesario"],
        type : moongoose.Schema.Types.ObjectId,
        ref : 'Hospital'
    }
});

module.exports = moongoose.model("Medico", medicoSchema);