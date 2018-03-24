/** Configuration **/
const nanoNodeUrl = `http://nano:7076`; // Nano node RPC url
const listeningPort = 9950; // Port this app will listen on

const express = require('express');
const request = require('request-promise-native');
const cors = require('cors');
const { promisify } = require('util');

const workCache = [];
let getCache, putCache;

// Set up the webserver
const app = express();
app.use(cors());
app.use(express.json());

// Allow certain requests to the Nano RPC and cache work requests
app.post('/api/node-api', async (req, res) => {
  const allowedActions = [
    'block_count',
    'peers'
  ];
  if (!req.body.action || allowedActions.indexOf(req.body.action) === -1) {
    return res.status(500).json({ error: `Action ${req.body.action} not allowed` });
  }

  // Send the request to the Nano node and return the response
  request({ method: 'post', uri: nanoNodeUrl, body: req.body, json: true })
    .then(proxyRes => {
      res.json(proxyRes)
    })
    .catch(err => res.status(500).json(err.toString()));
});

app.listen(listeningPort, () => console.log(`App listening on port ${listeningPort}!`));
