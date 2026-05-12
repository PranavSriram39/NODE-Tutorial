const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const employeeRoutes = require('./routes/employeeroutes')
const ejs = require('ejs')

const dns = require('dns')

dns.setServers(['8.8.8.8', '1.1.1.1'])

dotenv.config()

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.json())

//client side rendering
app.get('/mango',(req,res) =>{
    res.json({fruit:"mango"})
})

//server side rendering
app.get('/apple',(req,res) => {
    res.render('samplePage', {fruit:"apple"})
})

//html css 
//template engines
//ejs 

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB Successfully')
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err)
})

app.use('/employee', employeeRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

