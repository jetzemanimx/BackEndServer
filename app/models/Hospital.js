var moongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectId;

var hospitalSchema = new moongoose.Schema({
    _id : {
        type : moongoose.Schema.Types.ObjectId,
        default : ObjectID
    },
    Name : {
        type : String,
        required : [true, "El name es necesario"]
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
    Usuario : {
        type : moongoose.Schema.Types.ObjectId,
        ref : 'Usuario'
    },
}, {collection : "hospitales"});

module.exports = moongoose.model("Hospital", hospitalSchema);