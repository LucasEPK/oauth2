const express = require('express')
const dotenv = require('dotenv').config()
const app = express()
const port = process.env.PORT
const cors = require('cors')

// Enables cors, this is makes the backend work with nginx frontend
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(process.env.PORT)
})