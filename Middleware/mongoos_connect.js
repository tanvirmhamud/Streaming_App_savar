const mongoose = require('mongoose');


const dbconnect =  mongoose.connect('mongodb+srv://tanvir:WMgKddUmW5j7DrWV@cluster0.t8x12np.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log('Database Connect')
}).catch((error)=>{
    console.log(error)
})



module.exports = dbconnect