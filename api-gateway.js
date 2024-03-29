const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors')

app.use(cors())

app.use(logger('dev'));

function selectProxyHost(req) {
  if (req.path.startsWith('/Config')) {
    return 'http://localhost:8080';
  } else if (req.path.startsWith('/Log')) {
    return 'http://localhost:8090';
  } else {
    return null;
  }
}

app.use((req, res, next) => {
  const proxyHost = selectProxyHost(req);
  if (proxyHost === null) {
    res.status(404).send('Not found');
  } else {
    httpProxy(proxyHost)(req, res, next);
  }
});

app.listen(8000, () => {
  console.log('API Gateway iniciado!');
});
