const Agenda = require('agenda');

const jobTypes=['email', 'notify'];
const mongoConnectionString = 'mongodb://localhost:27017/ore-date';

let agenda = new Agenda({db: {address: mongoConnectionString, collection: 'jobs'}});

agenda.maxConcurrency(10);
agenda.defaultConcurrency(5);
agenda.defaultLockLifetime(1000);

jobTypes.forEach(function(type) {
  require('./jobs/' + type)(agenda);
});

if(jobTypes.length) {
  agenda.on('ready', function() {
    agenda.start();
  });
}

function graceful() {
    agenda.stop(function() {
      process.exit(0);
    });
}
  
process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

module.exports = agenda;