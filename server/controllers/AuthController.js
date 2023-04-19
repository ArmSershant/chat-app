const { Users } = require('../util/database')
const jwt = require('jsonwebtoken')
const passport = require('passport')
class AuthController {
  loggedUser(req, res) {
    if (!req.user) res.json({ username: "Please login" })
    res.json(req.user)
  }

  async isLoggedIn(jwt_payload, done) {
    let user = await Users.findOne({ where: { id: jwt_payload.user.id } })
      .then(user => { return done(null, user) })
      .catch(err => {
        return done(err, false, {
          message: "Token not matched"
        })
      })
  }

  async isRegistered(name, password, done) {
    let user = await Users.findOne({ where: { name: name, password: password } })
    if (!user) {
      return done(null, false)
    } else if (user.password === password) {
      return done(null, false)
    }
    return done(null, user)
  }

  // Register
  register = async (req, res, next) => {
    passport.authenticate('register', async (err, user, info) => {
      let existsUser = await Users.findOne({ where: { email: req.body.email } })
      if (existsUser) {
        res.status(400).json({ message: "User already exists" })
      }
      if (err || !user) {
        res.status(400)
        res.send(info)
      } else {
        user.name = req.body.name
        let newUser = await Users.create({
          name: req.body.name,
          email: req.body.email,
          password: user.password,
        });
        const token = jwt.sign({ user: newUser }, "SECRET")
        res.send({ user, token })
      }
    })(req, res, next)
  }

  // Login
  login = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
      if (err || !user) {
        res.status(400);
        res.send(info)
      } else {
        req.login(
          user,
          { session: false },
          async () => {
            const token = jwt.sign({ user: req.user }, "SECRET")
            res.json({ token: token, user: req.user })
          })
      }
    })(req, res, next);
  }

  validateToken = async (req, res) => {
    res.send({ user: req.user })
  }

  // Logout
  logout = (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      Users.update({ tokenExpiresAt: new Date() }, { where: { id: user.id } })
        .then(result => {
          console.log('Token invalidated successfully:', result);
          res.status(200).json({ message: 'Token invalidated successfully' });
        })
        .catch(error => {
          console.error('Error invalidating token:', error);
          res.status(500).json({ message: 'Internal server error' });
        });
    })(req, res);
  }
}

module.exports = new AuthController()
