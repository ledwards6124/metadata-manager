import express from 'express';
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/', (req, res) => {
  res.send(JSON.parse('Hello World!'));
  console.log('GET from ' + req.headers.origin);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});