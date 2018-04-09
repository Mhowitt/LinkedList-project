const { Company } = require('../models');
const { companySchema, companyUpdateSchema } = require('../schemas');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

function renderNewCompanyForm(req, res, next) {
  return res.json({ message: 'New company form rendered successfully' });
}

function createCompany(req, res, next) {
  const result = validator.validate(req.body, companySchema);
  if (!result.valid) {
    const errors = result.errors.map(error => error.message).join(', ');
    return next({ message: errors });
  }
  return Company.createCompany(new Company(req.body))
    .then(company => res.status(201).json({ data: company }))
    .catch(err => res.json(err.message));
}

function readCompanies(req, res, next) {
  return Company.find()
    .then(companies => res.json({ data: companies }))
    .catch(err => res.json(err.message));
}

function readCompany(req, res, next) {
  return Company.findOne({ handle: req.params.handle })
    .populate('employees')
    .exec()
    .then(company => {
      if (!company) {
        return res
          .status(404)
          .json({ message: `Company ${req.params.handle} not found` });
      }
      return res.json({ data: company });
    })
    .catch(err => res.json(err.message));
}

function renderEditCompanyForm(req, res, next) {
  return res.json({ message: 'Edit company form rendered successfully' });
}

function updateCompany(req, res, next) {
  const result = validator.validate(req.body, companyUpdateSchema);
  if (!result.valid) {
    const errors = result.errors.map(error => error.message).join(', ');
    return next({ message: errors });
  }
  return Company.updateCompany(req.params.handle, req.body)
    .then(company => res.json({ data: company }))
    .catch(err => res.json(err.message));
}

function deleteCompany(req, res, next) {
  return Company.deleteCompany(req.params.handle)
    .then(() => res.json({ message: 'Company successfully deleted' }))
    .catch(err => res.json(err.message));
}

module.exports = {
  renderNewCompanyForm,
  createCompany,
  readCompanies,
  readCompany,
  renderEditCompanyForm,
  updateCompany,
  deleteCompany
};
