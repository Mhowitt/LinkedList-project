const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));

const PORT = 3000;

app.use("/users", usersRouter);
app.use("/companies", companiesRouter);
app.use("/jobs", jobsRouter);

app.use((err, req, res, next) => {
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`LinkedList API is listening on port ${PORT}`);
});
