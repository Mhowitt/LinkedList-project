const express = require("express");
const router = express.Router();

const { jobs } = require("../handers");

router
  .route("")
  .get(jobs.readJobPostings)
  .post(jobs.createJobPosting);

router.get("/new").get(jobs.newJobPostingForm);

router
  .route("/:jobId")
  .get(jobs.readJobPosting)
  .patch(jobs.updateJobPosting)
  .delete(jobs.deleteJobPosting);

router.route("/:jobId/edit").get(jobs.editJobPosting);

module.exports = router;
