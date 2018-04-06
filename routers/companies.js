const express = require('express');
const router = express.Router();
const { companies } = require('../handlers');
const {
  renderNewCompanyForm,
  createCompany,
  readCompanies,
  readCompany,
  renderEditCompanyForm,
  updateCompany,
  deleteCompany
} = companies;

router
  .route('')
  .get(readCompanies)
  .post(createCompany);

router.route('/new').get(renderNewCompanyForm);

router
  .route('/:handle')
  .get(readCompany)
  .patch(updateCompany)
  .delete(deleteCompany);

router.route('/:handle/edit').get(renderEditCompanyForm);

module.exports = router;
