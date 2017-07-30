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
    .populate('tours')
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

  suggest(req.params.id, (data) => {
    res.send(data);
  });
};

function suggest(farmer_id, callback) {

  models.Farmer
    .findById(farmer_id)
    .populate('tours')
    .findOne((err, myFarmer) => {

      if (err) return console.error(err);

      models.Farmer
      .find({})
      .populate('tours')
      .find((err, allFarmers) => {

        if (err) return console.error(err);

        function farmerAsTour(farmer) {

          console.log('Converting farmer to tour', farmer);
          return {
            popularity: farmer.tours.reduce((sum, tour) => sum += tour.popularity, 0),
            features: farmer.tours.reduce((features, tour) => features.concat(tour.features), [])
          };
        }

        const allFarmersAsTours = allFarmers.map(farmerAsTour);

        console.log("All Farmers", allFarmersAsTours);

        const classifier = new Classifier(allFarmersAsTours);

        console.log("Classifier", classifier);

        const myFarmerAsTour = farmerAsTour(myFarmer);

        console.log("My Farmer", myFarmerAsTour);

        callback({
          farmer: myFarmer,
          suggestions: classifier.suggest(myFarmerAsTour)
        });
      });
    });
}

exports.nearby = function (req, res, next) {

  nearby((data) => {
    res.send(data);
  });
}
function nearby(callback) {

  const cachedFarmPlentyResponse = require('../data/cached_farmplenty_response_2');

  const totalAcres = cachedFarmPlentyResponse.crops
    .reduce((sum, crop) => sum += crop.pctAcres, 0);

  const cropsNearby = cachedFarmPlentyResponse.crops
    .map((crop) => ({ name: crop.name, pctAcres: crop.pctAcres }))
    .filter((crop) => !/Other/.test(crop.name))
    .map((crop) => {

      let category;

      const features = require('../data/features');

      switch (crop.name) {
        case 'Rice':
        case 'Winter Wheat':
        case 'Walnuts':
        case 'Almonds':
        case 'Corn':
          category = features.GRAIN;
          break;
        case 'Tomatoes':
        case 'Grapes':
          category = features.FRUITS;
          break;
        case 'Alfalfa':
        default:
          category = features.VEGGIES;
      }

      return {
        name: crop.name,
        pct: Math.round(crop.pctAcres / totalAcres * 100),
        feature: category
      };
    })
    .reduce((ag, crop) => {

      if (!ag[crop.feature]) ag[crop.feature] = 0;

      ag[crop.feature] += crop.pct;

      return ag;
    }, {});

  callback(cropsNearby);
};

exports.suggestNearby = function (req, res, next) {

  suggest(req.params.id, (farmerWithSuggestions) => {
    nearby((nearbyCrops) => {

      console.log('Nearby Crops', nearbyCrops);

      // Map over suggestions, because they try all features
      res.send({
        farmer: farmerWithSuggestions.farmer,
        suggestions: farmerWithSuggestions.suggestions.map((suggestion) => {

          console.log("Nearby pct?", suggestion.feature, nearbyCrops[suggestion.feature]);
          const pct = nearbyCrops[suggestion.feature]
            ? nearbyCrops[suggestion.feature]
            : 0;

          return {
            feature: suggestion.feature,
            score: suggestion.score,
            diff: suggestion.diff,
            pct
          };
        }).sort((a, b) => b.pct - a.pct)
      });
    });
  });

};
