
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

// ログ設定
var log4js = require('log4js');
var date = new Date();
var today = date.getFullYear() + (date.getMonth() + 1).toString().replace( /^([0-9])$/, '0$1') + date.getDate().toString().replace( /^([0-9])$/, '0$1');
log4js.addAppender(log4js.fileAppender('./log/' + today), 'DE-DE--N');
logger = log4js.getLogger('DE-DE--N');
logger.setLevel('INFO');

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(log4js.connectLogger(log4js.getLogger('DE-DE--N'), { level: log4js.levels.INFO }));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.error(function(err, req, res, next){
  logger.error(err.stack);
});

// Routes

app.get('/', routes.index);
app.post('/', routes.index);
app.get('/api', routes.api);
app.get('/channel.html', function(req, res) {
  res.send('<script src="//connect.facebook.net/en_US/all.js"></script>');
});
app.get('/who', function(req, res) {
  logger.info('who: ' + req.query.who);
  res.send();
});

app.listen(process.env.VCAP_APP_PORT || 3001);

logger.info("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
