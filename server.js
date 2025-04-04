const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use(express.static('pubic'))

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public')
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, () => {
    console.log(`Site rodando em http://localhost:${port}`)
})
