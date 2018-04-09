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
    // store current user information before update
    return this.findOne({ username })
      .then(currentUser => {
        console.log('* current user before update is:', currentUser);
        // remove current user id from previous employer employee list
        return mongoose
          .model('Company')
          .findOneAndUpdate(
            { name: currentUser.currentCompanyName },
            { $pull: { employees: currentUser._id } },
            { new: true }
          )
          .then(previousCompany => {
            console.log(
              '* previous company after removing user id:',
              previousCompany
            );
            // add current user id to new current employer employee list
            return mongoose
              .model('Company')
              .findOneAndUpdate(
                { name: patchBody.currentCompanyName },
                { $addToSet: { employees: currentUser._id } },
                { new: true }
              )
              .then(currentCompany => {
                if (!currentCompany)
                  console.log('* current company does not have a profile');
                else {
                  console.log(
                    '* current company after adding user id:',
                    currentCompany
                  );
                }
                // update patch body to refect current company id if company exists
                patchBody.currentCompanyId =
                  currentCompany === null ? null : currentCompany._id;
                console.log(
                  '* patch body after adding current company id:',
                  patchBody
                );
                // update current user according to patch body
                return this.findOneAndUpdate({ username }, patchBody, {
                  new: true
                })
                  .then(updatedUser => {
                    console.log('* current user after update is:', updatedUser);
                    return updatedUser
                      .save()
                      .then(savedUser => savedUser)
                      .catch(err => Promise.reject(err));
                  })
                  .catch(err => Promise.reject(err));
              })
              .catch(err => Promise.reject(err));
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
  console.log('THIS.PWD', this.password, 'THIS', this);
  bcrypt.compare(candidatePassword, this.password, function(err, boolean) {
    if (err) return next(err);
    return next(null, boolean);
  });
};

userSchema.plugin(immutablePlugin);
module.exports = mongoose.model('User', userSchema);
