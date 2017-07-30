const models = require('../models/models');

exports.browseAll = function (req, res, next) {
    models.Tour.find({})
      .populate('farmer')
      .find((err, tours) => {
      if (err) return console.error(err);

      res.send(tours.sort((a, b) => a.sort_id - b.sort_id));
    });
};

exports.browse = function (req, res, next) {

  models.Tour
    .find({
      farmer: req.params.farmer_id
    })
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

exports.edit = function (req, res, next) {

  models.Tour.findByIdAndUpdate(req.params.tour_id, {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    features: req.body.features,
    popularity: req.body.popularity,
    ratings: req.body.ratings
  }, (err, tour) => {

    if (err) return console.log(err);

    res.send('OK');
  });
};

exports.add = function (req, res, next) {

  models.Farmer.findById(req.params.farmer_id, (err, farmer) => {

    const tour = new models.Tour({
      farmer,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      features: req.body.features,
      popularity: req.body.popularity,
      ratings: req.body.ratings
    });

    farmer.tours.push(tour);
    farmer.save((err, f) => {
      if (err) {
        console.error(err);
      } else {

        tour.save((err, t) => {

          if (err) {
            console.error(err);
          } else {
            res.send(t);
          }
        });
      }
    });

  });
};
