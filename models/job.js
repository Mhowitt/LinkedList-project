const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const jobSchema = new mongoose.Schema(
  {
    title: String,
    companyHandle: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    salary: Number,
    equity: Number
  },
  { timestamps: true }
);

jobSchema.statics = {
  /**
   * As a registered and logged in company,
   * create a new job posting
   * and connect its unique ObjectId to the company via a list of job ids,
   * adopting the company's handle in return.
   * @param {Object} newUser -- an instance of a user document
   */
  createJob(newJob) {
    return newJob
      .save()
      .then(job => {
        console.log(`${job.title} successfully created`);
        return mongoose
          .model('Company')
          .findOneAndUpdate(
            { handle: job.companyHandle },
            {
              $addToSet: { jobs: job._id }
            }
          )
          .then(company => {
            console.log(
              `Job ${job._id} successfully added to ${company.name}'s jobs list`
            );
            return job;
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },
  /**
   * As a registered and logged in company,
   * delete this job posting and associated job relation to the company in the database.
   * @param {String} jobId -- a unique string identifying the job posting
   */
  deleteJob(jobId) {
    return this.findByIdAndRemove(jobId)
      .then(job => {
        console.log(`${job.title} successfully deleted`);
        return mongoose
          .model('Company')
          .findOneAndUpdate(
            { handle: job.companyHandle },
            {
              $pull: { jobs: job._id }
            }
          )
          .then(company =>
            console.log(
              `Job ${job._id} successfully removed from ${
                company.name
              }'s jobs list`
            )
          )
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};

module.exports = mongoose.model('Job', jobSchema);
