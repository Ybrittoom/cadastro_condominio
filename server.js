//server.js
const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use(express.json())

app.use(express.static('public'))

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public')
    res.sendFile(__dirname + '/public/index.html')
})

const moradoresRoutes = require('./routes')
app.use(express.json())
app.use('/api', moradoresRoutes)

app.listen(port, () => {
    console.log(`Site rodando em http://localhost:${port}`)
})
