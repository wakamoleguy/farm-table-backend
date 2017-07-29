const models = require('../models/models');

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
