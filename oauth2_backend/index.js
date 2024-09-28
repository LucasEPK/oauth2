const express = require('express')
const app = express()
const port = 8000
const cors = require('cors')

// Enables cors, this is makes the backend work with nginx frontend
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})