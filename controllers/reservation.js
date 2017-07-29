const models = require('../models/models');

exports.init = function (req, res, next) {

  // Add some data!

  new models.Farmer({
    name: 'ABC Farms',
    description: 'The Best Place To Grow'

  }).save((err, farmer) => {

    if (err) return console.error(err);

    console.log('Saved farmer', farmer);

    new models.Tour({
      farmer: farmer,
      name: 'Goat Yoga',
      description: 'Goats and Yoga! Fun!',
      price: 100,
      features: ['Goats', 'Yoga', 'Fun']
    }).save((err, tour) => {

      if (err) return console.error(err);

      console.log('Saved tour', tour);

      new models.Reservation({
        tour: tour,
        time: new Date()
      }).save((err, reservation) => {
        if (err) return console.error(err);

        console.log('Saved Rez', reservation);

        res.send(reservation);
      });
    });
  });

};

exports.clear = function (req, res, next) {
  models.Reservation.deleteMany({});
  models.Tour.deleteMany({});
  models.Farmer.deleteMany({});
  res.send('OK');
}

exports.browse = function (req, res, next) {

  models.Reservation
    .find({})
    .populate({
      path: 'tour',
      populate: { path: 'farmer' }
    })
    .find((err, reservations) => {

    if (err) {
      console.error(err);
    } else {
      reservations.forEach((rez) => {
        console.log(rez, rez.tour, rez.tourId);
      });
      res.send(reservations);
    }

    next();
  });
};
