 //const fs = require('fs');
// fs.readFile('demo.txt','utf-8',(err,data)=>{
//     if(err){
//         console.log(err)
//     } else {
//         console.log(data)
//     }
// })




// fs.writeFile('example.html','utf-8',(err)=>{
//     if(err){
//         console.log(err)
//     } else {
//         console.log('File written successfully')
//     }
// })



// const contentSample = "My name is Pranav and I am learning Node.js"
//     fs.writeFile('example.html',contentSample,(err)=>{
//     if(err){
//         console.log(err)
//     } else {
//         console.log('File content written successfully')
//     }
// })    



// const contentSample = "My name is Pranav and I am learning Node.js"
//     fs.rename('example.html',"newChangedFile.js",(err)=>{
//     if(err){
//         console.log(err)
//     } else {
//         console.log('File renamed successfully')
//     }
// })  



// fs.unlink('newChangedFile.js',(err)=>{
//     if(err){
//         console.log(err)
//     } else {
//         console.log('File deleted successfully')
//     }       
// })

// HTTP Module

const http = require('http');

const { addNumber, subtractNumber, divideNumber, multiplyNumber } = require('./demomodule')

// const myServer=http.createServer((request, response)=>{
//     response.write("Hello World! This is my first Node.js server.")
//     response.end()          
// })

//  myServer.listen(5500)

console.log(addNumber(5,3))
console.log(subtractNumber(5,3))
console.log(divideNumber(5,3))
console.log(multiplyNumber(5,3))
