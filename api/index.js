const { createProxyMiddleware } = require('http-proxy-middleware');

function noProtocol(url) {
  return url.replace('https://', '').replace('http://', '');
}

const apiProxy = createProxyMiddleware({
  router: function(req) {
    console.log(noProtocol(req.url));
    let target = noProtocol(req.url).split('/')[2];
    console.log('target ', target)
    return {
      protocol: 'https:', host: target,
    }
  },
  changeOrigin: true,
  pathRewrite: function(path, req) {
    console.log('path', '/' + noProtocol(req.url).split('/').slice(3).join('/'));
    return '/' + noProtocol(req.url).split('/').slice(3).join('/')
  },

  onProxyRes(proxyRes) {
    proxyRes.headers['x-added'] = 'foobar'; // add new header to response
    delete proxyRes.headers['x-removed']; // remove header from response
  }
});

// Expose the proxy on the "/api/*" endpoint.
export default function (req, res) {
  return apiProxy(req, res);
};
