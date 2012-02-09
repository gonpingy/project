/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'DE-DE--N(tokyo)' })
};

exports.api = function(req, res){
  logger.info('api access: ' + require('util').inspect(req.query, true, null));

  var
    CONFIG = require('../configuration.js'),
    DB = require('../lib/db.js');
    sql = 'SELECT ' +
            't.station_id, ' +
            't.hour, ' +
            't.minutes, ' +
            't.go_for, ' +
            't.date, ' +
            's.name, ' +
            'X(s.latlng) AS lng, ' +
            'Y(s.latlng) AS lat ' +
          'FROM ' +
            'timetable t, station s ' +
          'WHERE ' +
            't.hour BETWEEN ? and ? ' +
          'AND ' +
            't.date = ? ' +
          'AND ' +
            't.station_id IN (SELECT id FROM station WHERE MBRContains(GeomFromText(?), latlng)) ' +
          'AND ' +
            't.station_id = s.id ' +
          'ORDER BY ' +
            't.hour asc';

  var config_db = {
    'database': CONFIG.MYSQL_DATABASE,
    'host': CONFIG.MYSQL_HOST,
    'password': CONFIG.MYSQL_PASSWORD,
    'user': CONFIG.MYSQL_USER
  };

  var hour = req.query.hour;

  config_sql = [{
    'sql': sql,
    'parameters': [hour, hour + 1, req.query.date, 'LineString(' + req.query.ne + ', ' + req.query.sw + ')']
  }];

  db = new DB(config_db, config_sql);
  db.execute(function() {
    result = {};
    for (index in this.result[0]) {
      time = this.result[0][index];

      minutes = time.minutes.split(',');
      for (minute in minutes) {
        if (result[time.hour + minutes[minute]] == undefined) {
          result[time.hour + minutes[minute]] = [];
        }
      
        result[time.hour + minutes[minute]].push({
          'station_id': time.station_id,
          'name': time.name,
          'for': time.go_for,
          'date': time.date,
          'lng': time.lng,
          'lat': time.lat
        });
      }
    }

    res.send(result);
  });
};
