const express = require('express')
const dotenv = require('dotenv').config()
const app = express()
const port = process.env.PORT
const cors = require('cors')
const { request } = require('undici');

// Enables cors, this is makes the backend work with nginx frontend
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// This is called from the discord redirect url
app.get('/discord', async ({ query }, res) => {
  
  // Here we get access code
  const { code } = query;

  res.redirect("http://localhost:3000/?code=" + code)
})

app.get('/access-token', async ({ query }, res) => {
  // Here we get access code
  const { code } = query;
  
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

      const accessToken = `${oauthData.token_type} ${oauthData.access_token}`;
      console.log(accessToken)

      return res.status(200).json({ access_token: accessToken });
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error
      console.error(error);
      return res.status(500).json({})
    }
  }
})

app.get('/discord_data', async(req, res) => {
  // Getting the access token from the cookie
  const accessToken = req.headers.authorization;
  console.log("Access token: ", accessToken)

  if (!accessToken) {
    return res.status(401).json({})
  }

  try {
    // Requesting user data
    const userResult = await request('https://discord.com/api/users/@me', {
      headers: {
        authorization: accessToken,
      },
    });
    const data = await userResult.body.json()
    console.log(data['username'])

    return res.status(200).json(data)
  } catch (error) {
    console.error(error);
    return res.status(500).json({})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
