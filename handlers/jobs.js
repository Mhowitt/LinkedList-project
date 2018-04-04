const { Job, Company } = require("../models");

const Validator = require("jsonschema").Validator;
const v = new Validator();

function readJobPostings(req, res, next) {}

function createJobPosting(req, res, next) {}

function newJobPostingForm(req, res, next) {}

function readJobPosting(req, res, next) {}

function updateJobPosting(req, res, next) {}

function deleteJobPosting(req, res, next) {}

function editJobPosting(req, res, next) {}

module.exports = {
  readJobPostings,
  readJobPosting,
  createJobPosting,
  newJobPostingForm,
  updateJobPosting,
  deleteJobPosting,
  editJobPosting
};
