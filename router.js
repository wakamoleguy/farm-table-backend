const visitor = require('./controllers/visitor');
const farmer = require('./controllers/farmer');
const tour = require('./controllers/tour');
const reservation = require('./controllers/reservation');
const special = require('./controllers/special');

module.exports = function (app) {

  app.get('/', function (req, res, next) {

    res.send(['/visitor/', '/farmer/', '/reservation/']);
  });

  app.get('/visitor/', visitor.browse);
  app.get('/visitor/:id', visitor.read);
  app.post('/visitor/', visitor.add);

  app.get('/farmer/', farmer.browse);
  app.get('/farmer/:id', farmer.read);
  app.post('/farmer/', farmer.add);

  app.get('/farmer/:id/suggest/', farmer.suggest);
  app.get('/farmer/:id/nearby/', farmer.nearby);
  app.get('/farmer/:id/suggest/nearby', farmer.suggestNearby);

  app.get('/farmer/:farmer_id/tour/', tour.browse);
  app.get('/farmer/:farmer_id/tour/:tour_id/', tour.read);
  app.put('/farmer/:farmer_id/tour/:tour_id/', tour.edit);
  app.post('/farmer/:farmer_id/tour/', tour.add);

  app.get('/reservation/', reservation.browse);

  app.post('/special/clear', special.clear);
  app.post('/special/init', special.init);
};
