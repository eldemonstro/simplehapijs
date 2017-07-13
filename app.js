const Hapi = require('hapi');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hapijs', {
    useMongoClient: true
  })
  .then(() =>
    console.log('MongoDB connected...'))
  .catch((err) =>
    console.error(err)
  );

// Create task model
const Task = mongoose.model('Task', {
  text: String
});

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
    reply.view('index', {
      name: 'John Doe'
    });
  }
});

// get tasks Route
server.route({
  method: 'GET',
  path: '/tasks',
  handler: (request, reply) => {
    // reply.view('tasks', {
    //   tasks: [{
    //       text: 'Task One'
    //     },
    //     {
    //       text: 'Task Two'
    //     },
    //     {
    //       text: 'Task Three'
    //     }
    //   ]
    // });

    let tasks = Task.find((err, tasks) => {
      reply.view('tasks', {
        tasks: tasks
      });
    });
  }
});


// get tasks Route
server.route({
  method: 'post',
  path: '/tasks',
  handler: (request, reply) => {
    let text = request.payload.text;
    let newTask = new Task({
      text: text
    });
    newTask.save((err, task) => {
      if (err) return console.log(err);
      return reply.redirect().location('tasks');
    });
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
