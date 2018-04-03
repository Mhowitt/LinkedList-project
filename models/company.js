const mongoose = require("mongoose");
const Job = require("./job");
const User = require("./user");

const companySchema = new mongoose.Schema({});

module.exports = mongoose.model("Company", companySchema);
