import 'babel-polyfill';
import http from 'http';
import app from '../app';

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isInteger(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
const server = http.createServer(app);
server.listen(port);

export default server;
