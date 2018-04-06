const express = require('express');
const router = express.Router();
const { jobs } = require('../handlers');
const {
  renderNewJobForm,
  createJob,
  readJobs,
  readJob,
  renderEditJobForm,
  updateJob,
  deleteJob
} = jobs;

router
  .route('')
  .get(readJobs)
  .post(createJob);

router.route('/new').get(renderNewJobForm);

router
  .route('/:jobId')
  .get(readJob)
  .patch(updateJob)
  .delete(deleteJob);

router.route('/:jobId/edit').get(renderEditJobForm);

module.exports = router;
