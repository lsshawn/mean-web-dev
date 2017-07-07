const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    match: /.+\@.+\..+/
  },
  username: {
    type: String,
    trim: true, // modifier to present the data
    unique: true,
    required: true // model validation
  },
   password: {
     type: String,
     validate: [ // custom model validation
         function(password) {
           return password.length >= 6;
         },
         'Password should be longer'
       ]
   },
  created: {
    type: Date,
    default: Date.now
  },
  website: {
    type: String,
    set: function(url) { // custom setter modifier to add http
      if (!url) {
        return url;
      } else {
        if (url.indexOf('http://') !== 0 &&
          url.indexOf('https://') !== 0) {
          url = 'http://' + url;
        }
        return url;
      }
    },
    get: function(url) {
      if (!url) {
        return url;
      } else {
        if (url.indexOf('http://') !== 0 &&
          url.indexOf('https://') !== 0) {
          url = 'http://' + url;
        }
        return url;
      }
    }
  }
})

// This will force Mongoose to include getters when converting the MongoDB document to a JSON representation
UserSchema.set('toJSON', { getters: true });

// virtual attributes
UserSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
}).set(function(fullName) { // setter to break full name to first and last
  const splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
});

// custom static method: to find by username
UserSchema.statics.findOneByUsername = function(username,
 callback) {
 this.findOne({ username: new RegExp(username, 'i') },
 callback);
};


mongoose.model('User', UserSchema)

