const reservation = require('./controllers/reservation');

module.exports = function (app) {

  app.get('/', function (req, res, next) {

    res.send(['foo', 'bar', 'baz']);
  });

  // TODO - this should be a post or something
  app.get('/reservation/init', reservation.init);

  app.get('/reservation/browse', reservation.browse);

  app.get('/reservation/clear', reservation.clear);

  app.post('/hello', function (req, res, next) {
    res.send({ greeting: 'Hi!' });
  });
};
