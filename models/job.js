const mongoose = require("mongoose");
const Company = require("./company");

const jobSchema = new mongoose.Schema({});

module.exports = mongoose.model("Job", jobSchema);
