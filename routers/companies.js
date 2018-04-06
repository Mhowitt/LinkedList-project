const express = require("express");
const router = express.Router();
const { auth, companies } = require("../handlers");
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
  .route("")
  .get(readCompanies)
  .post(createCompany);

router.route("/new").get(renderNewCompanyForm);

router
  .route("/:handle")
  .get(auth.tokenRequired, readCompany)
  .patch(auth.ensureCorrectCompany, updateCompany)
  .delete(auth.ensureCorrectCompany, deleteCompany);

router
  .route("/:handle/edit")
  .get(auth.ensureCorrectCompany, renderEditCompanyForm);

module.exports = router;
