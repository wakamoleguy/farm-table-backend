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
