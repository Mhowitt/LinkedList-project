const express = require('express');
const router = express.Router();

const { jobs } = require('../handlers');

router
  .route('')
  .get(jobs.readJobPostings)
  .post(jobs.createJobPosting);

router.route('/new').get(jobs.newJobPostingForm);

router
  .route('/:jobId')
  .get(jobs.readJobPosting)
  .patch(jobs.updateJobPosting)
  .delete(jobs.deleteJobPosting);

router.route('/:jobId/edit').get(jobs.editJobPostingForm);

module.exports = router;
