const mongoose = require("mongoose");
const Company = require("./job");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
    },
    salary: Number,
    equity: Number
  },
  { timestamps: true }
);

jobSchema.statics = {
  /**
   * As a registered company, create a new job posting.
   * @param {Object} newJobPosting -- an instance of a job document
   */
  createJobPosting(newJobPosting) {
    // return Company.findById(newJobPosting.company)
    //   .then(company => {
    //     if (!company) throw new Error(`${company} does not exist`);
    return newJobPosting
      .save()
      .then(job =>
        Company.findOneAndUpdate(job.company, {
          $addToSet: { jobs: job._id }
        }).then(() => job)
      )
      .catch(err => Promise.reject(err));
    // });
  },
  /**
   * As a registered company, delete an existing job posting for your company.
   * @param {String} jobId -- an id corresponding to an existing job postin
   */
  deleteJobPosting(jobId) {
    return this.findOneAndRemove(jobId)
      .then(job =>
        Company.findOneAndUpdate(job.company, {
          $pull: { jobs: job._id }
        }).then(() => job)
      )
      .catch(err => Promise.reject(err));
  }
};

module.exports = mongoose.model("Job", jobSchema);
