var moongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectId;

var hospitalSchema = new moongoose.Schema({
    _id : {
        type : moongoose.Schema.Types.ObjectId,
        default : ObjectID
    },
    name : {
        type : String,
        required : true
    },
    Image : {
        type : String,
        required : false
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
});

module.exports = moongoose.model("Hospital", hospitalSchema);