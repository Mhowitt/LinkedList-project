const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const immutablePlugin = require('mongoose-immutable');

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    username: { type: String, immutable: true },
    email: {
      type: String,
      validate: {
        validator: function(validator) {
          return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(
            validator
          );
        },
        message: 'Not a valid email'
      },
      required: [true, 'User email required']
    },
    password: String,
    currentCompanyName: String,
    currentCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    photo: {
      type: String,
      validate: {
        validator: function(validator) {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            validator
          );
        },
        message: 'Not a valid image URL'
      }
    },
    experience: [
      {
        jobTitle: String,
        company: String,
        startDate: Date,
        endDate: Date
      }
    ],
    education: [
      {
        institution: String,
        degree: String,
        endDate: Date
      }
    ],
    skills: [String]
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

/**
 * Create a new user
 * and connect its unique ObjectId to the specified current company,
 * should such company alreqady exist in the database.
 * @param {Object} newUser -- an instance of a user document
 */
userSchema.statics = {
  createUser(newUser) {
    return this.findOne({ username: newUser.username }).then(user => {
      if (user)
        throw new Error(`The username ${newUser.username} already exists`);
      return newUser
        .save()
        .then(user => user)
        .catch(err => Promise.reject(err));
    });
  },
  /**
   * As a registered and logged in user,
   * update this user's profile and associated current company relation in the database.
   * @param {String} username -- a unique string identifying the user
   * @param {Object} patchBody -- an object (request.body) containing updated user information
   */
  updateUser(username, patchBody) {
    return this.findOneAndUpdate(username, patchBody, { new: true })
      .then(user => {
        console.log(`User ${user.username} successfully updated`);
        return mongoose
          .model('Company')
          .findOneAndUpdate(
            { name: user.currentCompanyName },
            {
              $addToSet: { employees: user.id }
            }
          )
          .then(company => {
            if (company) {
              console.log(
                `User ${user._id} successfully added to ${
                  company.name
                }'s list of employees`
              );
              this.findOneAndUpdate(
                { username: user.username },
                { currentCompanyId: company._id }
              )
                .then(updatedUser => {
                  console.log(
                    `Company ${company._id} successfully listed as ${
                      updatedUser.username
                    }'s current company `
                  );
                  return updatedUser;
                })
                .catch(err => Promise.reject(err));
            }
            return user;
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },
  /**
   * As a registered and logged in user,
   * delete this users' profile and associated current company relation in the database.
   * @param {String} username -- a unique string identifying the user
   */
  deleteUser(username) {
    return this.findOneAndRemove(username)
      .then(user => {
        console.log(`User ${user.username} successfully deleted`);
        return mongoose
          .model('Company')
          .findOneAndUpdate(
            user.currentCompanyId,
            { $pull: { employees: user._id } },
            { new: true }
          )
          .then(company =>
            console.log(
              `User ${user._id} successfully removed from ${
                company.name
              }'s list of employees`
            )
          )
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  return bcrypt
    .hash(user.password, 10)
    .then(hashedPassword => {
      user.password = hashedPassword;
      return next();
    })
    .catch(err => next(err));
});

userSchema.methods.comparePassword = function(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return next(err);
    return next(null, isMatch);
  });
};

userSchema.plugin(immutablePlugin);
module.exports = mongoose.model('User', userSchema);
