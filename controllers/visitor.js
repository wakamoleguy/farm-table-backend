const models = require('../models/models');

exports.browse = function (req, res, next) {

  models.Visitor
    .find({})
    .find((err, visitors) => {

    if (err) {
      console.error(err);
    } else {
      res.send(visitors);
    }

    next();
  });
};

exports.read = function (req, res, next) {

  models.Visitor
    .findById(req.params.id)
    .findOne((err, visitor) => {

      if (err) {
        console.error(err);
      } else {
        res.send(visitor);
      }

      next();
    });
};

exports.add = function (req, res, next) {
  console.log(req.body);

  const visitor = new models.Visitor({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  visitor.save((err, v) => {
    if (err) {
      console.error(err);
    } else {
      res.send(v);
    }
  });
};
