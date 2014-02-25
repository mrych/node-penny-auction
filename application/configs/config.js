// Generated by CoffeeScript 1.7.1
exports.config = function(app) {
  var config;
  if ((app != null) && app.get("env") === 'production') {
    app.get("env") === 'development';
    config = {
      baseUrl: {
        val: 'http://node-auc.rrs-lab.com:8001',
        allowInFrontend: true
      },
      apiRoot: {
        val: 'api',
        allowInFrontend: true
      },
      appPort: 8002
    };
  } else {
    config = {
      baseUrl: {
        val: 'http://localhost:3000',
        allowInFrontend: true
      },
      apiRoot: {
        val: 'api',
        allowInFrontend: true
      },
      appPort: 3000
    };
  }
  return config;
};
