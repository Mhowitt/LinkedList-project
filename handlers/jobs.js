const { Job } = require('../models');
const { jobSchema } = require('../schemas');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

function renderNewJobForm(req, res, next) {
  return res.json({ message: 'New job form rendered successfully' });
}

function createJob(req, res, next) {
  const result = validator.validate(req.body, jobSchema);
  if (!result.valid) {
    const errors = result.errors.map(error => error.message).join(', ');
    console.log('Error creating job');
    return next({ message: errors });
  }
  return Job.createJob(new Job(req.body))
    .then(job => res.status(201).json({ data: job }))
    .catch(err => res.json(err.message));
}

function readJobs(req, res, next) {
  return Job.find()
    .then(jobs => res.json({ data: jobs }))
    .catch(err => res.json(err.message));
}

function readJob(req, res, next) {
  return Job.findById(req.params.jobId)
    .populate('company')
    .exec()
    .then(job => {
      if (!job) {
        return res
          .status(404)
          .json({ message: `Job ${req.params.jobId} not found` });
      }
      return res.json({ data: job });
    })
    .catch(err => res.json(err.message));
}

function renderEditJobForm(req, res, next) {
  return res.json({ message: 'Edit job form rendered successfully' });
}

function updateJob(req, res, next) {
  const result = validator.validate(req.body, jobSchema);
  if (!result.valid) {
    const errors = result.errors.map(error => error.message).join(', ');
    console.log('Error creating job');
    return next({ message: errors });
  }
  return Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true })
    .then(job => res.json({ data: job }))
    .catch(err => res.json(err.message));
}

function deleteJob(req, res, next) {
  return Job.deleteJob(req.params.jobId)
    .then(() => res.json({ message: 'Job successfully deleted' }))
    .catch(err => res.json(err.message));
}

module.exports = {
  renderNewJobForm,
  createJob,
  readJobs,
  readJob,
  renderEditJobForm,
  updateJob,
  deleteJob
};
