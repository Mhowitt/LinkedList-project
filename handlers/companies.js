const { Job, Company } = require('../models');
const { newCompanySchema } = require('../schemas');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

function newCompanyForm(req, res, next) {
  return res.json({ data: { message: 'New company form rendered successfully' }})
}

function createCompany(req, res, next) {
  Company.createCompany(new Company(req.body))
    .then(company => res.status(201).json({ data: company }))
    .catch(err => res.json({ data: err }));
}

function readCompanies(req, res, next) {
  return Company.find()
    .then(companies => res.json({ data: companies }))
    .catch(err => res.json({ data: err }));
}

function readCompany(req, res, next) {
  return Company.findById(req.params.companyId)
    .populate('employees').exec()
    .then(company => {
      if (!company) {
        return res
          .status(404)
          .json({ data: { message: `Company ${req.params.companyId} not found` }});
      }
      return res.json({ data: company });
    })
    .catch(err => res.json({ data: err }));
}

function editCompanyForm(req, res, next) {
  return res.json({ data: { message: 'Edit company form rendered successfully' }});
}

function updateCompany(req, res, next) {
  return Company.findByIdAndUpdate(req.params.companyId, req.body, {new: true})
    .then(company => res.json({ data: company }))
    .catch(err => res.json({ data: err }));
}

function deleteCompany(req, res, next) {
  return Company.findOneAndRemove(req.params.companyId)
    .then(() => res.json({ data: { message: 'Company successfully deleted' }}))
    .catch(err => res.json({ data: err }));
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
