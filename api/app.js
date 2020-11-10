var createError = require('http-errors');
var express = require('express');
var cors = require('cors');

const gremlin = require('gremlin');
const url = 'ws://localhost:8182/gremlin'
const Client = gremlin.driver.Client;
let client
const source = "cobra.g"

function getClient(source){
  client = new Client (url, { traversalSource: source});
}

var app = express();

app.set('etag', false)
app.use(cors());

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

function getStandardResponse(status,message,data){
  return {
      status: status,
      message : message,
      data : data
   }
}

app.get('/connect/:source', function(req, res){
  getClient(req.params.source)
  res.send('Connected to ' + req.params.source)
});

app.post('/query', async (req, res, next) => {
  getClient(req.body.source)
  try {
    const graphson = await client.submit(req.body.q);
    console.log(graphson)
    res.send(graphson._items)
  } catch (error) {
    // Passes errors into the error handler
    return next(error)
  }
})

app.listen('9000', 'localhost', () => {
  client = new Client (url, { traversalSource: source});
})

module.exports = app;
