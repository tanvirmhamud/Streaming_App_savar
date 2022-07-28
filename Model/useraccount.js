const { default: mongoose, model } = require("mongoose")
const schema = mongoose.Schema



const usermodel = new schema({
    id: schema.ObjectId,
    name: String,
    email: String,
    password: String,
    live: Boolean
})

const createmodel = mongoose.model('user',usermodel)

module.exports = createmodel