const { default: mongoose, model } = require("mongoose")
const schema = mongoose.Schema



const audience = new schema({
    id: schema.ObjectId,
    hostid: schema.ObjectId,
    userid: schema.ObjectId,
    name: String,
    email: String,
    live: Boolean,
    rtcToken: String,
    channelname: String,
    uid: Number,
    role: Number,
    joinrequest: Boolean
})

const audiencemodel = mongoose.model('audience',audience)

module.exports = audiencemodel