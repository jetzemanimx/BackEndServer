var moongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectId;

var medicoSchema = new moongoose.Schema({
    _id : {
        type : moongoose.Schema.Types.ObjectId,
        default : ObjectID
    },
    personalData : {
        name : {
            type : String,
            required : true
        },
        lastName: {
            type: String,
            required: true
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
    Usuarios : [{
        required : true,
        type : moongoose.Schema.Types.ObjectId,
        ref : 'Usuario'
    }],
    Hospitales : [{
        required : true,
        type : moongoose.Schema.Types.ObjectId,
        ref : 'Hospital'
    }]
});

module.exports = moongoose.model("Medico", medicoSchema);