
var cluster = require('cluster');
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });
} else {
  var http = require('http'),
      path = require('path'),
      methods = require('methods'),
      express = require('express'),
      bodyParser = require('body-parser'),
      expressSanitized = require('express-sanitize-escape'),
      session = require('express-session'),
      cors = require('cors'),
      passport = require('passport'),
      errorhandler = require('errorhandler'),
      mongoose = require('mongoose');

  var isProduction = process.env.NODE_ENV === 'production';

  // Create global app object
  const redisClient = require('redis').createClient();
  const helmet = require('helmet');

  var app = express();

  const limiter = require('express-limiter')(app, redisClient);

  app.use(helmet());
  app.use(cors());

  // Normal express config defaults
  app.use(require('morgan')('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(expressSanitized.middleware());

  app.use(require('method-override')());
  app.use(express.static(__dirname + '/public'));

  app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

  if (!isProduction) {
    app.use(errorhandler());
  }

  if(isProduction){
    mongoose.connect(process.env.MONGODB_URI);
  } else {
    mongoose.connect('mongodb://localhost/ore-date');
    mongoose.set('debug', true);
  }

  // Limit requests to 1200 per hour per ip address. This is high. Only for stopping dumb DDoS attacking our endpoints.
  limiter({
    lookup: ['connection.remoteAddress'],
    total: 1200,
    expire: 1000 * 60 * 60
  })

  require('./models/User');
  require('./models/HappyRes');
  require('./models/MailInput');
  require('./models/WaitItem');
  require('./config/passport');

  app.use(require('./routes'));

  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(express.static('public'))

  /// error handlers

  // development error handler
  // will print stacktrace
  if (!isProduction) {
    app.use(function(err, req, res, next) {
      console.log(err.stack);

      res.status(err.status || 500);

      res.json({'errors': {
        message: err.message,
        error: err
      }});
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: {}
    }});
  });

  // finally, let's start our server...
  var server = app.listen( process.env.PORT || 3000, function()
  {
    console.log('Listening on port ' + server.address().port);
    console.log('Worker %d running!', cluster.worker.id);
  });

}
