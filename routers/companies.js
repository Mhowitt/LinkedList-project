const express = require("express");
const router = express.Router();

const { companies } = require("../handers");

router
  .route("")
  .get(companies.readCompanies)
  .post(companies.createCompany);

router.get("/new").get(companies.newCompanyForm);

router
  .route("/:companyId")
  .get(companies.readCompany)
  .patch(companies.updateCompany)
  .delete(companies.deleteCompany);

router.route("/:companyId/edit").get(companies.editCompany);

module.exports = router;
