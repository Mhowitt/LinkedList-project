
const { Job, Company } = require("../models");
const { newJobSchema } = require("../schemas");
const Validator = require("jsonschema").Validator;

const validator = new Validator();

function newJobPostingForm(req, res, next) {
  return res.json({ data: { message: "New job form rendered successfully" } });
}

function createJobPosting(req, res, next) {
  return new Job(req.body)
    .save()
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
  return Job.findByIdAndRemove(req.params.jobId)
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
