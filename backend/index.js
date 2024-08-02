const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const userRoutes = require('./routes/userRoutes')
const checkListRoutes = require('./routes/checekListRoutes')
const calendarRoutes = require('./routes/calendarRoutes')
const consistencyRoutes = require('./routes/ConsistencyRoutes')

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{console.log("connected to mongo")})
    .catch((err)=>{console.log(`err in db connection: ${err}`)})
app.use(express.json())
app.use(cors({origin:'*'}))

app.get("/",(req,res)=>{
    res.json({data:"hello"})
})

app.use('/',userRoutes)
app.use('/',checkListRoutes)
app.use('/',calendarRoutes)
app.use('/',consistencyRoutes)


app.listen(8000,()=>{console.log('app running on port 8000')})