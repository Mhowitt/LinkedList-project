const mongoose = require("mongoose");
const { Job, Company } = require("../models");
const { newJobPostingSchema } = require("../schemas");
const Validator = require("jsonschema").Validator;
const validator = new Validator();

function newJobPostingForm(req, res, next) {
  return res.json({ data: { message: "New job form rendered successfully" } });
}

function createJobPosting(req, res, next) {
  const result = validator.validate(req.body, newJobPostingSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(", ");
    console.log("error here");
    return next({ message: errors });
  }

  Job.createJobPosting(new Job(req.body))
    .then(job => res.status(201).json({ data: job }))
    .catch(err => res.json({ data: err }));
}

function readJobPostings(req, res, next) {
  return Job.find()
    .then(jobs => res.json({ data: jobs }))
    .catch(err => res.json({ data: err }));
}

function readJobPosting(req, res, next) {
  return Job.findById(req.params.jobId)
    .populate("company")
    .exec()
    .then(job => {
      if (!user) {
        return res
          .status(404)
          .json({ message: `User ${req.params.userId} not found` });
      }
      return res.json({ data: job });
    })
    .catch(err => res.json({ data: err }));
}

function editJobPostingForm(req, res, next) {
  return res.json({ data: { message: "Edit job form rendered successfully" } });
}

function updateJobPosting(req, res, next) {
  return Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true })
    .then(job => res.json({ data: job }))
    .catch(err => res.json({ data: err }));
}

function deleteJobPosting(req, res, next) {
  return Job.deleteJobPosting(req.params.jobId)
    .then(() => res.json({ data: { message: "Job successfully deleted" } }))
    .catch(err => res.json({ data: err }));
}

module.exports = {
  newJobPostingForm,
  createJobPosting,
  readJobPostings,
  readJobPosting,
  editJobPostingForm,
  updateJobPosting,
  deleteJobPosting
};
