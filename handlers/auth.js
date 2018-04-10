require('dotenv').load();

const { User, Company } = require('../models');
const jwt = require('jsonwebtoken');

function loginUser(req, res, next) {
  User.findOne({ username: req.body.username })
    .then(function(user) {
      if (user) {
        console.log('REQ.BODY', req.body);
        user.comparePassword(req.body.password, function(err, isMatch) {
          console.log('IS MATCH:', isMatch);
          if (isMatch) {
            let token = jwt.sign(
              { username: user.username },
              process.env.SECRET_KEY
            );
            res.status(200).send({ token });
          } else {
            res.status(400).send('Invalid Password');
          }
        });
      } else res.status(400).send('Invalid Username');
    })
    .catch(error => res.status(401).send(`Error: ${error}`));
}

function loginCompany(req, res, next) {
  Company.findOne({ handle: req.body.handle })
    .then(company => {
      if (company) {
        company.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch) {
            let token = jwt.sign(
              { handle: company.handle },
              process.env.SECRET_KEY
            );
            res.status(200).send({ token });
          } else {
            res.status(400).send('Invalid Password');
          }
        });
      } else res.status(400).send('Invalid Username');
    })
    .catch(error => res.status(401).send(`Error: ${error}`));
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
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded) {
        next();
      } else {
        res.status(401).send('Please log in first');
      }
    });
  } catch (e) {
    res.status(401).send('Please log in first');
  }
}

function ensureCorrectUser(req, res, next) {
  try {
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded.username === req.params.username) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    });
  } catch (e) {
    res.status(401).send('Unauthorized');
  }
}

function ensureCorrectCompany(req, res, next) {
  try {
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded.handle === req.params.handle) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    });
  } catch (e) {
    res.status(401).send('Unauthorized');
  }
}

function ensureCorrectJob(req, res, next) {
  try {
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded._id === req.params.jobId) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    });
  } catch (e) {
    res.status(401).send('Unauthorized');
  }
}

module.exports = {
  loginUser,
  loginCompany,
  ensureCorrectCompany,
  ensureCorrectUser,
  ensureCorrectJob,
  tokenRequired
};
