const fileSystem = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const port = 3000

const pathToAPI = 'C:/Users/cstri/gpusforall/backend/apis'
const fileArray = fileSystem.readdirSync(pathToAPI).map(file => path.join(pathToAPI, file))
const apiArray = [].concat.apply([],fileArray.map(filePath => {return require(filePath)}))
console.log(`line 10: ${fileArray} `)
console.log(apiArray)

for (let i = 0; i < apiArray.length; i++)
{
    const arrayObj = apiArray[i]
    const method = arrayObj['method']
    const handler = arrayObj['handler']
    const path = arrayObj['path']
    const options = arrayObj['options']

    if (method === 'ALL') app.all(`/apis/${path}`, (req,res) => handler(req,res));
    if (method === 'PUT') app.put(`/apis/${path}`, (req,res) => handler(req,res));
    if (method === 'GET') app.get(`/apis/${path}`, (req,res) => handler(req,res));
    if (method === 'POST') app.post(`/apis/${path}`, (req,res) => handler(req,res));
    if (method === 'DELETE') app.delete(`/apis/${path}`, (req,res) => handler(req,res));
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})