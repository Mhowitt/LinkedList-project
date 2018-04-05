const mongoose = require('mongoose');
const Company = require('./company');

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    currentCompanyName: String,
    currentCompanyId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
      }
    ],
    photo: String,
    experience: {
      jobTitle: String,
      company: String,
      startDate: Date,
      endDate: Date
    },
    education: {
      institution: String,
      degree: String,
      endDate: Date
    },
    skills: [String]
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

/**
 * Create a new user.
 * @param {Object} newUser an instance of a user document
 */

userSchema.statics = {
  createUser(newUser) {
    return this.findOne({ username: newUser.username }).then(user => {
      if (user) {
        throw new Error(`The username ${newUser.username} already exists`);
      }
      return newUser
        .save()
        .then(user => user)
        .catch(err => {
          return Promise.reject(err);
        });
    });
  },
  updateUser(userId, patchBody) {
    return this.findOneAndUpdate(userId, patchBody, { new: true })
      .then(user => {
        return Company.findByIdAndUpdate(user.currentCompanyId, {
          $addToSet: { employees: user.id }
        })
          .then(() => {
            console.log('POST HOOK RAN');
            return user;
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },
  deleteUser(userId) {
    return this.findOneAndRemove(userId)
      .then(user => {
        return Company.findOneAndUpdate(
          user.currentCompanyId,
          {
            $pull: { employees: user._id }
          },
          { new: true }
        )
          .then(() => {
            console.log('POST HOOK RAN');
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};

// userSchema.post("findOneAndUpdate", user => {
//   console.log("hfjehwihrfh;rhew");
//   Company.findByIdAndUpdate(user.currentCompanyId, {
//     $addToSet: { employees: user.id }
//   })
//     .then(() => {
//       console.log("POST HOOK RAN");
//     })
//     .catch(err => console.log(err));
// });

// after Dog.findOneAndRemove (delete) query runs
// userSchema.post("findOneAndRemove", user => {
//   // call the owner model and update its dogs array
//   Company.findOneAndUpdate(
//     user.currentCompanyId,
//     {
//       $pull: { employees: user._id }
//     },
//     { new: true }
//   ).then(() => {
//     console.log("POST HOOK RAN");
//   });
// });

module.exports = mongoose.model('User', userSchema);
