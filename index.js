const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
const fs = require("fs");

const DB_PATH = 'db/gallery.json';
const DB_ENCODE = 'utf8';

const sortBy = require('sort-by');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Invalid path');
});

app.get('/api/gallery', (req, res) => {
  fs.readFile(DB_PATH, DB_ENCODE, (err, data) => {
    const newData = JSON.parse(data).sort(sortBy('id'));
    res.end(JSON.stringify(newData));
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
    res.end(JSON.stringify(updatedDb.sort(sortBy('id'))));
  });
});

app.put('/api/gallery/:id/like', (req, res) => {
  fs.readFile(DB_PATH, DB_ENCODE, (err, data) => {
    // Arrange
    const id = parseInt(req.params.id, 10);
    parsedDb = JSON.parse(data);

    // Act
    const item = parsedDb.find((e) => e.id === id);
    item.liked = !item.liked;

    // Persist
    const others = parsedDb.filter((e) => e.id !== id);
    const updatedDb = [ ...others, item ];
    fs.writeFileSync(DB_PATH, JSON.stringify(updatedDb));
    res.end(JSON.stringify(updatedDb.sort(sortBy('id'))));
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
