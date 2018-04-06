require("dotenv").load();

const { User, Company } = require("../models");
const { jwt } = require("jsonwebtoken");

function loginUser(req, res, next) {
  User.findOne({ username: req.body.username }).then(
    function(user) {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          let token = jwt.sign(
            { username: user.username },
            process.env.SECRET_KEY
          );
          res.status(200).send({ token });
        } else {
          res.status(400).send("Invalid Credentials");
        }
      });
    },
    function(err) {
      res.status(400).send("Invalid Credentials");
    }
  );
}

function loginCompany(req, res, next) {
  Company.findOne({ email: req.body.email }).then(
    function(company) {
      company.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          let token = jwt.sign(
            { email: company.email },
            process.env.SECRET_KEY
          );
          res.status(200).send({ token });
        } else {
          res.status(400).send("Invalid Credentials");
        }
      });
    },
    function(err) {
      res.status(400).send("Invalid Credentials");
    }
  );
}

// function signUpUser(req, res, next) {
//   User.create(req.body).then(function(user) {
//     let token = jwt.sign({ username: user.username }, process.env.SECRET_KEY);
//     res.status(200).send({ token });
//   });
// }

// function logOutUser(req, res, next) {
//   req.session.username = null;
//   req.flash("message", "logged out!");
//   res.redirect("/users/login");
// }

function tokenRequired(req, res, next) {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded) {
        next();
      } else {
        res.status(401).send("Please log in first");
      }
    });
  } catch (e) {
    res.status(401).send("Please log in first");
  }
}

function ensureCorrectUser(req, res, next) {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded.user_id === req.params.id) {
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    });
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
}

function ensureCorrectCompany(req, res, next) {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded.handle === req.params.handle) {
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    });
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
}

module.exports = {
  loginUser,
  loginCompany,
  ensureCorrectCompany,
  ensureCorrectUser,
  loginRequired,
  logOutUser,
  signUpUser
};
