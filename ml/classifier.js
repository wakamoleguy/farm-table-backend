function withFeature(tours, feature) {
  return tours.filter((tour) => tour.features.indexOf(feature) !== -1);
}

function withoutFeature(tours, feature) {
  return tours.filter((tour) => tour.features.indexOf(feature) === -1);
}

function Classifier(tours) {

  this.allFeatures = new Set();

  tours.forEach((tour) => {
    tour.features.forEach((feature) => {
      this.allFeatures.add(feature);
    });
  });

  // TODO - actually learn things based on the features

  this.featureWeights = {};

  this.allFeatures.forEach((feature) => {

    const toursWith = withFeature(tours, feature);
    const toursWithout = withoutFeature(tours, feature);

    const popularityWith = toursWith.reduce(
      (sum, tour) => sum += tour.popularity,
      0) / toursWith.length;


    const popularityWithout = toursWithout.reduce(
      (sum, tour) => sum += tour.popularity,
      0) / toursWithout.length;

    console.log(popularityWith, popularityWithout);

    this.featureWeights[feature] = Math.max(popularityWith - popularityWithout, 0);
  });
}

Classifier.prototype = {

  // Based on a trained classifier, predict its popularity
  score(tour) {

    const features = [ ...new Set(tour.features) ];

    return features.reduce(
      (sum, feature) => sum += this.featureWeights[feature],
      0);
  },

  // Given a tour and a new feature, predict its new popularity
  predict(tour, feature) {

    const scoreActual = tour.popularity;
    const scoreNow = this.score(tour);
    const scoreWith = this.score({
      features: tour.features.concat([feature])
    });

    if (scoreActual) {
      // Assume you will have your current popularity, but improved by an amt
      return scoreActual + (scoreWith - scoreNow);
    } else {
      return scoreWith;
    }
  }
};

Classifier.testData = [

  { popularity: 10, features: ['animal', 'fruit', 'veggie', 'goatyoga'] },
  { popularity: 9, features: ['animal', 'goatyoga'] },
  { popularity: 12, features: ['animal', 'fruit', 'veggie', 'goatyoga'] },
  { popularity: 5, features: ['animal', 'fruit', 'veggie'] },
  { popularity: 3, features: ['fruit', 'veggie'] },
  { popularity: 6, features: ['animal', 'fruit'] },
  { popularity: 1, features: ['veggie'] },
  { popularity: 2, features: ['fruit', 'veggie'] },
  { popularity: 4, features: ['animal', 'fruit'] },
  { popularity: 3, features: ['animal'] }
];

module.exports = Classifier;
