const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId;
const urlSchema = new mongoose.Schema
    ({

        urlCode: {
            type: String,
            required: "urlCode requried",
            unique: true,
            lowercase: true,
            
            trim: true
        },
        fullUrl: {
            type: String,
            trim:true,
            required: "long url required"
        },
        shortlink: {
            type: String,
            requried: "short link requried",
            unique: true
        },
        authenticated_user: { type: ObjectId, ref: "User" },
        
        description:{
            type: String,
        },
        tags:{
            type: String,
        },
        isDeleted: {type:Boolean, default: false}
    }, { timestamps: true })

module.exports = mongoose.model('Url', urlSchema)