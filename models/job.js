const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    companyHandle: String,
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
  createJobPosting(newJob) {
    return newJob
      .save()
      .then(job => {
        console.log(`${job.title} successfully created`);
        return mongoose
          .model("Company")
          .findOneAndUpdate(
            { handle: job.companyHandle },
            {
              $addToSet: { jobs: job._id }
            }
          )
          .then(company => {
            console.log(`Job ${job._id} added to ${company.name}'s jobs list`);
            return job;
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },
  deleteJobPosting(jobId) {
    return this.findByIdAndRemove(jobId)
      .then(job => {
        console.log(`${job.title} successfully deleted`);
        return mongoose
          .model("Company")
          .findOneAndUpdate(job.company, {
            $pull: { jobs: job._id }
          })
          .then(company =>
            console.log(
              `Job ${job._id} removed from ${company.name}'s jobs list`
            )
          )
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};

module.exports = mongoose.model("Job", jobSchema);
