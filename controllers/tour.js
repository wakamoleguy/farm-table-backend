const models = require('../models/models');

exports.browse = function (req, res, next) {

  models.Tour
    .find({})
    .populate('reservations')
    .populate('farmer')
    .find((err, tours) => {

    if (err) {
      console.error(err);
    } else {
      res.send(tours);
    }

    next();
  });
};

exports.read = function (req, res, next) {

  models.Tour
    .findById(req.params.tour_id)
    .findOne((err, tour) => {

      if (err) {
        console.error(err);
      } else {
        res.send(tour);
      }

      next();
    });
};

exports.add = function (req, res, next) {

  const tour = new models.Tour({
    farmer: req.params.farmer_id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    features: req.body.features
  });

  tour.save((err, t) => {
    if (err) {
      console.error(err);
    } else {
      res.send(t);
    }
  });
};
