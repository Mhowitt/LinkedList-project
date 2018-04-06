const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const {
  usersRouter,
  companiesRouter,
  jobsRouter,
  authCompanyRouter,
  authUserRouter
} = require("./routers");

const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));

app.use("/company-auth", authCompanyRouter);
app.use("/user-auth", authUserRouter);
app.use("/users", usersRouter);
app.use("/companies", companiesRouter);
app.use("/jobs", jobsRouter);

app.get("/", (req, res, next) => res.redirect("/users"));

app.use((err, req, res, next) =>
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" })
);

app.listen(PORT, () => console.log(`LinkedList API listening on port ${PORT}`));
