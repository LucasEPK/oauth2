const express = require('express')
const dotenv = require('dotenv').config()
const app = express()
const port = process.env.PORT
const cors = require('cors')
const { request } = require('undici');

let data
// Enables cors, this is makes the backend work with nginx frontend
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// This is called from the discord redirect url
app.get('/discord', async ({ query }, res) => {
  
  // Here we get access code
  const { code } = query;
  let userResult
  
  // Here we get access token and request user data
  if (code) {
    try {
      // Getting acess token
      const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `http://localhost:${port}/discord`,
          scope: 'identify',
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const oauthData = await tokenResponseData.body.json();
      console.log(oauthData)

      // Requesting user data
      userResult = await request('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error
      console.error(error);
    }
  }
  
  data = await userResult.body.json()
  await console.log(data['username']);
  await res.redirect("http://localhost:3000")
})

app.get('/discord_data', async(req, res) => {
  await console.log(data)
  await res.json(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})