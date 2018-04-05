const { Company } = require("../models");
const Validator = require("jsonschema").Validator;
const v = new Validator();
const { newCompanySchema } = require("../schemas");

function newCompanyForm(req, res, next) {
  //route works
  return res.json({ message: "companyForm successfully brought" });
}

function createCompany(req, res, next) {
  //works
  Company.createCompany(new Company(req.body))
    .then(company => res.status(201).json(company))
    .catch(err => next(err));
}

function readCompanies(req, res, next) {
  //works
  return Company.find().then(companies => res.json(companies));
}

function readCompany(req, res, next) {
  //works
  return Company.findById(req.params.companyId)
    .populate("employees")
    .exec()
    .then(company => {
      if (!company) {
        return res
          .status(404)
          .json({ message: `Company ${req.params.companyId} not found` });
      }
      return res.json(company);
    })
    .catch(err => res.json(err));
}

function editCompanyForm(req, res, next) {
  //route works
  return res.json({ message: "editCompanyForm successfully brought" });
}

function updateCompany(req, res, next) {
  //update works
  return Company.findByIdAndUpdate(req.params.companyId, req.body, {
    new: true
  })
    .then(company => res.json(company))
    .catch(err => res.json(err));
}

function deleteCompany(req, res, next) {
  return Company.deleteCompany(req.params.companyId)
    .then(() => res.json({ message: "Company successfully deleted" }))
    .catch(err => res.json(err));
}

module.exports = {
  newCompanyForm,
  createCompany,
  readCompanies,
  readCompany,
  editCompanyForm,
  updateCompany,
  deleteCompany
};
