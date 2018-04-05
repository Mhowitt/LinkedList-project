const mongoose = require("mongoose");
const Company = require("./job");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    companyName: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
    },
    salary: Number,
    equity: Number
  },
  { timestamps: true }
);

jobSchema.post('save', job => {
  return Company.findOneAndUpdate({ name: job.companyName }, {
    $addToSet: { jobs: job._id }
  }).then(company => {
    console.log(`${job._id} added to ${company.name} jobs list`);
  }).catch(err => console.log(err));
});

jobSchema.post('findByIdAndRemove', job => {
  Company.findOneAndUpdate( job.company, {
      $pull: { jobs: job.id }
    })
    .exec()
    .then(() => console.log(`Job posting for ${job.title} at ${job.company} deleted`))
    .catch(err => console.log(err));
});

module.exports = mongoose.model("Job", jobSchema);
