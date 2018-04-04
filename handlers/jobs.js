const { Job, Company } = require("../models");

const Validator = require("jsonschema").Validator;
const v = new Validator();

function readJobPostings(req, res, next) {
  return Job.find().then(jobs => {
    return res.json(jobs);
  });
}

function createJobPosting(req, res, next) {
  Job.createJobPosting(new Job(req.body))
    .then(job => {
      return res.status(201).json(job);
    })
    .catch(err => next(err));
}

function newJobPostingForm(req, res, next) {
  return res.status(300);
}

function readJobPosting(req, res, next) {
  return Job.findById(req.params.jobId)
    .populate("company")
    .exec()
    .then(job => {
      if (!user) {
        return res
          .status(404)
          .json({ message: `User ${req.params.userId} not found.` });
      }
      return res.json(job);
    })
    .catch(err => {
      return res.json(err);
    });
}

function updateJobPosting(req, res, next) {
  return Job.findByIdAndUpdate(req.params.jobId, req.body, {
    new: true
  }).then(job => res.json(job));
}

function deleteJobPosting(req, res, next) {
  Job.deleteJobPosting(req.params.jobId).then(() => {
    return res.json({ message: "User successfully deleted" });
  });
}

function editJobPosting(req, res, next) {
  return res.status(300);
}

module.exports = {
  readJobPostings,
  readJobPosting,
  createJobPosting,
  newJobPostingForm,
  updateJobPosting,
  deleteJobPosting,
  editJobPosting
};
