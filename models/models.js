const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schemas = {

  visitor: {
    name: String,
    email: String,
    password: String
  },

  farmer: {
    name: String,
    location: String,
    tours: [{
      type: Schema.Types.ObjectId,
      ref: 'Tour'
    }]
  },

  tour: {
    farmer: {
      type: Schema.Types.ObjectId,
      ref: 'Farmer'
    },
    name: String,
    description: String,
    price: Number,
    features: [{ type: String }],
    popularity: Number,
    ratings: [String],
    sort_id: Number
  },

  reservation: {
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour'
    },
    time: Date
  }
};

const classes = {

  Visitor: mongoose.model('Visitor', schemas.visitor),
  Farmer: mongoose.model('Farmer', schemas.farmer),
  Tour: mongoose.model('Tour', schemas.tour),
  Reservation: mongoose.model('Reservation', schemas.reservation)
};

module.exports = classes;
