const fs = require('fs')
const express = require('express')
const app = require('express')()

app.use('/lib', express.static('lib'))
app.use('/scripts', express.static('scripts'))
app.use('/pages', express.static('pages'))

app.use(express.json())


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/home.html')
})

app.get('/approve', (req, res) => {
  res.sendFile(__dirname + '/pages/approve.html')
})

app.get('/cryptos', (req, res) => {
  res.send(fs.readFileSync('./lib/cryptos.json'))
})

app.get('/filter', (req, res) => {
  res.send(fs.readFileSync('./lib/filter.json'))
})

app.get('/create', (req, res) => {
  res.sendFile(__dirname + '/pages/create.html')
})

app.post('/submit', (req, res) => {
  let arr = JSON.parse(fs.readFileSync('./lib/filter.json'))
  arr.push(req.body)
  fs.writeFile("./lib/filter.json", JSON.stringify(arr), (err) => {
    if (err) throw err
    console.log('Submission Recieved: ' + req.body.name)
  })
  res.sendStatus(200)
})

app.post('/approve', (req, res) => {
  let arr = JSON.parse(fs.readFileSync('./lib/cryptos.json'))
  if (req.body.approved == true) {
    arr.push(req.body.item)
    fs.writeFile("./lib/cryptos.json", JSON.stringify(arr), (err) => {
      if (err) throw err
      console.log('Submission Approved: ' + req.body.item.name)
    })
  }
  fs.writeFile("./lib/filter.json", JSON.stringify(req.body.data), (err) => {
    if (err) throw err
    console.log('Submission Denied: ' + req.body.item.name)
  })
  
  res.sendStatus(200)
})

app.listen(3000)