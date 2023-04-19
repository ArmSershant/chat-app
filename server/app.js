const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt')
const app = express();
const passport = require('passport');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = passportJWT.ExtractJwt;
require('dotenv').config();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const Auth = require('./middleware/Auth')
const http = require('http');
const server = http.Server(app);
const { Op } = require('sequelize');
const socketIO = require('socket.io');
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:4200',
    credentials: true
  }
});
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const { Users, Messages } = require('./util/database')

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}))
app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')())
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}))

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('get messages', async ({ receiver, sender }) => {
    let messages = await Messages.findAll({
      where: {
        [Op.or]: [
          { senderId: sender, receiverId: receiver },
          { senderId: receiver, receiverId: sender }
        ]
      }
    });
    io.emit('got messages', messages);
  });
  socket.on('message', async (data) => {
    let newMessage = await Messages.create(data);
    console.log("new message server : ", newMessage)
    io.emit('new message', newMessage);
    socket.broadcast.to(newMessage.receiverId).emit('new message', newMessage);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: "SECRET"
  },
    AuthController.isLoggedIn
  )
)

// Confirmation
const sendConfirmationEmail = async (email) => {
  let myEmail = process.env.MY_EMAIL
  let myPassword = process.env.MY_PASSWORD
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: myEmail,
      pass: myPassword
    }
  });
  function generateConfirmationCode() {
    const length = 6;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  let confirmationCode = generateConfirmationCode();
  let info = await transporter.sendMail({
    from: `From Vardges`,
    to: email,
    subject: "Registration Confirmation",
    text: "Thank you for registering with us!",
    subject: 'Confirmation Email',
    html: `<p>Please confirm your registration by clicking on the link below:</p>
        <a href="http://localhost:5000/confirm-registration?email=${email}&code=${confirmationCode}">Confirm Registration</a>`,
  });
  console.log("Message sent: %s", info.messageId);
}

// Confirm Registration
app.get('/confirm-registration', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.confirmed) {
      return res.status(400).json({ message: "User already confirmed" });
    }
    user.confirmed = true;
    await user.save();
    return res.redirect('http://localhost:4200/app-login');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Register
passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    let user = await Users.findOne({ where: { email: email } })
    if (user) {
      console.log("confirmed: ", user.confirmed)
      if (!user.confirmed) {
        return done(null, false, "Your registration is not confirmed yet. Please check your email to confirm your registration.")
      }
      let emailMatches = await Users.findOne({ where: { email: email } })
      if (emailMatches) {
        return done(null, false, "Account with that email already exists")
      }
      if (password.length <= 4 || !email) {
        return done(null, false, "Your credential don't match our criteria")
      }
    } else {
      const hashedPass = bcrypt.hashSync(password, 10)
      let user = { email, password: hashedPass }
      sendConfirmationEmail(email)
      return done(null, user, `Signed up successfully`)
    }
  } catch (err) {
    return done(err)
  }
},
  AuthController.isRegistered
))


// Login
passport.use("login", new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      const user = await Users.findOne({ where: { email: email } });
      if (!user) {
        return done(null, false, 'User not found');
      }
      if (user.lockedUntil && user.lockedUntil > Date.now()) {
        const remainingTime = Math.ceil((user.lockedUntil - Date.now()) / 1000 / 60);
        return done(null, false, `Too many failed login attempts. Please try again in ${remainingTime} minute(s).`);
      }
      if (user.confirmed == null) {
        return done(null, false, 'User is not confirmed')
      }
      const passwordMatches = bcrypt.compareSync(password, user.password);
      if (!passwordMatches) {
        user.failedLoginAttempts++;
        if (user.failedLoginAttempts >= 3) {
          user.lockedUntil = new Date(Date.now() + (5 * 60 * 1000));
          user.failedLoginAttempts = 0;
          await user.save();
          return done(null, false, 'Please try again in 5 minutes.');
        } else {
          await user.save();
          return done(null, false, 'Password mismatch');
        }
      } else {
        user.failedLoginAttempts = 0;
        user.lockedUntil = null;
        await user.save();
        return done(null, user, `You are logged in successfully ${email}`);
      }
    }
    catch (err) {
      return done(err);
    }
  },
  AuthController.isLoggedIn
));



// Auth
app.post('/register', AuthController.register)
app.post('/login', AuthController.login)
app.get('/profile', Auth(), AuthController.loggedUser)

// User
app.get('/users', Auth(), UserController.getUsers)

server.listen(5000, () => {
  console.log(`started on port 5000`);
});
