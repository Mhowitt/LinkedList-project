const { Job, Company } = require('../models');
const { newCompanySchema } = require('../schemas');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

function newCompanyForm(req, res, next) {
  return res.json({
    data: { message: 'New company form rendered successfully' }
  });
}

function createCompany(req, res, next) {
  const result = validator.validate(req.body, newCompanySchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(', ');
    return next({ message: errors });
  }
  Company.createCompany(new Company(req.body))
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
        return res.status(404).json({
          data: { message: `Company ${req.params.handle} not found` }
        });
      }
      return res.json({ data: company });
    })
    .catch(err => res.json(err.message));
}

function editCompanyForm(req, res, next) {
  return res.json({
    data: { message: 'Edit company form rendered successfully' }
  });
}

function updateCompany(req, res, next) {
  return Company.updateCompany(req.params.handle, req.body)
    .then(company => res.json({ data: company }))
    .catch(err => res.json(err.message));
}

function deleteCompany(req, res, next) {
  return Company.findOneAndRemove({ handle: req.params.handle })
    .then(() => res.json({ data: { message: 'Company successfully deleted' } }))
    .catch(err => res.json(err.message));
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
