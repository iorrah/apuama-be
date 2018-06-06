const express = require('express');
const bodyParser     = require('body-parser');
var fs = require("fs");

const app = express();

const DB_PATH = 'db/gallery.json';
const DB_ENCODE = 'utf8';

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Invalid path');
});

app.get('/api/gallery', (req, res) => {
  fs.readFile(DB_PATH, DB_ENCODE, (err, data) => {
    res.end(data);
  });
});

app.post('/api/gallery/add', (req, res) => {
  fs.readFile(DB_PATH, DB_ENCODE, (err, data) => {
    // Arrange
    let newItem = {};
    
    // Act
    if (req.body) {
      newItem.id = req.body.id;
      newItem.img = req.body.img;
      newItem.title = req.body.titl;
    }

    // Persist
    parsedDb = JSON.parse(data);
    const updatedDb = [ ...parsedDb, newItem ];
    fs.writeFileSync(DB_PATH, JSON.stringify(updatedDb));
    res.end(JSON.stringify(updatedDb));
  });
});

app.put('/api/gallery/:id/favorite', (req, res) => {
  fs.readFile(DB_PATH, DB_ENCODE, (err, data) => {
    // Arrange
    const id = parseInt(req.params.id, 10);
    parsedDb = JSON.parse(data);

    // Act
    const item = parsedDb.find((e) => e.id === id);
    item.favorited = true;

    // Persist
    const others = parsedDb.filter((e) => e.id !== id);
    const updatedDb = [ ...others, item ];
    fs.writeFileSync(DB_PATH, JSON.stringify(updatedDb));
    res.end(JSON.stringify(updatedDb));
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
