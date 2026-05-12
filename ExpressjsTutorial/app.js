// console.log("welcome to EXPRESS JS");


const express = require("express")

const app = express()

const PORT = 5000

const firsthandler = ((req,res,next)=> {
        if(10 < 20){
            next()
        }
})

const secondhandler = ((req,res,next)=> {
        if(30>20){
            next()
        }
})

const thirdhandler = ((req,res,next)=> {
        if(10 > 20){
            next()
        }else{
            console.log("sorry ur not aollewd")
        }
})


app.get('/apple',(req,res)=>{
    res.send("Apple is red in color")
})

app.get('/home', firsthandler, (req,res)=>{
    res.send("welcome to home page")
})

app.get('/about', secondhandler, (req,res)=>{
    res.send("welcome to about page")
})

app.get('/user', thirdhandler, (req,res)=>{
    res.send("welcome to user page")    
})


app.listen(PORT,() => {
    console.log('server started and running  succeessfully')
})
