module.exports = function (app) {

  app.get('/', function (req, res, next) {

    res.send(['foo', 'bar', 'baz']);
  });

  app.post('/hello', function (req, res, next) {
    res.send({ greeting: 'Hi!' });
  });
};
