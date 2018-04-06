const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: String,
  email: String,
  handle: String,
  password: String,
  logo: String,
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    }
  ]
});

companySchema.statics = {
  /**
   * Create a new company.
   * @param {Object} newCompany -- an instance of a company document
   */
  createCompany(newCompany) {
    return this.findOne({
      $or: [{ name: newCompany.name }, { handle: newCompany.handle }]
    })
      .then(company => {
        if (company) {
          if (company.name === newCompany.name)
            throw new Error(`The Company ${newCompany.name} already exists`);
          if (company.handle === newCompany.handle)
            throw new Error(`The handle ${newCompany.handle} already exists`);
        }
        return newCompany
          .save()
          .then(company => company)
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },
  /**
   * As a registered and logged in company,
   * update this company profile and associated job posting handles in the database.
   * @param {String} handle -- a unique string identifying the company
   * @param {Object} patchBody -- an object (request.body) containing updated company information
   */
  updateCompany(handle, patchBody) {
    return this.findOne({ handle: patchBody.handle })
      .then(company => {
        if (company)
          if (company.handle !== handle)
            throw new Error(`The handle ${company.handle} already exists`);
        return this.findOneAndUpdate({ handle }, patchBody, {
          new: true
        })
          .then(updatedCompany => {
            updatedCompany.jobs.forEach(jobId => {
              return mongoose
                .model("Job")
                .findOneAndUpdate(
                  { _id: jobId },
                  { companyHandle: updatedCompany.handle }
                )
                .then(updatedJob =>
                  console.log(
                    `Successfully updated company handle for job ${
                      updatedJob._id
                    } to reflect change to ${updatedCompany.title}'s handle`
                  )
                )
                .catch(err => Promise.reject(err));
            });
            return updatedCompany;
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },
  /**
   * As a registered and logged in company,
   * delete this company profile and associated job postings from the database.
   * @param {String} handle -- a unique string identifying the company
   */
  deleteCompany(handle) {
    return this.findOneAndRemove({ handle })
      .then(deletedCompany => {
        deletedCompany.jobs.forEach(jobId => {
          return mongoose
            .model("Job")
            .findOneAndRemove({ _id: jobId })
            .then(deletedJob =>
              console.log(
                `Successfully deleted ${
                  deletedJob.title
                }, originally posted by ${deletedCompany.name}`
              )
            )
            .catch(err => Promise.reject(err));
        });
      })
      .catch(err => Promise.reject(err));
  }
};

companySchema.pre("save", function(next) {
  let company = this;

  if (!company.isModified("password")) return next();

  bcrypt.hash(company.password, 10).then(
    function(hashedPassword) {
      company.password = hashedPassword;
      next();
    },
    err => next(err)
  );
});

companySchema.methods.comparePassword = function(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return next(err);
    next(null, isMatch);
  });
};

module.exports = mongoose.model("Company", companySchema);
