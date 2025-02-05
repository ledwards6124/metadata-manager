import express from 'express';
import { readMP3 } from './io/mp3io';
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/', (req, res) => {
  console.log('Ping from ' + req.ip)
  res.send('Hello World!');
});

app.get('/mp3', (req, res) => {
  const path = req.query.path;
  const tags = readMP3(path);
  res.send(tags);
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});