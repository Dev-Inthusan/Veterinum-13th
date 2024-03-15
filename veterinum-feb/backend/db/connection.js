const mongoose = require('mongoose')

const db = process.env.DATABASE

mongoose.connect(db, {
    useNewurlParser : true,
    useUnifiedTopology : true
}).then(()=>{
    console.log("Database Connected")
}).catch((e)=>{
    console.log(e)
})


