require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let urlDatabase = []
app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
var shortUrl = 1;
app.route('/api/shorturl').post(
  (req, res) =>{
    const url = req.body.url;
    const dns = require('dns');
    const urlParser = require('url');
dns.lookup(urlParser.parse(url).hostname, (err, address) =>{
      if(err){
        res.json({error: 'invalid url'});
      }else{
        res.json({original_url: url, short_url: shortUrl});
        urlDatabase[shortUrl] = url;
        shortUrl++;
      }
      console.log(address);
    }
  );}
)

app.route('/api/shorturl/:short_url').get(
  (req, res) =>{
    const shortUrl = req.params.short_url;
    if(!urlDatabase[shortUrl]){
      res.json({error: 'invalid url'});
    }
    else{
      res.redirect(urlDatabase[shortUrl]);
    }
  })