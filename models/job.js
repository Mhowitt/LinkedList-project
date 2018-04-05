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

jobSchema.post('findOneAndRemove', job => {
  Company.findOneAndUpdate( job.company, {
      $pull: { jobs: job._id }
    })
    .exec()
    .then(() => console.log(`Job posting for ${job.title} at ${job.company} deleted`))
    .catch(err => console.log(err));
});

module.exports = mongoose.model("Job", jobSchema);
