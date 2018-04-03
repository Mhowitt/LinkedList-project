const mongoose = require("mongoose");
const Company = require("./company");

const userSchema = new mongoose.Schema({});

module.exports = mongoose.model("User", userSchema);
