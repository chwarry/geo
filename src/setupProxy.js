const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 代理 Swagger 文档请求
  app.use(
    '/v3/api-docs',
    createProxyMiddleware({
      target: 'http://121.40.127.120:8080',
      changeOrigin: true,
      onProxyReq: function(proxyReq, req, res) {
        console.log('[Swagger Proxy]', req.method, req.path);
      },
      onProxyRes: function(proxyRes, req, res) {
        console.log('[Swagger Response]', proxyRes.statusCode, req.path);
      },
      onError: function(err, req, res) {
        console.error('[Swagger Proxy Error]', err.message);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          error: 'Swagger Proxy Error', 
          message: err.message 
        }));
      },
    })
  );

  // 代理到新的后端服务器
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://121.40.127.120:8080',
      changeOrigin: true,
      // 不进行路径重写，直接转发
      // 前端: /api/auth/login -> 后端: /api/auth/login
      // 前端: /api/v1/bd/bd-xm -> 后端: /api/v1/bd/bd-xm
      onProxyReq: function(proxyReq, req, res) {
        console.log('[API Proxy]', req.method, req.path, '->', proxyReq.path);
      },
      onProxyRes: function(proxyRes, req, res) {
        console.log('[API Response]', proxyRes.statusCode, req.path);
      },
      onError: function(err, req, res) {
        console.error('[API Proxy Error]', err.message);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          error: 'API Proxy Error', 
          message: err.message 
        }));
      },
    })
  );
};

