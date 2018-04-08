const express = require('express');
const router = express.Router();
const { auth, jobs } = require('../handlers');
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
  .get(auth.tokenRequired, readJobs)
  .post(auth.tokenRequired, auth.ensureCorrectCompany, createJob);

router.route('/new').get(renderNewJobForm);

router
  .route('/:jobId')
  .get(auth.tokenRequired, readJob)
  .patch(
    auth.tokenRequired,
    auth.ensureCorrectCompany,
    auth.ensureCorrectJob,
    updateJob
  )
  .delete(
    auth.tokenRequired,
    auth.ensureCorrectCompany,
    auth.ensureCorrectJob,
    deleteJob
  );

router
  .route('/:jobId/edit')
  .get(
    auth.tokenRequired,
    auth.ensureCorrectCompany,
    auth.ensureCorrectJob,
    renderEditJobForm
  );

module.exports = router;
