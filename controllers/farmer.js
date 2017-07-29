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

const Classifier = require('../ml/classifier');

exports.suggest = function (req, res, next) {

  models.Farmer
    .findById(req.params.id)
    .populate('tours')
    .findOne((err, myFarmer) => {

      if (err) return console.error(err);

      models.Farmer.find({}, (err, allFarmers) => {

        if (err) return console.error(err);

        function farmerAsTour(farmer) {
          return {
            popularity: farmer.tours.reduce((sum, tour) => sum += tour.popularity, 0),
            features: farmer.tours.reduce((features, tour) => features.concat(tour.features), [])
          };
        }

        const allFarmersAsTours = allFarmers.map(farmerAsTour);

        const classifier = new Classifier(allFarmersAsTours);

        const myFarmerAsTour = farmerAsTour(myFarmer);

        res.send({
          myFarmer,
          suggestions: classifier.suggest(myFarmerAsTour)
        })
      });
    })

};
