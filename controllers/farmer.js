const models = require('../models/models');

exports.browse = function (req, res, next) {

  models.Farmer
    .find({})
    .find((err, farmers) => {

    if (err) {
      console.error(err);
    } else {
      res.send(farmers);
    }

    next();
  });
};

exports.read = function (req, res, next) {

  models.Farmer
    .findById(req.params.id)
    .findOne((err, farmer) => {

      if (err) {
        console.error(err);
      } else {
        res.send(farmer);
      }

      next();
    });
};

exports.add = function (req, res, next) {
  console.log(req.body);

  const farmer = new models.Farmer({
    name: req.body.name,
    description: req.body.description
  });

  farmer.save((err, f) => {
    if (err) {
      console.error(err);
    } else {
      res.send(f);
    }
  });
};
