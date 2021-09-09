import * as express from 'express';

const FOO_PORT = 3000;
const BAR_PORT = 8080;

const foo = express();

foo.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ service: 'foo', message: 'Hello, World!' }));
});

foo.listen(FOO_PORT, () => {
  console.log(`Example app listening at http://localhost:${FOO_PORT}`);
});

const bar = express();

bar.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ service: 'bar', message: 'Hello, World!' }));
});

bar.listen(BAR_PORT, () => {
  console.log(`Example app listening at http://localhost:${BAR_PORT}`);
});
