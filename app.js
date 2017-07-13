const Hapi = require('hapi');

const server = new Hapi.Server();

// Add Connection
server.connection({
  port: 8000,
  host: 'localhost'
});

// Home Route
server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply.view('index');
  }
});

// Dynamic route
server.route({
  method: 'GET',
  path: '/user/{name}',
  handler: (request, reply) => {
    reply('Hello, ' + request.params.name);
  }
});

// Static Routes
server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }
  server.route({
    method: 'GET',
    path: '/about',
    handler: (request, reply) => {
      reply.file('./public/about.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/image',
    handler: (request, reply) => {
      reply.file('./public/hapi.png');
    }
  });
});

// Vision Templates
server.register(require('vision'), (err) => {
  if (err) {
    throw err;
  }

  server.views({
    engines: {
      html: require('handlebars')
    },
    path: __dirname + '/views'
  });
});

// Start server
server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server started at: ${server.info.uri}`);
});
