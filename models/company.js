const mongoose = require("mongoose");
const Job = require("./job");
const User = require("./user");

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
    return this.findOne({ name: newCompany.name })
      .then(company => {
        if (company) throw new Error(`${newCompany.name} already exists`);
        return newCompany
          .save()
          .then(company => company)
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};

companySchema.post("findOneAndRemove", deletedCompany => {
  return Job.remove({ company: deletedCompany._id })
    .then(() => console.log(`Job postings by ${deletedCompany.name} deleted`))
    .catch(err => console.log('Unable to delete associated jobs:', err));
});

module.exports = mongoose.model("Company", companySchema);