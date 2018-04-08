const express = require('express');
const router = express.Router();
const { auth, companies } = require('../handlers');
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
  .get(auth.tokenRequired, readCompanies)
  .post(createCompany);

router.route('/new').get(renderNewCompanyForm);

router
  .route('/:handle')
  .get(auth.tokenRequired, readCompany)
  .patch(auth.tokenRequired, auth.ensureCorrectCompany, updateCompany)
  .delete(auth.tokenRequired, auth.ensureCorrectCompany, deleteCompany);

router
  .route('/:handle/edit')
  .get(auth.tokenRequired, auth.ensureCorrectCompany, renderEditCompanyForm);

module.exports = router;
