const CONN_PROTOCOL = 'http';
const CONN_HOSTNAME = 'localhost';
const CONN_PORT = 8090;


const PROXY_CONFIG = {
  '/api/v1/*': {
    target: `${CONN_PROTOCOL}://${CONN_HOSTNAME}:${CONN_PORT}`,
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    headers: {},
  },
};

module.exports = PROXY_CONFIG;
