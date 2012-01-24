
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.api = function(req, res){
  var
    CONFIG = require('/Users/gonpingy/project/dev/nodejs/batch/import/configuration.js'),
    DB = require('/Users/gonpingy/project/dev/nodejs/lib/db.js');
  sql = 'SELECT ' +
          't2.station_id, ' +
          't2.time, ' +
          's.name, ' +
          'X(s.latlng) AS lng, ' +
          'Y(s.latlng) AS lat, ' +
          't.name AS train, ' +
          't.go_for, ' +
          't.date, ' +
          't.service ' +
        'FROM ' +
          'timetable t2, train t, station s ' +
        'WHERE ' +
          't2.time BETWEEN ? and ? ' +
        'AND ' +
          't.date = ? ' +
        'AND ' +
          't2.station_id IN (SELECT id FROM station WHERE MBRContains(GeomFromText(?), latlng)) ' +
        'AND ' +
          't2.station_id = s.id ' +
        'AND ' +
          't2.train_id = t.id ' +
        'ORDER BY ' +
          't2.time ASC';

  var config_db = {
    'database': CONFIG.MYSQL_DATABASE,
    'host': CONFIG.MYSQL_HOST,
    'password': CONFIG.MYSQL_PASSWORD,
    'user': CONFIG.MYSQL_USER
  };

  if (req.query.end == 0) {
    req.query.end = 24;
  }

  config_sql = [{
    'sql': sql,
    'parameters': [req.query.begin + '0000' , req.query.end + '0000', req.query.date, 'LineString(' + req.query.ne + ', ' + req.query.sw + ')']
  }];

  db = new DB(config_db, config_sql);
  db.execute(function() {
    console.log(this.result);
    result = {};

    for (index in this.result[0]) {
      time = this.result[0][index];

      if (result[time['time']] == undefined) {
        result[time['time']] = [];
      }

      result[time['time']].push(time);
    }

    res.send(result);
  });
};
