const { default: mongoose, model } = require("mongoose")
const schema = mongoose.Schema



const agoralive = new schema({
    id: schema.ObjectId,
    userid: schema.ObjectId,
    name: String,
    email: String,
    live: Boolean,
    rtcToken: String,
    channelname: String,
    uid: Number,
    role: Number,
    



})

const agoralivemodel = mongoose.model('agoralive',agoralive)

module.exports = agoralivemodel