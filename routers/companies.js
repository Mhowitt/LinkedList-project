const express = require("express");
const router = express.Router();

const { companies } = require("../handlers");

router
  .route("")
  .get(companies.readCompanies)
  .post(companies.createCompany);

router.route("/new").get(companies.newCompanyForm);

router
  .route("/:handle")
  .get(companies.readCompany)
  .patch(companies.updateCompany)
  .delete(companies.deleteCompany);

router.route("/:handle/edit").get(companies.editCompanyForm);

module.exports = router;
