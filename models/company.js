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
  },
  /**
   * As a registered company, delete your company and associated jobs postings from the database
   * @param {String} companyId -- an id corresponding to an existing company
   */
  deleteCompany(companyId) {
    return this.findById(companyId)
      .then(company => {
        // return Job.update({ $pullAll: { _id: company.jobs }})
        //   .then(jobs => console.log(`Job postings by ${company.name} deleted`))
        //   .catch(err => Promise.reject(err));
        return this.remove({ _id: companyId }).exec()
          .then(jobs => console.log(`Job postings by ${company.name} deleted`))
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};

module.exports = mongoose.model("Company", companySchema);